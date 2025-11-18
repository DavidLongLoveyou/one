import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs, ProductTabs, ProductCard } from '@/components/shared';
import { getProduct, getRelatedProducts, getStrapiImageUrl } from '@/lib/cms-client';
import { generateProductMetadata } from '@/lib/seo/metadata';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/json-ld';
import { Award, MapPin, Package, Download } from 'lucide-react';
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
  
  // Support both old (title) and new (name) field names
  const productName = (product as any).name || product.title || 'Product';
  const shortDescription = (product as any).short_description;
  
  const imageUrl = product.featured_image
    ? getStrapiImageUrl(product.featured_image)
    : null;
  const category = product.category?.data?.attributes;
  const categoryId = product.category?.data?.id;

  // Fetch related products
  const relatedProducts = categoryId
    ? await getRelatedProducts(categoryId, product.id, params.locale, 4)
    : [];

  // Generate schemas
  const productSchema = generateProductSchema(product, params.locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}` },
    { name: 'Products', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/products` },
    { name: productName, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${prefix}/products/${product.slug}` },
  ]);

  // Get certifications if available
  const certifications = (product as any).certifications?.data || [];

  return (
    <>
      <Header locale={params.locale} />
      <main className="min-h-screen">
        <Breadcrumbs
          items={[
            { label: 'Home', href: `${prefix}` },
            { label: 'Products', href: `${prefix}/products` },
            { label: productName, href: `${prefix}/products/${product.slug}` },
          ]}
        />

        <article className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {imageUrl && (
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={imageUrl}
                    alt={productName}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}

              {product.gallery?.data && product.gallery.data.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.gallery.data.slice(0, 8).map((img: any, index: number) => {
                    const galleryUrl = getStrapiImageUrl({ data: { attributes: img.attributes } });
                    return (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={galleryUrl}
                          alt={`${productName} - Image ${index + 1}`}
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
                {productName}
              </h1>

              {shortDescription && (
                <p className="text-lg text-green-700 leading-relaxed">
                  {shortDescription}
                </p>
              )}

              {/* Key Specs Badges */}
              <div className="flex flex-wrap gap-3">
                {product.cupping_score && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Score: {product.cupping_score}/100
                    </span>
                  </div>
                )}

                {product.processing_method && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                    <Package className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800 capitalize">
                      {product.processing_method}
                    </span>
                  </div>
                )}

                {(product as any).origin_region && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {(product as any).origin_region}
                    </span>
                  </div>
                )}
              </div>

              {/* Certifications */}
              {certifications.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-2">Certifications:</p>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert: any, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                      >
                        {cert.attributes?.name || cert.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  href={`${prefix}/contact`}
                  className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Request Sample
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                  <Download className="h-5 w-5" />
                  Download Spec PDF
                </button>
              </div>

              {(product as any).price_range && (
                <div className="pt-4 border-t border-green-200">
                  <p className="text-sm text-green-600 mb-1">Pricing</p>
                  <p className="text-2xl font-bold text-green-800">
                    {(product as any).price_range}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="max-w-4xl mx-auto mb-16">
            <ProductTabs product={product} />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold text-green-800 mb-8">
                Similar Coffee Origins
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct: any) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    locale={params.locale}
                  />
                ))}
              </div>
            </section>
          )}
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

export const revalidate = 3600;
