import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getService } from '@/lib/cms-client';
import { generateServiceMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema } from '@/lib/seo/json-ld';
import { getStrapiImageUrl } from '@/lib/cms-client';
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
  const imageUrl = service.featured_image
    ? getStrapiImageUrl(service.featured_image)
    : null;

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}` },
    { name: 'Services', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/services` },
    { name: service.title, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/services/${service.slug}` },
  ]);

  // Render rich text
  const renderRichText = (content: any) => {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    if (Array.isArray(content)) {
      return content.map((block: any, index: number) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-4 text-green-700">
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
              className={`mb-4 font-bold text-green-800 ${
                level === 2 ? 'text-2xl' : level === 3 ? 'text-xl' : 'text-lg'
              }`}
            >
              {block.children?.map((child: any) => child.text).join(' ')}
            </HeadingTag>
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
                <Link href={`${prefix}/services`} className="text-green-600 hover:text-green-700">
                  Services
                </Link>
              </li>
              <li className="text-green-400">/</li>
              <li className="text-green-800 font-medium" aria-current="page">
                {service.title}
              </li>
            </ol>
          </div>
        </nav>

        <article className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              {service.excerpt && (
                <p className="text-xl text-green-700 mb-6">{service.excerpt}</p>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
                {service.title}
              </h1>
            </div>

            {/* Featured Image */}
            {imageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-12">
                <Image
                  src={imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-green max-w-none">
              {renderRichText(service.description)}
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 bg-green-50 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-800">
                Ready to Get Started?
              </h2>
              <p className="text-green-700 mb-6">
                Contact us to learn more about our {service.title} services.
              </p>
              <Link
                href={`${prefix}/contact`}
                className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </article>

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </main>
      <Footer locale={params.locale} />
    </>
  );
}

