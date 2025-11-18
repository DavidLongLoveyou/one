import qs from 'qs';
import { HomepageSchema, type HomepageData } from './validators/homepage';
import { KnowledgeAssetSchema, type KnowledgeAssetData } from './validators/knowledge-asset';
import { ProductSchema, type ProductData } from './validators/product';
import { ServiceSchema, type ServiceData } from './validators/service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * THE GOLDEN RULES OF POPULATE:
 * 
 * 1. NEVER use populate: '*' at root level
 * 2. NEVER use populate: 'deep'
 * 3. ALWAYS use explicit field selection
 * 4. For Dynamic Zones, ALWAYS use 'on: { ... }' syntax
 * 5. For relations, specify nested populate explicitly
 * 6. ALWAYS validate response with Zod before returning
 */

/**
 * Fetch homepage data with all sections populated
 */
export async function getHomepage(locale: string = 'en'): Promise<HomepageData> {
  const query = qs.stringify({
    populate: {
      // Dynamic Zone requires 'on' syntax to populate components
      content_sections: {
        on: {
          // Each component type needs its own populate config
          'section.hero-advanced': {
            populate: {
              primary_cta: true,
              secondary_cta: true,
              background_image_desktop: {
                fields: ['url', 'alternativeText', 'width', 'height', 'formats'],
              },
              background_image_mobile: {
                fields: ['url', 'alternativeText', 'width', 'height', 'formats'],
              },
              trust_indicators: {
                populate: '*',
              },
              stats: {
                populate: '*',
              },
              hotspots: {
                populate: '*',
              },
            },
          },
          'section.trust-bar-enhanced': {
            populate: {
              certifications: {
                populate: {
                  logo: {
                    fields: ['url', 'alternativeText', 'width', 'height'],
                  },
                },
              },
            },
          },
          'section.services-grid': {
            populate: {
              services: {
                populate: {
                  icon_name: true,
                  featured_image: {
                    fields: ['url', 'alternativeText', 'width', 'height'],
                  },
                },
              },
            },
          },
          'section.factory-story': {
            populate: {
              image: {
                fields: ['url', 'alternativeText', 'width', 'height'],
              },
              key_stats: {
                populate: '*',
              },
              expertise_proofs: {
                populate: '*',
              },
            },
          },
          'section.products-showcase': {
            populate: {
              products: {
                populate: {
                  featured_image: {
                    fields: ['url', 'alternativeText', 'width', 'height'],
                  },
                  gallery: {
                    fields: ['url', 'alternativeText', 'width', 'height'],
                  },
                  category: {
                    fields: ['name', 'slug'],
                  },
                },
              },
            },
          },
          'section.testimonials-proof': {
            populate: {
              testimonials: {
                populate: {
                  reviewer_avatar: {
                    fields: ['url', 'alternativeText'],
                  },
                  company_logo: {
                    fields: ['url', 'alternativeText'],
                  },
                },
              },
            },
          },
          'section.blog-insights': {
            populate: {
              knowledge_assets: {
                populate: {
                  featured_image: {
                    fields: ['url', 'alternativeText', 'width', 'height'],
                  },
                  author: {
                    fields: ['name', 'slug'],
                    populate: {
                      avatar: {
                        fields: ['url', 'alternativeText'],
                      },
                    },
                  },
                  category: {
                    fields: ['name', 'slug'],
                  },
                },
              },
            },
          },
          'section.faq-seo': {
            populate: {
              faq_items: {
                populate: '*',
              },
            },
          },
          'section.cta-conversion': {
            populate: {
              cta_button: true,
              secondary_cta: true,
              background_image: {
                fields: ['url', 'alternativeText', 'width', 'height'],
              },
            },
          },
        },
      },
      // SEO metadata
      seo: {
        populate: {
          metaImage: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
          metaSocial: {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
            },
          },
        },
      },
    },
    locale: locale,
  });

  try {
    const response = await fetch(`${API_URL}/api/homepage?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // ISR with 60s revalidation
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    // CRITICAL: Validate with Zod before returning
    const validatedData = HomepageSchema.parse(json.data);
    
    return validatedData;
    
  } catch (error) {
    console.error('Error fetching homepage:', error);
    throw error;
  }
}

/**
 * Fetch knowledge asset by slug
 */
export async function getKnowledgeAsset(
  slug: string,
  locale: string = 'en'
): Promise<KnowledgeAssetData | null> {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      featured_image: {
        fields: ['url', 'alternativeText', 'width', 'height', 'formats'],
      },
      author: {
        fields: ['name', 'title', 'slug', 'bio'],
        populate: {
          avatar: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
      category: {
        fields: ['name', 'slug', 'description', 'id'],
      },
      content_sections: {
        on: {
          'section.text-block': {
            populate: '*',
          },
          'section.image-block': {
            populate: {
              image: {
                fields: ['url', 'alternativeText', 'width', 'height'],
              },
            },
          },
          'section.quote-block': {
            populate: '*',
          },
          'section.code-block': {
            populate: '*',
          },
        },
      },
      seo: {
        populate: {
          metaImage: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
    },
    locale: locale,
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
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    
    if (!json.data || json.data.length === 0) {
      return null;
    }
    
    // Validate with Zod
    const validatedData = KnowledgeAssetSchema.parse(json.data[0]);
    
    return validatedData;
    
  } catch (error) {
    console.error(`Error fetching knowledge asset ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch product by slug
 */
export async function getProduct(
  slug: string,
  locale: string = 'en'
): Promise<ProductData | null> {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      featured_image: {
        fields: ['url', 'alternativeText', 'width', 'height', 'formats'],
      },
      gallery: {
        fields: ['url', 'alternativeText', 'width', 'height'],
      },
      category: {
        fields: ['name', 'slug', 'id'],
      },
      specifications: {
        populate: '*',
      },
      packaging_options: {
        populate: '*',
      },
      certifications: {
        fields: ['name', 'slug'],
        populate: {
          logo: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
      related_products: {
        fields: ['name', 'slug', 'title'],
        populate: {
          featured_image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
          category: {
            fields: ['name', 'slug'],
          },
        },
      },
      seo: {
        populate: {
          metaImage: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
    },
    locale: locale,
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
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    
    if (!json.data || json.data.length === 0) {
      return null;
    }
    
    const validatedData = ProductSchema.parse(json.data[0]);
    
    return validatedData;
    
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch service by slug
 */
export async function getService(
  slug: string,
  locale: string = 'en'
): Promise<ServiceData | null> {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      hero_image: {
        fields: ['url', 'alternativeText', 'width', 'height', 'formats'],
      },
      featured_image: {
        fields: ['url', 'alternativeText', 'width', 'height', 'formats'],
      },
      process_steps: {
        populate: {
          illustration: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      },
      capabilities: {
        populate: '*',
      },
      faq_items: {
        populate: '*',
      },
      case_studies: {
        fields: ['name', 'title', 'quote', 'company'],
        populate: {
          reviewer_avatar: {
            fields: ['url', 'alternativeText'],
          },
          company_logo: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
      related_products: {
        fields: ['name', 'slug', 'title'],
        populate: {
          featured_image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      },
      primary_cta: {
        populate: '*',
      },
      seo: {
        populate: {
          metaImage: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
    },
    locale: locale,
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
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    
    if (!json.data || json.data.length === 0) {
      return null;
    }
    
    const validatedData = ServiceSchema.parse(json.data[0]);
    
    return validatedData;
    
  } catch (error) {
    console.error(`Error fetching service ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch category by slug
 */
export async function getCategory(
  slug: string,
  locale: string = 'en'
): Promise<any | null> {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      featured_image: {
        fields: ['url', 'alternativeText', 'width', 'height'],
      },
    },
    locale: locale,
  });

  try {
    const response = await fetch(`${API_URL}/api/categories?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    
    if (!json.data || json.data.length === 0) {
      return null;
    }
    
    return json.data[0];
    
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch knowledge assets by category
 */
export async function getKnowledgeAssetsByCategory(
  categorySlug: string,
  locale: string = 'en',
  limit: number = 10
): Promise<any[]> {
  const query = qs.stringify({
    filters: {
      category: {
        slug: {
          $eq: categorySlug,
        },
      },
    },
    populate: {
      featured_image: {
        fields: ['url', 'alternativeText', 'width', 'height'],
      },
      author: {
        fields: ['name', 'slug'],
        populate: {
          avatar: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
      category: {
        fields: ['name', 'slug'],
      },
    },
    pagination: {
      limit,
    },
    sort: ['published_date:desc'],
    locale: locale,
  });

  try {
    const response = await fetch(`${API_URL}/api/knowledge-assets?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    return json.data || [];
    
  } catch (error) {
    console.error(`Error fetching knowledge assets for category ${categorySlug}:`, error);
    return [];
  }
}

/**
 * Fetch related products
 */
export async function getRelatedProducts(
  categoryId: number | undefined,
  excludeProductId: number,
  locale: string = 'en',
  limit: number = 4
): Promise<any[]> {
  if (!categoryId) {
    return [];
  }

  const query = qs.stringify({
    filters: {
      category: {
        id: {
          $eq: categoryId,
        },
      },
      id: {
        $ne: excludeProductId,
      },
    },
    populate: {
      featured_image: {
        fields: ['url', 'alternativeText', 'width', 'height'],
      },
      category: {
        fields: ['name', 'slug'],
      },
    },
    pagination: {
      limit,
    },
    locale: locale,
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
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    return json.data || [];
    
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

/**
 * Fetch about page
 */
export async function getAboutPage(locale: string = 'en'): Promise<any | null> {
  const query = qs.stringify({
    populate: {
      hero_image: {
        fields: ['url', 'alternativeText', 'width', 'height'],
      },
      ceo_section: {
        populate: {
          photo: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
          certifications: {
            populate: {
              logo: {
                fields: ['url', 'alternativeText'],
              },
            },
          },
        },
      },
      timeline_events: {
        populate: {
          image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      },
      factory_tour_cta: true,
      seo: {
        populate: {
          metaImage: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
    },
    locale: locale,
  });

  try {
    const response = await fetch(`${API_URL}/api/about-page?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    return json.data || null;
    
  } catch (error) {
    console.error('Error fetching about page:', error);
    throw error;
  }
}

/**
 * Fetch contact page
 */
export async function getContactPage(locale: string = 'en'): Promise<any | null> {
  const query = qs.stringify({
    populate: {
      seo: {
        populate: {
          metaImage: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
    },
    locale: locale,
  });

  try {
    const response = await fetch(`${API_URL}/api/contact-page?${query}`, {
      headers: {
        'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    return json.data || null;
    
  } catch (error) {
    console.error('Error fetching contact page:', error);
    throw error;
  }
}

/**
 * Get image URL from Strapi media object
 */
export function getStrapiImageUrl(
  media: { data: { attributes: { url: string } } | null } | null | undefined,
  fallback?: string
): string {
  if (!media?.data?.attributes?.url) {
    return fallback || '';
  }
  
  const url = media.data.attributes.url;
  
  // If URL is already absolute, return as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // Otherwise, prepend API URL
  return `${API_URL}${url}`;
}

