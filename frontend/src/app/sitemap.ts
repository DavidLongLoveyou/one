import { MetadataRoute } from 'next';
import { getAllKnowledgeAssets, getAllProducts, getAllServices } from '@/lib/cms-client-list';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'vi'];
  const routes: MetadataRoute.Sitemap = [];

  // Static routes
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/resources', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
  ];

  // Add static routes for each locale
  for (const locale of locales) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    
    for (const route of staticRoutes) {
      routes.push({
        url: `${siteUrl}${prefix}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${siteUrl}${route.path}`,
            vi: `${siteUrl}/vi${route.path}`,
          },
        },
      });
    }
  }

  // Add dynamic routes from Strapi
  try {
    // Fetch all knowledge assets
    for (const locale of locales) {
      const knowledgeAssets = await getAllKnowledgeAssets(locale);
      const prefix = locale === 'en' ? '' : `/${locale}`;
      
      for (const asset of knowledgeAssets) {
        routes.push({
          url: `${siteUrl}${prefix}/resources/${asset.slug}`,
          lastModified: new Date(asset.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              en: `${siteUrl}/resources/${asset.slug}`,
              vi: `${siteUrl}/vi/resources/${asset.slug}`,
            },
          },
        });
      }
    }
    
    // Fetch all products
    for (const locale of locales) {
      const products = await getAllProducts(locale);
      const prefix = locale === 'en' ? '' : `/${locale}`;
      
      for (const product of products) {
        routes.push({
          url: `${siteUrl}${prefix}/products/${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              en: `${siteUrl}/products/${product.slug}`,
              vi: `${siteUrl}/vi/products/${product.slug}`,
            },
          },
        });
      }
    }
    
    // Fetch all services
    for (const locale of locales) {
      const services = await getAllServices(locale);
      const prefix = locale === 'en' ? '' : `/${locale}`;
      
      for (const service of services) {
        routes.push({
          url: `${siteUrl}${prefix}/services/${service.slug}`,
          lastModified: new Date(service.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              en: `${siteUrl}/services/${service.slug}`,
              vi: `${siteUrl}/vi/services/${service.slug}`,
            },
          },
        });
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Continue with static routes even if dynamic routes fail
  }

  return routes;
}

