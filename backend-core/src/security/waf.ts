import type { IncomingMessage, ServerResponse } from "node:http";

export type RequestContext = {
  ip: string;
  method: string;
  url: string;
  userAgent?: string;
  sessionToken?: string;
  payloadBytes?: number;
};

export type WafVerdict = {
  allowed: boolean;
  statusCode: number;
  reason: string;
  audit: {
    ip: string;
    url: string;
    method: string;
    reasonCode: string;
  };
};

export type WafConfig = {
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  authRateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  maxPayloadBytes: number;
  protectedPathPrefixes: string[];
  requireSessionTokenForProtected: boolean;
};

const DEFAULT_CONFIG: WafConfig = {
  rateLimit: {
    windowMs: 60_000,
    maxRequests: 120
  },
  authRateLimit: {
    windowMs: 60_000,
    maxRequests: 10
  },
  maxPayloadBytes: 200_000,
  protectedPathPrefixes: ["/api/wat/", "/api/gpe/", "/api/gd/", "/api/pi/", "/api/medical/"],
  requireSessionTokenForProtected: false
};

type Bucket = {
  windowStartMs: number;
  count: number;
};

const bucketByIp = new Map<string, Bucket>();

function getClientIp(req: IncomingMessage): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) {
    return xff.split(",")[0]!.trim();
  }
  const ra = req.socket?.remoteAddress;
  return ra ?? "unknown";
}

function ipRateCheck(ip: string, nowMs: number, config: WafConfig): { allowed: boolean; count: number } {
  const existing = bucketByIp.get(ip);
  if (!existing) {
    bucketByIp.set(ip, { windowStartMs: nowMs, count: 1 });
    return { allowed: true, count: 1 };
  }

  if (nowMs - existing.windowStartMs >= config.rateLimit.windowMs) {
    existing.windowStartMs = nowMs;
    existing.count = 1;
    bucketByIp.set(ip, existing);
    return { allowed: true, count: 1 };
  }

  existing.count += 1;
  return { allowed: existing.count <= config.rateLimit.maxRequests, count: existing.count };
}

export function createWaf(config?: Partial<WafConfig>) {
  const effective: WafConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    rateLimit: { ...DEFAULT_CONFIG.rateLimit, ...(config?.rateLimit ?? {}) },
    authRateLimit: { ...DEFAULT_CONFIG.authRateLimit, ...(config?.authRateLimit ?? {}) }
  };

  function shouldProtect(url: string): boolean {
    return effective.protectedPathPrefixes.some((p) => url.startsWith(p));
  }

  function evaluate(ctx: RequestContext, nowMs: number): WafVerdict {
    const isAuth = ctx.url.includes('/api/auth/') || ctx.url.includes('/signin') || ctx.url.includes('/signup');
    const protectedEndpoint = shouldProtect(ctx.url) || isAuth; // Auth is implicitly protected by rate limits

    if (!protectedEndpoint) {
      return {
        allowed: true,
        statusCode: 200,
        reason: "not_protected",
        audit: { ip: ctx.ip, url: ctx.url, method: ctx.method, reasonCode: "not_protected" }
      };
    }

    const rateLimitConfigToUse = isAuth ? effective.authRateLimit : effective.rateLimit;
    
    // Separate bucket namespace for auth to prevent overall traffic from exhausting auth limits or vice-versa
    const bucketKey = isAuth ? `auth:${ctx.ip}` : ctx.ip;

    const rate = ipRateCheck(bucketKey, nowMs, { ...effective, rateLimit: rateLimitConfigToUse });
    if (!rate.allowed) {
      return {
        allowed: false,
        statusCode: 429,
        reason: "rate_limited",
        audit: { ip: ctx.ip, url: ctx.url, method: ctx.method, reasonCode: "rate_limited" }
      };
    }

    if (typeof ctx.payloadBytes === "number" && ctx.payloadBytes > effective.maxPayloadBytes) {
      return {
        allowed: false,
        statusCode: 413,
        reason: "payload_too_large",
        audit: { ip: ctx.ip, url: ctx.url, method: ctx.method, reasonCode: "payload_too_large" }
      };
    }

    if (effective.requireSessionTokenForProtected && !isAuth) {
      const hasToken = !!ctx.sessionToken && ctx.sessionToken.length >= 8;
      if (!hasToken) {
        return {
          allowed: false,
          statusCode: 403,
          reason: "missing_session_token",
          audit: { ip: ctx.ip, url: ctx.url, method: ctx.method, reasonCode: "missing_session_token" }
        };
      }
    }

    // “Bot-ish” UA heuristic
    if (ctx.userAgent) {
      const ua = ctx.userAgent.toLowerCase();
      const bot =
        ua.includes("curl") ||
        ua.includes("wget") ||
        ua.includes("python-requests") ||
        ua.includes("node-fetch") ||
        ua.includes("scrapy");
      if (bot) {
        return {
          allowed: false,
          statusCode: 403,
          reason: "bot_user_agent",
          audit: { ip: ctx.ip, url: ctx.url, method: ctx.method, reasonCode: "bot_user_agent" }
        };
      }
    }

    // 9th Layer: Malicious Payload Inspection (SQLi & Path Traversal)
    const urlDecoded = decodeURIComponent(ctx.url).toLowerCase();
    const isMalicious = 
        // Path Traversal
        urlDecoded.includes('../') || 
        urlDecoded.includes('..\\') || 
        urlDecoded.includes('/etc/passwd') ||
        // Basic SQLi heuristics
        urlDecoded.includes('union select') || 
        urlDecoded.includes('drop table') || 
        /(\b(select|update|delete|insert|drop|alter)\b.*\b(from|into|table)\b)/.test(urlDecoded) ||
        /['"]\s*(or|and)\s*['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/.test(urlDecoded); // e.g. ' OR 1=1

    if (isMalicious) {
      return {
        allowed: false,
        statusCode: 403,
        reason: "malicious_payload",
        audit: { ip: ctx.ip, url: ctx.url, method: ctx.method, reasonCode: "malicious_payload" }
      };
    }

    return {
      allowed: true,
      statusCode: 200,
      reason: "ok",
      audit: { ip: ctx.ip, url: ctx.url, method: ctx.method, reasonCode: "ok" }
    };
  }

  async function enforce(req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> {
    const nowMs = Date.now();
    const ip = getClientIp(req);
    const method = req.method ?? "unknown";

    const sessionToken =
      (typeof req.headers["x-session-token"] === "string" ? req.headers["x-session-token"] : undefined) ??
      (() => {
        try {
          const u = new URL(url, "http://localhost");
          const t = u.searchParams.get("sessionToken");
          return t ?? undefined;
        } catch {
          return undefined;
        }
      })();

    const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined;

    const verdict = evaluate(
      { ip, method, url, userAgent, sessionToken, payloadBytes: undefined },
      nowMs
    );

    if (!verdict.allowed) {
      // eslint-disable-next-line no-console
      console.log(`[WAF] BLOCK ${verdict.audit.reasonCode} ip=${verdict.audit.ip} ${verdict.audit.method} ${verdict.audit.url}`);
      res.statusCode = verdict.statusCode;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Blocked by WAF", reason: verdict.reason, audit: verdict.audit }, null, 2));
      return false;
    }

    return true;
  }

  return { enforce };
}
