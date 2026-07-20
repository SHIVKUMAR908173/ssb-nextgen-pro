import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  connect-src 'self' http://localhost:* ws://localhost:* https://*.supabase.co wss://*.supabase.co https://*.render.com wss://*.render.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader.replace(/\n/g, '') },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/gto/:path*',
        destination: `${backendUrl}/api/gto/:path*`
      },
      {
        source: '/api/gpe/:path*',
        destination: `${backendUrl}/api/gpe/:path*`
      },
      {
        source: '/api/wat/:path*',
        destination: `${backendUrl}/api/wat/:path*`
      },
      {
        source: '/api/tat/:path*',
        destination: `${backendUrl}/api/tat/:path*`
      },
      {
        source: '/api/srt/:path*',
        destination: `${backendUrl}/api/srt/:path*`
      },
      {
        source: '/api/pi/:path*',
        destination: `${backendUrl}/api/pi/:path*`
      },
      {
        source: '/api/ssb/:path*',
        destination: `${backendUrl}/api/ssb/:path*`
      },
      {
        source: '/api/gamification/:path*',
        destination: `${backendUrl}/api/gamification/:path*`
      },
      {
        source: '/api/oir/session/:path*',
        destination: `${backendUrl}/api/oir/session/:path*`
      }
    ];
  },
};

export default nextConfig;
