# Testing Guide - PostgreSQL Migration

This guide provides step-by-step testing procedures to validate the PostgreSQL migration and setup.

---

## Prerequisites

Before testing, ensure you have:
- ✅ Docker Compose running (`docker-compose up -d`)
- ✅ Backend `.env` configured for PostgreSQL
- ✅ Dependencies installed (`npm install` in both backend and frontend)

---

## Test 1: Docker Compose PostgreSQL Connection

**Objective:** Verify PostgreSQL is running and accepting connections.

### Steps

```bash
# Check Docker container status
docker-compose ps

# Expected output:
# NAME                  STATUS
# thegreatbeans-db      Up (healthy)
```

```bash
# Test PostgreSQL connection
docker-compose exec postgres pg_isready -U strapi

# Expected output:
# postgres:5432 - accepting connections
```

```bash
# Connect to database (optional)
docker-compose exec postgres psql -U strapi -d thegreatbeans -c "SELECT version();"

# Should show PostgreSQL version 15.x
```

### Success Criteria

- [x] Container is running with "healthy" status
- [x] PostgreSQL accepts connections
- [x] Database `thegreatbeans` exists

---

## Test 2: Strapi Startup with PostgreSQL

**Objective:** Verify Strapi connects to PostgreSQL and creates tables.

### Steps

```bash
cd backend

# Start Strapi in development mode
npm run develop
```

### Watch for in Console

```
[2024-11-18 10:00:00.000] info: Database connection established
[2024-11-18 10:00:01.000] info: Server started on http://0.0.0.0:1337
```

### Success Criteria

- [x] No database connection errors
- [x] Admin panel accessible at http://localhost:1337/admin
- [x] Can create admin user account
- [x] No "Missing environment variable" errors

### Common Issues

**Error:** `ECONNREFUSED`
**Solution:** PostgreSQL not running. Run `docker-compose up -d`

**Error:** `password authentication failed`
**Solution:** Check DATABASE_PASSWORD in `.env` matches `strapi_dev_password`

---

## Test 3: Deep Populate Queries

**Objective:** Verify complex nested queries work correctly with PostgreSQL.

### Prerequisites

- Strapi running
- Some content created (at least homepage with sections)

### Test Cases

#### 3.1 Homepage with Dynamic Zones

```bash
# Test endpoint
curl "http://localhost:1337/api/homepage?populate[content_sections][on][section.hero-advanced][populate][background_image_desktop][fields][0]=url&populate[content_sections][on][section.hero-advanced][populate][background_image_desktop][fields][1]=alternativeText" | jq
```

**Expected:** JSON response with nested `content_sections` array containing `section.hero-advanced` components with populated images.

#### 3.2 Products with Relations

```bash
# Test endpoint
curl "http://localhost:1337/api/products?populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[certifications][populate][logo][fields][0]=url&populate[featured_image][fields][0]=url" | jq
```

**Expected:** Products with populated category, certifications (with logos), and featured images.

#### 3.3 Knowledge Assets with Author and Category

```bash
# Test endpoint
curl "http://localhost:1337/api/knowledge-assets?populate[author][populate][avatar][fields][0]=url&populate[category][fields][0]=name&populate[featured_image][fields][0]=url" | jq
```

**Expected:** Articles with populated author (including avatar), category, and featured image.

### Success Criteria

- [x] All queries return 200 OK
- [x] Nested relations are populated (not null)
- [x] No timeout errors (should respond in < 2 seconds)
- [x] No "Maximum call stack" errors

### Performance Check

```bash
# Time the query
time curl "http://localhost:1337/api/homepage?populate[content_sections][on][section.hero-advanced][populate]=*" > /dev/null

# Should complete in < 2 seconds
```

---

## Test 4: i18n (Internationalization)

**Objective:** Verify locale switching works correctly with PostgreSQL.

### Prerequisites

- Content created in both English (en) and Vietnamese (vi)

### Test Cases

#### 4.1 English Content

```bash
curl "http://localhost:1337/api/homepage?locale=en" | jq '.data.attributes'
```

**Expected:** Content in English

#### 4.2 Vietnamese Content

```bash
curl "http://localhost:1337/api/homepage?locale=vi" | jq '.data.attributes'
```

**Expected:** Content in Vietnamese (if populated)

#### 4.3 Locale-specific Relations

```bash
# Get products in Vietnamese
curl "http://localhost:1337/api/products?locale=vi&populate[category]=*" | jq
```

**Expected:** Products with Vietnamese category names

### Success Criteria

- [x] Locale parameter changes returned content
- [x] Relations respect locale (if localized)
- [x] No errors when switching locales
- [x] Default locale (en) works without explicit parameter

---

## Test 5: Performance Benchmark (PostgreSQL vs SQLite)

**Objective:** Compare query performance between PostgreSQL and SQLite.

### Benchmark Scenarios

#### 5.1 Simple Query (10 Products)

**PostgreSQL:**
```bash
time curl "http://localhost:1337/api/products?pagination[limit]=10" > /dev/null 2>&1
```

**Expected:** < 200ms

#### 5.2 Complex Query (Homepage with all sections)

**PostgreSQL:**
```bash
time curl "http://localhost:1337/api/homepage?populate[content_sections][on][section.hero-advanced][populate]=*&populate[content_sections][on][section.products-showcase][populate][products][populate][featured_image]=*" > /dev/null 2>&1
```

**Expected:** < 1000ms (1 second)

#### 5.3 Concurrent Requests (10 simultaneous)

```bash
# Install Apache Bench if needed: sudo apt install apache2-utils

ab -n 100 -c 10 "http://localhost:1337/api/products"
```

**Expected PostgreSQL Performance:**
- Requests per second: > 50
- 95th percentile: < 500ms
- No failed requests

**SQLite (for comparison - if you still have it):**
- Requests per second: ~10-20 (2-5x slower)
- 95th percentile: > 1000ms
- Possible timeout errors under load

### Success Criteria

- [x] PostgreSQL handles concurrent requests without errors
- [x] Response times are consistent (low variance)
- [x] No connection pool exhaustion errors
- [x] Memory usage stable during load test

---

## Test 6: Connection Pool

**Objective:** Verify connection pooling is working correctly.

### Monitor Connection Count

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U strapi -d thegreatbeans

# In psql prompt, check active connections:
SELECT count(*), state FROM pg_stat_activity WHERE datname='thegreatbeans' GROUP BY state;
```

**Expected:**
```
 count | state  
-------+--------
     2 | idle   (pool min = 2)
     1 | active (current query)
```

### Test Under Load

```bash
# Generate load
ab -n 1000 -c 20 "http://localhost:1337/api/products"

# Check max connections reached
# Run above query again in psql
```

**Expected:** Connection count should increase but not exceed `DATABASE_POOL_MAX` (10 by default).

### Success Criteria

- [x] Minimum pool connections maintained
- [x] Pool expands under load
- [x] No "too many connections" errors
- [x] Connections are reused (not created per request)

---

## Test 7: Media Upload with PostgreSQL

**Objective:** Verify media uploads work correctly.

### Steps

1. Go to http://localhost:1337/admin
2. Navigate to Media Library
3. Upload a test image
4. Check it appears in `backend/public/uploads/`
5. Access via: http://localhost:1337/uploads/[filename]

### Database Check

```bash
docker-compose exec postgres psql -U strapi -d thegreatbeans -c "SELECT id, name, url FROM files ORDER BY id DESC LIMIT 5;"
```

**Expected:** Uploaded files appear in `files` table

### Success Criteria

- [x] Files upload without errors
- [x] Files saved to `public/uploads/`
- [x] File metadata in PostgreSQL `files` table
- [x] Files accessible via URL

---

## Test 8: Frontend Integration

**Objective:** Verify frontend can fetch data from PostgreSQL backend.

### Prerequisites

- Backend running with PostgreSQL
- Frontend running (`cd frontend && npm run dev`)

### Test Cases

#### 8.1 Homepage Loads

Visit: http://localhost:3000

**Expected:**
- Page loads without errors
- Hero section displays
- All sections render
- Images display correctly

#### 8.2 Product Page

Visit: http://localhost:3000/products/[slug]

**Expected:**
- Product details display
- Related products show
- Category links work
- Images load

#### 8.3 Knowledge Asset Page

Visit: http://localhost:3000/resources/[slug]

**Expected:**
- Article content renders
- Author information displays
- Category badge shows
- Table of contents generates

### Check Browser Console

**No errors related to:**
- Failed API requests
- Missing data fields
- Validation errors (Zod)

### Success Criteria

- [x] All pages load successfully
- [x] No console errors
- [x] Data displays correctly
- [x] Images load from Strapi
- [x] Relationships render properly

---

## Test 9: Data Migration (If Migrating from SQLite)

**Objective:** Verify data migration preserved all content and relationships.

### Comparison Checklist

#### Before Migration (SQLite)

Count records:
```sql
-- In SQLite
SELECT count(*) FROM products;
SELECT count(*) FROM knowledge_assets;
SELECT count(*) FROM services;
```

#### After Migration (PostgreSQL)

```bash
docker-compose exec postgres psql -U strapi -d thegreatbeans

# In psql:
SELECT count(*) FROM products;
SELECT count(*) FROM knowledge_assets;
SELECT count(*) FROM services;
```

**Expected:** Counts match SQLite counts

#### Verify Relationships

```sql
-- Check product-category links
SELECT count(*) FROM products_category_links;

-- Check product-certifications links
SELECT count(*) FROM products_certifications_links;
```

### Success Criteria

- [x] All content migrated (counts match)
- [x] All relationships preserved
- [x] Media files copied
- [x] Users migrated
- [x] No data corruption

---

## Test 10: Production Readiness

**Objective:** Verify setup is ready for production deployment.

### Checklist

#### Environment Variables

- [ ] `DATABASE_SSL=true` for production
- [ ] Strong passwords (not default values)
- [ ] Secrets rotated (not dev values)
- [ ] CORS configured for production domain
- [ ] API tokens generated

#### Performance

- [ ] ISR caching configured (frontend)
- [ ] Connection pool tuned for traffic
- [ ] Indexes created on frequently queried fields
- [ ] Query performance acceptable (< 1s)

#### Security

- [ ] Admin path customized (optional)
- [ ] Rate limiting configured
- [ ] SSL/TLS enabled
- [ ] Database firewall rules set
- [ ] Backups configured

#### Monitoring

- [ ] Error tracking setup (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Database monitoring
- [ ] Log aggregation

---

## Reporting Issues

When reporting issues, include:

1. **Environment:**
   - OS version
   - Node.js version
   - Docker version
   - Database: PostgreSQL 15

2. **Error messages:**
   - Full error stack trace
   - Strapi console output
   - PostgreSQL logs: `docker-compose logs postgres`

3. **Steps to reproduce:**
   - Commands run
   - Configuration used
   - Expected vs actual behavior

4. **Attempted solutions:**
   - What you tried
   - Results

---

## Summary Checklist

All tests passing means PostgreSQL migration is successful:

- [x] PostgreSQL container running
- [x] Strapi connects to PostgreSQL
- [x] Deep populate queries work
- [x] i18n functions correctly
- [x] Performance acceptable
- [x] Connection pool working
- [x] Media uploads successful
- [x] Frontend integration works
- [x] Data migration complete (if applicable)
- [x] Production ready

---

**Last Updated:** November 2024  
**Project:** The Great Beans Digital Flagship




