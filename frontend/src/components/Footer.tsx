import Link from 'next/link';
import { generateOrganizationSchema } from '@/lib/seo/json-ld';
import type { HomepageData } from '@/lib/validators/homepage';

interface FooterProps {
  locale: string;
  homepageData?: HomepageData;
}

export function Footer({ locale, homepageData }: FooterProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const currentYear = new Date().getFullYear();

  // Generate Organization schema for footer
  const organizationSchema = homepageData
    ? generateOrganizationSchema(homepageData)
    : null;

  return (
    <footer className="border-t border-green-200 bg-forest text-white" itemScope itemType="https://schema.org/Organization">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4" itemProp="name">
              The Great Beans
            </h3>
            <p className="text-sm text-green-100 mb-4" itemProp="description">
              Specialty Coffee from Vietnam&apos;s Highlands
            </p>
            <div className="text-sm text-green-100" itemScope itemType="https://schema.org/PostalAddress">
              <p itemProp="addressLocality">Da Lat</p>
              <p itemProp="addressRegion">Lam Dong</p>
              <p itemProp="addressCountry">Vietnam</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>
                <Link
                  href={`${prefix}/products`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  Coffee Origins
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/products`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  Green Beans
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/products`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>
                <Link
                  href={`${prefix}/about`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/contact`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/services`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  Our Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>
                <Link
                  href={`${prefix}/resources`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  Blog & Insights
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/resources`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  Knowledge Base
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-green-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-green-100">
            <p>&copy; {currentYear} The Great Beans. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href={`${prefix}/privacy`}
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                Privacy Policy
              </Link>
              <Link
                href={`${prefix}/terms`}
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Schema */}
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      )}
    </footer>
  );
}

