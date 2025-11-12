'use client';

import type { SectionData } from '@/lib/validators/homepage';
import { HeroAdvanced } from './HeroAdvanced';
import { TrustBarEnhanced } from './TrustBarEnhanced';
import { ServicesGrid } from './ServicesGrid';
import { FactoryStory } from './FactoryStory';
import { ProductsShowcase } from './ProductsShowcase';
import { TestimonialsProof } from './TestimonialsProof';
import { BlogInsights } from './BlogInsights';
import { FaqSeo } from './FaqSeo';
import { CtaConversion } from './CtaConversion';

interface SectionRendererProps {
  sections: SectionData[];
  locale: string;
}

export function SectionRenderer({ sections, locale }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => {
        try {
          switch (section.__component) {
            case 'section.hero-advanced':
              return (
                <HeroAdvanced
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            case 'section.trust-bar-enhanced':
              return (
                <TrustBarEnhanced
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            case 'section.services-grid':
              return (
                <ServicesGrid
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            case 'section.factory-story':
              return (
                <FactoryStory
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            case 'section.products-showcase':
              return (
                <ProductsShowcase
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            case 'section.testimonials-proof':
              return (
                <TestimonialsProof
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            case 'section.blog-insights':
              return (
                <BlogInsights
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            case 'section.faq-seo':
              return (
                <FaqSeo
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            case 'section.cta-conversion':
              return (
                <CtaConversion
                  key={`section-${index}`}
                  data={section}
                  locale={locale}
                />
              );

            default:
              console.warn(`Unknown section type: ${(section as any).__component}`);
              return null;
          }
        } catch (error) {
          console.error(`Error rendering section ${index}:`, error);
          return null;
        }
      })}
    </>
  );
}

