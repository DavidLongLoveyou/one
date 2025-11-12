'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getStrapiImageUrl } from '@/lib/cms-client';
import type { SectionData } from '@/lib/validators/homepage';
import { Button } from '@/components/ui/button';

interface CtaConversionProps {
  data: Extract<SectionData, { __component: 'section.cta-conversion' }>;
  locale: string;
}

export function CtaConversion({ data, locale }: CtaConversionProps) {
  const {
    headline,
    subheadline,
    cta_button,
    secondary_cta,
    background_style = 'gradient',
    background_color_primary = '#059669',
    background_color_secondary = '#047857',
    background_image,
    text_color = 'white',
    layout = 'centered',
  } = data;

  const imageUrl = background_image ? getStrapiImageUrl(background_image) : null;
  const prefix = locale === 'en' ? '' : `/${locale}`;

  const textColorClass = text_color === 'white' ? 'text-white' : 'text-green-800';
  const bgStyle = background_style === 'gradient'
    ? `linear-gradient(135deg, ${background_color_primary} 0%, ${background_color_secondary} 100%)`
    : background_style === 'image' && imageUrl
    ? undefined
    : background_color_primary;

  if (layout === 'centered') {
    return (
      <section
        className="section-spacing relative overflow-hidden"
        style={{
          background: bgStyle,
        }}
      >
        {background_style === 'image' && imageUrl && (
          <>
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt="CTA background"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-bold mb-6',
                textColorClass
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {headline}
            </motion.h2>

            {subheadline && (
              <motion.p
                className={cn('text-lg md:text-xl mb-8', textColorClass)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {subheadline}
              </motion.p>
            )}

            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button
                asChild
                variant={cta_button.variant || 'primary'}
                size="lg"
                className={text_color === 'white' ? 'bg-white text-green-600 hover:bg-green-50' : ''}
              >
                <a
                  href={cta_button.url}
                  target={cta_button.open_in_new_tab ? '_blank' : undefined}
                  rel={cta_button.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {cta_button.text}
                </a>
              </Button>
              {secondary_cta && (
                <Button
                  asChild
                  variant={secondary_cta.variant || 'outline'}
                  size="lg"
                  className={text_color === 'white' ? 'border-white text-white hover:bg-white/10' : ''}
                >
                  <a
                    href={secondary_cta.url}
                    target={secondary_cta.open_in_new_tab ? '_blank' : undefined}
                    rel={secondary_cta.open_in_new_tab ? 'noopener noreferrer' : undefined}
                  >
                    {secondary_cta.text}
                  </a>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Split layout
  return (
    <section
      className="section-spacing relative overflow-hidden"
      style={{
        background: bgStyle,
      }}
    >
      {background_style === 'image' && imageUrl && (
        <>
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt="CTA background"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <motion.div
            className={textColorClass}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{headline}</h2>
            {subheadline && (
              <p className="text-lg mb-6">{subheadline}</p>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              variant={cta_button.variant || 'primary'}
              size="lg"
              className={text_color === 'white' ? 'bg-white text-green-600 hover:bg-green-50' : ''}
            >
              <a
                href={cta_button.url}
                target={cta_button.open_in_new_tab ? '_blank' : undefined}
                rel={cta_button.open_in_new_tab ? 'noopener noreferrer' : undefined}
              >
                {cta_button.text}
              </a>
            </Button>
            {secondary_cta && (
              <Button
                asChild
                variant={secondary_cta.variant || 'outline'}
                size="lg"
                className={text_color === 'white' ? 'border-white text-white hover:bg-white/10' : ''}
              >
                <a
                  href={secondary_cta.url}
                  target={secondary_cta.open_in_new_tab ? '_blank' : undefined}
                  rel={secondary_cta.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {secondary_cta.text}
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

