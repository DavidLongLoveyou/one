import type { Metadata } from 'next';
import type { HomepageData } from '../validators/homepage';
import type { KnowledgeAssetData } from '../validators/knowledge-asset';
import type { ProductData } from '../validators/product';
import type { ServiceData } from '../validators/service';
import { getStrapiImageUrl } from '../cms-client';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = 'The Great Beans';

/**
 * Generate metadata for homepage
 */
export function generateHomepageMetadata(
  data: HomepageData,
  locale: string = 'en'
): Metadata {
  const seo = data.seo;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  
  const title = seo?.metaTitle || `${siteName} - Specialty Coffee from Vietnam`;
  const description = seo?.metaDescription || 'B2B Green Beans & OEM Services Since 2015. ISO certified, premium Vietnamese coffee.';
  const image = seo?.metaImage ? getStrapiImageUrl(seo.metaImage) : undefined;
  
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${prefix}`,
      languages: {
        'en': `${siteUrl}`,
        'vi': `${siteUrl}/vi`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${prefix}`,
      siteName,
      images: image ? [{ url: image }] : undefined,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate metadata for knowledge asset (blog post)
 */
export function generateKnowledgeAssetMetadata(
  data: KnowledgeAssetData,
  locale: string = 'en'
): Metadata {
  const seo = data.seo;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const url = `${siteUrl}${prefix}/resources/${data.slug}`;
  
  const title = seo?.metaTitle || `${data.title} | ${siteName}`;
  const description = seo?.metaDescription || data.excerpt || '';
  const image = seo?.metaImage 
    ? getStrapiImageUrl(seo.metaImage)
    : data.featured_image 
    ? getStrapiImageUrl(data.featured_image)
    : undefined;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: image ? [{ url: image }] : undefined,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'article',
      publishedTime: data.published_date || undefined,
      authors: data.author?.data?.attributes?.name ? [data.author.data.attributes.name] : undefined,
      tags: data.category?.data?.attributes?.name ? [data.category.data.attributes.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate metadata for product
 */
export function generateProductMetadata(
  data: ProductData,
  locale: string = 'en'
): Metadata {
  const seo = data.seo;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const url = `${siteUrl}${prefix}/products/${data.slug}`;
  
  const title = seo?.metaTitle || `${data.title} | ${siteName}`;
  const description = seo?.metaDescription || '';
  const image = seo?.metaImage 
    ? getStrapiImageUrl(seo.metaImage)
    : data.featured_image 
    ? getStrapiImageUrl(data.featured_image)
    : undefined;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: image ? [{ url: image }] : undefined,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate metadata for service
 */
export function generateServiceMetadata(
  data: ServiceData,
  locale: string = 'en'
): Metadata {
  const seo = data.seo;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const url = `${siteUrl}${prefix}/services/${data.slug}`;
  
  const title = seo?.metaTitle || `${data.title} | ${siteName}`;
  const description = seo?.metaDescription || data.excerpt || '';
  const image = seo?.metaImage 
    ? getStrapiImageUrl(seo.metaImage)
    : data.featured_image 
    ? getStrapiImageUrl(data.featured_image)
    : undefined;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: image ? [{ url: image }] : undefined,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

