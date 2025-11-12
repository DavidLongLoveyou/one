/**
 * SEO Validation Utilities
 * Validates meta tags, schema markup, and SEO best practices
 */

import type { Metadata } from 'next';

export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

/**
 * Validate metadata object
 */
export function validateMetadata(metadata: Metadata): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Title validation
  if (!metadata.title) {
    errors.push('Missing title tag');
    score -= 20;
  } else {
    const title = typeof metadata.title === 'string' 
      ? metadata.title 
      : metadata.title.absolute || '';
    
    if (title.length < 30) {
      warnings.push('Title is too short (recommended: 30-60 characters)');
      score -= 5;
    }
    if (title.length > 60) {
      warnings.push('Title is too long (recommended: 30-60 characters)');
      score -= 5;
    }
  }

  // Description validation
  if (!metadata.description) {
    errors.push('Missing meta description');
    score -= 20;
  } else {
    const description = metadata.description;
    if (description.length < 120) {
      warnings.push('Description is too short (recommended: 120-160 characters)');
      score -= 5;
    }
    if (description.length > 160) {
      warnings.push('Description is too long (recommended: 120-160 characters)');
      score -= 5;
    }
  }

  // Open Graph validation
  if (!metadata.openGraph) {
    warnings.push('Missing Open Graph tags');
    score -= 10;
  } else {
    if (!metadata.openGraph.title) {
      warnings.push('Missing Open Graph title');
      score -= 5;
    }
    if (!metadata.openGraph.description) {
      warnings.push('Missing Open Graph description');
      score -= 5;
    }
    if (!metadata.openGraph.images || metadata.openGraph.images.length === 0) {
      warnings.push('Missing Open Graph image');
      score -= 10;
    }
  }

  // Twitter Card validation
  if (!metadata.twitter) {
    warnings.push('Missing Twitter Card tags');
    score -= 5;
  }

  // Canonical URL validation
  if (!metadata.alternates?.canonical) {
    warnings.push('Missing canonical URL');
    score -= 5;
  }

  // Robots validation
  if (!metadata.robots) {
    warnings.push('Missing robots meta tag');
    score -= 5;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate schema.org JSON-LD
 */
export function validateSchema(schema: any): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!schema) {
    errors.push('Schema is missing');
    return { isValid: false, errors, warnings, score: 0 };
  }

  // Check required schema.org properties
  if (!schema['@context']) {
    errors.push('Missing @context in schema');
    score -= 20;
  } else if (schema['@context'] !== 'https://schema.org') {
    warnings.push('@context should be "https://schema.org"');
    score -= 5;
  }

  if (!schema['@type']) {
    errors.push('Missing @type in schema');
    score -= 20;
  }

  // Type-specific validations
  if (schema['@type'] === 'Organization') {
    if (!schema.name) {
      errors.push('Organization schema missing name');
      score -= 10;
    }
    if (!schema.url) {
      warnings.push('Organization schema missing url');
      score -= 5;
    }
  }

  if (schema['@type'] === 'Article') {
    if (!schema.headline) {
      errors.push('Article schema missing headline');
      score -= 10;
    }
    if (!schema.datePublished) {
      warnings.push('Article schema missing datePublished');
      score -= 5;
    }
    if (!schema.author) {
      warnings.push('Article schema missing author');
      score -= 5;
    }
  }

  if (schema['@type'] === 'Product') {
    if (!schema.name) {
      errors.push('Product schema missing name');
      score -= 10;
    }
    if (!schema.description) {
      warnings.push('Product schema missing description');
      score -= 5;
    }
  }

  if (schema['@type'] === 'BreadcrumbList') {
    if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
      errors.push('BreadcrumbList schema missing itemListElement');
      score -= 10;
    }
  }

  if (schema['@type'] === 'FAQPage') {
    if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
      errors.push('FAQPage schema missing mainEntity');
      score -= 10;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate URL structure
 */
export function validateURL(url: string): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!url) {
    errors.push('URL is missing');
    return { isValid: false, errors, warnings, score: 0 };
  }

  // Check for HTTPS
  if (!url.startsWith('https://')) {
    warnings.push('URL should use HTTPS');
    score -= 10;
  }

  // Check for trailing slash consistency
  if (url.endsWith('/') && url !== 'https://' && !url.match(/\/[^\/]+\/$/)) {
    warnings.push('Consider removing trailing slash for consistency');
    score -= 5;
  }

  // Check URL length
  if (url.length > 100) {
    warnings.push('URL is quite long (recommended: < 100 characters)');
    score -= 5;
  }

  // Check for special characters
  if (url.includes('#')) {
    warnings.push('URL contains fragment identifier (#)');
    score -= 5;
  }

  // Check for uppercase
  if (url !== url.toLowerCase()) {
    warnings.push('URL contains uppercase letters (use lowercase)');
    score -= 5;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate image for SEO
 */
export function validateImage(imageUrl: string | undefined, context: string = 'image'): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!imageUrl) {
    warnings.push(`Missing ${context}`);
    score -= 20;
    return { isValid: true, errors, warnings, score };
  }

  // Check image format
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const hasSupportedFormat = supportedFormats.some(format => 
    imageUrl.toLowerCase().includes(format)
  );

  if (!hasSupportedFormat) {
    warnings.push(`${context} should use supported format (JPG, PNG, WebP, AVIF)`);
    score -= 5;
  }

  // Check image dimensions (recommended: 1200x630 for OG images)
  // Note: This would require actual image fetching, so we'll just warn
  warnings.push(`Ensure ${context} is at least 1200x630px for optimal sharing`);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Comprehensive SEO audit
 */
export function auditSEO(metadata: Metadata, schema?: any, url?: string, imageUrl?: string): SEOValidationResult {
  const results: SEOValidationResult[] = [];

  // Validate metadata
  results.push(validateMetadata(metadata));

  // Validate schema if provided
  if (schema) {
    results.push(validateSchema(schema));
  }

  // Validate URL if provided
  if (url) {
    results.push(validateURL(url));
  }

  // Validate image if provided
  if (imageUrl) {
    results.push(validateImage(imageUrl));
  }

  // Aggregate results
  const allErrors = results.flatMap(r => r.errors);
  const allWarnings = results.flatMap(r => r.warnings);
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

  return {
    isValid: allErrors.length === 0,
    errors: [...new Set(allErrors)],
    warnings: [...new Set(allWarnings)],
    score: Math.round(avgScore),
  };
}

