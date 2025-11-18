'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FAQItem {
  id?: number;
  question: string;
  answer: string | any; // Can be rich text
  category?: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  className?: string;
  generateSchema?: boolean;
}

export function FAQSection({ 
  items, 
  title = "Frequently Asked Questions",
  className,
  generateSchema = true 
}: FAQSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Render rich text answer
  const renderAnswer = (answer: string | any) => {
    if (typeof answer === 'string') {
      return <div className="text-green-700" dangerouslySetInnerHTML={{ __html: answer }} />;
    }
    // If it's a rich text object, render it
    if (typeof answer === 'object' && answer !== null) {
      // Handle Strapi blocks format
      if (Array.isArray(answer)) {
        return (
          <div className="prose prose-green max-w-none text-green-700">
            {answer.map((block: any, index: number) => {
              if (block.type === 'paragraph') {
                return (
                  <p key={index} className="mb-2">
                    {block.children?.map((child: any, childIndex: number) => 
                      child.text || ''
                    ).join(' ')}
                  </p>
                );
              }
              return null;
            })}
          </div>
        );
      }
    }
    return <div className="text-green-700">{String(answer)}</div>;
  };

  const faqSchema = generateSchema ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof item.answer === 'string' ? item.answer : JSON.stringify(item.answer)
      }
    }))
  } : null;

  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-serif font-bold text-green-800">
          {title}
        </h2>
        
        <Accordion type="single" collapsible className="max-w-3xl">
          {items.map((item, index) => (
            <AccordionItem key={item.id || index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-green-800 hover:text-green-700">
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}
    </section>
  );
}

