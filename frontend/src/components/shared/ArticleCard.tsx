import Image from 'next/image';
import Link from 'next/link';
import { getStrapiImageUrl } from '@/lib/cms-client';
import { Calendar, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    featured_image?: any;
    published_date?: string;
    read_time?: number;
    author?: {
      data?: {
        attributes?: {
          name: string;
          avatar?: any;
        };
      };
    };
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

export function ArticleCard({ article, locale = 'en', className }: ArticleCardProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const imageUrl = article.featured_image
    ? getStrapiImageUrl(article.featured_image)
    : null;
  const category = article.category?.data?.attributes;
  const author = article.author?.data?.attributes;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString(
        locale === 'vi' ? 'vi-VN' : 'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      );
    } catch {
      return '';
    }
  };

  return (
    <Link
      href={`${prefix}/resources/${article.slug}`}
      className={cn(
        "group block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden bg-green-50">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="p-6">
        {category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-3">
            {category.name}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-green-800 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        {article.excerpt && (
          <p className="text-green-700 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-green-600">
          {author && (
            <div className="flex items-center gap-2">
              {author.avatar && (
                <div className="relative w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src={getStrapiImageUrl(author.avatar)}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <User className="h-3 w-3" />
              <span>{author.name}</span>
            </div>
          )}
          
          {article.published_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.published_date)}</span>
            </div>
          )}
          
          {article.read_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.read_time} min</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

