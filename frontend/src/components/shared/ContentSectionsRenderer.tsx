import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/cms-client';

interface ContentSectionsRendererProps {
  sections: any[];
  className?: string;
}

// Generate slug from text for heading IDs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function ContentSectionsRenderer({ sections, className }: ContentSectionsRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {sections.map((section: any, index: number) => {
        const componentType = section.__component;

        // Text block
        if (componentType === 'section.text-block' || componentType === 'text-block') {
          const content = section.content || section.text || '';
          
          // Handle Strapi blocks format
          if (Array.isArray(content)) {
            return (
              <div key={index} className="mb-6">
                {content.map((block: any, blockIndex: number) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p
                        key={blockIndex}
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

                  if (block.type === 'heading') {
                    const level = block.level || 2;
                    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
                    const headingText = block.children?.map((child: any) => child.text).join(' ') || '';
                    const headingId = generateSlug(headingText);
                    
                    const sizes = {
                      1: 'text-4xl mb-6 mt-12',
                      2: 'text-3xl mb-4 mt-10',
                      3: 'text-2xl mb-4 mt-8',
                      4: 'text-xl mb-3 mt-6',
                    };

                    return (
                      <HeadingTag
                        key={blockIndex}
                        id={headingId}
                        className={`font-serif font-bold text-green-800 scroll-mt-24 ${
                          sizes[level as keyof typeof sizes] || 'text-2xl mb-4 mt-8'
                        }`}
                      >
                        {headingText}
                      </HeadingTag>
                    );
                  }

                  if (block.type === 'list') {
                    const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
                    return (
                      <ListTag
                        key={blockIndex}
                        className={`mb-6 ml-6 space-y-2 text-lg text-green-800 ${
                          block.format === 'ordered' ? 'list-decimal' : 'list-disc'
                        }`}
                      >
                        {block.children?.map((item: any, itemIndex: number) => (
                          <li key={itemIndex} className="leading-relaxed">
                            {item.children?.map((child: any) => child.text).join(' ')}
                          </li>
                        ))}
                      </ListTag>
                    );
                  }

                  if (block.type === 'quote') {
                    return (
                      <blockquote
                        key={blockIndex}
                        className="my-8 border-l-4 border-green-600 bg-green-50 p-6 italic"
                      >
                        <div className="text-xl text-green-800">
                          {block.children?.map((child: any) => child.text).join(' ')}
                        </div>
                      </blockquote>
                    );
                  }

                  if (block.type === 'code') {
                    return (
                      <pre
                        key={blockIndex}
                        className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4"
                      >
                        <code className="text-sm text-gray-100">
                          {block.children?.map((child: any) => child.text).join(' ')}
                        </code>
                      </pre>
                    );
                  }

                  return null;
                })}
              </div>
            );
          }

          // Handle string content
          if (typeof content === 'string') {
            return (
              <div
                key={index}
                className="mb-6 prose prose-green max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            );
          }
        }

        // Image block
        if (componentType === 'section.image-block' || componentType === 'image-block') {
          const image = section.image;
          if (!image) return null;

          const imageUrl = getStrapiImageUrl(image);
          return (
            <figure key={index} className="my-8">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={image.alternativeText || section.caption || ''}
                  fill
                  className="object-cover"
                />
              </div>
              {section.caption && (
                <figcaption className="mt-2 text-center text-sm text-green-600">
                  {section.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // Quote block
        if (componentType === 'section.quote-block' || componentType === 'quote-block') {
          return (
            <blockquote
              key={index}
              className="my-8 border-l-4 border-green-600 bg-green-50 p-6 italic"
            >
              <div className="text-xl text-green-800">
                {section.quote || section.text}
              </div>
              {section.author && (
                <cite className="block mt-4 text-sm text-green-600 not-italic">
                  — {section.author}
                </cite>
              )}
            </blockquote>
          );
        }

        // Code block
        if (componentType === 'section.code-block' || componentType === 'code-block') {
          return (
            <pre
              key={index}
              className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4"
            >
              <code className="text-sm text-gray-100">
                {section.code || section.text}
              </code>
            </pre>
          );
        }

        return null;
      })}
    </div>
  );
}

