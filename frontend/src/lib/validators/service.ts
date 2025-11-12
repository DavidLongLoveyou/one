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

const SeoMetadataSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaImage: MediaSchema.optional(),
  keywords: z.string().optional(),
  metaRobots: z.string().optional(),
  canonicalURL: z.string().optional(),
});

export const ServiceSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  description: z.any(), // Rich text
  icon_name: z.string().optional(),
  featured_image: MediaSchema.optional(),
  cta_url: z.string().optional(),
  seo: SeoMetadataSchema.optional(),
  locale: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ServiceData = z.infer<typeof ServiceSchema>;

