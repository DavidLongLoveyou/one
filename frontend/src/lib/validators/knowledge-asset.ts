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

const AuthorSchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: z.object({
      name: z.string(),
      slug: z.string(),
      title: z.string().optional(),
      bio: z.string().optional(),
      avatar: MediaSchema.optional(),
    }),
  }).nullable(),
});

const CategorySchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
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

export const KnowledgeAssetSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  content: z.any(), // Rich text
  featured_image: MediaSchema.optional(),
  author: AuthorSchema.optional(),
  category: CategorySchema.optional(),
  published_date: z.string().nullable().optional(),
  read_time: z.number().optional(),
  word_count: z.number().optional(),
  seo: SeoMetadataSchema.optional(),
  locale: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type KnowledgeAssetData = z.infer<typeof KnowledgeAssetSchema>;

