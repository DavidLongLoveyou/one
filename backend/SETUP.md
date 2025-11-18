# Backend Setup Guide

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- **PostgreSQL 15** (required - via Docker recommended)
- Docker Desktop (for PostgreSQL)

## Initial Setup

### 1. Start PostgreSQL Database

From project root:

```bash
# Start PostgreSQL via Docker Compose
docker-compose up -d

# Verify it's running
docker ps
```

**Database credentials (development):**
- Host: localhost
- Port: 5432
- Database: thegreatbeans
- User: strapi
- Password: strapi_dev_password

For production deployment, see [DATABASE-SETUP.md](./DATABASE-SETUP.md) for Supabase or VPS setup.

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

```bash
cp env.example .env
```

Generate secrets:
```bash
# Generate random keys (run 4 times for APP_KEYS)
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Edit `.env`:
```env
# Database - PostgreSQL (REQUIRED)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=thegreatbeans
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_dev_password
DATABASE_SSL=false

# Secrets (replace with generated values)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_salt
ADMIN_JWT_SECRET=your_secret
TRANSFER_TOKEN_SALT=your_salt
JWT_SECRET=your_secret

# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Start Strapi

```bash
npm run develop
```

Strapi will automatically:
- Connect to PostgreSQL
- Create all tables and relations
- Start the admin panel

### 5. Create Admin User

- Visit http://localhost:1337/admin
- Complete the admin registration form

### 6. Configure Public Permissions

- Go to: Settings > Users & Permissions > Roles > Public
- Enable permissions:
  - `homepage`: find
  - `knowledge-asset`: find, findOne
  - `product`: find, findOne
  - `service`: find, findOne
  - `category`: find, findOne
  - `author`: find, findOne
  - `certification`: find, findOne
  - `testimonial`: find, findOne
  - `site-settings`: find
  - `global-seo`: find
  - `contact-page`: find
  - `about-page`: find

### 7. Create API Token (Optional)

- Go to: Settings > API Tokens
- Create new token with "Read-only" type
- Copy token for frontend use

## Content Structure

All content types and components are pre-configured. You can now:

1. **Create Homepage Content**
   - Go to: Content Manager > Homepage
   - Add sections to `content_sections` dynamic zone
   - Configure SEO metadata

2. **Populate Collections**
   - Create categories, authors, certifications first
   - Then create products, services, knowledge assets
   - Add testimonials

## Testing API

Test the API endpoint:
```bash
curl http://localhost:1337/api/homepage?locale=en
```

## Next Steps

After backend is running, proceed to Session 2: Frontend Skeleton.

