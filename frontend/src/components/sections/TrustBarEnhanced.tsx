'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getStrapiImageUrl } from '@/lib/cms-client';
import type { SectionData } from '@/lib/validators/homepage';

interface TrustBarEnhancedProps {
  data: Extract<SectionData, { __component: 'section.trust-bar-enhanced' }>;
  locale: string;
}

export function TrustBarEnhanced({ data, locale }: TrustBarEnhancedProps) {
  const {
    headline,
    display_style = 'logo-wall',
    layout_desktop = 'single-row',
    layout_mobile = 'carousel',
    certifications = [],
    background_color = 'white',
    logo_max_height = 60,
    enable_grayscale = true,
  } = data;

  if (!certifications || certifications.length === 0) {
    return null;
  }

  const bgColorClass = {
    white: 'bg-white',
    earth: 'bg-earth',
    'green-50': 'bg-green-50',
  }[background_color];

  return (
    <section className={cn('section-spacing', bgColorClass)}>
      <div className="container mx-auto px-4">
        {headline && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-green-800">
            {headline}
          </h2>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:block">
          {layout_desktop === 'single-row' && (
            <div className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap">
              {certifications.map((cert: any, index: number) => {
                const logoUrl = cert.logo?.data?.attributes?.url
                  ? getStrapiImageUrl({ data: { attributes: cert.logo.data.attributes } })
                  : null;
                
                if (!logoUrl) return null;

                return (
                  <motion.div
                    key={cert.id || index}
                    className={cn(
                      'flex items-center justify-center p-4 transition-all',
                      enable_grayscale && 'grayscale hover:grayscale-0 opacity-60 hover:opacity-100'
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Image
                      src={logoUrl}
                      alt={cert.name || 'Certification logo'}
                      width={logo_max_height * 2}
                      height={logo_max_height}
                      className="object-contain"
                      style={{ maxHeight: logo_max_height }}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          {layout_desktop === 'two-rows' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {certifications.map((cert: any, index: number) => {
                const logoUrl = cert.logo?.data?.attributes?.url
                  ? getStrapiImageUrl({ data: { attributes: cert.logo.data.attributes } })
                  : null;
                
                if (!logoUrl) return null;

                return (
                  <motion.div
                    key={cert.id || index}
                    className={cn(
                      'flex items-center justify-center p-4 transition-all',
                      enable_grayscale && 'grayscale hover:grayscale-0 opacity-60 hover:opacity-100'
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Image
                      src={logoUrl}
                      alt={cert.name || 'Certification logo'}
                      width={logo_max_height * 2}
                      height={logo_max_height}
                      className="object-contain"
                      style={{ maxHeight: logo_max_height }}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {layout_mobile === 'carousel' && (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {certifications.map((cert: any, index: number) => {
                const logoUrl = cert.logo?.data?.attributes?.url
                  ? getStrapiImageUrl({ data: { attributes: cert.logo.data.attributes } })
                  : null;
                
                if (!logoUrl) return null;

                return (
                  <div
                    key={cert.id || index}
                    className="flex-shrink-0 flex items-center justify-center p-4"
                  >
                    <Image
                      src={logoUrl}
                      alt={cert.name || 'Certification logo'}
                      width={logo_max_height * 2}
                      height={logo_max_height}
                      className="object-contain"
                      style={{ maxHeight: logo_max_height }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {layout_mobile === 'grid-2col' && (
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert: any, index: number) => {
                const logoUrl = cert.logo?.data?.attributes?.url
                  ? getStrapiImageUrl({ data: { attributes: cert.logo.data.attributes } })
                  : null;
                
                if (!logoUrl) return null;

                return (
                  <div
                    key={cert.id || index}
                    className="flex items-center justify-center p-4"
                  >
                    <Image
                      src={logoUrl}
                      alt={cert.name || 'Certification logo'}
                      width={logo_max_height * 2}
                      height={logo_max_height}
                      className="object-contain"
                      style={{ maxHeight: logo_max_height }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

