# Project Structure - The Great Beans

## 📁 Directory Structure

```
one/
├── ARCHITECTURE-GUIDE.md          # Main architecture documentation
├── INTERNAL-PAGES-IMPLEMENTATION-COMPLETE.md  # Page templates implementation
├── DEEP-TEST-REPORT.md            # Comprehensive test results
├── QUICK-START.md                 # Quick setup guide
├── README.md                      # Project overview
├── PROJECT-STRUCTURE.md           # This file
│
├── backend/                       # Strapi CMS Backend
│   ├── src/
│   │   ├── api/                   # Content types
│   │   │   ├── product/
│   │   │   ├── knowledge-asset/
│   │   │   ├── service/
│   │   │   ├── category/
│   │   │   ├── about-page/        # Single type
│   │   │   ├── contact-page/      # Single type
│   │   │   └── ...
│   │   └── components/            # Reusable components
│   │       ├── shared/
│   │       ├── product/
│   │       ├── service/
│   │       ├── about/
│   │       └── contact/
│   ├── README.md
│   └── SETUP.md
│
└── frontend/                      # Next.js Frontend
    ├── src/
    │   ├── app/                   # Next.js App Router
    │   │   ├── [locale]/          # Internationalized routes
    │   │   │   ├── page.tsx       # Homepage
    │   │   │   ├── about/
    │   │   │   ├── contact/
    │   │   │   ├── products/[slug]/
    │   │   │   ├── resources/[slug]/
    │   │   │   ├── resources/category/[slug]/
    │   │   │   ├── services/[slug]/
    │   │   │   └── not-found.tsx
    │   │   ├── robots.ts
    │   │   └── sitemap.ts
    │   │
    │   ├── components/
    │   │   ├── shared/            # Shared components (14 files)
    │   │   ├── sections/          # Homepage sections
    │   │   ├── ui/                # UI primitives
    │   │   └── ...
    │   │
    │   ├── lib/
    │   │   ├── cms-client.ts      # Strapi API client
    │   │   ├── seo/               # SEO utilities
    │   │   └── validators/        # Zod schemas
    │   │
    │   └── middleware.ts          # i18n middleware
    │
    ├── STRAPI-CONTENT-GUIDE.md    # Content population guide
    ├── SEO-GUIDE.md
    ├── ACCESSIBILITY-GUIDE.md
    ├── PERFORMANCE-OPTIMIZATION.md
    ├── SECURITY-AUDIT.md
    ├── LAUNCH-CHECKLIST.md
    ├── CONTENT-STRATEGY.md
    ├── COMPANY-INFO.md
    ├── CROSS-BROWSER-TESTING.md
    └── README.md
```

## 🎯 Key Files

### Architecture & Guides
- `ARCHITECTURE-GUIDE.md` - Complete architecture overview
- `INTERNAL-PAGES-IMPLEMENTATION-COMPLETE.md` - Page templates guide
- `DEEP-TEST-REPORT.md` - Test results
- `QUICK-START.md` - Setup instructions

### Frontend Guides
- `frontend/STRAPI-CONTENT-GUIDE.md` - Content population (1080 lines)
- `frontend/SEO-GUIDE.md` - SEO best practices
- `frontend/ACCESSIBILITY-GUIDE.md` - WCAG compliance
- `frontend/PERFORMANCE-OPTIMIZATION.md` - Performance strategies
- `frontend/SECURITY-AUDIT.md` - Security practices
- `frontend/LAUNCH-CHECKLIST.md` - Pre-launch checklist

### Backend Guides
- `backend/README.md` - Backend setup
- `backend/SETUP.md` - Strapi configuration

## 📊 Statistics

- **Total Pages:** 7 internal page templates
- **Shared Components:** 14
- **Strapi Content Types:** 6 (4 collections + 2 single types)
- **Strapi Components:** 9
- **CMS Functions:** 10
- **SEO Functions:** 8
- **Validators:** 4

## ✅ Quality Metrics

- TypeScript: ✅ No errors
- ESLint: ✅ No errors or warnings
- Tests: ✅ 75/75 passed
- Code Coverage: All critical paths tested

---

*Last updated: 2025-01-13*

