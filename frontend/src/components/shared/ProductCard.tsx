import Image from 'next/image';
import Link from 'next/link';
import { getStrapiImageUrl } from '@/lib/cms-client';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    name?: string;
    title?: string; // Support both name and title for backward compatibility
    short_description?: string;
    featured_image?: any;
    cupping_score?: number;
    processing_method?: string;
    category?: {
      data?: {
        attributes?: {
          name: string;
          slug: string;
        };
      };
    };
  };
  locale?: string;
  className?: string;
}

export function ProductCard({ product, locale = 'en', className }: ProductCardProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const productName = product.name || product.title || 'Product';
  const imageUrl = product.featured_image
    ? getStrapiImageUrl(product.featured_image)
    : null;
  const category = product.category?.data?.attributes;

  return (
    <Link
      href={`${prefix}/products/${product.slug}`}
      className={cn(
        "group block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {imageUrl && (
        <div className="relative aspect-square overflow-hidden bg-green-50">
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="p-6">
        {category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-2">
            {category.name}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors">
          {productName}
        </h3>
        
        {product.short_description && (
          <p className="text-green-700 text-sm mb-4 line-clamp-2">
            {product.short_description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {product.cupping_score && (
            <div className="flex items-center gap-2 text-green-700">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">{product.cupping_score}/100</span>
            </div>
          )}
          
          {product.processing_method && (
            <span className="text-xs text-green-600 capitalize">
              {product.processing_method}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

