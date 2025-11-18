# The Great Beans - Frontend

A world-class B2B digital flagship for The Great Beans, built with Next.js 14, TypeScript, and Strapi CMS. Optimized for SEO, SGE, and exceptional user experience.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Strapi backend running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Generate environment file
node generate-env.js

# Configure .env.local with your Strapi API URL
# NEXT_PUBLIC_API_URL=http://localhost:1337
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── [locale]/    # Localized routes
│   │   ├── sitemap.ts   # Dynamic sitemap
│   │   └── robots.ts    # Robots.txt
│   ├── components/      # React components
│   │   ├── sections/    # Homepage sections
│   │   ├── ui/         # UI components
│   │   ├── reactbits/  # Animated components
│   │   └── patterns/   # Complex patterns
│   └── lib/            # Utilities
│       ├── cms-client.ts      # Strapi API client
│       ├── seo/               # SEO utilities
│       ├── accessibility.ts   # A11y utilities
│       └── validators/        # Zod schemas
├── public/             # Static assets
└── docs/              # Documentation
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing
npm run test:setup   # Verify setup
npm run analyze      # Bundle analysis

# Environment
node generate-env.js # Generate .env.local
```

## 🎯 Key Features

### SEO-First Architecture
- ✅ Semantic HTML
- ✅ Schema.org markup
- ✅ Dynamic sitemap
- ✅ Meta tags optimization
- ✅ Internal linking system
- ✅ E-E-A-T optimization

### Performance
- ✅ Image optimization (AVIF, WebP)
- ✅ Bundle optimization
- ✅ ISR caching (60s homepage, 3600s content)
- ✅ Core Web Vitals optimized
- ✅ Web Vitals monitoring

### Accessibility
- ✅ WCAG AA compliant
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Color contrast verified

### User Experience
- ✅ Responsive design
- ✅ Multi-language support (en, vi)
- ✅ Smooth animations
- ✅ Modern UI components
- ✅ Mobile-first approach

## 📚 Documentation

- [Performance Optimization](./PERFORMANCE-OPTIMIZATION.md)
- [SEO Guide](./SEO-GUIDE.md)
- [Accessibility Guide](./ACCESSIBILITY-GUIDE.md)
- [Content Strategy](./CONTENT-STRATEGY.md)
- [Company Information](./COMPANY-INFO.md)
- [Strapi Content Guide](./STRAPI-CONTENT-GUIDE.md)

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRAPI_API_TOKEN=your_token_here
```

### Next.js Config

Key configurations in `next.config.js`:
- Image optimization
- Security headers
- Bundle analyzer
- Performance optimizations

## 🧪 Testing

### Run Tests

```bash
# Setup verification
node test-setup.js

# Deep testing
node test-deep.js

# Integration testing
node test-integration.js

# Performance testing
node test-performance.js

# SEO testing
node test-seo.js

# Accessibility testing
node test-accessibility.js
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deployment Checklist

See [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) for complete deployment guide.

## 📊 Performance Budget

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |
| FCP | < 1.8s | ✅ |
| TTI | < 3.8s | ✅ |

## 🔒 Security

- Security headers configured
- Environment variables secured
- Input validation (Zod)
- API security
- HTTPS enforced

See [SECURITY-AUDIT.md](./SECURITY-AUDIT.md) for details.

## 🌐 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

See [CROSS-BROWSER-TESTING.md](./CROSS-BROWSER-TESTING.md) for details.

## 📦 Tech Stack

- **Framework:** Next.js 14.2.15 (App Router)
- **Language:** TypeScript 5.6.0
- **Styling:** Tailwind CSS 3.4.14
- **Animations:** Framer Motion 11.11.17
- **UI Components:** Radix UI
- **Validation:** Zod 3.23.8
- **CMS:** Strapi 5.3.0

## 🤝 Contributing

1. Follow code style guidelines
2. Write tests for new features
3. Update documentation
4. Ensure accessibility
5. Optimize for performance

## 📝 License

Private - The Great Beans

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for The Great Beans**
