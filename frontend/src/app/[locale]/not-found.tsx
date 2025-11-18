import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header locale="en" />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center bg-green-50">
        <div className="mb-8 text-6xl">🔍</div>

        <h1 className="mb-4 text-4xl font-bold text-green-800">
          Page Not Found
        </h1>

        <p className="mb-8 max-w-md text-lg text-green-700">
          Looks like this coffee bean got lost in the roasting process.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>

        <div className="mt-8">
          <p className="mb-4 text-sm font-semibold text-green-800">
            Popular Pages:
          </p>
          <nav className="flex flex-col gap-2">
            <Link
              href="/services"
              className="text-green-600 hover:text-green-700 hover:underline transition-colors"
            >
              Our Services
            </Link>
            <Link
              href="/resources"
              className="text-green-600 hover:text-green-700 hover:underline transition-colors"
            >
              Knowledge Hub
            </Link>
            <Link
              href="/about"
              className="text-green-600 hover:text-green-700 hover:underline transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-green-600 hover:text-green-700 hover:underline transition-colors"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
      <Footer locale="en" />
    </>
  );
}

