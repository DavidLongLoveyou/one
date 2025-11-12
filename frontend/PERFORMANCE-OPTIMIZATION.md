# Performance Optimization Guide - Session 10

## Overview

This document outlines all performance optimizations implemented for The Great Beans frontend, following Next.js 14 best practices and Core Web Vitals targets.

## Performance Budget

| Metric | Target | Current Status |
|--------|--------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ Configured |
| **FID** (First Input Delay) | < 100ms | ✅ Configured |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ Configured |
| **FCP** (First Contentful Paint) | < 1.8s | ✅ Configured |
| **TTI** (Time to Interactive) | < 3.8s | ✅ Configured |

## Implemented Optimizations

### 1. Image Optimization

#### Next.js Image Configuration
- ✅ **AVIF & WebP formats** - Automatic format selection
- ✅ **Device sizes** - Responsive breakpoints configured
- ✅ **Image sizes** - Optimized for different use cases
- ✅ **Cache TTL** - 60 seconds minimum cache
- ✅ **Remote patterns** - Secure image loading from Strapi

#### Image Presets
```typescript
// Available presets in src/lib/image-optimization.ts
- hero: 90% quality, priority loading
- thumbnail: 80% quality, lazy loading
- gallery: 85% quality, lazy loading
- card: 80% quality, lazy loading
- icon: 75% quality, lazy loading
```

#### Usage in Components
- ✅ Hero images use `priority` prop
- ✅ All images use proper `sizes` attribute
- ✅ Lazy loading for below-fold images
- ✅ Proper alt text for accessibility

### 2. Bundle Optimization

#### Bundle Analyzer
```bash
npm run analyze          # Analyze bundle size
npm run build:analyze    # Build with analysis
```

#### Webpack Optimizations
- ✅ **Tree shaking** - Unused exports removed
- ✅ **Side effects** - Marked as false for better tree shaking
- ✅ **Package imports** - Optimized for:
  - `lucide-react`
  - `framer-motion`
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-tooltip`

#### Code Splitting
- ✅ Dynamic imports for heavy components
- ✅ Route-based code splitting (automatic with App Router)
- ✅ Component-level lazy loading available

### 3. Caching Strategy

#### ISR (Incremental Static Regeneration)
```typescript
// Homepage: 60 seconds
next: { revalidate: 60 }

// Content pages: 1 hour
next: { revalidate: 3600 }
```

#### HTTP Caching Headers
- ✅ **Static assets** - 1 year cache with immutable
- ✅ **Images** - 1 year cache with immutable
- ✅ **HTML** - Respects Next.js cache headers

### 4. Font Optimization

#### Google Fonts
- ✅ **Preload** - Fonts preloaded for faster rendering
- ✅ **Display swap** - Prevents FOIT (Flash of Invisible Text)
- ✅ **Subset** - Only Latin characters loaded
- ✅ **Font variables** - CSS variables for efficient loading

### 5. Performance Monitoring

#### Web Vitals Tracking
- ✅ **Core Web Vitals** - LCP, FID, CLS, FCP, TTI, INP
- ✅ **Development logging** - Console logs in dev mode
- ✅ **Production ready** - Ready for analytics integration

#### Performance Utilities
Located in `src/lib/performance.ts`:
- `reportWebVitals()` - Report metrics to analytics
- `meetsPerformanceBudget()` - Check if metric meets target
- `getPerformanceScore()` - Calculate overall score (0-100)
- `debounce()` / `throttle()` - Performance helpers

### 6. Next.js Configuration

#### Compiler Optimizations
- ✅ **Remove console** - Production builds remove console.log
- ✅ **Keep errors/warnings** - Important logs preserved
- ✅ **CSS optimization** - Experimental CSS optimization enabled

#### Security Headers (Performance Impact)
- ✅ **DNS Prefetch** - Faster external resource loading
- ✅ **HSTS** - Secure connections
- ✅ **X-Frame-Options** - Prevent clickjacking
- ✅ **Content-Type-Options** - Prevent MIME sniffing

### 7. Runtime Optimizations

#### React Optimizations
- ✅ **Strict Mode** - Development checks enabled
- ✅ **Standalone output** - Optimized for deployment
- ✅ **Compression** - Gzip/Brotli enabled

#### Memory Management
- ✅ **Debounce/throttle** - Available utilities
- ✅ **Lazy loading** - Components and images
- ✅ **Code splitting** - Automatic route splitting

## Performance Testing

### Bundle Analysis
```bash
# Install dependencies first
npm install

# Run bundle analysis
npm run analyze
```

This will:
1. Build the application
2. Generate bundle size report
3. Open interactive visualization

### Core Web Vitals Testing

#### Development
- Web Vitals are logged to console
- Check browser DevTools Performance tab
- Use Lighthouse in Chrome DevTools

#### Production
- Deploy to staging/production
- Use Google PageSpeed Insights
- Monitor with Real User Monitoring (RUM)

### Performance Checklist

- [ ] Bundle size < 250KB (first load)
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] All images optimized
- [ ] Fonts preloaded
- [ ] Caching configured
- [ ] Code splitting working
- [ ] No console errors
- [ ] Lighthouse score > 90

## Image Optimization Best Practices

### Hero Images
```tsx
<Image
  src={imageUrl}
  alt={altText}
  fill
  priority
  sizes="(max-width: 768px) 100vw, 60vw"
  quality={90}
/>
```

### Thumbnails
```tsx
<Image
  src={imageUrl}
  alt={altText}
  width={400}
  height={300}
  sizes="(max-width: 768px) 50vw, 25vw"
  quality={80}
  loading="lazy"
/>
```

### Gallery Images
```tsx
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 33vw"
  quality={85}
  loading="lazy"
/>
```

## Caching Strategy Details

### Static Assets
- **Images**: 1 year cache, immutable
- **JS/CSS**: 1 year cache, immutable
- **Fonts**: 1 year cache, immutable

### API Responses
- **Homepage**: 60 seconds (frequent updates)
- **Content pages**: 1 hour (stable content)
- **Product/Service pages**: 1 hour

### Browser Caching
- Respects `Cache-Control` headers
- Uses ETags for validation
- Supports conditional requests

## Monitoring & Analytics

### Web Vitals Integration

#### Google Analytics
```typescript
// In src/lib/performance.ts
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
    });
  }
}
```

#### Vercel Analytics
```typescript
import { Analytics } from '@vercel/analytics/react';

// Add to layout
<Analytics />
```

#### Custom Analytics
Modify `reportWebVitals()` in `src/lib/performance.ts` to send to your analytics service.

## Performance Budget Enforcement

### Build-time Checks
```typescript
// Add to CI/CD pipeline
const budget = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
};

// Fail build if metrics exceed budget
```

### Runtime Monitoring
- Web Vitals component reports metrics
- Logs to console in development
- Ready for production analytics

## Next Steps

1. **Run bundle analysis** - `npm run analyze`
2. **Test Core Web Vitals** - Use Lighthouse
3. **Monitor in production** - Set up analytics
4. **Optimize based on results** - Iterate on findings

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Core Web Vitals](https://web.dev/vitals/)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

**Status**: ✅ **Session 10 Complete**  
**Next**: Session 11 - SEO Deep Dive

