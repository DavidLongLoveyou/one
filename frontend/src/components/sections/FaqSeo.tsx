'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SectionData } from '@/lib/validators/homepage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { generateFAQPageSchema } from '@/lib/seo/json-ld';

interface FaqSeoProps {
  data: Extract<SectionData, { __component: 'section.faq-seo' }>;
  locale: string;
}

export function FaqSeo({ data, locale }: FaqSeoProps) {
  const {
    headline,
    subheadline,
    faq_items = [],
    layout = 'accordion',
    default_open_first = false,
    enable_search = false,
    enable_faqpage_schema = true,
  } = data;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!faq_items || faq_items.length === 0) {
    return null;
  }

  // Extract categories
  const categories = Array.from(
    new Set(faq_items.map((item: any) => item.category || 'general'))
  );

  // Filter FAQs
  const filteredFaqs = faq_items.filter((item: any) => {
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === 'string' &&
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render rich text answer
  const renderAnswer = (answer: any) => {
    if (typeof answer === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: answer }} />;
    }
    if (Array.isArray(answer)) {
      return answer.map((block: any, index: number) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-2 text-green-700">
              {block.children?.map((child: any) => child.text).join(' ')}
            </p>
          );
        }
        return null;
      });
    }
    return null;
  };

  // Generate FAQPage schema
  const faqSchema = enable_faqpage_schema
    ? generateFAQPageSchema(
        filteredFaqs.map((item: any) => ({
          question: item.question,
          answer: typeof item.answer === 'string' ? item.answer : JSON.stringify(item.answer),
        }))
      )
    : null;

  if (layout === 'accordion') {
    return (
      <section className="section-spacing bg-earth">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            {headline && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-green-800">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="text-lg md:text-xl text-green-700 max-w-2xl mx-auto">
                {subheadline}
              </p>
            )}
          </div>

          {enable_search && (
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          )}

          {layout === 'split-categories' && categories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  !selectedCategory
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-800 hover:bg-green-50'
                )}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize',
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-800 hover:bg-green-50'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <Accordion
              type="single"
              collapsible
              defaultValue={default_open_first ? 'item-0' : undefined}
            >
              {filteredFaqs.map((item: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-green-800">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-green-700">
                    {renderAnswer(item.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {faqSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
          )}
        </div>
      </section>
    );
  }

  // Grid layout
  return (
    <section className="section-spacing bg-earth">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          {headline && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-green-800">
              {headline}
            </h2>
          )}
          {subheadline && (
            <p className="text-lg md:text-xl text-green-700 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredFaqs.map((item: any, index: number) => (
            <motion.div
              key={index}
              className="p-6 bg-white rounded-lg border border-green-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                {item.question}
              </h3>
              <div className="text-green-700">{renderAnswer(item.answer)}</div>
            </motion.div>
          ))}
        </div>

        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
      </div>
    </section>
  );
}

