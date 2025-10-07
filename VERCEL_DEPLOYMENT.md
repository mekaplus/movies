# Vercel Deployment Guide with Prisma Migrations

This guide covers deploying XFLIX to Vercel with automatic database migrations.

---

## 🚀 Quick Deployment

### Prerequisites
- Vercel account (free tier works!)
- GitHub/GitLab/Bitbucket account
- Database (PostgreSQL, MySQL, or MongoDB)

---

## Step 1: Prepare Your Database

### Option A: Vercel Postgres (Recommended)

1. **Go to Vercel Dashboard**
2. **Storage** → **Create Database** → **Postgres**
3. **Copy the connection string**

### Option B: Supabase (Free)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Project Settings** → **Database**
4. Copy the **Connection String** (choose "Transaction" mode)

### Option C: Railway (Free tier available)

1. Go to [railway.app](https://railway.app)
2. New Project → PostgreSQL
3. Copy the **DATABASE_URL**

### Option D: PlanetScale (MySQL)

1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string

---

## Step 2: Push Your Code to Git

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/mini-netflix.git
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New..."** → **Project**
3. **Import your Git repository**
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: Leave as default (will use package.json)
   - **Output Directory**: Leave as default

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```env
   DATABASE_URL=your_database_connection_string
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

   **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

6. **Click "Deploy"**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

---

## Step 4: Configure Environment Variables

After deployment, add all required environment variables:

### Via Dashboard:
1. Go to your project on Vercel
2. **Settings** → **Environment Variables**
3. Add each variable:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Authentication
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-app.vercel.app

# Optional: Add others as needed
NODE_ENV=production
```

### Via CLI:
```bash
# Set environment variable
vercel env add DATABASE_URL

# You'll be prompted to enter the value
# Choose which environments: Production, Preview, Development
```

---

## Step 5: Verify Migrations Run Automatically

Our updated `package.json` now includes:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "postinstall": "prisma generate"
  }
}
```

This means:
✅ **On every deployment**: Prisma generates client → Runs migrations → Builds Next.js
✅ **Automatic**: No manual intervention needed
✅ **Safe**: Uses `migrate deploy` (production-safe, won't prompt)

### Check Build Logs

After deployment, check the build logs on Vercel:

1. Go to your deployment
2. Click on the build
3. Look for:
   ```
   Running "prisma generate"
   ✔ Generated Prisma Client

   Running "prisma migrate deploy"
   ✔ Applied X migrations

   Running "next build"
   ✔ Compiled successfully
   ```

---

## Step 6: Seed Initial Data (First Time Only)

After first deployment, seed your database:

### Option A: Run seed script locally

```bash
# Point to production database
DATABASE_URL="your_production_database_url" pnpm run seed
DATABASE_URL="your_production_database_url" pnpm run seed:admin
```

### Option B: Create API endpoint for seeding

Create `src/app/api/admin/seed/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { secret } = await request.json();

  // Protect with a secret
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Run your seed logic here
    // ... (copy from src/scripts/seed.ts)

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
```

Then call it:
```bash
curl -X POST https://your-app.vercel.app/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_seed_secret"}'
```

---

## Step 7: Setup Automatic Deployments

Vercel automatically deploys when you push to Git!

### How it works:
- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

### Configure branches:
1. **Settings** → **Git**
2. **Production Branch**: `main` or `master`
3. **Preview deployments**: Enable for all branches

---

## Step 8: Create New Migrations in the Future

When you need to update your database schema:

### 1. Make schema changes locally

Edit `prisma/schema.prisma`:
```prisma
model Movie {
  id          String   @id @default(cuid())
  title       String
  // New field
  imdbRating  Float?   // Add new field
}
```

### 2. Create migration

```bash
# Create migration file
pnpm prisma migrate dev --name add_imdb_rating

# This creates a new migration in prisma/migrations/
```

### 3. Test locally

```bash
# Restart your dev server
pnpm dev
```

### 4. Commit and push

```bash
git add .
git commit -m "Add IMDB rating to movies"
git push
```

### 5. Vercel automatically:
1. Pulls your code
2. Runs `prisma generate`
3. Runs `prisma migrate deploy` (applies your new migration)
4. Builds and deploys

✅ **Done!** Your production database is updated automatically.

---

## Common Issues & Solutions

### Issue: "Migration failed"

**Cause**: Database connection issues or schema conflicts

**Solution**:
1. Check `DATABASE_URL` is correct in Vercel env vars
2. Ensure database is accessible from Vercel (check firewall/IP whitelist)
3. Check build logs for specific error
4. For Vercel Postgres: Make sure connection string includes `?sslmode=require`

### Issue: "Prisma Client not found"

**Cause**: `prisma generate` didn't run

**Solution**:
1. Ensure `postinstall` script exists in package.json
2. Check build logs to confirm it ran
3. Redeploy with `vercel --prod --force`

### Issue: "Can't reach database server"

**Cause**: Database not accessible from Vercel

**Solution**:
1. **Supabase**: Use "Transaction" mode connection string, not "Session"
2. **Railway**: Ensure public networking is enabled
3. **PlanetScale**: Add `?sslaccept=strict` to connection string
4. Check database is not paused (Supabase/Railway can auto-pause)

### Issue: Migrations work locally but fail on Vercel

**Cause**: Different database provider or missing permissions

**Solution**:
1. Ensure same database provider locally and in production
2. Database user needs CREATE/ALTER/DROP permissions
3. For Vercel Postgres, permissions should be automatic

### Issue: "MIGRATION_CONFLICT"

**Cause**: Local migrations out of sync with production

**Solution**:
```bash
# Reset local migrations (DANGER: only if safe)
pnpm prisma migrate reset

# Or pull production state
pnpm prisma db pull
pnpm prisma migrate dev
```

---

## Environment Variables Reference

Here are all the environment variables you need:

### Required:
```env
# Database (from your provider)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# NextAuth (for authentication)
NEXTAUTH_SECRET="openssl-rand-base64-32-output"
NEXTAUTH_URL="https://your-app.vercel.app"
```

### Optional:
```env
# Telegram Bot (if integrating backend features)
TELEGRAM_BOT_TOKEN="123456789:ABC..."

# Seed protection
SEED_SECRET="another-random-secret"

# Node environment
NODE_ENV="production"
```

### Setting them on Vercel:

**Via Dashboard:**
```
Project → Settings → Environment Variables → Add
```

**Via CLI:**
```bash
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

---

## Performance Optimization

### 1. Enable Edge Runtime (Optional)

For better performance in Telegram Mini Apps:

```typescript
// src/app/layout.tsx
export const runtime = 'edge'; // Optional: for faster cold starts
```

### 2. Database Connection Pooling

For better database performance, use connection pooling:

**Prisma with PgBouncer (Supabase/Vercel Postgres):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional: for migrations
}
```

**Environment Variables:**
```env
DATABASE_URL="postgresql://...?pgbouncer=true"
DIRECT_URL="postgresql://..." # Direct connection for migrations
```

### 3. Optimize Build Time

Add to `next.config.ts`:
```typescript
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/@prisma/client/**/*'],
    },
  },
};
```

---

## Monitoring

### Check Deployment Status

```bash
# List recent deployments
vercel ls

# Check specific deployment logs
vercel logs [deployment-url]
```

### View Runtime Logs

1. Go to Vercel Dashboard
2. Select your project
3. **Deployments** tab
4. Click on a deployment
5. **Function Logs** (for API routes)

### Set up Alerts

1. **Settings** → **Notifications**
2. Enable:
   - Deployment Failed
   - Deployment Ready
   - Production Error Alerts

---

## Database Backup (Important!)

### Vercel Postgres:
- Automatic backups included
- Check **Storage** → **Postgres** → **Backups**

### Supabase:
- Free tier: Daily backups (7 days retention)
- Pro: More retention options

### Manual Backup:
```bash
# Backup to SQL file
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

---

## Rollback Strategy

If a deployment breaks:

### Option 1: Instant Rollback (Vercel UI)
1. Go to **Deployments**
2. Find working deployment
3. Click **⋯** → **Promote to Production**

### Option 2: Revert Git Commit
```bash
git revert HEAD
git push
```

### Option 3: Rollback Migration
```bash
# Locally, create a down migration
pnpm prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource $DATABASE_URL \
  --script > rollback.sql

# Apply manually to production database
psql $DATABASE_URL < rollback.sql
```

---

## CI/CD Workflow Summary

Here's what happens on every `git push`:

```
1. Push to GitHub
   ↓
2. Vercel detects push
   ↓
3. Install dependencies (runs postinstall → prisma generate)
   ↓
4. Run build command:
   - prisma generate (generates client)
   - prisma migrate deploy (applies migrations)
   - next build (builds app)
   ↓
5. Deploy to Vercel CDN
   ↓
6. Update production URL
   ↓
7. Send deployment notification
```

**Total time**: Usually 1-3 minutes ⚡

---

## Best Practices

### ✅ DO:
- Always test migrations locally first
- Use `prisma migrate dev` for development
- Use `prisma migrate deploy` for production (we do this automatically)
- Keep migrations in version control
- Use meaningful migration names
- Backup database before major schema changes

### ❌ DON'T:
- Don't use `prisma db push` in production (we use `migrate deploy`)
- Don't edit migration files after they're created
- Don't delete migrations that have been applied
- Don't skip testing migrations locally

---

## Quick Reference Commands

```bash
# Deploy to production
git push origin main

# Check deployment status
vercel ls

# View logs
vercel logs

# Add environment variable
vercel env add VARIABLE_NAME

# Force redeploy
vercel --prod --force

# Create new migration
pnpm prisma migrate dev --name migration_name

# View current schema
pnpm prisma studio

# Check migration status
pnpm prisma migrate status
```

---

## Next Steps

After successful deployment:

1. ✅ Test your app at the Vercel URL
2. ✅ Verify migrations ran (check build logs)
3. ✅ Seed your production database
4. ✅ Set up your Telegram Bot (see TELEGRAM_DEPLOYMENT.md)
5. ✅ Configure custom domain (optional)
6. ✅ Set up monitoring/analytics

---

## Support

**Vercel Docs**: https://vercel.com/docs
**Prisma Docs**: https://www.prisma.io/docs
**Next.js Docs**: https://nextjs.org/docs

**Need help?** Check the build logs first - they usually tell you exactly what went wrong!

---

## Summary

✅ **Migrations are automated** - Run on every deployment
✅ **Zero downtime** - Vercel handles it
✅ **Safe** - Uses `migrate deploy` (production-safe)
✅ **Fast** - Usually completes in 1-3 minutes
✅ **Automatic** - Just `git push` and you're done!

Your database schema and application will always stay in sync! 🚀
