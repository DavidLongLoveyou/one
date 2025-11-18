import type { Schema, Struct } from '@strapi/strapi';

export interface AboutCeoProfile extends Struct.ComponentSchema {
  collectionName: 'components_about_ceo_profiles';
  info: {
    description: 'CEO profile information';
    displayName: 'CEO Profile';
  };
  attributes: {
    bio: Schema.Attribute.RichText & Schema.Attribute.Required;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    photo: Schema.Attribute.Media<'images'>;
    quote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface AboutTimelineEvent extends Struct.ComponentSchema {
  collectionName: 'components_about_timeline_events';
  info: {
    description: 'Company timeline event';
    displayName: 'Timeline Event';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    year: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
  };
}

export interface AboutValue extends Struct.ComponentSchema {
  collectionName: 'components_about_values';
  info: {
    description: 'Company core value';
    displayName: 'Core Value';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    icon_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface ContactInquiryType extends Struct.ComponentSchema {
  collectionName: 'components_contact_inquiry_types';
  info: {
    description: 'Contact form inquiry type option';
    displayName: 'Inquiry Type';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface HeroHotspot extends Struct.ComponentSchema {
  collectionName: 'components_hero_hotspots';
  info: {
    description: 'Interactive hotspot marker on hero image';
    displayName: 'Hotspot';
  };
  attributes: {
    icon_type: Schema.Attribute.Enumeration<
      ['question', 'info', 'star', 'check']
    > &
      Schema.Attribute.DefaultTo<'info'>;
    position_x: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    position_y: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    tooltip_content: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
    tooltip_title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface HeroStat extends Struct.ComponentSchema {
  collectionName: 'components_hero_stats';
  info: {
    description: 'Statistic card for hero section';
    displayName: 'Hero Stat';
  };
  attributes: {
    animation_delay: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    icon_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    prefix: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5;
      }>;
    suffix: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
  };
}

export interface HeroTrustIndicator extends Struct.ComponentSchema {
  collectionName: 'components_hero_trust_indicators';
  info: {
    description: 'Trust badge or certification indicator';
    displayName: 'Trust Indicator';
  };
  attributes: {
    icon_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    show_on_mobile: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface ProductPackaging extends Struct.ComponentSchema {
  collectionName: 'components_product_packagings';
  info: {
    description: 'Packaging option for a product';
    displayName: 'Product Packaging';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    minimum_order: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    size: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    type: Schema.Attribute.Enumeration<['bulk', 'bag', 'box', 'custom']> &
      Schema.Attribute.Required;
  };
}

export interface ProductSpecification extends Struct.ComponentSchema {
  collectionName: 'components_product_specifications';
  info: {
    description: 'Product specification field';
    displayName: 'Product Specification';
  };
  attributes: {
    spec_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    spec_unit: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    spec_value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface SectionBlogInsights extends Struct.ComponentSchema {
  collectionName: 'components_section_blog_insightss';
  info: {
    description: 'Knowledge assets/blog posts section';
    displayName: 'Blog Insights';
  };
  attributes: {
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    knowledge_assets: Schema.Attribute.Relation<
      'oneToMany',
      'api::knowledge-asset.knowledge-asset'
    >;
    layout: Schema.Attribute.Enumeration<
      ['grid', 'featured-left', 'carousel']
    > &
      Schema.Attribute.DefaultTo<'grid'>;
    max_posts: Schema.Attribute.Enumeration<['3', '6']> &
      Schema.Attribute.DefaultTo<'3'>;
    show_author: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_excerpt: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_read_time: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subheadline: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
  };
}

export interface SectionCtaConversion extends Struct.ComponentSchema {
  collectionName: 'components_section_cta_conversions';
  info: {
    description: 'Final conversion CTA section';
    displayName: 'CTA Conversion';
  };
  attributes: {
    background_color_primary: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#059669'>;
    background_color_secondary: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#047857'>;
    background_image: Schema.Attribute.Media<'images'>;
    background_style: Schema.Attribute.Enumeration<
      ['solid', 'gradient', 'image']
    > &
      Schema.Attribute.DefaultTo<'gradient'>;
    cta_button: Schema.Attribute.Component<'shared.button', false> &
      Schema.Attribute.Required;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    layout: Schema.Attribute.Enumeration<['centered', 'split', 'minimal']> &
      Schema.Attribute.DefaultTo<'centered'>;
    secondary_cta: Schema.Attribute.Component<'shared.button', false>;
    subheadline: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
    text_color: Schema.Attribute.Enumeration<['white', 'dark']> &
      Schema.Attribute.DefaultTo<'white'>;
  };
}

export interface SectionFactoryStory extends Struct.ComponentSchema {
  collectionName: 'components_section_factory_storys';
  info: {
    description: 'Factory and process story section';
    displayName: 'Factory Story';
  };
  attributes: {
    enable_counter_animation: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    expertise_proofs: Schema.Attribute.Component<'hero.trust-indicator', true>;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    image: Schema.Attribute.Media<'images'>;
    image_position: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    key_stats: Schema.Attribute.Component<'hero.stat', true>;
    layout: Schema.Attribute.Enumeration<
      ['split-60-40', 'split-50-50', 'image-full']
    > &
      Schema.Attribute.DefaultTo<'split-60-40'>;
    story_text: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface SectionFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_section_faq_items';
  info: {
    description: 'Single FAQ question and answer';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    category: Schema.Attribute.Enumeration<
      ['general', 'products', 'services', 'shipping']
    > &
      Schema.Attribute.DefaultTo<'general'>;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SectionFaqSeo extends Struct.ComponentSchema {
  collectionName: 'components_section_faq_seos';
  info: {
    description: 'FAQ section with SEO schema support';
    displayName: 'FAQ SEO';
  };
  attributes: {
    default_open_first: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    enable_faqpage_schema: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    enable_search: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    faq_items: Schema.Attribute.Component<'section.faq-item', true>;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    layout: Schema.Attribute.Enumeration<
      ['accordion', 'grid', 'split-categories']
    > &
      Schema.Attribute.DefaultTo<'accordion'>;
    subheadline: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
  };
}

export interface SectionHeroAdvanced extends Struct.ComponentSchema {
  collectionName: 'components_section_hero_advanceds';
  info: {
    description: 'Advanced hero section with stats, hotspots, and CTAs';
    displayName: 'Hero Advanced';
  };
  attributes: {
    background_image_desktop: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    background_image_mobile: Schema.Attribute.Media<'images'>;
    enable_animated_grid: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    enable_gradient_text: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    hotspots: Schema.Attribute.Component<'hero.hotspot', true>;
    layout_variant: Schema.Attribute.Enumeration<
      ['golden-ratio-split', 'centered-overlay', 'full-width']
    > &
      Schema.Attribute.DefaultTo<'golden-ratio-split'>;
    overlay_opacity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<40>;
    primary_cta: Schema.Attribute.Component<'shared.button', false> &
      Schema.Attribute.Required;
    secondary_cta: Schema.Attribute.Component<'shared.button', false>;
    stats: Schema.Attribute.Component<'hero.stat', true>;
    subheadline: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
    trust_indicators: Schema.Attribute.Component<'hero.trust-indicator', true>;
  };
}

export interface SectionProductsShowcase extends Struct.ComponentSchema {
  collectionName: 'components_section_products_showcases';
  info: {
    description: 'Product showcase section';
    displayName: 'Products Showcase';
  };
  attributes: {
    card_layout: Schema.Attribute.Enumeration<
      ['image-top', 'image-left', 'overlay']
    > &
      Schema.Attribute.DefaultTo<'image-top'>;
    enable_quick_view: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
    products_per_row_desktop: Schema.Attribute.Enumeration<['3', '4']> &
      Schema.Attribute.DefaultTo<'3'>;
    products_per_row_mobile: Schema.Attribute.Enumeration<['1', '2']> &
      Schema.Attribute.DefaultTo<'1'>;
    show_categories: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    show_price: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    show_specifications: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    subheadline: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
  };
}

export interface SectionServicesGrid extends Struct.ComponentSchema {
  collectionName: 'components_section_services_grids';
  info: {
    description: 'Grid display of B2B services';
    displayName: 'Services Grid';
  };
  attributes: {
    card_style: Schema.Attribute.Enumeration<
      ['minimal', 'detailed', 'image-focus']
    > &
      Schema.Attribute.DefaultTo<'detailed'>;
    enable_hover_effect: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    services: Schema.Attribute.Relation<'oneToMany', 'api::service.service'>;
    services_per_row_desktop: Schema.Attribute.Enumeration<['3', '4']> &
      Schema.Attribute.DefaultTo<'3'>;
    services_per_row_mobile: Schema.Attribute.Enumeration<['1', '2']> &
      Schema.Attribute.DefaultTo<'1'>;
    subheadline: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
  };
}

export interface SectionTestimonialsProof extends Struct.ComponentSchema {
  collectionName: 'components_section_testimonials_proofs';
  info: {
    description: 'Social proof testimonials section';
    displayName: 'Testimonials Proof';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    autoplay_delay: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10000;
          min: 2000;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5000>;
    display_style: Schema.Attribute.Enumeration<
      ['carousel', 'grid', 'masonry']
    > &
      Schema.Attribute.DefaultTo<'carousel'>;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    show_company_logos: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    show_ratings: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
  };
}

export interface SectionTrustBarEnhanced extends Struct.ComponentSchema {
  collectionName: 'components_section_trust_bar_enhanceds';
  info: {
    description: 'Enhanced trust bar with certifications and partnerships';
    displayName: 'Trust Bar Enhanced';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<
      ['white', 'earth', 'green-50']
    > &
      Schema.Attribute.DefaultTo<'white'>;
    certifications: Schema.Attribute.Relation<
      'oneToMany',
      'api::certification.certification'
    >;
    display_style: Schema.Attribute.Enumeration<
      ['logo-wall', 'carousel', 'grid']
    > &
      Schema.Attribute.DefaultTo<'logo-wall'>;
    enable_grayscale: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    layout_desktop: Schema.Attribute.Enumeration<
      ['single-row', 'two-rows', 'masonry']
    > &
      Schema.Attribute.DefaultTo<'single-row'>;
    layout_mobile: Schema.Attribute.Enumeration<['carousel', 'grid-2col']> &
      Schema.Attribute.DefaultTo<'carousel'>;
    logo_max_height: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 120;
          min: 30;
        },
        number
      > &
      Schema.Attribute.DefaultTo<60>;
  };
}

export interface SeoMetadata extends Struct.ComponentSchema {
  collectionName: 'components_seo_metadata';
  info: {
    description: 'SEO metadata component';
    displayName: 'SEO Metadata';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'index, follow'>;
    metaSocial: Schema.Attribute.Component<'seo.social-share', true>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SeoSocialShare extends Struct.ComponentSchema {
  collectionName: 'components_seo_social_shares';
  info: {
    description: 'Social media sharing metadata';
    displayName: 'Social Share';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    image: Schema.Attribute.Media<'images'>;
    socialNetwork: Schema.Attribute.Enumeration<['Facebook', 'Twitter']> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface ServiceCapability extends Struct.ComponentSchema {
  collectionName: 'components_service_capabilities';
  info: {
    description: 'Service capability metric';
    displayName: 'Service Capability';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    icon_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    metric_label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    metric_value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface ServiceProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_service_process_steps';
  info: {
    description: 'A step in the service process';
    displayName: 'Service Process Step';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    icon_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    illustration: Schema.Attribute.Media<'images'>;
    step_number: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: 'Reusable button component for CTAs';
    displayName: 'Button';
  };
  attributes: {
    icon_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    open_in_new_tab: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'outline', 'ghost', 'destructive']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: 'Reusable FAQ question and answer component';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    category: Schema.Attribute.Enumeration<
      ['general', 'product', 'service', 'shipping', 'other']
    > &
      Schema.Attribute.DefaultTo<'general'>;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: 'Internal or external link';
    displayName: 'Link';
  };
  attributes: {
    open_in_new_tab: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    description: 'Media reference component';
    displayName: 'Media';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.ceo-profile': AboutCeoProfile;
      'about.timeline-event': AboutTimelineEvent;
      'about.value': AboutValue;
      'contact.inquiry-type': ContactInquiryType;
      'hero.hotspot': HeroHotspot;
      'hero.stat': HeroStat;
      'hero.trust-indicator': HeroTrustIndicator;
      'product.packaging': ProductPackaging;
      'product.specification': ProductSpecification;
      'section.blog-insights': SectionBlogInsights;
      'section.cta-conversion': SectionCtaConversion;
      'section.factory-story': SectionFactoryStory;
      'section.faq-item': SectionFaqItem;
      'section.faq-seo': SectionFaqSeo;
      'section.hero-advanced': SectionHeroAdvanced;
      'section.products-showcase': SectionProductsShowcase;
      'section.services-grid': SectionServicesGrid;
      'section.testimonials-proof': SectionTestimonialsProof;
      'section.trust-bar-enhanced': SectionTrustBarEnhanced;
      'seo.metadata': SeoMetadata;
      'seo.social-share': SeoSocialShare;
      'service.capability': ServiceCapability;
      'service.process-step': ServiceProcessStep;
      'shared.button': SharedButton;
      'shared.faq-item': SharedFaqItem;
      'shared.link': SharedLink;
      'shared.media': SharedMedia;
    }
  }
}
