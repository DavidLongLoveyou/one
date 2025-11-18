# The Great Beans - Strapi Backend

## Setup Instructions

### Prerequisites

- Node.js >= 20.0.0
- PostgreSQL 15 (via Docker recommended)

### 1. Start PostgreSQL

From project root:
```bash
docker-compose up -d
```

See [DATABASE-SETUP.md](./DATABASE-SETUP.md) for alternative setup options (Supabase, VPS).

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp env.example .env
```

Generate secrets:
```bash
# Run 4 times for APP_KEYS
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Edit `.env` with PostgreSQL configuration:
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=thegreatbeans
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_dev_password
# ... and other secrets
```

See [ENVIRONMENT-VARIABLES.md](../ENVIRONMENT-VARIABLES.md) for complete reference.

### 4. Start Development Server

```bash
npm run develop
```

### 5. Create Admin User

- Visit http://localhost:1337/admin
- Complete the admin registration

### 6. Configure Permissions

- Go to Settings > Users & Permissions > Roles > Public
- Enable `find` and `findOne` for all content types
- Enable `find` for homepage (single type)

## Content Types

### Single Types
- `homepage` - Main homepage with dynamic zones
- `site-settings` - Global site settings
- `global-seo` - Global SEO configuration

### Collection Types
- `knowledge-asset` - Blog posts and articles
- `product` - Coffee products
- `service` - B2B services
- `category` - Content categories
- `author` - Content authors
- `certification` - Certifications and accreditations
- `testimonial` - Client testimonials

## Components

### Shared Components
- `shared.button` - Reusable button component
- `shared.media` - Media reference
- `shared.link` - Internal/external link

### SEO Components
- `seo.metadata` - SEO metadata
- `seo.social-share` - Social sharing metadata

### Hero Components
- `hero.stat` - Statistic card
- `hero.trust-indicator` - Trust badge
- `hero.hotspot` - Interactive hotspot marker

### Section Components
- `section.hero-advanced` - Advanced hero section
- `section.trust-bar-enhanced` - Trust bar with certifications
- `section.services-grid` - Services grid
- `section.factory-story` - Factory story section
- `section.products-showcase` - Products showcase
- `section.testimonials-proof` - Testimonials section
- `section.blog-insights` - Blog insights section
- `section.faq-seo` - FAQ section with SEO
- `section.cta-conversion` - CTA conversion section
- `section.faq-item` - Single FAQ item

## Lifecycle Hooks

- `knowledge-asset`: Auto-calculates `word_count` and `read_time` from content
- Auto-generates slugs for all content types with `uid` fields
- Auto-sets `published_date` on first publish

## API Endpoints

All content types are available at:
- `/api/[content-type]` (e.g., `/api/products`)
- `/api/homepage` (single type)

Use query parameters for filtering, sorting, and population:
- `?locale=en` - Get localized content
- `?populate=*` - Populate relations (use explicit populate in production)

## Notes

- All content types support i18n (English and Vietnamese)
- Use explicit populate queries (not `populate=*`) for better performance
- Media files are stored in `public/uploads` directory

