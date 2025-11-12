'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStrapiImageUrl } from '@/lib/cms-client';
import type { SectionData } from '@/lib/validators/homepage';
import { CardWithHover } from '@/components/patterns/card-with-hover';

interface BlogInsightsProps {
  data: Extract<SectionData, { __component: 'section.blog-insights' }>;
  locale: string;
}

export function BlogInsights({ data, locale }: BlogInsightsProps) {
  const {
    headline,
    subheadline,
    knowledge_assets = [],
    max_posts = '3',
    layout = 'grid',
    show_author = true,
    show_read_time = true,
    show_excerpt = true,
  } = data;

  if (!knowledge_assets || knowledge_assets.length === 0) {
    return null;
  }

  const prefix = locale === 'en' ? '' : `/${locale}`;
  const postsToShow = knowledge_assets.slice(0, parseInt(max_posts));

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const ArticleCard = ({ post, index, featured = false }: { post: any; index: number; featured?: boolean }) => {
    const imageUrl = post.featured_image?.data?.attributes?.url
      ? getStrapiImageUrl(post.featured_image)
      : null;
    const author = post.author?.data?.attributes;
    const category = post.category?.data?.attributes;
    const articleUrl = `${prefix}/resources/${post.slug}`;

    return (
      <CardWithHover>
        <Link href={articleUrl} className="block">
          {imageUrl && (
            <div className={cn(
              'relative aspect-video rounded-lg overflow-hidden mb-4',
              featured && 'aspect-[16/9]'
            )}>
              <Image
                src={imageUrl}
                alt={post.title || 'Article image'}
                fill
                className="object-cover"
                sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
              />
            </div>
          )}

          {category && (
            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                {category.name}
              </span>
            </div>
          )}

          <h3 className={cn(
            'font-semibold mb-2 text-green-800',
            featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          )}>
            {post.title}
          </h3>

          {show_excerpt && post.excerpt && (
            <p className="text-green-700 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-green-600">
            {show_author && author && (
              <div className="flex items-center gap-2">
                {author.avatar?.data?.attributes?.url && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={getStrapiImageUrl(author.avatar)}
                      alt={author.name || 'Author'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span>{author.name}</span>
              </div>
            )}

            {post.published_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_date)}</span>
              </div>
            )}

            {show_read_time && post.read_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.read_time} min read</span>
              </div>
            )}
          </div>
        </Link>
      </CardWithHover>
    );
  };

  if (layout === 'featured-left') {
    const [featured, ...others] = postsToShow;

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

          <div className="grid lg:grid-cols-3 gap-8">
            {featured && (
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <ArticleCard post={featured} index={0} featured={true} />
              </motion.div>
            )}

            <div className="space-y-6">
              {others.map((post: any, index: number) => (
                <motion.div
                  key={post.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index + 1) * 0.1 }}
                >
                  <ArticleCard post={post} index={index + 1} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Grid layout
  const gridCols = 'md:grid-cols-2 lg:grid-cols-3';

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

        <div className={cn('grid gap-6 lg:gap-8', gridCols)}>
          {postsToShow.map((post: any, index: number) => (
            <motion.div
              key={post.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ArticleCard post={post} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

