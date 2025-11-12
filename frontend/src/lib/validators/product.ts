import { z } from 'zod';

const MediaSchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: z.object({
      url: z.string(),
      alternativeText: z.string().nullable(),
      width: z.number().nullable(),
      height: z.number().nullable(),
      formats: z.any().nullable(),
    }),
  }).nullable(),
});

const CategorySchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: z.object({
      name: z.string(),
      slug: z.string(),
    }),
  }).nullable(),
});

const SeoMetadataSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaImage: MediaSchema.optional(),
  keywords: z.string().optional(),
  metaRobots: z.string().optional(),
  canonicalURL: z.string().optional(),
});

export const ProductSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.any(), // Rich text
  featured_image: MediaSchema.optional(),
  gallery: z.object({
    data: z.array(z.object({
      id: z.number(),
      attributes: z.object({
        url: z.string(),
        alternativeText: z.string().nullable(),
        width: z.number().nullable(),
        height: z.number().nullable(),
      }),
    })),
  }).optional(),
  category: CategorySchema.optional(),
  specifications: z.any().optional(), // JSON
  cupping_score: z.number().optional(),
  altitude: z.string().optional(),
  processing_method: z.string().optional(),
  price_range: z.string().optional(),
  in_stock: z.boolean().optional(),
  seo: SeoMetadataSchema.optional(),
  locale: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ProductData = z.infer<typeof ProductSchema>;

