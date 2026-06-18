/**
 * Centralized configuration management
 * All environment variables and configuration values are loaded and validated here
 */

import { z } from "zod";

// Environment schema validation
const EnvSchema = z.object({
  // Server
  PORT: z.string().default("3001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Supabase
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Redis
  REDIS_URL: z.string().url().default("redis://127.0.0.1:6379"),
  ENABLE_REDIS_MATCHMAKING: z.string().default("false"),

  // Security
  JWT_SECRET: z.string().min(32).optional(),
  SESSION_SECRET: z.string().optional(),
  CORS_ORIGIN: z.string().url().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default("60000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("120"),
  MAX_PAYLOAD_BYTES: z.string().default("200000"),

  // Matchmaking
  MATCHMAKING_NOTIFY_CHANNEL: z.string().default("gd-gpe:notify"),
  MATCHMAKING_QUEUE_KEY: z.string().default("gd-gpe:queue"),
  MATCHMAKING_GROUP_MIN_SIZE: z.string().default("8"),
  MATCHMAKING_GROUP_MAX_SIZE: z.string().default("10"),
  MATCHMAKING_TTL_MS: z.string().default("600000"),
  MATCHMAKING_CANDIDATE_MAX_AGE_MS: z.string().default("600000"),

  // OpenTelemetry
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  OTEL_SERVICE_NAME: z.string().default("ssb-nextgen-pro"),

  // Feature Flags
  ENABLE_WAF: z.string().default("true"),
  ENABLE_RATE_LIMITING: z.string().default("true"),
  ENABLE_AUTH: z.string().default("true"),
  
  // Auth Security
  AUTH_MAX_ATTEMPTS: z.string().default("5"),
  AUTH_LOCKOUT_DURATION_MS: z.string().default("900000"), // 15 mins
});

type EnvConfig = z.infer<typeof EnvSchema>;

function loadEnv(): EnvConfig {
  const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV as string,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    REDIS_URL: process.env.REDIS_URL,
    ENABLE_REDIS_MATCHMAKING: process.env.ENABLE_REDIS_MATCHMAKING,
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    MAX_PAYLOAD_BYTES: process.env.MAX_PAYLOAD_BYTES,
    MATCHMAKING_NOTIFY_CHANNEL: process.env.MATCHMAKING_NOTIFY_CHANNEL,
    MATCHMAKING_QUEUE_KEY: process.env.MATCHMAKING_QUEUE_KEY,
    MATCHMAKING_GROUP_MIN_SIZE: process.env.MATCHMAKING_GROUP_MIN_SIZE,
    MATCHMAKING_GROUP_MAX_SIZE: process.env.MATCHMAKING_GROUP_MAX_SIZE,
    MATCHMAKING_TTL_MS: process.env.MATCHMAKING_TTL_MS,
    MATCHMAKING_CANDIDATE_MAX_AGE_MS: process.env.MATCHMAKING_CANDIDATE_MAX_AGE_MS,
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
    ENABLE_WAF: process.env.ENABLE_WAF,
    ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING,
    ENABLE_AUTH: process.env.ENABLE_AUTH,
    AUTH_MAX_ATTEMPTS: process.env.AUTH_MAX_ATTEMPTS,
    AUTH_LOCKOUT_DURATION_MS: process.env.AUTH_LOCKOUT_DURATION_MS,
  };

  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("Environment validation failed:", JSON.stringify(parsed.error.flatten(), null, 2));
    process.exit(1);
  }

  return parsed.data;
}

const config = loadEnv();

// Export typed configuration
export const serverConfig = {
  port: Number(config.PORT),
  nodeEnv: config.NODE_ENV,
  isProduction: config.NODE_ENV === "production",
  isDevelopment: config.NODE_ENV === "development",
};

export const supabaseConfig = {
  url: config.SUPABASE_URL,
  anonKey: config.SUPABASE_ANON_KEY,
  serviceRoleKey: config.SUPABASE_SERVICE_ROLE_KEY,
};

export const redisConfig = {
  url: config.REDIS_URL,
  enabled: config.ENABLE_REDIS_MATCHMAKING === "true",
};

export const securityConfig = {
  jwtSecret: config.JWT_SECRET,
  sessionSecret: config.SESSION_SECRET,
  corsOrigin: config.CORS_ORIGIN,
  maxAttempts: Number(config.AUTH_MAX_ATTEMPTS),
  lockoutDurationMs: Number(config.AUTH_LOCKOUT_DURATION_MS),
};

export const rateLimitConfig = {
  windowMs: Number(config.RATE_LIMIT_WINDOW_MS),
  maxRequests: Number(config.RATE_LIMIT_MAX_REQUESTS),
  maxPayloadBytes: Number(config.MAX_PAYLOAD_BYTES),
};

export const matchmakingConfig = {
  notifyChannel: config.MATCHMAKING_NOTIFY_CHANNEL,
  queueKey: config.MATCHMAKING_QUEUE_KEY,
  groupMinSize: Number(config.MATCHMAKING_GROUP_MIN_SIZE),
  groupMaxSize: Number(config.MATCHMAKING_GROUP_MAX_SIZE),
  ttlMs: Number(config.MATCHMAKING_TTL_MS),
  candidateMaxAgeMs: Number(config.MATCHMAKING_CANDIDATE_MAX_AGE_MS),
};

export const otelConfig = {
  endpoint: config.OTEL_EXPORTER_OTLP_ENDPOINT,
  serviceName: config.OTEL_SERVICE_NAME,
};

export const featureFlags = {
  waf: config.ENABLE_WAF === "true",
  rateLimiting: config.ENABLE_RATE_LIMITING === "true",
  auth: config.ENABLE_AUTH === "true",
};

export { config as envConfig };