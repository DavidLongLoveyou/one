import { z } from 'zod';

// Shared component schemas
const ButtonSchema = z.object({
  text: z.string(),
  url: z.string(),
  variant: z.enum(['primary', 'outline', 'ghost', 'destructive']).optional(),
  open_in_new_tab: z.boolean().optional(),
  icon_name: z.string().optional(),
});

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

// Hero component schemas
const HeroStatSchema = z.object({
  value: z.string(),
  label: z.string(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
  icon_name: z.string().optional(),
  animation_delay: z.number().optional(),
});

const HeroTrustIndicatorSchema = z.object({
  text: z.string(),
  icon_name: z.string().optional(),
  show_on_mobile: z.boolean().optional(),
});

const HeroHotspotSchema = z.object({
  position_x: z.number(),
  position_y: z.number(),
  tooltip_title: z.string(),
  tooltip_content: z.string().optional(),
  icon_type: z.enum(['question', 'info', 'star', 'check']).optional(),
});

// Section schemas
const HeroAdvancedSchema = z.object({
  __component: z.literal('section.hero-advanced'),
  headline: z.string(),
  subheadline: z.string().optional(),
  primary_cta: ButtonSchema,
  secondary_cta: ButtonSchema.optional(),
  background_image_desktop: MediaSchema,
  background_image_mobile: MediaSchema.optional(),
  overlay_opacity: z.number().optional(),
  trust_indicators: z.array(HeroTrustIndicatorSchema).optional(),
  stats: z.array(HeroStatSchema).optional(),
  hotspots: z.array(HeroHotspotSchema).optional(),
  layout_variant: z.enum(['golden-ratio-split', 'centered-overlay', 'full-width']).optional(),
  enable_gradient_text: z.boolean().optional(),
  enable_animated_grid: z.boolean().optional(),
});

const TrustBarEnhancedSchema = z.object({
  __component: z.literal('section.trust-bar-enhanced'),
  headline: z.string().optional(),
  display_style: z.enum(['logo-wall', 'carousel', 'grid']).optional(),
  layout_desktop: z.enum(['single-row', 'two-rows', 'masonry']).optional(),
  layout_mobile: z.enum(['carousel', 'grid-2col']).optional(),
  certifications: z.any().optional(), // Will be populated with certification data
  background_color: z.enum(['white', 'earth', 'green-50']).optional(),
  logo_max_height: z.number().optional(),
  enable_grayscale: z.boolean().optional(),
});

const ServicesGridSchema = z.object({
  __component: z.literal('section.services-grid'),
  headline: z.string(),
  subheadline: z.string().optional(),
  services: z.any().optional(), // Will be populated with service data
  services_per_row_desktop: z.enum(['3', '4']).optional(),
  services_per_row_mobile: z.enum(['1', '2']).optional(),
  card_style: z.enum(['minimal', 'detailed', 'image-focus']).optional(),
  enable_hover_effect: z.boolean().optional(),
});

const FactoryStorySchema = z.object({
  __component: z.literal('section.factory-story'),
  headline: z.string(),
  story_text: z.any(), // Rich text
  image: MediaSchema.optional(),
  image_position: z.enum(['left', 'right']).optional(),
  key_stats: z.array(HeroStatSchema).optional(),
  expertise_proofs: z.array(HeroTrustIndicatorSchema).optional(),
  layout: z.enum(['split-60-40', 'split-50-50', 'image-full']).optional(),
  enable_counter_animation: z.boolean().optional(),
});

const ProductsShowcaseSchema = z.object({
  __component: z.literal('section.products-showcase'),
  headline: z.string(),
  subheadline: z.string().optional(),
  products: z.any().optional(), // Will be populated with product data
  products_per_row_desktop: z.enum(['3', '4']).optional(),
  products_per_row_mobile: z.enum(['1', '2']).optional(),
  show_specifications: z.boolean().optional(),
  show_price: z.boolean().optional(),
  show_categories: z.boolean().optional(),
  card_layout: z.enum(['image-top', 'image-left', 'overlay']).optional(),
  enable_quick_view: z.boolean().optional(),
});

const TestimonialsProofSchema = z.object({
  __component: z.literal('section.testimonials-proof'),
  headline: z.string(),
  testimonials: z.any().optional(), // Will be populated with testimonial data
  display_style: z.enum(['carousel', 'grid', 'masonry']).optional(),
  show_company_logos: z.boolean().optional(),
  show_ratings: z.boolean().optional(),
  autoplay: z.boolean().optional(),
  autoplay_delay: z.number().optional(),
});

const BlogInsightsSchema = z.object({
  __component: z.literal('section.blog-insights'),
  headline: z.string(),
  subheadline: z.string().optional(),
  knowledge_assets: z.any().optional(), // Will be populated with knowledge-asset data
  max_posts: z.enum(['3', '6']).optional(),
  layout: z.enum(['grid', 'featured-left', 'carousel']).optional(),
  show_author: z.boolean().optional(),
  show_read_time: z.boolean().optional(),
  show_excerpt: z.boolean().optional(),
});

const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.any(), // Rich text
  category: z.enum(['general', 'products', 'services', 'shipping']).optional(),
});

const FaqSeoSchema = z.object({
  __component: z.literal('section.faq-seo'),
  headline: z.string(),
  subheadline: z.string().optional(),
  faq_items: z.array(FaqItemSchema).optional(),
  layout: z.enum(['accordion', 'grid', 'split-categories']).optional(),
  default_open_first: z.boolean().optional(),
  enable_search: z.boolean().optional(),
  enable_faqpage_schema: z.boolean().optional(),
});

const CtaConversionSchema = z.object({
  __component: z.literal('section.cta-conversion'),
  headline: z.string(),
  subheadline: z.string().optional(),
  cta_button: ButtonSchema,
  secondary_cta: ButtonSchema.optional(),
  background_style: z.enum(['solid', 'gradient', 'image']).optional(),
  background_color_primary: z.string().optional(),
  background_color_secondary: z.string().optional(),
  background_image: MediaSchema.optional(),
  text_color: z.enum(['white', 'dark']).optional(),
  layout: z.enum(['centered', 'split', 'minimal']).optional(),
});

// Union of all section types
export const SectionSchema = z.discriminatedUnion('__component', [
  HeroAdvancedSchema,
  TrustBarEnhancedSchema,
  ServicesGridSchema,
  FactoryStorySchema,
  ProductsShowcaseSchema,
  TestimonialsProofSchema,
  BlogInsightsSchema,
  FaqSeoSchema,
  CtaConversionSchema,
]);

// SEO metadata schema
const SeoMetadataSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaImage: MediaSchema.optional(),
  keywords: z.string().optional(),
  metaRobots: z.string().optional(),
  canonicalURL: z.string().optional(),
  metaSocial: z.array(z.any()).optional(),
});

// Homepage schema
export const HomepageSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  content_sections: z.array(SectionSchema),
  seo: SeoMetadataSchema.optional(),
  locale: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type HomepageData = z.infer<typeof HomepageSchema>;
export type SectionData = z.infer<typeof SectionSchema>;

