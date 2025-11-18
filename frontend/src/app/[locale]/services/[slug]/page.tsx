import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs, ProcessTimeline, CapabilitiesGrid, FAQSection, RichTextRenderer, ProductCard } from '@/components/shared';
import { getService, getStrapiImageUrl } from '@/lib/cms-client';
import { generateServiceMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateHowToSchema, generateFAQPageSchema } from '@/lib/seo/json-ld';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const service = await getService(params.slug, params.locale);
    if (!service) {
      return {
        title: 'Service Not Found | The Great Beans',
      };
    }
    return generateServiceMetadata(service, params.locale);
  } catch (error) {
    console.error('Error generating service metadata:', error);
    return {
      title: 'Service | The Great Beans',
    };
  }
}

export default async function ServicePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const service = await getService(params.slug, params.locale);

  if (!service) {
    notFound();
  }

  const prefix = params.locale === 'en' ? '' : `/${params.locale}`;
  
  // Support both old (title) and new (name) field names
  const serviceName = (service as any).name || service.title || 'Service';
  const tagline = (service as any).tagline;
  const overview = (service as any).overview || service.description;
  const heroImage = (service as any).hero_image || service.featured_image;
  const processSteps = (service as any).process_steps || [];
  const capabilities = (service as any).capabilities || [];
  const faqItems = (service as any).faq_items || [];
  const caseStudies = (service as any).case_studies?.data || [];
  const relatedProducts = (service as any).related_products?.data || [];
  const primaryCTA = (service as any).primary_cta;

  const imageUrl = heroImage
    ? getStrapiImageUrl(heroImage)
    : null;

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}` },
    { name: 'Services', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/services` },
    { name: serviceName, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/services/${service.slug}` },
  ]);

  const howToSchema = processSteps.length > 0
    ? generateHowToSchema(serviceName, processSteps)
    : null;

  const faqSchema = faqItems.length > 0
    ? generateFAQPageSchema(faqItems.map((item: any) => ({
        question: item.question,
        answer: item.answer,
      })))
    : null;

  return (
    <>
      <Header locale={params.locale} />
      <main className="min-h-screen">
        <Breadcrumbs
          items={[
            { label: 'Home', href: `${prefix}` },
            { label: 'Services', href: `${prefix}/services` },
            { label: serviceName, href: `${prefix}/services/${service.slug}` },
          ]}
        />

        {/* Hero Section */}
        <section className="relative py-20 bg-green-50">
          {imageUrl && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={imageUrl}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-green-800 text-center mb-4">
              {serviceName}
            </h1>
            {tagline && (
              <p className="text-xl text-green-700 text-center max-w-3xl mx-auto">
                {tagline}
              </p>
            )}
            {primaryCTA && (
              <div className="text-center mt-8">
                <Link
                  href={primaryCTA.url || `${prefix}/contact`}
                  className="inline-block px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  {primaryCTA.text || 'Request a Quote'}
                </Link>
              </div>
            )}
          </div>
        </section>

        <article className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Overview Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-green-800 mb-6">What We Do</h2>
              <div className="prose prose-green max-w-none">
                <RichTextRenderer content={overview} />
              </div>
            </section>

            {/* Process Timeline */}
            {processSteps.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Our Process</h2>
                <ProcessTimeline steps={processSteps} />
              </section>
            )}

            {/* Capabilities Grid */}
            {capabilities.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Our Capabilities</h2>
                <CapabilitiesGrid capabilities={capabilities} />
              </section>
            )}

            {/* Case Studies / Social Proof */}
            {caseStudies.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Client Success Stories</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {caseStudies.slice(0, 2).map((testimonial: any, index: number) => {
                    const testimonialData = testimonial.attributes || testimonial;
                    return (
                      <div key={index} className="p-6 bg-green-50 rounded-xl border border-green-200">
                        {testimonialData.quote && (
                          <blockquote className="text-green-800 mb-4 italic">
                            &ldquo;{testimonialData.quote}&rdquo;
                          </blockquote>
                        )}
                        {testimonialData.company && (
                          <p className="text-sm font-semibold text-green-700">
                            — {testimonialData.company}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {faqItems.length > 0 && (
              <FAQSection
                items={faqItems}
                title="Frequently Asked Questions"
              />
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-3xl font-bold text-green-800 mb-8">
                  Related Products
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={params.locale}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Final CTA */}
            <section className="mt-16 p-12 bg-green-600 text-white rounded-xl text-center">
              <h2 className="text-4xl font-serif font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Contact us to learn more about our {serviceName} services and how we can help your business.
              </p>
              <Link
                href={primaryCTA?.url || `${prefix}/contact`}
                className="inline-block px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
              >
                {primaryCTA?.text || 'Request a Quote'}
              </Link>
            </section>
          </div>
        </article>

        {/* Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {howToSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
          />
        )}
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
      </main>
      <Footer locale={params.locale} />
    </>
  );
}

export const revalidate = 3600;
