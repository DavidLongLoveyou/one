# Production Deployment Guide

Complete guide for deploying **The Great Beans** to production with PostgreSQL backend and Next.js frontend.

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  PRODUCTION ARCHITECTURE                    │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (Next.js 14)                      │
│  └─> Vercel                                 │
│      • Edge Functions                       │
│      • Image Optimization                   │
│      • ISR Caching                          │
│      • CDN Distribution                     │
│                                             │
│  Backend (Strapi 5)                         │
│  └─> Railway / Heroku / VPS                 │
│      • Node.js 20+ runtime                  │
│      • Media uploads → S3/Cloudinary        │
│      • API endpoints                        │
│                                             │
│  Database (PostgreSQL 15)                   │
│  └─> Managed Service                        │
│      • Supabase (recommended)               │
│      • Railway Postgres                     │
│      • Heroku Postgres                      │
│      • AWS RDS                              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Table of Contents

1. [Backend Deployment](#backend-deployment)
   - [Option A: Railway (Easiest)](#option-a-railway-easiest)
   - [Option B: Heroku](#option-b-heroku)
   - [Option C: VPS (Self-hosted)](#option-c-vps-self-hosted)
2. [Database Setup](#database-setup)
   - [Option A: Supabase (Recommended)](#option-a-supabase-recommended)
   - [Option B: Railway Postgres](#option-b-railway-postgres)
   - [Option C: VPS PostgreSQL](#option-c-vps-postgresql)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Media Storage (S3/Cloudinary)](#media-storage)
5. [Post-Deployment](#post-deployment)

---

## Backend Deployment

### Option A: Railway (Easiest)

**Best for:** Quick deployment, all-in-one platform

**Pros:**
- ✅ One-click deploy from GitHub
- ✅ Built-in PostgreSQL
- ✅ Free $5/month credit
- ✅ Automatic SSL
- ✅ Great for small-medium projects

**Cost:** ~$5-15/month (starter plan)

#### Setup Steps

**1. Prepare Repository**

Ensure your `backend` directory has:
- `package.json` with start script
- `.env` variables documented
- `Procfile` (optional but recommended)

Create `backend/Procfile`:
```
web: npm run start
```

**2. Sign Up for Railway**

1. Go to https://railway.app
2. Sign up with GitHub
3. Connect your repository

**3. Create New Project**

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select `backend` directory as root path

**4. Add PostgreSQL**

1. In project dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway auto-creates database and connection string

**5. Configure Environment Variables**

In Railway dashboard, go to Variables tab:

```env
# Server
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}  # Railway auto-assigns

# Secrets (Generate new ones!)
APP_KEYS=prod_key1,prod_key2,prod_key3,prod_key4
API_TOKEN_SALT=prod_salt
ADMIN_JWT_SECRET=prod_secret
TRANSFER_TOKEN_SALT=prod_salt
JWT_SECRET=prod_secret

# Database (Auto-filled by Railway)
DATABASE_CLIENT=postgres
DATABASE_HOST=${{POSTGRES.PGHOST}}
DATABASE_PORT=${{POSTGRES.PGPORT}}
DATABASE_NAME=${{POSTGRES.PGDATABASE}}
DATABASE_USERNAME=${{POSTGRES.PGUSER}}
DATABASE_PASSWORD=${{POSTGRES.PGPASSWORD}}
DATABASE_SSL=true

# CORS (Your frontend URL)
CORS_ORIGIN=https://your-domain.vercel.app

# Media (if using Cloudinary)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

**6. Deploy**

1. Push to GitHub → Railway auto-deploys
2. Wait 3-5 minutes
3. Access at: `https://your-app.railway.app`

**7. Create Admin User**

Visit: `https://your-app.railway.app/admin` and create account.

---

### Option B: Heroku

**Best for:** Established platform, reliable

**Pros:**
- ✅ Very stable
- ✅ Great docs
- ✅ Add-ons ecosystem
- ❌ More expensive

**Cost:** ~$7-16/month

#### Setup Steps

**1. Install Heroku CLI**

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

**2. Login**

```bash
heroku login
```

**3. Create App**

```bash
cd backend
heroku create thegreatbeans-api
```

**4. Add PostgreSQL**

```bash
heroku addons:create heroku-postgresql:mini
```

**5. Configure Environment Variables**

```bash
heroku config:set NODE_ENV=production
heroku config:set APP_KEYS="key1,key2,key3,key4"
heroku config:set API_TOKEN_SALT="your_salt"
heroku config:set ADMIN_JWT_SECRET="your_secret"
heroku config:set JWT_SECRET="your_secret"
heroku config:set TRANSFER_TOKEN_SALT="your_salt"
heroku config:set DATABASE_CLIENT=postgres
heroku config:set DATABASE_SSL=true
heroku config:set CORS_ORIGIN="https://your-domain.vercel.app"
```

**6. Deploy**

```bash
git push heroku main
```

**7. Scale**

```bash
heroku ps:scale web=1
```

---

### Option C: VPS (Self-hosted)

**Best for:** Full control, custom configuration

**Requirements:**
- Ubuntu 22.04 LTS
- 2GB RAM minimum (4GB recommended)
- 20GB+ SSD
- Static IP or domain

#### Complete VPS Setup

**1. Initial Server Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # Should be v20.x.x
npm --version
```

**2. Install PM2 (Process Manager)**

```bash
sudo npm install -g pm2
```

**3. Setup Application User**

```bash
sudo adduser strapi
sudo usermod -aG sudo strapi
su - strapi
```

**4. Clone Repository**

```bash
cd ~
git clone https://github.com/your-username/thegreatbeans.git
cd thegreatbeans/backend
```

**5. Install Dependencies**

```bash
npm install --production
```

**6. Configure Environment**

```bash
cp env.example .env
nano .env
```

Set production values (see Railway section for variables).

**7. Build Strapi**

```bash
NODE_ENV=production npm run build
```

**8. Start with PM2**

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'strapi',
    script: 'npm',
    args: 'run start',
    cwd: '/home/strapi/thegreatbeans/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 1337
    }
  }]
};
```

Start:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**9. Install Nginx (Reverse Proxy)**

```bash
sudo apt install nginx -y
```

Create config:

```bash
sudo nano /etc/nginx/sites-available/strapi
```

```nginx
server {
    listen 80;
    server_name api.thegreatbeans.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**10. SSL with Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.thegreatbeans.com
```

---

## Database Setup

See [DATABASE-SETUP.md](backend/DATABASE-SETUP.md) for detailed instructions.

### Quick Options

**Option A: Supabase** (Recommended)
- Free tier: 500MB database
- Connection string: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true`

**Option B: Railway Postgres**
- Included with Railway backend deployment
- Auto-configured connection

**Option C: VPS PostgreSQL**
- Self-hosted PostgreSQL 15
- See VPS setup section above

---

## Frontend Deployment (Vercel)

### Prerequisites

- Backend deployed and accessible
- Backend URL (e.g., `https://api.thegreatbeans.com`)
- Strapi API token generated

### Setup Steps

**1. Prepare Repository**

Ensure `frontend/package.json` has:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

**2. Sign Up for Vercel**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository

**3. Configure Project**

- **Root Directory:** `frontend`
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

**4. Environment Variables**

In Vercel dashboard → Settings → Environment Variables:

```env
# Strapi API
NEXT_PUBLIC_API_URL=https://api.thegreatbeans.com
STRAPI_API_TOKEN=your_readonly_api_token

# Site
NEXT_PUBLIC_SITE_URL=https://thegreatbeans.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

**5. Deploy**

1. Click "Deploy"
2. Wait 2-3 minutes
3. Access at: `https://your-project.vercel.app`

**6. Custom Domain**

1. Go to Settings → Domains
2. Add your domain: `thegreatbeans.com`
3. Add DNS records (Vercel provides instructions)
4. Wait for DNS propagation (5-60 minutes)

**7. Update Backend CORS**

Update backend `.env`:

```env
CORS_ORIGIN=https://thegreatbeans.com,https://www.thegreatbeans.com
```

Restart backend.

---

## Media Storage

### Why External Storage?

- ✅ Railway/Heroku have ephemeral filesystems
- ✅ CDN distribution
- ✅ Automatic optimization
- ✅ Unlimited storage

### Option A: Cloudinary (Recommended)

**Free Tier:** 25GB storage, 25GB bandwidth/month

**Setup:**

1. Sign up: https://cloudinary.com
2. Get credentials from Dashboard
3. Install provider:

```bash
cd backend
npm install @strapi/provider-upload-cloudinary --save
```

4. Configure `backend/config/plugins.js`:

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_API_KEY'),
        api_secret: env('CLOUDINARY_API_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
```

5. Set environment variables (Railway/Heroku):

```env
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Option B: AWS S3

**Setup:**

1. Create S3 bucket
2. Create IAM user with S3 permissions
3. Install provider:

```bash
npm install @strapi/provider-upload-aws-s3 --save
```

4. Configure similar to Cloudinary

---

## Post-Deployment

### 1. Security Checklist

- [ ] Change all default secrets
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Setup SSL/HTTPS
- [ ] Restrict admin panel access
- [ ] Regular security updates

### 2. Monitoring

**Setup Error Tracking (Sentry):**

```bash
npm install @sentry/node --save
```

**Setup Uptime Monitoring:**
- UptimeRobot (free): https://uptimerobot.com
- Pingdom

### 3. Backups

**Automated Database Backups:**

```bash
# Create backup script
nano ~/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
# Upload to S3/Dropbox/etc
```

```bash
chmod +x ~/backup-db.sh
crontab -e
# Add: 0 2 * * * ~/backup-db.sh
```

### 4. Performance

**Enable Caching:**
- Frontend ISR (already configured)
- Backend: Add Redis for session storage (optional)

**CDN:**
- Vercel includes CDN for frontend
- Use Cloudinary CDN for media

### 5. SEO

**Submit Sitemap:**
- Google Search Console: `https://thegreatbeans.com/sitemap.xml`
- Bing Webmaster Tools

**Verify Schema:**
- Google Rich Results Test
- Schema.org Validator

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] TypeScript builds without errors
- [ ] Environment variables documented
- [ ] Secrets rotated (not using dev values)
- [ ] Database backed up
- [ ] Media migrated to cloud storage

### Deployment

- [ ] Backend deployed successfully
- [ ] Database connected and accessible
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] Frontend deployed successfully
- [ ] Frontend connects to backend API

### Post-Deployment

- [ ] Create admin user account
- [ ] Populate initial content
- [ ] Test all page types
- [ ] Verify media uploads
- [ ] Check Core Web Vitals
- [ ] Test on mobile devices
- [ ] Submit sitemap
- [ ] Setup monitoring
- [ ] Configure backups

---

## Estimated Costs (Monthly)

### Minimal Setup (Hobby Project)
- Backend: Railway ($5-10)
- Database: Supabase Free tier
- Frontend: Vercel Free tier
- Media: Cloudinary Free tier
- **Total:** $5-10/month

### Production Setup (Small Business)
- Backend: Railway Pro ($20)
- Database: Supabase Pro ($25)
- Frontend: Vercel Pro ($20)
- Media: Cloudinary Plus ($89)
- **Total:** $154/month

### High-Traffic Setup
- Backend: VPS ($40)
- Database: AWS RDS ($50)
- Frontend: Vercel Enterprise
- Media: Cloudinary Advanced ($249)
- CDN: Cloudflare Pro ($20)
- **Total:** $359+/month

---

## Support Resources

- [Strapi Deployment Docs](https://docs.strapi.io/dev-docs/deployment)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)

---

**Last Updated:** November 2024  
**Project:** The Great Beans Digital Flagship




