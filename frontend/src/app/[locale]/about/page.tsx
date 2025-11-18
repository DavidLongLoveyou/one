import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/shared';
import { RichTextRenderer } from '@/components/shared';
import { getAboutPage, getStrapiImageUrl } from '@/lib/cms-client';
import { Award, Factory, Target, Heart, Lightbulb, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  try {
    const aboutPage = await getAboutPage(params.locale);
    if (!aboutPage) {
      return {
        title: 'About Us | The Great Beans',
      };
    }
    
    const pageData = aboutPage.attributes || aboutPage;
    
    return {
      title: pageData.seo?.metaTitle || 'About Us | Vietnam\'s Premier Coffee Processor | The Great Beans',
      description: pageData.seo?.metaDescription || 'From a 10-hectare farm to Vietnam\'s leading B2B coffee processor. Led by Q Processing Professional certified expert. ISO 22000 facility. 120T+ annual capacity.',
    };
  } catch (error) {
    console.error('Error generating about page metadata:', error);
    return {
      title: 'About Us | The Great Beans',
    };
  }
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const aboutPage = await getAboutPage(params.locale);

  if (!aboutPage) {
    notFound();
  }

  const prefix = params.locale === 'en' ? '' : `/${params.locale}`;
  
  // Handle Strapi data structure (with or without attributes)
  const pageData = aboutPage.attributes || aboutPage;
  
  const heroImageUrl = pageData.hero_image
    ? getStrapiImageUrl(pageData.hero_image)
    : null;
  const ceoPhotoUrl = pageData.ceo_section?.photo
    ? getStrapiImageUrl(pageData.ceo_section.photo)
    : null;

  // Icon mapping for core values
  const iconMap: Record<string, any> = {
    quality: Award,
    sustainability: Heart,
    innovation: Lightbulb,
    trust: Shield,
    default: Target,
  };

  const getIcon = (iconName: string | undefined) => {
    if (!iconName) return iconMap.default;
    const Icon = iconMap[iconName.toLowerCase()] || iconMap.default;
    return Icon;
  };

  return (
    <>
      <Header locale={params.locale} />
      <main className="min-h-screen">
        <Breadcrumbs
          items={[
            { label: 'Home', href: `${prefix}` },
            { label: 'About Us', href: `${prefix}/about` },
          ]}
        />

        {/* Hero Section */}
        <section className="relative py-20 bg-green-50">
          {heroImageUrl && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={heroImageUrl}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-green-800 text-center mb-6">
              {pageData.hero_headline || 'About The Great Beans'}
            </h1>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="p-8 bg-green-50 rounded-xl">
                <Target className="h-12 w-12 text-green-600 mb-4" />
                <h2 className="text-3xl font-bold text-green-800 mb-4">Our Mission</h2>
                <p className="text-lg text-green-700 leading-relaxed">
                  {pageData.mission_statement}
                </p>
              </div>
              <div className="p-8 bg-green-50 rounded-xl">
                <Lightbulb className="h-12 w-12 text-green-600 mb-4" />
                <h2 className="text-3xl font-bold text-green-800 mb-4">Our Vision</h2>
                <p className="text-lg text-green-700 leading-relaxed">
                  {pageData.vision_statement}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        {pageData.timeline_events && pageData.timeline_events.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-serif font-bold text-green-800 text-center mb-12">
                Our Journey
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200 hidden md:block" />
                  
                  <div className="space-y-12">
                    {pageData.timeline_events.map((event: any, index: number) => {
                      const eventImageUrl = event.image
                        ? getStrapiImageUrl(event.image)
                        : null;
                      const Icon = getIcon(event.icon_name);
                      
                      return (
                        <div key={index} className="relative flex gap-8">
                          {/* Year badge */}
                          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg z-10">
                            {event.year}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 pb-12">
                            <h3 className="text-2xl font-bold text-green-800 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-green-700 leading-relaxed">
                              {event.description}
                            </p>
                            {eventImageUrl && (
                              <div className="mt-4 relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src={eventImageUrl}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CEO Profile */}
        {pageData.ceo_section && (
          <section className="py-16 bg-green-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-serif font-bold text-green-800 text-center mb-12">
                  Meet Our Expert
                </h2>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-8">
                    {ceoPhotoUrl && (
                      <div className="flex-shrink-0">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto md:mx-0">
                          <Image
                            src={ceoPhotoUrl}
                            alt={pageData.ceo_section.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-green-800 mb-2">
                        {pageData.ceo_section.name}
                      </h3>
                      <p className="text-xl text-green-600 mb-4">
                        {pageData.ceo_section.title}
                      </p>
                      <div className="prose prose-green max-w-none mb-4">
                        <RichTextRenderer content={pageData.ceo_section.bio} />
                      </div>
                      {pageData.ceo_section.quote && (
                        <blockquote className="border-l-4 border-green-600 pl-4 italic text-green-700 text-lg">
                          &ldquo;{pageData.ceo_section.quote}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Core Values */}
        {pageData.core_values && pageData.core_values.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-serif font-bold text-green-800 text-center mb-12">
                Our Core Values
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {pageData.core_values.map((value: any, index: number) => {
                  const Icon = getIcon(value.icon_name);
                  return (
                    <div key={index} className="text-center p-6 bg-green-50 rounded-xl">
                      <Icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-green-700">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Factory Tour CTA */}
        {pageData.factory_tour_cta && (
          <section className="py-16 bg-green-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <Factory className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-4xl font-serif font-bold mb-4">
                See Where the Magic Happens
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Schedule a visit to our state-of-the-art processing facility in Đà Lạt
              </p>
              <Link
                href={pageData.factory_tour_cta.url || `${prefix}/contact`}
                className="inline-block px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
              >
                {pageData.factory_tour_cta.text || 'Schedule a Factory Visit'}
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer locale={params.locale} />
    </>
  );
}

export const revalidate = 3600;

