import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs, TableOfContents, ContentSectionsRenderer, SocialShare, ArticleCard } from '@/components/shared';
import { getKnowledgeAsset, getKnowledgeAssetsByCategory, getStrapiImageUrl } from '@/lib/cms-client';
import { generateKnowledgeAssetMetadata } from '@/lib/seo/metadata';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/json-ld';
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

// Extract TOC items from content_sections or use table_of_contents
function extractTOCItems(article: any): Array<{ level: number; text: string; id: string }> {
  // If table_of_contents exists, use it
  if (article.table_of_contents && Array.isArray(article.table_of_contents)) {
    return article.table_of_contents;
  }

  // Otherwise, extract from content_sections
  const tocItems: Array<{ level: number; text: string; id: string }> = [];
  
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const extractFromContent = (content: any) => {
    if (Array.isArray(content)) {
      content.forEach((block: any) => {
        if (block.type === 'heading') {
          const level = block.level || 2;
          const text = block.children?.map((child: any) => child.text).join(' ') || '';
          if (text && (level === 2 || level === 3)) {
            tocItems.push({
              level,
              text,
              id: generateSlug(text),
            });
          }
        }
        // Recursively check nested content
        if (block.children) {
          extractFromContent(block.children);
        }
      });
    }
  };

  // Check content_sections
  if (article.content_sections) {
    article.content_sections.forEach((section: any) => {
      if (section.content) {
        extractFromContent(section.content);
      }
      if (section.text) {
        extractFromContent(section.text);
      }
    });
  }

  // Fallback: check old content field
  if (article.content && !article.content_sections) {
    extractFromContent(article.content);
  }

  return tocItems;
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
  const categoryId = article.category?.data?.id;

  // Extract TOC items
  const tocItems = extractTOCItems(article);

  // Fetch related articles
  const relatedArticles = categoryId
    ? await getKnowledgeAssetsByCategory(category?.slug || '', params.locale, 4)
        .then(articles => articles.filter(a => a.id !== article.id).slice(0, 3))
    : [];

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

  // Use content_sections if available, fallback to content
  const contentSections = (article as any).content_sections || 
    (article.content ? [{ __component: 'section.text-block', content: article.content }] : []);

  return (
    <>
      <Header locale={params.locale} />
      <main className="min-h-screen">
        <Breadcrumbs
          items={[
            { label: 'Home', href: `${prefix}` },
            { label: 'Resources', href: `${prefix}/resources` },
            { label: article.title, href: `${prefix}/resources/${article.slug}` },
          ]}
        />

        <article className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  href={`${prefix}/resources`}
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Resources
                </Link>
              </div>

              {category && (
                <Link
                  href={`${prefix}/resources/category/${category.slug}`}
                  className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors mb-4"
                >
                  {category.name}
                </Link>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-green-700 mb-6 leading-relaxed max-w-3xl">
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

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content - 66% */}
              <div className="lg:col-span-2">
                <ContentSectionsRenderer sections={contentSections} />

                {/* Social Share */}
                <div className="mt-12 pt-8 border-t border-green-200">
                  <SocialShare
                    url={`${prefix}/resources/${article.slug}`}
                    title={article.title}
                    description={article.excerpt || ''}
                  />
                </div>

                {/* Author Bio Box */}
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
                        {(author as any).bio && (
                          <p className="text-green-700 text-sm">{(author as any).bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - 33% */}
              <aside className="lg:col-span-1">
                {tocItems.length > 0 && (
                  <div className="mb-8">
                    <TableOfContents items={tocItems} />
                  </div>
                )}

                {/* CTA Box */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-8">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-green-700 mb-4">
                    Have questions about our coffee processing services?
                  </p>
                  <Link
                    href={`${prefix}/contact`}
                    className="inline-block w-full text-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </aside>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-16 pt-12 border-t border-green-200">
                <h2 className="text-3xl font-bold text-green-800 mb-8">
                  Related Articles
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle: any) => (
                    <ArticleCard
                      key={relatedArticle.id}
                      article={relatedArticle}
                      locale={params.locale}
                    />
                  ))}
                </div>
              </section>
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

export const revalidate = 1800;
