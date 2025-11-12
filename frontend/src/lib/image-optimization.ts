/**
 * Image optimization utilities
 */

import type { StaticImageData } from 'next/image';

/**
 * Get responsive image sizes for different use cases
 */
export const IMAGE_SIZES = {
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw',
  thumbnail: '(max-width: 768px) 50vw, 25vw',
  gallery: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
  icon: '64px',
  full: '100vw',
} as const;

/**
 * Image quality presets
 */
export const IMAGE_QUALITY = {
  hero: 90,
  thumbnail: 80,
  gallery: 85,
  card: 80,
  icon: 75,
  default: 85,
} as const;

/**
 * Get optimized image configuration
 */
export function getImageConfig(
  type: keyof typeof IMAGE_SIZES,
  priority: boolean = false
) {
  return {
    sizes: IMAGE_SIZES[type],
    quality: IMAGE_QUALITY[type] || IMAGE_QUALITY.default,
    priority,
    loading: priority ? ('eager' as const) : ('lazy' as const),
  };
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return widths
    .map((width) => `${baseUrl}?w=${width}&q=85 ${width}w`)
    .join(', ');
}

/**
 * Get blur placeholder data URL
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  // Base64 encoded 1x1 transparent pixel
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f0f0f0" offset="20%" />
          <stop stop-color="#e0e0e0" offset="50%" />
          <stop stop-color="#f0f0f0" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f0f0f0" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;

  const svg = shimmer(width, height);
  const svgBase64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${svgBase64}`;
}

/**
 * Check if image should be prioritized
 */
export function shouldPrioritizeImage(
  isAboveFold: boolean,
  isHero: boolean = false
): boolean {
  return isAboveFold || isHero;
}

/**
 * Get image loading strategy
 */
export function getLoadingStrategy(
  priority: boolean,
  isVisible: boolean = false
): 'eager' | 'lazy' {
  return priority || isVisible ? 'eager' : 'lazy';
}

