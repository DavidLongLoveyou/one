/**
 * Internal Linking Utilities
 * Helps create SEO-friendly internal links throughout the site
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export interface InternalLink {
  href: string;
  text: string;
  title?: string;
  rel?: string;
}

/**
 * Generate internal link with locale
 */
export function getInternalLink(
  path: string,
  locale: string = 'en',
  text?: string
): InternalLink {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const href = `${prefix}${path}`;
  
  return {
    href,
    text: text || path,
  };
}

/**
 * Generate product link
 */
export function getProductLink(
  slug: string,
  locale: string = 'en',
  title?: string
): InternalLink {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  
  return {
    href: `${prefix}/products/${slug}`,
    text: title || slug,
    title: title,
  };
}

/**
 * Generate service link
 */
export function getServiceLink(
  slug: string,
  locale: string = 'en',
  title?: string
): InternalLink {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  
  return {
    href: `${prefix}/services/${slug}`,
    text: title || slug,
    title: title,
  };
}

/**
 * Generate resource/knowledge asset link
 */
export function getResourceLink(
  slug: string,
  locale: string = 'en',
  title?: string
): InternalLink {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  
  return {
    href: `${prefix}/resources/${slug}`,
    text: title || slug,
    title: title,
  };
}

/**
 * Generate category link
 */
export function getCategoryLink(
  slug: string,
  type: 'product' | 'resource' = 'product',
  locale: string = 'en'
): InternalLink {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const basePath = type === 'product' ? '/products' : '/resources';
  
  return {
    href: `${prefix}${basePath}?category=${slug}`,
    text: slug,
  };
}

/**
 * Generate breadcrumb links
 */
export function generateBreadcrumbs(
  items: Array<{ name: string; href?: string }>,
  locale: string = 'en'
): Array<InternalLink> {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  
  return items.map((item, index) => {
    // Home is always first
    if (index === 0 && !item.href) {
      return {
        href: prefix || '/',
        text: 'Home',
      };
    }
    
    return {
      href: item.href || '#',
      text: item.name,
    };
  });
}

/**
 * Generate related content links
 */
export function generateRelatedLinks(
  items: Array<{ slug: string; title: string; type: 'product' | 'service' | 'resource' }>,
  locale: string = 'en'
): InternalLink[] {
  return items.map((item) => {
    switch (item.type) {
      case 'product':
        return getProductLink(item.slug, locale, item.title);
      case 'service':
        return getServiceLink(item.slug, locale, item.title);
      case 'resource':
        return getResourceLink(item.slug, locale, item.title);
      default:
        return getInternalLink(`/${item.slug}`, locale, item.title);
    }
  });
}

/**
 * Check if link is internal
 */
export function isInternalLink(href: string): boolean {
  if (!href) return false;
  if (href.startsWith('#')) return true;
  if (href.startsWith('/')) return true;
  if (href.startsWith(siteUrl)) return true;
  return false;
}

/**
 * Get absolute URL from internal link
 */
export function getAbsoluteUrl(href: string, locale: string = 'en'): string {
  if (href.startsWith('http')) return href;
  if (href.startsWith('/')) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    return `${siteUrl}${prefix}${href}`;
  }
  return `${siteUrl}${href}`;
}

/**
 * Generate sitemap entry for internal link
 */
export function getSitemapEntry(
  link: InternalLink,
  lastModified?: Date,
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  priority: number = 0.5
) {
  return {
    url: getAbsoluteUrl(link.href),
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  };
}

