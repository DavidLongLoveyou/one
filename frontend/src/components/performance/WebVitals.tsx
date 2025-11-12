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
      onCLS((metric) => reportWebVitals(metric));
      onFID((metric) => reportWebVitals(metric));
      onFCP((metric) => reportWebVitals(metric));
      onLCP((metric) => reportWebVitals(metric));
      onTTFB((metric) => reportWebVitals(metric));
      onINP((metric) => reportWebVitals(metric));
    });
  }, []);

  return null;
}

