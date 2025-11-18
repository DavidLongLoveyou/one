import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs, FAQSection, RichTextRenderer } from '@/components/shared';
import { getContactPage } from '@/lib/cms-client';
import { ContactForm } from './ContactForm';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  try {
    const contactPage = await getContactPage(params.locale);
    if (!contactPage) {
      return {
        title: 'Contact Us | The Great Beans',
      };
    }
    
    const pageData = contactPage.attributes || contactPage;
    
    return {
      title: pageData.seo?.metaTitle || 'Contact Us | Request a Quote | The Great Beans',
      description: pageData.seo?.metaDescription || 'Get in touch with Vietnam\'s leading coffee processor. Request samples, quotes, or visit our factory in Đà Lạt. Response within 24 hours.',
    };
  } catch (error) {
    console.error('Error generating contact page metadata:', error);
    return {
      title: 'Contact Us | The Great Beans',
    };
  }
}

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const contactPage = await getContactPage(params.locale);

  if (!contactPage) {
    notFound();
  }

  const prefix = params.locale === 'en' ? '' : `/${params.locale}`;
  
  // Handle Strapi data structure (with or without attributes)
  const pageData = contactPage.attributes || contactPage;

  return (
    <>
      <Header locale={params.locale} />
      <main className="min-h-screen">
        <Breadcrumbs
          items={[
            { label: 'Home', href: `${prefix}` },
            { label: 'Contact', href: `${prefix}/contact` },
          ]}
        />

        {/* Hero */}
        <section className="py-12 bg-green-50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-800 text-center mb-4">
              {pageData.headline || 'Get in Touch'}
            </h1>
            {pageData.subheadline && (
              <p className="text-xl text-green-700 text-center max-w-2xl mx-auto">
                {pageData.subheadline}
              </p>
            )}
          </div>
        </section>

        {/* Main Content - Two Column */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
              {/* Contact Info - 40% */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <MapPin className="h-6 w-6 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Factory Address</h3>
                  <div className="prose prose-green max-w-none text-green-700">
                    <RichTextRenderer content={pageData.factory_address} />
                  </div>
                </div>

                <div>
                  <Mail className="h-6 w-6 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Email</h3>
                  <div className="space-y-2 text-green-700">
                    <div>
                      <span className="font-medium">Sales: </span>
                      <a
                        href={`mailto:${pageData.email_sales}`}
                        className="text-green-600 hover:text-green-700 underline"
                      >
                        {pageData.email_sales}
                      </a>
                    </div>
                    {pageData.email_support && (
                      <div>
                        <span className="font-medium">Support: </span>
                        <a
                          href={`mailto:${pageData.email_support}`}
                          className="text-green-600 hover:text-green-700 underline"
                        >
                          {pageData.email_support}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Phone className="h-6 w-6 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Phone</h3>
                  <a
                    href={`tel:${pageData.phone_primary}`}
                    className="text-green-700 hover:text-green-600"
                  >
                    {pageData.phone_primary}
                  </a>
                </div>

                {pageData.business_hours && (
                  <div>
                    <Clock className="h-6 w-6 text-green-600 mb-3" />
                    <h3 className="text-xl font-bold text-green-800 mb-2">Business Hours</h3>
                    <p className="text-green-700 whitespace-pre-line">
                      {pageData.business_hours}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Form - 60% */}
              <div className="lg:col-span-3">
                <ContactForm
                  inquiryTypes={pageData.form_inquiry_types || []}
                  successMessage={pageData.success_message}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Google Maps */}
        {pageData.google_maps_embed_url && (
          <section className="py-16 bg-green-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
                  Find Us
                </h2>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={pageData.google_maps_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {pageData.contact_faq && pageData.contact_faq.length > 0 && (
          <FAQSection
            items={pageData.contact_faq}
            title="Quick Questions About Contacting Us"
          />
        )}
      </main>
      <Footer locale={params.locale} />
    </>
  );
}

export const revalidate = 3600;

