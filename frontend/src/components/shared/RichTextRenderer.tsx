import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/cms-client';
import { cn } from '@/lib/utils';

interface RichTextRendererProps {
  content: any; // Strapi blocks format or string
  className?: string;
  maxWidth?: 'none' | 'prose' | '65ch';
}

export function RichTextRenderer({ 
  content, 
  className,
  maxWidth = 'prose'
}: RichTextRendererProps) {
  if (!content) {
    return null;
  }

  // Handle string content
  if (typeof content === 'string') {
    return (
      <div 
        className={cn(
          "prose prose-green max-w-none",
          maxWidth === '65ch' && "max-w-[65ch]",
          className
        )}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  // Handle Strapi blocks format
  if (Array.isArray(content)) {
    return (
      <div 
        className={cn(
          "prose prose-green max-w-none",
          maxWidth === '65ch' && "max-w-[65ch]",
          className
        )}
      >
        {content.map((block: any, index: number) => {
          // Paragraph
          if (block.type === 'paragraph') {
            return (
              <p 
                key={index} 
                className="mb-6 text-lg leading-relaxed text-green-800"
              >
                {block.children?.map((child: any, childIndex: number) => {
                  if (child.type === 'text') {
                    return <span key={childIndex}>{child.text}</span>;
                  }
                  if (child.type === 'link') {
                    return (
                      <a
                        key={childIndex}
                        href={child.url}
                        className="text-green-600 hover:text-green-700 underline"
                      >
                        {child.children?.map((linkChild: any) => linkChild.text).join('')}
                      </a>
                    );
                  }
                  return null;
                })}
              </p>
            );
          }

          // Headings
          if (block.type === 'heading') {
            const level = block.level || 2;
            const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
            const sizes = {
              1: 'text-4xl mb-6 mt-12',
              2: 'text-3xl mb-4 mt-10',
              3: 'text-2xl mb-4 mt-8',
              4: 'text-xl mb-3 mt-6',
              5: 'text-lg mb-2 mt-4',
              6: 'text-base mb-2 mt-3',
            };
            return (
              <HeadingTag
                key={index}
                className={cn(
                  "font-serif font-bold text-green-800",
                  sizes[level as keyof typeof sizes]
                )}
              >
                {block.children?.map((child: any) => child.text).join(' ')}
              </HeadingTag>
            );
          }

          // Lists
          if (block.type === 'list') {
            const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag
                key={index}
                className={cn(
                  "mb-6 ml-6 space-y-2 text-lg text-green-800",
                  block.format === 'ordered' ? 'list-decimal' : 'list-disc'
                )}
              >
                {block.children?.map((item: any, itemIndex: number) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item.children?.map((child: any) => child.text).join(' ')}
                  </li>
                ))}
              </ListTag>
            );
          }

          // Quote
          if (block.type === 'quote') {
            return (
              <blockquote
                key={index}
                className="my-8 border-l-4 border-green-600 bg-green-50 p-6 italic"
              >
                <div className="text-xl text-green-800">
                  {block.children?.map((child: any) => child.text).join(' ')}
                </div>
              </blockquote>
            );
          }

          // Code
          if (block.type === 'code') {
            return (
              <pre
                key={index}
                className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4"
              >
                <code className="text-sm text-gray-100">
                  {block.children?.map((child: any) => child.text).join(' ')}
                </code>
              </pre>
            );
          }

          // Image (if Strapi blocks includes image blocks)
          if (block.type === 'image' && block.image) {
            const imageUrl = getStrapiImageUrl(block.image);
            return (
              <figure key={index} className="my-8">
                <Image
                  src={imageUrl}
                  alt={block.image.alternativeText || ''}
                  width={block.image.width || 800}
                  height={block.image.height || 600}
                  className="rounded-lg"
                />
                {block.image.caption && (
                  <figcaption className="mt-2 text-center text-sm text-green-600">
                    {block.image.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          return null;
        })}
      </div>
    );
  }

  return null;
}

