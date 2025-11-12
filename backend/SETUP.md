# Backend Setup Guide

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL (for production) or SQLite (for development)

## Initial Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:
   - Database connection (use SQLite for quick start)
   - Generate secure keys:
     ```bash
     # Generate random keys (run 4 times for APP_KEYS)
     node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
     ```

3. **Start Strapi**
   ```bash
   npm run develop
   ```

4. **Create Admin User**
   - Visit http://localhost:1337/admin
   - Complete the admin registration form

5. **Configure Public Permissions**
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

6. **Create API Token (Optional)**
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

