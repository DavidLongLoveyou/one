'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStrapiImageUrl } from '@/lib/cms-client';
import type { SectionData } from '@/lib/validators/homepage';
import { InfiniteMovingCards } from '@/components/patterns/infinite-moving-cards';
import { CardWithHover } from '@/components/patterns/card-with-hover';

interface TestimonialsProofProps {
  data: Extract<SectionData, { __component: 'section.testimonials-proof' }>;
  locale: string;
}

export function TestimonialsProof({ data, locale }: TestimonialsProofProps) {
  const {
    headline,
    testimonials = [],
    display_style = 'carousel',
    show_company_logos = true,
    show_ratings = true,
    autoplay = true,
    autoplay_delay = 5000,
  } = data;

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
        )}
      />
    ));
  };

  const TestimonialCard = ({ testimonial, index }: { testimonial: any; index: number }) => {
    const avatarUrl = testimonial.reviewer_avatar?.data?.attributes?.url
      ? getStrapiImageUrl(testimonial.reviewer_avatar)
      : null;
    const companyLogoUrl = testimonial.company_logo?.data?.attributes?.url
      ? getStrapiImageUrl(testimonial.company_logo)
      : null;

    return (
      <div className="w-[350px] md:w-[400px] flex-shrink-0">
        <CardWithHover className="h-full">
          <div className="space-y-4">
            {show_ratings && testimonial.rating && (
              <div className="flex gap-1">
                {renderStars(testimonial.rating)}
              </div>
            )}

            <blockquote className="text-green-800 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-4 pt-4 border-t border-green-200">
              {avatarUrl && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={avatarUrl}
                    alt={testimonial.reviewer_name || 'Reviewer'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-green-800">
                  {testimonial.reviewer_name}
                </div>
                {testimonial.reviewer_title && (
                  <div className="text-sm text-green-700">
                    {testimonial.reviewer_title}
                  </div>
                )}
                {testimonial.reviewer_company && (
                  <div className="text-sm text-green-600">
                    {testimonial.reviewer_company}
                  </div>
                )}
              </div>

              {show_company_logos && companyLogoUrl && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={companyLogoUrl}
                    alt={testimonial.reviewer_company || 'Company logo'}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </CardWithHover>
      </div>
    );
  };

  if (display_style === 'carousel') {
    const testimonialCards = testimonials.map((testimonial: any, index: number) => (
      <TestimonialCard key={testimonial.id || index} testimonial={testimonial} index={index} />
    ));

    return (
      <section className="section-spacing bg-green-50">
        <div className="container mx-auto px-4">
          {headline && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 text-green-800">
              {headline}
            </h2>
          )}

          <InfiniteMovingCards
            items={testimonialCards}
            direction="left"
            speed="normal"
            pauseOnHover={true}
          />
        </div>
      </section>
    );
  }

  // Grid layout
  const gridCols = display_style === 'masonry' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="section-spacing bg-green-50">
      <div className="container mx-auto px-4">
        {headline && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 text-green-800">
            {headline}
          </h2>
        )}

        <div className={cn('grid gap-6 lg:gap-8', gridCols)}>
          {testimonials.map((testimonial: any, index: number) => (
            <motion.div
              key={testimonial.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TestimonialCard testimonial={testimonial} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

