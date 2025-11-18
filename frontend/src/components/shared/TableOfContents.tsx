'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TOCItem {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observerOptions = {
      rootMargin: '-100px 0px -66%',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all heading elements
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={cn('sticky top-24', className)}>
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Table of Contents</h3>
        <ul className="space-y-2">
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            const indent = item.level === 3 ? 'ml-4' : '';

            return (
              <li key={index} className={indent}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    'text-left text-sm transition-colors hover:text-green-600 w-full',
                    isActive
                      ? 'text-green-600 font-medium'
                      : 'text-green-700'
                  )}
                >
                  {item.text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

