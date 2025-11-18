'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/performance';

/**
 * Web Vitals reporting component
 * Reports Core Web Vitals to analytics
 */
export function WebVitals() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Import web-vitals dynamically
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS((metric) => reportWebVitals({ ...metric, label: metric.rating || 'unknown' }));
      onFID((metric) => reportWebVitals({ ...metric, label: metric.rating || 'unknown' }));
      onFCP((metric) => reportWebVitals({ ...metric, label: metric.rating || 'unknown' }));
      onLCP((metric) => reportWebVitals({ ...metric, label: metric.rating || 'unknown' }));
      onTTFB((metric) => reportWebVitals({ ...metric, label: metric.rating || 'unknown' }));
      onINP((metric) => reportWebVitals({ ...metric, label: metric.rating || 'unknown' }));
    });
  }, []);

  return null;
}

