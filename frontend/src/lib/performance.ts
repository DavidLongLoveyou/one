/**
 * Performance utilities and monitoring
 */

/**
 * Performance Budget Constants
 * Based on Core Web Vitals targets
 */
export const PERFORMANCE_BUDGET = {
  LCP: 2500, // Largest Contentful Paint (ms) - Target: < 2.5s
  FID: 100, // First Input Delay (ms) - Target: < 100ms
  CLS: 0.1, // Cumulative Layout Shift - Target: < 0.1
  FCP: 1800, // First Contentful Paint (ms) - Target: < 1.8s
  TTI: 3800, // Time to Interactive (ms) - Target: < 3.8s
} as const;

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  label: string;
}) {
  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics, Vercel Analytics, etc.
    // gtag('event', metric.name, {
    //   value: Math.round(metric.value),
    //   metric_id: metric.id,
    //   metric_value: metric.value,
    //   metric_delta: metric.delta,
    // });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, {
      value: metric.value,
      label: metric.label,
      id: metric.id,
    });
  }
}

/**
 * Check if performance metric meets budget
 */
export function meetsPerformanceBudget(
  metric: keyof typeof PERFORMANCE_BUDGET,
  value: number
): boolean {
  return value <= PERFORMANCE_BUDGET[metric];
}

/**
 * Get performance score (0-100)
 */
export function getPerformanceScore(metrics: {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  tti?: number;
}): number {
  const scores = {
    lcp: metrics.lcp
      ? Math.max(0, 100 - (metrics.lcp / PERFORMANCE_BUDGET.LCP) * 100)
      : 0,
    fid: metrics.fid
      ? Math.max(0, 100 - (metrics.fid / PERFORMANCE_BUDGET.FID) * 100)
      : 0,
    cls: metrics.cls
      ? Math.max(0, 100 - (metrics.cls / PERFORMANCE_BUDGET.CLS) * 100)
      : 0,
    fcp: metrics.fcp
      ? Math.max(0, 100 - (metrics.fcp / PERFORMANCE_BUDGET.FCP) * 100)
      : 0,
    tti: metrics.tti
      ? Math.max(0, 100 - (metrics.tti / PERFORMANCE_BUDGET.TTI) * 100)
      : 0,
  };

  // Weighted average (LCP and FID are most important)
  const weightedScore =
    scores.lcp * 0.25 +
    scores.fid * 0.25 +
    scores.cls * 0.2 +
    scores.fcp * 0.15 +
    scores.tti * 0.15;

  return Math.round(weightedScore);
}

/**
 * Image optimization presets
 */
export const IMAGE_PRESETS = {
  hero: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw',
    quality: 90,
    priority: true,
  },
  thumbnail: {
    sizes: '(max-width: 768px) 50vw, 25vw',
    quality: 80,
    priority: false,
  },
  gallery: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality: 85,
    priority: false,
  },
  icon: {
    sizes: '64px',
    quality: 75,
    priority: false,
  },
} as const;

/**
 * Get optimized image props based on preset
 */
export function getOptimizedImageProps(
  preset: keyof typeof IMAGE_PRESETS,
  src: string,
  alt: string,
  width?: number,
  height?: number
) {
  const config = IMAGE_PRESETS[preset];
  return {
    src,
    alt,
    width,
    height,
    sizes: config.sizes,
    quality: config.quality,
    priority: config.priority,
    loading: config.priority ? undefined : ('lazy' as const),
  };
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Note: Use React.lazy() directly in components for code splitting

