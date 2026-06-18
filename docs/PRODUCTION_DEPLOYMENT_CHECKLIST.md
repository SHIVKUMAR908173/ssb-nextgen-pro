# Production Deployment Checklist

## Pre-Deployment

### Environment Setup

- [ ] Copy `.env.example` to `.env` and configure all values
- [ ] Set `NODE_ENV=production`
- [ ] Generate a strong `JWT_SECRET` (min 32 characters)
- [ ] Configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set up Redis if using `ENABLE_REDIS_MATCHMAKING=true`
- [ ] Configure `CORS_ORIGIN` for your production domain

### Database Setup

- [ ] Create Supabase project
- [ ] Run `database/schema.sql` to create tables
- [ ] Run `database/rls_policies.sql` to enable Row Level Security
- [ ] Create database indexes for performance
- [ ] Test database connections

### Security

- [ ] Enable HTTPS/TLS for production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable WAF (Web Application Firewall)
- [ ] Review and test RLS policies
- [ ] Set up monitoring and alerting

## Build & Deploy

### Build

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Build
npm run build
```

### Deploy Options

#### Option 1: Node.js Server

```bash
# Start production server
NODE_ENV=production npm start
```

#### Option 2: Docker

```bash
# Build Docker image
docker build -t ssb-nextgen-pro .

# Run container
docker run -p 3001:3001 --env-file .env ssb-nextgen-pro
```

#### Option 3: PM2

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/server.js --name ssb-api

# Save PM2 configuration
pm2 save
```

## Post-Deployment

### Verification

- [ ] Health check endpoint responds: `GET /health`
- [ ] All API endpoints are accessible
- [ ] Authentication works (if enabled)
- [ ] Database connections are stable
- [ ] Rate limiting is working
- [ ] Error handling returns proper status codes

### Monitoring

- [ ] Set up logging (consider OpenTelemetry)
- [ ] Configure error tracking
- [ ] Set up uptime monitoring
- [ ] Monitor database performance
- [ ] Monitor memory and CPU usage

## Rollback Plan

### Quick Rollback

1. Keep previous version deployed
2. Use PM2 to switch versions: `pm2 reload all`
3. Have database backups ready

### Database Backup

```sql
-- Create backup
pg_dump -h <host> -U postgres -d postgres > backup_$(date +%Y%m%d).sql
```

## Maintenance

### Regular Tasks

- [ ] Monitor logs for errors
- [ ] Review security logs
- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Review and optimize database queries
- [ ] Clean up old sessions and temporary data

### Security Updates

- [ ] Subscribe to security advisories for dependencies
- [ ] Test security patches in staging first
- [ ] Deploy security updates promptly

## Troubleshooting

### Common Issues

#### Database Connection Failures

- Check Supabase credentials
- Verify network connectivity
- Check connection pool settings

#### High Memory Usage

- Increase Node.js memory limit: `NODE_OPTIONS=--max-old-space-size=4096`
- Consider horizontal scaling
- Review for memory leaks

#### Rate Limiting Issues

- Adjust `RATE_LIMIT_*` settings
- Consider Redis-backed rate limiting for distributed systems

## Support

For issues and questions:

- Check logs: `pm2 logs ssb-api`
- Review error messages
- Check database status in Supabase dashboard
