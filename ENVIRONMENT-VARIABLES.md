# Environment Variables Reference

Complete reference for all environment variables used in **The Great Beans** project.

---

## Table of Contents

1. [Backend Variables](#backend-variables)
2. [Frontend Variables](#frontend-variables)
3. [Security Best Practices](#security-best-practices)
4. [Environment-Specific Configs](#environment-specific-configs)
5. [Generating Secrets](#generating-secrets)

---

## Backend Variables

Location: `backend/.env`

### Server Configuration

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `HOST` | string | ✅ | `0.0.0.0` | Server host binding |
| `PORT` | number | ✅ | `1337` | Server port |
| `NODE_ENV` | string | ✅ | `development` | Environment: `development`, `production`, `staging` |

**Example:**
```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=development
```

---

### Secrets (REQUIRED)

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `APP_KEYS` | string | ✅ | ❌ | Comma-separated encryption keys (4 keys) |
| `API_TOKEN_SALT` | string | ✅ | ❌ | Salt for API token generation |
| `ADMIN_JWT_SECRET` | string | ✅ | ❌ | Secret for admin JWT tokens |
| `TRANSFER_TOKEN_SALT` | string | ✅ | ❌ | Salt for transfer tokens |
| `JWT_SECRET` | string | ✅ | ❌ | Secret for JWT generation |

**⚠️ CRITICAL:** Never use the same values in development and production!

**Example:**
```env
APP_KEYS=J8xk9Pq2L5mN3tR7,Vw1Zc4Hf6Jn9Km2T,Bn5Gp8Lq1Xr4Ys7Z,Mp3Tq6Wr9Jl2Nk5H
API_TOKEN_SALT=Xy7Qw9Pz3Km5Tn8L
ADMIN_JWT_SECRET=Hn2Vl5Rp8Jq1Zx4K
TRANSFER_TOKEN_SALT=Wm6Bn9Tp2Lk5Qr8J
JWT_SECRET=Gp4Yx7Hn1Wq9Km3T
```

**How to generate:** See [Generating Secrets](#generating-secrets)

---

### Database - PostgreSQL (REQUIRED for Production)

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `DATABASE_CLIENT` | string | ✅ | `postgres` | Database type: `postgres` or `sqlite` |
| `DATABASE_HOST` | string | ✅ | `localhost` | Database server hostname |
| `DATABASE_PORT` | number | ✅ | `5432` | Database server port |
| `DATABASE_NAME` | string | ✅ | `thegreatbeans` | Database name |
| `DATABASE_USERNAME` | string | ✅ | `strapi` | Database user |
| `DATABASE_PASSWORD` | string | ✅ | ❌ | Database password |
| `DATABASE_SSL` | boolean | ⚠️ | `false` | Enable SSL connection (required for cloud DBs) |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | boolean | ⚠️ | `false` | Reject unauthorized SSL certs |

**Connection Pool:**

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `DATABASE_POOL_MIN` | number | ⚠️ | `2` | Minimum pool connections |
| `DATABASE_POOL_MAX` | number | ⚠️ | `10` | Maximum pool connections |
| `DATABASE_ACQUIRE_TIMEOUT` | number | ⚠️ | `60000` | Connection acquisition timeout (ms) |

**Local Development (Docker):**
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=thegreatbeans
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_dev_password
DATABASE_SSL=false
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

**Production (Supabase):**
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=db.xxxxxxxxxxxxx.supabase.co
DATABASE_PORT=6543
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_production_password
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=25
```

**Production (Railway - Auto-configured):**
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=${{POSTGRES.PGHOST}}
DATABASE_PORT=${{POSTGRES.PGPORT}}
DATABASE_NAME=${{POSTGRES.PGDATABASE}}
DATABASE_USERNAME=${{POSTGRES.PGUSER}}
DATABASE_PASSWORD=${{POSTGRES.PGPASSWORD}}
DATABASE_SSL=true
```

---

### CORS Configuration

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `CORS_ORIGIN` | string | ✅ | ❌ | Allowed origins (comma-separated) |

**Example:**
```env
# Development
CORS_ORIGIN=http://localhost:3000

# Production
CORS_ORIGIN=https://thegreatbeans.com,https://www.thegreatbeans.com,https://thegreatbeans.vercel.app
```

---

### Admin Panel

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `ADMIN_PATH` | string | ❌ | `/admin` | Custom admin panel URL |

**Example (Security by obscurity):**
```env
ADMIN_PATH=/secret-admin-panel-xyz
```

---

### Media Upload (Production)

#### Cloudinary

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `CLOUDINARY_NAME` | string | ⚠️ | ❌ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | string | ⚠️ | ❌ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | string | ⚠️ | ❌ | Cloudinary API secret |

**Example:**
```env
CLOUDINARY_NAME=thegreatbeans
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

#### AWS S3

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `AWS_ACCESS_KEY_ID` | string | ⚠️ | ❌ | AWS access key |
| `AWS_ACCESS_SECRET` | string | ⚠️ | ❌ | AWS secret key |
| `AWS_REGION` | string | ⚠️ | `us-east-1` | AWS region |
| `AWS_BUCKET` | string | ⚠️ | ❌ | S3 bucket name |

**Example:**
```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_ACCESS_SECRET=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_BUCKET=thegreatbeans-uploads
```

---

### Email Provider (Optional)

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `SMTP_HOST` | string | ❌ | ❌ | SMTP server hostname |
| `SMTP_PORT` | number | ❌ | `587` | SMTP server port |
| `SMTP_USERNAME` | string | ❌ | ❌ | SMTP username |
| `SMTP_PASSWORD` | string | ❌ | ❌ | SMTP password |
| `SMTP_FROM` | string | ❌ | ❌ | From email address |

**Example (Gmail):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@thegreatbeans.com
```

---

### Security & Rate Limiting

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `RATE_LIMIT_MAX` | number | ❌ | `100` | Max requests per minute per IP |

**Example:**
```env
RATE_LIMIT_MAX=100
```

---

## Frontend Variables

Location: `frontend/.env.local`

### Strapi API Configuration

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | string | ✅ | ❌ | Strapi backend URL (publicly accessible) |
| `STRAPI_API_TOKEN` | string | ⚠️ | ❌ | Read-only API token (server-side only) |

**⚠️ Security Note:** `NEXT_PUBLIC_*` variables are exposed to the browser. Never put secrets here!

**Example:**
```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_readonly_token_here

# Production
NEXT_PUBLIC_API_URL=https://api.thegreatbeans.com
STRAPI_API_TOKEN=abcd1234efgh5678ijkl9012mnop3456
```

---

### Site Configuration

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | string | ✅ | ❌ | Frontend site URL (for canonical URLs, sitemaps) |

**Example:**
```env
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_SITE_URL=https://thegreatbeans.com
```

---

### Analytics (Optional)

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_GA_ID` | string | ❌ | ❌ | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_GTM_ID` | string | ❌ | ❌ | Google Tag Manager Container ID |

**Example:**
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

### SEO & Social (Optional)

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_DEFAULT_OG_IMAGE` | string | ❌ | `/og-image.jpg` | Default OpenGraph image path |

**Example:**
```env
NEXT_PUBLIC_DEFAULT_OG_IMAGE=/images/og-default.jpg
```

---

### Feature Flags (Optional)

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_ENABLE_SEARCH` | boolean | ❌ | `true` | Enable search functionality |
| `NEXT_PUBLIC_ENABLE_NEWSLETTER` | boolean | ❌ | `true` | Enable newsletter signup |
| `NEXT_PUBLIC_MAINTENANCE_MODE` | boolean | ❌ | `false` | Enable maintenance mode |

**Example:**
```env
NEXT_PUBLIC_ENABLE_SEARCH=true
NEXT_PUBLIC_ENABLE_NEWSLETTER=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

---

### Error Tracking (Optional)

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN` | string | ❌ | ❌ | Sentry Data Source Name |
| `NEXT_PUBLIC_LOGROCKET_ID` | string | ❌ | ❌ | LogRocket App ID |

**Example:**
```env
NEXT_PUBLIC_SENTRY_DSN=https://abcd1234@o123456.ingest.sentry.io/7654321
NEXT_PUBLIC_LOGROCKET_ID=xyz123/thegreatbeans
```

---

### Third-party Services (Optional)

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | string | ❌ | ❌ | reCAPTCHA v3 site key |
| `NEXT_PUBLIC_INTERCOM_APP_ID` | string | ❌ | ❌ | Intercom App ID |

**Example:**
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_INTERCOM_APP_ID=abcd1234
```

---

### Development Only

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `DEBUG` | string | ❌ | ❌ | Enable debug logging |
| `ANALYZE` | boolean | ❌ | `false` | Enable bundle analyzer |

**Example:**
```env
DEBUG=*
ANALYZE=true
```

---

## Security Best Practices

### 1. Never Commit `.env` Files

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### 2. Use Different Values Per Environment

❌ **Wrong:**
```env
# Same secret in dev and prod
JWT_SECRET=my-secret-123
```

✅ **Correct:**
```env
# Development
JWT_SECRET=dev-secret-Xy7Qw9Pz3Km5Tn8L

# Production
JWT_SECRET=prod-secret-Hn2Vl5Rp8Jq1Zx4K
```

### 3. Rotate Secrets Regularly

- Change production secrets every 90 days
- Rotate immediately if exposed
- Keep old secrets for 24h during rotation

### 4. Restrict Access

- Store secrets in secure vault (1Password, AWS Secrets Manager)
- Only give production access to necessary team members
- Use environment variables in CI/CD, never hardcode

### 5. Validate Required Variables

Backend startup should fail if required variables are missing.

---

## Environment-Specific Configs

### Development (Local)

```env
# backend/.env
NODE_ENV=development
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
CORS_ORIGIN=http://localhost:3000

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Staging

```env
# backend/.env
NODE_ENV=staging
DATABASE_CLIENT=postgres
DATABASE_SSL=true
CORS_ORIGIN=https://staging.thegreatbeans.com

# frontend/.env.local
NEXT_PUBLIC_API_URL=https://api-staging.thegreatbeans.com
NEXT_PUBLIC_SITE_URL=https://staging.thegreatbeans.com
```

### Production

```env
# backend/.env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_SSL=true
CORS_ORIGIN=https://thegreatbeans.com,https://www.thegreatbeans.com

# frontend/.env.local
NEXT_PUBLIC_API_URL=https://api.thegreatbeans.com
NEXT_PUBLIC_SITE_URL=https://thegreatbeans.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Generating Secrets

### Method 1: Node.js (Recommended)

```bash
# Generate one secret
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

# Generate 4 secrets for APP_KEYS (run 4 times)
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

### Method 2: OpenSSL

```bash
# Generate one secret
openssl rand -base64 32
```

### Method 3: Online Generator

Use: https://generate-secret.vercel.app/32

⚠️ **Warning:** Only use for development, never for production!

---

## Checklist: Before Deployment

### Backend

- [ ] All required variables set
- [ ] Secrets are unique (not default values)
- [ ] Database connection tested
- [ ] CORS configured for production domain
- [ ] Admin path customized (optional)
- [ ] Media provider configured (Cloudinary/S3)
- [ ] Email provider configured (if needed)

### Frontend

- [ ] `NEXT_PUBLIC_API_URL` points to production backend
- [ ] `NEXT_PUBLIC_SITE_URL` is production domain
- [ ] Analytics IDs configured
- [ ] Sentry/error tracking configured
- [ ] No sensitive data in `NEXT_PUBLIC_*` variables

---

## Troubleshooting

### "Missing required environment variable"

**Solution:** Check backend logs for which variable is missing, add to `.env`

### "Database connection failed"

**Solution:** Verify all `DATABASE_*` variables are correct, test connection with `psql`

### "CORS error in browser"

**Solution:** Add frontend URL to `CORS_ORIGIN` in backend `.env`

### "API returns 401 Unauthorized"

**Solution:** Check `STRAPI_API_TOKEN` is valid, generate new token in Strapi admin

---

**Last Updated:** November 2024  
**Project:** The Great Beans Digital Flagship




