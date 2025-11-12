# The Great Beans - Strapi Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Generate secure keys for:
     - `APP_KEYS` (4 random strings)
     - `API_TOKEN_SALT`
     - `ADMIN_JWT_SECRET`
     - `TRANSFER_TOKEN_SALT`
     - `JWT_SECRET`
   - Configure database connection (PostgreSQL or SQLite for dev)

3. **Start Development Server**
   ```bash
   npm run develop
   ```

4. **Create Admin User**
   - Visit http://localhost:1337/admin
   - Complete the admin registration

5. **Configure Permissions**
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

