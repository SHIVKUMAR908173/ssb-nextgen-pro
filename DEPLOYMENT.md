# SSB NextGen Pro — Deployment Guide

## Infrastructure Architecture
SSB NextGen Pro is deployed across three distinct platforms:
1. **Frontend:** Vercel (Next.js Edge Network)
2. **Backends (Node & Python):** Render (Docker Containers)
3. **Database & Auth:** Supabase (PostgreSQL)

## Deployment Pipeline (CI/CD)
Deployment is fully automated via GitHub Actions (`.github/workflows/deploy.yml`):
- Pushes to the `main` branch trigger the deployment pipeline.
- **Frontend** is built and deployed directly to Vercel via the `vercel-action`.
- **Backend-Core & Backend-AI** trigger Render deployments via Webhooks (ensure `RENDER_DEPLOY_HOOK` is configured in GitHub Secrets).

## Prerequisites & Environment Variables

### Supabase
Ensure the following are set in all environments:
- `NEXT_PUBLIC_SUPABASE_URL` (Frontend + Backend-Core)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Frontend + Backend-Core)
- `SUPABASE_SERVICE_ROLE_KEY` (Backend-Core + Backend-AI - KEEP SECRET)
- `DATABASE_URL` (Backend-AI for direct asyncpg connections)

### AI
- `GEMINI_API_KEY` (Backend-AI + Frontend Edge)

### Render Configuration (`render.yaml`)
We use Infrastructure-as-Code for Render:
- `backend-core` builds via `Dockerfile.node`. Requires `NODE_VERSION=22` and standard Node build arguments.
- `backend-ai` builds via `Dockerfile` using Python 3.12-slim. It installs system dependencies (`ffmpeg`, `libsndfile1`) for audio processing.

## Manual Deployment steps
If CI/CD fails, you can deploy manually:

**Frontend (Vercel):**
```bash
cd frontend
vercel --prod
```

**Backends (Render):**
Navigate to the Render Dashboard, select the Web Service, and click "Manual Deploy -> Deploy latest commit".

## Disaster Recovery
- **Database Backups:** Supabase handles point-in-time recovery (PITR) depending on the project tier. For free/Pro tiers, logical backups are taken daily.
- **Codebase:** Entire system state is stored in GitHub. Since backends are stateless (Redis is ephemeral/fallback), any complete loss of compute infrastructure can be recovered by re-linking the Render webhooks to GitHub.
