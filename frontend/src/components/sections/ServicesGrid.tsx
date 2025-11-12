'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStrapiImageUrl } from '@/lib/cms-client';
import type { SectionData } from '@/lib/validators/homepage';
import { CardWithHover } from '@/components/patterns/card-with-hover';

interface ServicesGridProps {
  data: Extract<SectionData, { __component: 'section.services-grid' }>;
  locale: string;
}

export function ServicesGrid({ data, locale }: ServicesGridProps) {
  const {
    headline,
    subheadline,
    services = [],
    services_per_row_desktop = '3',
    services_per_row_mobile = '1',
    card_style = 'detailed',
    enable_hover_effect = true,
  } = data;

  if (!services || services.length === 0) {
    return null;
  }

  const prefix = locale === 'en' ? '' : `/${locale}`;
  const gridCols = {
    '3': 'lg:grid-cols-3',
    '4': 'lg:grid-cols-4',
  }[services_per_row_desktop];

  const mobileCols = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-2',
  }[services_per_row_mobile];

  return (
    <section className="section-spacing bg-earth">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          {headline && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-green-800">
              {headline}
            </h2>
          )}
          {subheadline && (
            <p className="text-lg md:text-xl text-green-700 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </div>

        <div className={cn('grid gap-6 lg:gap-8', mobileCols, gridCols)}>
          {services.map((service: any, index: number) => {
            const imageUrl = service.featured_image?.data?.attributes?.url
              ? getStrapiImageUrl(service.featured_image)
              : null;

            const serviceUrl = service.cta_url || `${prefix}/services/${service.slug}`;

            const CardContent = (
              <>
                {imageUrl && card_style !== 'minimal' && (
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={service.title || 'Service image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}

                {service.icon_name && card_style === 'minimal' && (
                  <div className="text-4xl mb-4 text-green-600">
                    {/* Icon would be rendered here based on icon_name */}
                  </div>
                )}

                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-green-800">
                  {service.title}
                </h3>

                {service.excerpt && card_style !== 'minimal' && (
                  <p className="text-green-700 mb-4 line-clamp-3">
                    {service.excerpt}
                  </p>
                )}

                <Link
                  href={serviceUrl}
                  className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            );

            if (enable_hover_effect) {
              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CardWithHover>{CardContent}</CardWithHover>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={service.id || index}
                className="rounded-xl border border-green-200 bg-white p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {CardContent}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

