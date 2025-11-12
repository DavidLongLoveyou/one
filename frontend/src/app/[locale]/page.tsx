import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { getHomepage } from '@/lib/cms-client';
import { generateHomepageMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema } from '@/lib/seo/json-ld';
import type { HomepageData } from '@/lib/validators/homepage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  try {
    const data = await getHomepage(params.locale);
    return generateHomepageMetadata(data, params.locale);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'The Great Beans - Specialty Coffee from Vietnam',
      description: 'B2B Green Beans & OEM Services Since 2015',
    };
  }
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  let homepageData: HomepageData | null = null;
  let error = null;

  try {
    homepageData = await getHomepage(params.locale);
  } catch (err) {
    console.error('Error fetching homepage:', err);
    error = err;
    // Don't throw - show error state instead
  }

  // Generate Organization schema
  const organizationSchema = homepageData
    ? generateOrganizationSchema(homepageData)
    : null;

  return (
    <>
      <Header locale={params.locale} />
      <main className="min-h-screen">
        {error ? (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 text-green-800">
                Unable to load content
              </h1>
              <p className="text-green-700">
                Please check your connection and try again.
              </p>
            </div>
          </div>
        ) : homepageData ? (
          <>
            <SectionRenderer
              sections={homepageData.content_sections}
              locale={params.locale}
            />
            {organizationSchema && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(organizationSchema),
                }}
              />
            )}
          </>
        ) : (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 text-green-800">
                No content available
              </h1>
              <p className="text-green-700">
                Please configure your homepage in Strapi.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer locale={params.locale} homepageData={homepageData || undefined} />
    </>
  );
}

