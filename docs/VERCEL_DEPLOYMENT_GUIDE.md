# Vercel Deployment Guide for SSB NextGen Pro

## Overview

This guide explains how to deploy the SSB NextGen Pro application. The project consists of two parts:

1. **Frontend (Next.js)** - Deploy to **Vercel** ✅
2. **Backend (Node.js API)** - Deploy to **Railway, Render, or AWS** (not Vercel-compatible)

## 🚀 Frontend Deployment to Vercel

### Prerequisites

1. **Supabase Project** - Create at [supabase.com](https://supabase.com)
2. **GitHub/GitLab/Bitbucket** - Push your code to a repository
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

### Step-by-Step Deployment

#### 1. Push Code to Git

```bash
cd ssb-nextgen-pro/frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/ssb-nextgen-pro.git
git push -u origin main
```

#### 2. Deploy to Vercel

**Option A: Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Select the `frontend` folder as the root directory
4. Add environment variables (see below)
5. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to frontend
cd ssb-nextgen-pro/frontend

# Deploy
vercel --prod
```

#### 3. Configure Environment Variables

In the Vercel dashboard, go to **Project Settings → Environment Variables** and add:

| Variable                        | Value                     | Environment                      |
| ------------------------------- | ------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key    | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL`           | Your backend API URL      | Production, Preview, Development |

#### 4. Post-Deployment

After deployment, Vercel will provide a URL like:

```
https://ssb-nextgen-pro-frontend.vercel.app
```

## 🔧 Backend Deployment Options

The Node.js backend (`extensions` workspace) cannot be deployed to Vercel because it:

- Requires a long-running server process
- Uses WebSocket-like connections for matchmaking
- Needs Redis for session management

### Recommended: Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Deploy from GitHub or upload your code
4. Set environment variables from `.env.example`
5. Deploy

### Alternative: Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Configure build and start commands:
   - Build: `npm install && npm run build`
   - Start: `node dist/server.js`
5. Add environment variables
6. Deploy

### Alternative: AWS (EC2 or ECS)

For enterprise deployments, use AWS with:

- EC2 for simple deployments
- ECS/Fargate for containerized deployments
- RDS or Supabase for database

## 📋 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

### Backend (.env)

```env
PORT=3001
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REDIS_URL=redis://your-redis-url
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ENABLE_AUTH=true
ENABLE_WAF=true
```

## 🔗 Connecting Frontend to Backend

After deploying both:

1. Get your backend URL (e.g., `https://api.railway.app`)
2. Update frontend environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://api.railway.app
   ```
3. Redeploy frontend to apply changes

## ✅ Verification Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Supabase database configured
- [ ] RLS policies applied
- [ ] Environment variables set
- [ ] Frontend can reach backend API
- [ ] Authentication working (if enabled)
- [ ] HTTPS enabled on both

## 🐛 Troubleshooting

### Frontend Issues

**Build fails:**

```bash
cd frontend
npm run build
```

**Environment variables not working:**

- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables

### Backend Issues

**Server won't start:**

```bash
npm run build
npm start
```

**Database connection fails:**

- Check Supabase credentials
- Verify network connectivity

## 📊 Monitoring

### Vercel Analytics

- Go to Vercel dashboard → Analytics
- Enable for performance monitoring

### Supabase Logs

- Go to Supabase dashboard → Logs
- Monitor database queries

### Backend Logs

- Railway: View logs in dashboard
- Render: View logs in dashboard

## 🔄 CI/CD

Vercel automatically deploys on push to your main branch. For custom workflows:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
          working-directory: ./frontend
```

## 💰 Cost Estimates

### Vercel (Frontend)

- **Hobby**: Free (for personal projects)
- **Pro**: $20/month (for commercial projects)

### Railway (Backend)

- **Pay as you go**: ~$5-20/month depending on usage

### Supabase

- **Free tier**: Generous for development
- **Pro**: $25/month for production

## 📞 Support

For issues:

- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
