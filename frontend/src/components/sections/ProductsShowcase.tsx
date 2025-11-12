'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStrapiImageUrl } from '@/lib/cms-client';
import type { SectionData } from '@/lib/validators/homepage';
import { CardWithHover } from '@/components/patterns/card-with-hover';

interface ProductsShowcaseProps {
  data: Extract<SectionData, { __component: 'section.products-showcase' }>;
  locale: string;
}

export function ProductsShowcase({ data, locale }: ProductsShowcaseProps) {
  const {
    headline,
    subheadline,
    products = [],
    products_per_row_desktop = '3',
    products_per_row_mobile = '1',
    show_specifications = true,
    show_price = false,
    show_categories = true,
    card_layout = 'image-top',
    enable_quick_view = false,
  } = data;

  if (!products || products.length === 0) {
    return null;
  }

  const prefix = locale === 'en' ? '' : `/${locale}`;
  const gridCols = {
    '3': 'lg:grid-cols-3',
    '4': 'lg:grid-cols-4',
  }[products_per_row_desktop];

  const mobileCols = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-2',
  }[products_per_row_mobile];

  return (
    <section className="section-spacing bg-white">
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
          {products.map((product: any, index: number) => {
            const imageUrl = product.featured_image?.data?.attributes?.url
              ? getStrapiImageUrl(product.featured_image)
              : null;

            const productUrl = `${prefix}/products/${product.slug}`;
            const category = product.category?.data?.attributes;

            const CardContent = (
              <>
                {imageUrl && card_layout !== 'overlay' && (
                  <div className={cn(
                    'relative aspect-[4/3] rounded-lg overflow-hidden mb-4',
                    card_layout === 'image-left' && 'md:float-left md:mr-4 md:mb-0 md:w-1/3'
                  )}>
                    <Image
                      src={imageUrl}
                      alt={product.title || 'Product image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}

                {show_categories && category && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                      {category.name}
                    </span>
                  </div>
                )}

                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-green-800">
                  {product.title}
                </h3>

                {product.description && (
                  <p className="text-green-700 mb-4 line-clamp-2">
                    {typeof product.description === 'string'
                      ? product.description.replace(/<[^>]*>/g, '').substring(0, 150)
                      : ''}
                  </p>
                )}

                {show_specifications && product.specifications && (
                  <div className="space-y-2 mb-4 text-sm">
                    {product.cupping_score && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">
                          Cupping Score: {product.cupping_score}
                        </span>
                      </div>
                    )}
                    {product.altitude && (
                      <div className="text-green-700">
                        Altitude: {product.altitude}
                      </div>
                    )}
                    {product.processing_method && (
                      <div className="text-green-700">
                        Processing: {product.processing_method}
                      </div>
                    )}
                  </div>
                )}

                {show_price && product.price_range && (
                  <div className="text-lg font-semibold text-green-800 mb-4">
                    {product.price_range}
                  </div>
                )}

                <Link
                  href={productUrl}
                  className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
                >
                  View details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            );

            return (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CardWithHover>{CardContent}</CardWithHover>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

