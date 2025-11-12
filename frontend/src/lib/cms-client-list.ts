/**
 * CMS Client - List Functions
 * Functions to fetch lists of content for sitemap and internal linking
 */

import qs from 'qs';
import { KnowledgeAssetSchema, type KnowledgeAssetData } from './validators/knowledge-asset';
import { ProductSchema, type ProductData } from './validators/product';
import { ServiceSchema, type ServiceData } from './validators/service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Fetch all knowledge assets (for sitemap)
 */
export async function getAllKnowledgeAssets(
  locale: string = 'en'
): Promise<Array<{ slug: string; updatedAt: string }>> {
  const query = qs.stringify({
    fields: ['slug', 'updatedAt'],
    locale: locale,
    pagination: {
      limit: 1000, // Adjust based on your content volume
    },
  });

  try {
    const response = await fetch(`${API_URL}/api/knowledge-assets?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // 1 hour cache
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch knowledge assets: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.map((item: any) => ({
      slug: item.attributes.slug,
      updatedAt: item.attributes.updatedAt,
    })) || [];
  } catch (error) {
    console.error('Error fetching knowledge assets:', error);
    return [];
  }
}

/**
 * Fetch all products (for sitemap)
 */
export async function getAllProducts(
  locale: string = 'en'
): Promise<Array<{ slug: string; updatedAt: string }>> {
  const query = qs.stringify({
    fields: ['slug', 'updatedAt'],
    locale: locale,
    pagination: {
      limit: 1000,
    },
  });

  try {
    const response = await fetch(`${API_URL}/api/products?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.map((item: any) => ({
      slug: item.attributes.slug,
      updatedAt: item.attributes.updatedAt,
    })) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch all services (for sitemap)
 */
export async function getAllServices(
  locale: string = 'en'
): Promise<Array<{ slug: string; updatedAt: string }>> {
  const query = qs.stringify({
    fields: ['slug', 'updatedAt'],
    locale: locale,
    pagination: {
      limit: 1000,
    },
  });

  try {
    const response = await fetch(`${API_URL}/api/services?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.map((item: any) => ({
      slug: item.attributes.slug,
      updatedAt: item.attributes.updatedAt,
    })) || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Fetch related content for internal linking
 */
export async function getRelatedContent(
  type: 'product' | 'service' | 'resource',
  currentSlug: string,
  limit: number = 3,
  locale: string = 'en'
): Promise<Array<{ slug: string; title: string; type: 'product' | 'service' | 'resource' }>> {
  const query = qs.stringify({
    fields: ['slug', 'title'],
    filters: {
      slug: {
        $ne: currentSlug, // Exclude current item
      },
    },
    locale: locale,
    pagination: {
      limit: limit,
    },
    sort: ['updatedAt:desc'], // Most recent first
  });

  try {
    const endpoint = type === 'product' 
      ? 'products' 
      : type === 'service' 
      ? 'services' 
      : 'knowledge-assets';
    
    const response = await fetch(`${API_URL}/api/${endpoint}?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch related ${type}s: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.map((item: any) => ({
      slug: item.attributes.slug,
      title: item.attributes.title,
      type: type,
    })) || [];
  } catch (error) {
    console.error(`Error fetching related ${type}s:`, error);
    return [];
  }
}

