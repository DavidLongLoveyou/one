import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs, ArticleCard, FAQSection, RichTextRenderer } from '@/components/shared';
import { getCategory, getKnowledgeAssetsByCategory } from '@/lib/cms-client';
import { generateBreadcrumbSchema } from '@/lib/seo/json-ld';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const category = await getCategory(params.slug, params.locale);
    if (!category) {
      return {
        title: 'Category Not Found | The Great Beans',
      };
    }
    
    return {
      title: category.attributes?.seo?.metaTitle || `The Complete Guide to ${category.attributes?.name} | The Great Beans`,
      description: category.attributes?.meta_description || category.attributes?.description || `Comprehensive resources about ${category.attributes?.name}`,
    };
  } catch (error) {
    console.error('Error generating category metadata:', error);
    return {
      title: 'Category | The Great Beans',
    };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const category = await getCategory(params.slug, params.locale);

  if (!category) {
    notFound();
  }

  const prefix = params.locale === 'en' ? '' : `/${params.locale}`;
  
  // Handle Strapi data structure (with or without attributes)
  const categoryData = category.attributes || category;
  const articles = await getKnowledgeAssetsByCategory(params.slug, params.locale, 20);

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}` },
    { name: 'Resources', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/resources` },
    { name: categoryData.name, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/resources/category/${params.slug}` },
  ]);

  return (
    <>
      <Header locale={params.locale} />
      <main className="min-h-screen">
        <Breadcrumbs
          items={[
            { label: 'Home', href: `${prefix}` },
            { label: 'Resources', href: `${prefix}/resources` },
            { label: categoryData.name, href: `${prefix}/resources/category/${params.slug}` },
          ]}
        />

        {/* Category Header */}
        <section className="py-12 bg-green-50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-800 mb-6 text-center">
              The Ultimate Guide to {categoryData.name}
            </h1>
            {categoryData.pillar_page_content && (
              <div className="max-w-4xl mx-auto mt-8">
                <div className="prose prose-green max-w-none">
                  <RichTextRenderer content={categoryData.pillar_page_content} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Articles Grid */}
        {articles.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-green-800 mb-8">
                Articles in {categoryData.name}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: any) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    locale={params.locale}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category FAQ */}
        {categoryData.pillar_page_faq && categoryData.pillar_page_faq.length > 0 && (
          <FAQSection
            items={categoryData.pillar_page_faq}
            title={`Frequently Asked Questions About ${categoryData.name}`}
          />
        )}
      </main>
      <Footer locale={params.locale} />
      
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

export const revalidate = 1800;

