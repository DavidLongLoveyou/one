'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResizableNavbarProps {
  locale: string;
  links: Array<{ href: string; label: string }>;
  pathname: string;
}

export function ResizableNavbar({
  locale,
  links,
  pathname,
}: ResizableNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const prefix = locale === 'en' ? '' : `/${locale}`;

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'h-16 bg-white/95 backdrop-blur-md shadow-md border-b border-green-200'
          : 'h-20 bg-white/80 backdrop-blur-sm'
      )}
      initial={false}
      animate={{
        height: isScrolled ? 64 : 80,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div
            animate={{
              scale: isScrolled ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href={`${prefix}/`}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 rounded"
              aria-label="The Great Beans Home"
            >
              <span
                className={cn(
                  'font-serif font-bold text-green-600 transition-all duration-300',
                  isScrolled ? 'text-xl' : 'text-2xl'
                )}
              >
                The Great Beans
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1" aria-label="Main navigation">
            {links.map((link) => {
              const isActive =
                pathname === `${prefix}${link.href}` ||
                (link.href !== '/' && pathname?.startsWith(`${prefix}${link.href}`));

              return (
                <Link
                  key={link.href}
                  href={`${prefix}${link.href}`}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg',
                    isActive
                      ? 'text-green-600 bg-green-50'
                      : 'text-green-800 hover:text-green-600 hover:bg-green-50/50'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"
                      layoutId="activeIndicator"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center">
            <Link
              href={locale === 'en' ? '/vi' : '/'}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300',
                isScrolled
                  ? 'text-green-800 hover:bg-green-50'
                  : 'text-green-600 hover:bg-green-50'
              )}
              aria-label={`Switch to ${locale === 'en' ? 'Vietnamese' : 'English'}`}
            >
              {locale === 'en' ? 'VI' : 'EN'}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

