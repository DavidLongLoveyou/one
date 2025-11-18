import type { HomepageData } from '../validators/homepage';
import type { KnowledgeAssetData } from '../validators/knowledge-asset';
import type { ProductData } from '../validators/product';
import { getStrapiImageUrl } from '../cms-client';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Generate Organization schema for homepage
 */
export function generateOrganizationSchema(data: HomepageData) {
  const heroSection = data.content_sections.find(
    (section) => section.__component === 'section.hero-advanced'
  );
  
  const subheadline = heroSection && 'subheadline' in heroSection 
    ? heroSection.subheadline 
    : 'B2B Green Beans & OEM Services Since 2015';
  
  const image = heroSection && 'background_image_desktop' in heroSection
    ? getStrapiImageUrl(heroSection.background_image_desktop)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Great Beans',
    description: subheadline,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: image,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VN',
      addressRegion: 'Lam Dong',
      addressLocality: 'Da Lat',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['English', 'Vietnamese'],
    },
    sameAs: [
      // Add social media URLs here
    ],
  };
}

/**
 * Generate Article schema for knowledge asset
 */
export function generateArticleSchema(data: KnowledgeAssetData, locale: string = 'en') {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const url = `${siteUrl}${prefix}/resources/${data.slug}`;
  
  const image = data.featured_image 
    ? getStrapiImageUrl(data.featured_image)
    : undefined;
  
  const author = data.author?.data?.attributes;
  const category = data.category?.data?.attributes;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.excerpt || '',
    image: image,
    datePublished: data.published_date || data.publishedAt || data.createdAt,
    dateModified: data.updatedAt || data.publishedAt || data.createdAt,
    author: author ? {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.title,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'The Great Beans',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category?.name,
    keywords: category?.name,
  };
}

/**
 * Generate Product schema
 */
export function generateProductSchema(data: ProductData, locale: string = 'en') {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const url = `${siteUrl}${prefix}/products/${data.slug}`;
  
  const image = data.featured_image 
    ? getStrapiImageUrl(data.featured_image)
    : undefined;
  
  const gallery = data.gallery?.data?.map((img) => getStrapiImageUrl({ data: { attributes: img.attributes } })) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: typeof data.description === 'string' 
      ? data.description.replace(/<[^>]*>/g, '').substring(0, 200)
      : '',
    image: image ? [image, ...gallery] : undefined,
    category: data.category?.data?.attributes?.name,
    brand: {
      '@type': 'Brand',
      name: 'The Great Beans',
    },
    offers: data.price_range ? {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: data.in_stock 
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      price: data.price_range,
    } : undefined,
    aggregateRating: data.cupping_score ? {
      '@type': 'AggregateRating',
      ratingValue: data.cupping_score.toString(),
      bestRating: '100',
      worstRating: '0',
    } : undefined,
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof faq.answer === 'string' 
          ? faq.answer.replace(/<[^>]*>/g, '')
          : JSON.stringify(faq.answer),
      },
    })),
  };
}

/**
 * Generate HowTo schema for service process steps
 */
export function generateHowToSchema(
  serviceName: string,
  steps: Array<{ step_number: number; title: string; description: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: serviceName,
    step: steps
      .sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
      .map((step) => ({
        '@type': 'HowToStep',
        position: step.step_number || 0,
        name: step.title,
        text: step.description,
      })),
  };
}

