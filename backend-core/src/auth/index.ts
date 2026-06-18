/**
 * Authentication and Authorization Module
 * Provides JWT-based authentication with Supabase Auth integration
 */

import crypto from "node:crypto";
import { securityConfig, featureFlags } from "../config/index.js";
import { userRepository, User } from "../lib/supabase/client.js";
import { passwordPolicy } from "./passwordPolicy.js";
import { bruteForceProtection } from "./bruteForce.js";

// ============= Types =============

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
}

export type UserRole = "user" | "admin" | "moderator";

export interface JWTPayload {
  sub: string; // subject (user id)
  email: string;
  role: UserRole;
  iat: number; // issued at
  exp: number; // expiration
  iss: string; // issuer
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

// ============= Constants =============

const JWT_EXPIRATION_SECONDS = 3600; // 1 hour
const REFRESH_TOKEN_EXPIRATION_SECONDS = 86400 * 7; // 7 days
const JWT_ISSUER = "ssb-nextgen-pro";
const SALT_ROUNDS = 12;

// ============= Token Utilities =============

/**
 * Generate a simple JWT token (HMAC-SHA256)
 * Note: For production, consider using a more robust JWT library
 */
function generateJWT(payload: JWTPayload, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");
  return `${headerB64}.${payloadB64}.${signature}`;
}

function verifyJWT(token: string, secret: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signature] = parts;
    const header = JSON.parse(Buffer.from(headerB64, "base64url").toString());

    if (header.alg !== "HS256") return null;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    return JSON.parse(Buffer.from(payloadB64, "base64url").toString());
  } catch {
    return null;
  }
}

/**
 * Hash a password using PBKDF2
 */
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 2 ** 14, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

/**
 * Verify a password against a hash
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedHash] = hash.split(":");
  if (!salt || !storedHash) return false;

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 2 ** 14, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), derivedKey));
    });
  });
}

/**
 * Generate a random refresh token
 */
function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ============= Session Store (In-Memory for MVP) =============

interface SessionRecord {
  refreshToken: string;
  userId: string;
  expiresAt: number;
}

const sessionStore = new Map<string, SessionRecord>();

function storeSession(userId: string, refreshToken: string, expiresIn: number): void {
  sessionStore.set(refreshToken, {
    refreshToken,
    userId,
    expiresAt: Date.now() + expiresIn * 1000,
  });
}

function getSession(refreshToken: string): SessionRecord | null {
  const session = sessionStore.get(refreshToken);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessionStore.delete(refreshToken);
    return null;
  }
  return session;
}

function deleteSession(refreshToken: string): void {
  sessionStore.delete(refreshToken);
}

// ============= Auth Service =============

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(input: SignUpInput): Promise<Session> {
    if (!securityConfig.jwtSecret) {
      throw new Error("Authentication not configured. Set JWT_SECRET environment variable.");
    }

    if (bruteForceProtection.isLocked(input.email)) {
      throw new Error("Account locked due to too many attempts. Please try again later.");
    }

    const policyResult = passwordPolicy.validate(input.password);
    if (!policyResult.isValid) {
      throw new Error(`Password policy violation: ${policyResult.errors.join(" ")}`);
    }

    // Check if user already exists
    const existingUser = await userRepository.getUserByEmail(input.email);
    if (existingUser) {
      bruteForceProtection.recordFailure(input.email);
      throw new Error("User with this email already exists");
    }

    const pwdHash = await hashPassword(input.password);

    // Create user in Supabase
    const user = await userRepository.createUser({
      email: input.email,
      full_name: input.fullName,
      password_hash: pwdHash,
    });

    // Generate tokens
    return this.generateSession(user);
  },

  /**
   * Sign in an existing user
   */
  async signIn(input: SignInInput): Promise<Session> {
    if (!securityConfig.jwtSecret) {
      throw new Error("Authentication not configured. Set JWT_SECRET environment variable.");
    }

    if (bruteForceProtection.isLocked(input.email)) {
      throw new Error("Account locked due to too many attempts. Please try again later.");
    }

    // Find user by email
    const user = await userRepository.getUserByEmail(input.email);
    if (!user || !user.password_hash) {
      bruteForceProtection.recordFailure(input.email);
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValid = await verifyPassword(input.password, user.password_hash);
    if (!isValid) {
      bruteForceProtection.recordFailure(input.email);
      throw new Error("Invalid email or password");
    }

    bruteForceProtection.recordSuccess(input.email);

    // Generate session
    return this.generateSession(user);
  },

  /**
   * Generate a session for a user
   */
  async generateSession(user: User): Promise<Session> {
    if (!securityConfig.jwtSecret) {
      throw new Error("JWT_SECRET not configured");
    }

    const now = Math.floor(Date.now() / 1000);
    const role: UserRole = "user"; // Default role, can be enhanced with RBAC

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role,
      iat: now,
      exp: now + JWT_EXPIRATION_SECONDS,
      iss: JWT_ISSUER,
    };

    const accessToken = generateJWT(payload, securityConfig.jwtSecret);
    const refreshToken = generateRefreshToken();

    // Store refresh token session
    storeSession(user.id, refreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS);

    // Update last login
    await userRepository.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRATION_SECONDS,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        role,
      },
    };
  },

  /**
   * Refresh an access token using a refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<Session> {
    if (!securityConfig.jwtSecret) {
      throw new Error("Authentication not configured");
    }

    const session = getSession(refreshToken);
    if (!session) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await userRepository.getUserById(session.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete old session
    deleteSession(refreshToken);

    // Generate new session
    return this.generateSession(user);
  },

  /**
   * Sign out (invalidate refresh token)
   */
  signOut(refreshToken: string): void {
    deleteSession(refreshToken);
  },

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): JWTPayload | null {
    if (!securityConfig.jwtSecret) {
      return null;
    }
    return verifyJWT(token, securityConfig.jwtSecret);
  },

  /**
   * Extract user from request headers
   */
  async getUserFromToken(token: string): Promise<AuthUser | null> {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    const user = await userRepository.getUserById(payload.sub);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      role: payload.role,
    };
  },
};

// ============= Middleware =============

import type { IncomingMessage } from "node:http";

/**
 * Extract token from request headers
 */
export function extractTokenFromRequest(req: IncomingMessage): string | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader) return undefined;

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return undefined;
}

/**
 * Authentication middleware factory
 */
export function createAuthMiddleware() {
  return {
    /**
     * Require authentication - returns 401 if not authenticated
     */
    async requireAuth(
      req: IncomingMessage
    ): Promise<{ authenticated: false } | { authenticated: true; user: AuthUser }> {
      if (!featureFlags.auth) {
        // Auth disabled - return a default user for development
        return {
          authenticated: true,
          user: {
            id: "dev-user",
            email: "dev@example.com",
            fullName: "Development User",
            role: "admin",
          },
        };
      }

      const token = extractTokenFromRequest(req);
      if (!token) {
        return { authenticated: false };
      }

      const user = await authService.getUserFromToken(token);
      if (!user) {
        return { authenticated: false };
      }

      return { authenticated: true, user };
    },

    /**
     * Require specific role
     */
    async requireRole(
      req: IncomingMessage,
      requiredRole: UserRole
    ): Promise<{ authorized: false; reason: string } | { authorized: true; user: AuthUser }> {
      const result = await this.requireAuth(req);
      if (!result.authenticated) {
        return { authorized: false, reason: "Authentication required" };
      }

      if (result.user.role !== requiredRole && requiredRole !== "user") {
        return { authorized: false, reason: `Requires ${requiredRole} role` };
      }

      return { authorized: true, user: result.user };
    },
  };
}

export const authMiddleware = createAuthMiddleware();