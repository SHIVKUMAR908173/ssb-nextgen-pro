# SSB NextGen Pro — Security Policy

## Authentication & Authorization
- **Supabase Auth:** All authentication is offloaded to Supabase. Next.js uses `@supabase/ssr` middleware to manage session cookies securely.
- **Protected Routes:** Frontend enforces authentication on restricted areas (e.g., `/dashboard`, `/assessments`) via `middleware.ts`. Unauthenticated users are redirected to `/login`.
- **Row Level Security (RLS):** Direct database access from the frontend is governed by strict PostgreSQL RLS policies ensuring users can only read/write their own records.

## API Security
- **Rate Limiting (Python):** Handled by `slowapi` ensuring a maximum of 60 requests per minute by default for AI endpoints.
- **Rate Limiting (Node.js):** Custom middleware implementation to prevent abuse of core APIs.
- **CORS Policies:** Configured explicitly to allow only specific origins (e.g., `https://ssb-nextgen-pro.vercel.app` and localhost during dev).
- **Global Exception Handling:** Stack traces are suppressed in production. A generic "Internal Server Error" is returned to clients, while detailed exceptions are logged internally via standard structured logging.

## Data Privacy & LLM Risks
- **No PII in Prompts:** Sensitive personally identifiable information must not be sent to Google Gemini APIs.
- **Validation:** All inputs sent to the AI backend are strictly typed using Pydantic. AI outputs are validated against Pydantic schemas before being returned or stored to prevent prompt-injection or hallucinated schema breaks.

## Secrets Management
- **Environment Variables:** All secrets (API keys, DB URLs) are injected at runtime via environment variables in Vercel and Render.
- **Git Ignore:** `.env` and `*.env` files are strictly excluded from source control.
- **Key Rotation:** If Supabase anon/service-role keys or Gemini API keys are accidentally committed, they must be revoked and rotated immediately via their respective provider dashboards.

## Dependency Management
- **Upgrades:** Both `npm` packages and `pip` requirements must be scanned periodically for known vulnerabilities.
- **Python Compatibility:** Python dependencies are pinned with `>=` operators to ensure compatibility while grabbing security patches. (Note: Currently targeting Python 3.12 for Docker deployments and 3.14 for local development).
