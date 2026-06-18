import type { ServerResponse } from "node:http";

export function applySecurityHeaders(res: ServerResponse) {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Strict Transport Security (HSTS)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  
  // Clickjacking protection
  res.setHeader("X-Frame-Options", "DENY");
  
  // XSS Protection (legacy but good for older browsers)
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Content Security Policy (strict REST API mode)
  // APIs shouldn't be rendering HTML or running inline scripts anyway.
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; sandbox");
}
