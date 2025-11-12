import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getKnowledgeAsset } from '@/lib/cms-client';
import { generateKnowledgeAssetMetadata } from '@/lib/seo/metadata';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/json-ld';
import { getStrapiImageUrl } from '@/lib/cms-client';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const article = await getKnowledgeAsset(params.slug, params.locale);
    if (!article) {
      return {
        title: 'Article Not Found | The Great Beans',
      };
    }
    return generateKnowledgeAssetMetadata(article, params.locale);
  } catch (error) {
    console.error('Error generating article metadata:', error);
    return {
      title: 'Article | The Great Beans',
    };
  }
}

export default async function KnowledgeAssetPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const article = await getKnowledgeAsset(params.slug, params.locale);

  if (!article) {
    notFound();
  }

  const prefix = params.locale === 'en' ? '' : `/${params.locale}`;
  const imageUrl = article.featured_image
    ? getStrapiImageUrl(article.featured_image)
    : null;
  const author = article.author?.data?.attributes;
  const category = article.category?.data?.attributes;

  // Generate schemas
  const articleSchema = generateArticleSchema(article, params.locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}` },
    { name: 'Resources', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/resources` },
    { name: article.title, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/resources/${article.slug}` },
  ]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString(
        params.locale === 'vi' ? 'vi-VN' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      );
    } catch {
      return '';
    }
  };

  // Render rich text
  const renderRichText = (content: any) => {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    if (Array.isArray(content)) {
      return content.map((block: any, index: number) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-4 text-green-700 leading-relaxed">
              {block.children?.map((child: any) => child.text).join(' ')}
            </p>
          );
        }
        if (block.type === 'heading') {
          const level = block.level || 2;
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag
              key={index}
              className={`mb-4 mt-8 font-bold text-green-800 ${
                level === 2 ? 'text-2xl' : level === 3 ? 'text-xl' : 'text-lg'
              }`}
            >
              {block.children?.map((child: any) => child.text).join(' ')}
            </HeadingTag>
          );
        }
        if (block.type === 'list') {
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag
              key={index}
              className={`mb-4 ml-6 ${
                block.format === 'ordered' ? 'list-decimal' : 'list-disc'
              }`}
            >
              {block.children?.map((item: any, itemIndex: number) => (
                <li key={itemIndex} className="mb-2 text-green-700">
                  {item.children?.map((child: any) => child.text).join(' ')}
                </li>
              ))}
            </ListTag>
          );
        }
        return null;
      });
    }
    return null;
  };

  return (
    <>
      <Header locale={params.locale} />
      <main className="min-h-screen">
        {/* Breadcrumbs */}
        <nav className="bg-green-50 py-4" aria-label="Breadcrumb">
          <div className="container mx-auto px-4">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href={`${prefix}`} className="text-green-600 hover:text-green-700">
                  Home
                </Link>
              </li>
              <li className="text-green-400">/</li>
              <li>
                <Link href={`${prefix}/resources`} className="text-green-600 hover:text-green-700">
                  Resources
                </Link>
              </li>
              <li className="text-green-400">/</li>
              <li className="text-green-800 font-medium" aria-current="page">
                {article.title}
              </li>
            </ol>
          </div>
        </nav>

        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href={`${prefix}/resources`}
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>

            {/* Header */}
            <header className="mb-8">
              {category && (
                <Link
                  href={`${prefix}/resources?category=${category.slug}`}
                  className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors mb-4"
                >
                  {category.name}
                </Link>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-green-700 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-green-600 pb-6 border-b border-green-200">
                {author && (
                  <div className="flex items-center gap-2">
                    {author.avatar?.data?.attributes?.url && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={getStrapiImageUrl(author.avatar)}
                          alt={author.name || 'Author'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-green-800">{author.name}</div>
                      {author.title && (
                        <div className="text-xs text-green-600">{author.title}</div>
                      )}
                    </div>
                  </div>
                )}

                {article.published_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.published_date)}</span>
                  </div>
                )}

                {article.read_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{article.read_time} min read</span>
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {imageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-12">
                <Image
                  src={imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 768px"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-green max-w-none">
              {renderRichText(article.content)}
            </div>

            {/* Author Card */}
            {author && (
              <div className="mt-12 p-6 bg-green-50 rounded-xl">
                <div className="flex items-start gap-4">
                  {author.avatar?.data?.attributes?.url && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={getStrapiImageUrl(author.avatar)}
                        alt={author.name || 'Author'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-1">
                      {author.name}
                    </h3>
                    {author.title && (
                      <p className="text-green-600 mb-2">{author.title}</p>
                    )}
                    {author.bio && (
                      <p className="text-green-700 text-sm">{author.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </main>
      <Footer locale={params.locale} />
    </>
  );
}

