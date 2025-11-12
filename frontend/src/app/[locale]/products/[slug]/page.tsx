import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getProduct } from '@/lib/cms-client';
import { generateProductMetadata } from '@/lib/seo/metadata';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/json-ld';
import { getStrapiImageUrl } from '@/lib/cms-client';
import { Award, MapPin, Package } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const product = await getProduct(params.slug, params.locale);
    if (!product) {
      return {
        title: 'Product Not Found | The Great Beans',
      };
    }
    return generateProductMetadata(product, params.locale);
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Product | The Great Beans',
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const product = await getProduct(params.slug, params.locale);

  if (!product) {
    notFound();
  }

  const prefix = params.locale === 'en' ? '' : `/${params.locale}`;
  const imageUrl = product.featured_image
    ? getStrapiImageUrl(product.featured_image)
    : null;
  const category = product.category?.data?.attributes;

  // Generate schemas
  const productSchema = generateProductSchema(product, params.locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}` },
    { name: 'Products', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/products` },
    { name: product.title, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/products/${product.slug}` },
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
                <Link href={`${prefix}/products`} className="text-green-600 hover:text-green-700">
                  Products
                </Link>
              </li>
              <li className="text-green-400">/</li>
              <li className="text-green-800 font-medium" aria-current="page">
                {product.title}
              </li>
            </ol>
          </div>
        </nav>

        <article className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {imageUrl && (
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}

              {product.gallery?.data && product.gallery.data.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.gallery.data.slice(0, 4).map((img: any, index: number) => {
                    const galleryUrl = getStrapiImageUrl({ data: { attributes: img.attributes } });
                    return (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={galleryUrl}
                          alt={`${product.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 25vw, 12.5vw"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {category && (
                <div>
                  <Link
                    href={`${prefix}/products?category=${category.slug}`}
                    className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-green-800">
                {product.title}
              </h1>

              {/* Specifications */}
              <div className="space-y-4 p-6 bg-green-50 rounded-xl">
                {product.cupping_score && (
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-green-800">Cupping Score</div>
                      <div className="text-green-700">{product.cupping_score}/100</div>
                    </div>
                  </div>
                )}

                {product.altitude && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-green-800">Altitude</div>
                      <div className="text-green-700">{product.altitude}</div>
                    </div>
                  </div>
                )}

                {product.processing_method && (
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-green-800">Processing Method</div>
                      <div className="text-green-700">{product.processing_method}</div>
                    </div>
                  </div>
                )}

                {product.price_range && (
                  <div className="pt-4 border-t border-green-200">
                    <div className="text-2xl font-bold text-green-800">
                      {product.price_range}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Link
                  href={`${prefix}/contact`}
                  className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-800">
              About This Coffee
            </h2>
            <div className="prose prose-green max-w-none">
              {renderRichText(product.description)}
            </div>
          </div>
        </article>

        {/* Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
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

