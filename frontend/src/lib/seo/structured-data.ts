/**
 * Helper functions for structured data
 */

/**
 * Convert rich text to plain text for schema descriptions
 */
export function extractTextFromRichText(richText: any): string {
  if (!richText) return '';
  
  // Handle string (legacy HTML)
  if (typeof richText === 'string') {
    return richText.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
  
  // Handle Strapi richtext structure (array of blocks)
  if (Array.isArray(richText)) {
    return richText
      .map((block: any) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children
            .map((child: any) => child.text || '')
            .join(' ');
        }
        if (block.type === 'heading' && block.children) {
          return block.children
            .map((child: any) => child.text || '')
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .trim();
  }
  
  return '';
}

/**
 * Truncate text to max length for meta descriptions
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string, locale: string = 'en'): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${siteUrl}${prefix}${path}`;
}

/**
 * Format date for schema.org
 */
export function formatSchemaDate(date: string | null | undefined): string | undefined {
  if (!date) return undefined;
  
  try {
    return new Date(date).toISOString();
  } catch {
    return undefined;
  }
}

