'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StaggeredMenuProps {
  locale: string;
  links: Array<{ href: string; label: string }>;
}

const menuVariants = {
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export function StaggeredMenu({ locale, links }: StaggeredMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const prefix = locale === 'en' ? '' : `/${locale}`;

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-green-800 hover:text-green-600 transition-colors relative z-50"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          className="relative w-6 h-6"
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 45, y: 6 },
            }}
            className="absolute top-0 left-0 w-full h-0.5 bg-current origin-center"
          />
          <motion.span
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            className="absolute top-1/2 left-0 w-full h-0.5 bg-current -translate-y-1/2"
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: -6 },
            }}
            className="absolute bottom-0 left-0 w-full h-0.5 bg-current origin-center"
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.nav
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                  <span className="text-2xl font-serif font-bold text-green-600">
                    The Great Beans
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-green-800 hover:text-green-600 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <motion.ul className="space-y-2" variants={menuVariants}>
                  {links.map((link, index) => (
                    <motion.li key={link.href} variants={itemVariants}>
                      <Link
                        href={`${prefix}${link.href}`}
                        onClick={() => setIsOpen(false)}
                        className="block py-4 text-2xl font-semibold text-green-800 hover:text-green-600 transition-colors border-b border-green-100"
                      >
                        {link.label.split('').map((char, charIndex) => (
                          <motion.span
                            key={charIndex}
                            variants={{
                              closed: { opacity: 0, y: 20 },
                              open: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                  delay: index * 0.1 + charIndex * 0.02,
                                },
                              },
                            }}
                            className="inline-block"
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </motion.span>
                        ))}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Language Switcher */}
                <motion.div
                  variants={itemVariants}
                  className="mt-12 pt-8 border-t border-green-200"
                >
                  <Link
                    href={locale === 'en' ? '/vi' : '/'}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 text-lg font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    {locale === 'en' ? 'Tiếng Việt' : 'English'}
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

