'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ResizableNavbar } from './ui/resizable-navbar';
import { StaggeredMenu } from './ui/staggered-menu';

interface HeaderProps {
  locale: string;
}

const navigationLinks = [
  { href: '/products', label: 'Products' },
  { href: '/services', label: 'Services' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header>
      {/* Desktop: Resizable Navbar */}
      <div className="hidden md:block">
        <ResizableNavbar
          locale={locale}
          links={navigationLinks}
          pathname={pathname || ''}
        />
      </div>

      {/* Mobile: Staggered Menu */}
      <div className="md:hidden">
        <div className="sticky top-0 z-50 w-full border-b border-green-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <Link
                href={locale === 'en' ? '/' : `/${locale}`}
                className="text-2xl font-serif font-bold text-green-600"
              >
                The Great Beans
              </Link>
              <StaggeredMenu locale={locale} links={navigationLinks} />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="hidden md:block h-20" />
    </header>
  );
}

