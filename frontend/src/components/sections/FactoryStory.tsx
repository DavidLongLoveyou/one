'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getStrapiImageUrl } from '@/lib/cms-client';
import type { SectionData } from '@/lib/validators/homepage';
import { NumberTicker } from '@/components/reactbits/number-ticker';
import { CheckCircle } from 'lucide-react';

interface FactoryStoryProps {
  data: Extract<SectionData, { __component: 'section.factory-story' }>;
  locale: string;
}

export function FactoryStory({ data, locale }: FactoryStoryProps) {
  const {
    headline,
    story_text,
    image,
    image_position = 'left',
    key_stats = [],
    expertise_proofs = [],
    layout = 'split-60-40',
    enable_counter_animation = true,
  } = data;

  const imageUrl = image ? getStrapiImageUrl(image) : null;

  // Simple rich text renderer (basic implementation)
  const renderRichText = (content: any) => {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    if (Array.isArray(content)) {
      return content.map((block: any, index: number) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-4 text-green-700">
              {block.children?.map((child: any, i: number) => child.text).join(' ')}
            </p>
          );
        }
        return null;
      });
    }
    return null;
  };

  if (layout === 'split-60-40' || layout === 'split-50-50') {
    const contentCols = layout === 'split-60-40' ? 'lg:col-span-3' : 'lg:col-span-4';
    const imageCols = layout === 'split-60-40' ? 'lg:col-span-2' : 'lg:col-span-4';

    return (
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          {headline && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 text-green-800">
              {headline}
            </h2>
          )}

          <div
            className={cn(
              'grid lg:grid-cols-5 gap-8 lg:gap-12 items-center',
              image_position === 'right' && 'lg:flex-row-reverse'
            )}
          >
            {/* Content */}
            <div className={cn('space-y-6', image_position === 'left' ? contentCols : imageCols)}>
              <div className="prose prose-green max-w-none">
                {renderRichText(story_text)}
              </div>

              {/* Key Stats */}
              {key_stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                  {key_stats.map((stat: any, index: number) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-green-50 rounded-lg"
                    >
                      <div className="text-2xl md:text-3xl font-bold text-green-800 mb-1">
                        {enable_counter_animation ? (
                          <NumberTicker
                            value={stat.value}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                            direction="up"
                            delay={index * 0.1}
                          />
                        ) : (
                          <>
                            {stat.prefix}
                            {stat.value}
                            {stat.suffix}
                          </>
                        )}
                      </div>
                      <div className="text-sm text-green-700">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Expertise Proofs */}
              {expertise_proofs.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 pt-6">
                  {expertise_proofs.map((proof: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {proof.text}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image */}
            {imageUrl && (
              <div className={cn(image_position === 'left' ? imageCols : contentCols)}>
                <motion.div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={imageUrl}
                    alt={image.data?.attributes?.alternativeText || headline || 'Factory image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Full-width image layout
  return (
    <section className="section-spacing bg-white">
      <div className="container mx-auto px-4">
        {headline && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 text-green-800">
            {headline}
          </h2>
        )}

        {imageUrl && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg mb-8">
            <Image
              src={imageUrl}
              alt={image.data?.attributes?.alternativeText || headline || 'Factory image'}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <div className="prose prose-green max-w-none">
            {renderRichText(story_text)}
          </div>
        </div>
      </div>
    </section>
  );
}

