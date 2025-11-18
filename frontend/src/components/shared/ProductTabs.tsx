'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextRenderer } from './RichTextRenderer';
import { SpecificationsTable } from './SpecificationsTable';
import { PackagingOptions } from './PackagingOptions';
import type { ProductData } from '@/lib/validators/product';

interface ProductTabsProps {
  product: ProductData;
}

export function ProductTabs({ product }: ProductTabsProps) {
  // Support both old and new field names for backward compatibility
  const fullDescription = (product as any).full_description || product.description;
  const originStory = (product as any).origin_story;
  const specifications = (product as any).specifications || [];
  const packagingOptions = (product as any).packaging_options || [];

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="origin">Origin Story</TabsTrigger>
        <TabsTrigger value="packaging">Packaging</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose prose-green max-w-none">
          <RichTextRenderer content={fullDescription} />
        </div>
      </TabsContent>

      <TabsContent value="specs" className="mt-6">
        {specifications.length > 0 ? (
          <SpecificationsTable specifications={specifications} />
        ) : (
          <div className="text-green-700">
            <p>No specifications available for this product.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="origin" className="mt-6">
        {originStory ? (
          <div className="prose prose-green max-w-none">
            <RichTextRenderer content={originStory} />
          </div>
        ) : (
          <div className="text-green-700">
            <p>Origin story coming soon.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="packaging" className="mt-6">
        {packagingOptions.length > 0 ? (
          <PackagingOptions packaging={packagingOptions} />
        ) : (
          <div className="text-green-700">
            <p>Packaging options available upon request. Please contact us for details.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

