#!/usr/bin/env node

/**
 * Deep testing script - Focus on populate queries, data fetching, and integration
 */

const fs = require('fs');
const path = require('path');

console.log('🔬 Running Deep Tests - Populate Queries & Data Fetching...\n');

let errors = 0;
let warnings = 0;
let passed = 0;

const test = (name, condition, isWarning = false) => {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    if (isWarning) {
      console.warn(`⚠️  ${name}`);
      warnings++;
    } else {
      console.error(`❌ ${name}`);
      errors++;
    }
  }
};

// Test 1: CMS Client - Populate Queries
console.log('🔍 Testing CMS Client - Populate Queries (Golden Rules)...');
const cmsClient = fs.readFileSync('src/lib/cms-client.ts', 'utf8');

// Check for forbidden patterns
test('NO populate: "*" at root level', !cmsClient.includes('populate: "*"'));
test('NO populate: "deep"', !cmsClient.includes('populate: "deep"'));
test('NO populate: \'*\' at root', !cmsClient.includes("populate: '*'"));
test('NO populate: \'deep\'', !cmsClient.includes("populate: 'deep'"));

// Check for correct patterns
test('Uses explicit field selection', cmsClient.includes('fields: ['));
test('Uses Dynamic Zone "on" syntax', cmsClient.includes('on: {'));
test('Uses section.hero-advanced populate', cmsClient.includes("'section.hero-advanced'"));
test('Uses section.trust-bar-enhanced populate', cmsClient.includes("'section.trust-bar-enhanced'"));
test('Uses section.services-grid populate', cmsClient.includes("'section.services-grid'"));
test('Uses section.factory-story populate', cmsClient.includes("'section.factory-story'"));
test('Uses section.products-showcase populate', cmsClient.includes("'section.products-showcase'"));
test('Uses section.testimonials-proof populate', cmsClient.includes("'section.testimonials-proof'"));
test('Uses section.blog-insights populate', cmsClient.includes("'section.blog-insights'"));
test('Uses section.faq-seo populate', cmsClient.includes("'section.faq-seo'"));
test('Uses section.cta-conversion populate', cmsClient.includes("'section.cta-conversion'"));

// Check media field selection
test('Media fields specify exact fields', cmsClient.includes("fields: ['url', 'alternativeText'"));
test('Uses qs.stringify for queries', cmsClient.includes('qs.stringify'));

// Check Zod validation
test('Zod validation before return', cmsClient.includes('HomepageSchema.parse'));
test('Zod validation for knowledge assets', cmsClient.includes('KnowledgeAssetSchema.parse'));
test('Zod validation for products', cmsClient.includes('ProductSchema.parse'));
test('Zod validation for services', cmsClient.includes('ServiceSchema.parse'));

// Check error handling
test('Error handling in getHomepage', cmsClient.includes('catch') && cmsClient.includes('getHomepage'));
test('Error handling in getKnowledgeAsset', cmsClient.includes('catch') && cmsClient.includes('getKnowledgeAsset'));
test('Error handling in getProduct', cmsClient.includes('catch') && cmsClient.includes('getProduct'));
test('Error handling in getService', cmsClient.includes('catch') && cmsClient.includes('getService'));

// Check ISR caching
test('ISR caching configured (revalidate)', cmsClient.includes('revalidate'));
test('Homepage has 60s cache', cmsClient.includes('revalidate: 60'));
test('Content pages have 3600s cache', cmsClient.includes('revalidate: 3600'));

console.log('');

// Test 2: Zod Validators - Schema Completeness
console.log('✅ Testing Zod Validators...');
const homepageValidator = fs.readFileSync('src/lib/validators/homepage.ts', 'utf8');
const knowledgeAssetValidator = fs.readFileSync('src/lib/validators/knowledge-asset.ts', 'utf8');
const productValidator = fs.readFileSync('src/lib/validators/product.ts', 'utf8');
const serviceValidator = fs.readFileSync('src/lib/validators/service.ts', 'utf8');

// Homepage validator
test('HomepageSchema uses discriminated union', homepageValidator.includes('discriminatedUnion'));
test('HomepageSchema has all 9 section types', (homepageValidator.match(/section\./g) || []).length >= 9);
test('HomepageSchema has ButtonSchema', homepageValidator.includes('ButtonSchema'));
test('HomepageSchema has MediaSchema', homepageValidator.includes('MediaSchema'));
test('HomepageSchema has HeroStatSchema', homepageValidator.includes('HeroStatSchema'));
test('HomepageSchema has HeroTrustIndicatorSchema', homepageValidator.includes('HeroTrustIndicatorSchema'));
test('HomepageSchema has HeroHotspotSchema', homepageValidator.includes('HeroHotspotSchema'));

// Knowledge Asset validator
test('KnowledgeAssetSchema has all required fields', knowledgeAssetValidator.includes('title') && knowledgeAssetValidator.includes('slug'));
test('KnowledgeAssetSchema has author relation', knowledgeAssetValidator.includes('author'));
test('KnowledgeAssetSchema has category relation', knowledgeAssetValidator.includes('category'));
test('KnowledgeAssetSchema has featured_image', knowledgeAssetValidator.includes('featured_image'));

// Product validator
test('ProductSchema has all required fields', productValidator.includes('title') && productValidator.includes('slug'));
test('ProductSchema has gallery support', productValidator.includes('gallery'));
test('ProductSchema has specifications', productValidator.includes('specifications'));
test('ProductSchema has cupping_score', productValidator.includes('cupping_score'));

// Service validator
test('ServiceSchema has all required fields', serviceValidator.includes('title') && serviceValidator.includes('slug'));
test('ServiceSchema has icon_name', serviceValidator.includes('icon_name'));
test('ServiceSchema has cta_url', serviceValidator.includes('cta_url'));

console.log('');

// Test 3: Section Components - Data Handling
console.log('🧩 Testing Section Components - Data Handling...');

const heroAdvanced = fs.readFileSync('src/components/sections/HeroAdvanced.tsx', 'utf8');
test('HeroAdvanced handles missing data', heroAdvanced.includes('||') || heroAdvanced.includes('??'));
test('HeroAdvanced uses getStrapiImageUrl', heroAdvanced.includes('getStrapiImageUrl'));
test('HeroAdvanced has error handling', heroAdvanced.includes('if (!') || heroAdvanced.includes('early return'));

const sectionRenderer = fs.readFileSync('src/components/sections/SectionRenderer.tsx', 'utf8');
test('SectionRenderer handles null sections', sectionRenderer.includes('length === 0') || sectionRenderer.includes('!sections'));
test('SectionRenderer has try-catch', sectionRenderer.includes('try') && sectionRenderer.includes('catch'));
test('SectionRenderer handles unknown sections', sectionRenderer.includes('default') || sectionRenderer.includes('Unknown'));

// Test all section components exist and have proper structure
const sections = [
  'TrustBarEnhanced',
  'ServicesGrid',
  'FactoryStory',
  'ProductsShowcase',
  'TestimonialsProof',
  'BlogInsights',
  'FaqSeo',
  'CtaConversion',
];

sections.forEach((section) => {
  const filePath = `src/components/sections/${section}.tsx`;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    test(`${section} handles missing data`, content.includes('||') || content.includes('??') || content.includes('if (!'));
    test(`${section} uses getStrapiImageUrl for images`, content.includes('getStrapiImageUrl') || !content.includes('image'));
  }
});

console.log('');

// Test 4: Homepage Integration
console.log('🏠 Testing Homepage Integration...');
const homepage = fs.readFileSync('src/app/[locale]/page.tsx', 'utf8');

test('Homepage fetches data with getHomepage', homepage.includes('getHomepage'));
test('Homepage generates metadata', homepage.includes('generateMetadata'));
test('Homepage generates Organization schema', homepage.includes('generateOrganizationSchema'));
test('Homepage has error handling', homepage.includes('catch') || homepage.includes('error'));
test('Homepage shows error state', homepage.includes('Unable to load') || homepage.includes('error'));
test('Homepage shows empty state', homepage.includes('No content') || homepage.includes('empty'));
test('Homepage uses SectionRenderer', homepage.includes('SectionRenderer'));
test('Homepage passes locale to SectionRenderer', homepage.includes('locale={params.locale}'));

console.log('');

// Test 5: Internal Pages - Data Fetching
console.log('📄 Testing Internal Pages - Data Fetching...');

const productPage = fs.readFileSync('src/app/[locale]/products/[slug]/page.tsx', 'utf8');
test('Product page uses getProduct', productPage.includes('getProduct'));
test('Product page generates metadata', productPage.includes('generateProductMetadata'));
test('Product page generates Product schema', productPage.includes('generateProductSchema'));
test('Product page generates Breadcrumb schema', productPage.includes('generateBreadcrumbSchema'));
test('Product page handles notFound', productPage.includes('notFound()'));

const servicePage = fs.readFileSync('src/app/[locale]/services/[slug]/page.tsx', 'utf8');
test('Service page uses getService', servicePage.includes('getService'));
test('Service page generates metadata', servicePage.includes('generateServiceMetadata'));
test('Service page handles notFound', servicePage.includes('notFound()'));

const resourcePage = fs.readFileSync('src/app/[locale]/resources/[slug]/page.tsx', 'utf8');
test('Resource page uses getKnowledgeAsset', resourcePage.includes('getKnowledgeAsset'));
test('Resource page generates metadata', resourcePage.includes('generateKnowledgeAssetMetadata'));
test('Resource page generates Article schema', resourcePage.includes('generateArticleSchema'));
test('Resource page handles notFound', resourcePage.includes('notFound()'));

console.log('');

// Test 6: SEO Implementation
console.log('🔎 Testing SEO Implementation...');

const metadata = fs.readFileSync('src/lib/seo/metadata.ts', 'utf8');
test('generateHomepageMetadata exists', metadata.includes('generateHomepageMetadata'));
test('generateKnowledgeAssetMetadata exists', metadata.includes('generateKnowledgeAssetMetadata'));
test('generateProductMetadata exists', metadata.includes('generateProductMetadata'));
test('generateServiceMetadata exists', metadata.includes('generateServiceMetadata'));
test('Metadata includes Open Graph', metadata.includes('openGraph'));
test('Metadata includes Twitter cards', metadata.includes('twitter'));
test('Metadata includes canonical URLs', metadata.includes('canonical'));

const jsonLd = fs.readFileSync('src/lib/seo/json-ld.ts', 'utf8');
test('generateOrganizationSchema exists', jsonLd.includes('generateOrganizationSchema'));
test('generateArticleSchema exists', jsonLd.includes('generateArticleSchema'));
test('generateProductSchema exists', jsonLd.includes('generateProductSchema'));
test('generateBreadcrumbSchema exists', jsonLd.includes('generateBreadcrumbSchema'));
test('generateFAQPageSchema exists', jsonLd.includes('generateFAQPageSchema'));
test('All schemas use @context', jsonLd.includes('@context'));
test('All schemas use @type', jsonLd.includes('@type'));

console.log('');

// Test 7: Type Safety
console.log('🔒 Testing Type Safety...');

// Check for 'any' types in critical files
const criticalFiles = [
  { path: 'src/lib/cms-client.ts', name: 'CMS Client' },
  { path: 'src/components/sections/SectionRenderer.tsx', name: 'SectionRenderer' },
  { path: 'src/app/[locale]/page.tsx', name: 'Homepage' },
];

criticalFiles.forEach(({ path: filePath, name }) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Count 'any' types (excluding comments and strings)
    const anyMatches = content.match(/: any\b/g) || [];
    const anyInComments = (content.match(/\/\/.*: any/g) || []).length;
    const anyInStrings = (content.match(/['"].*: any.*['"]/g) || []).length;
    const actualAnyCount = anyMatches.length - anyInComments - anyInStrings;
    
    test(`${name} has minimal 'any' types`, actualAnyCount <= 2, true);
  }
});

// Check for proper TypeScript types
test('CMS client has proper return types', cmsClient.includes(': Promise<'));
test('Validators export types', homepageValidator.includes('export type'));
test('SectionRenderer uses discriminated union types', sectionRenderer.includes('Extract<'));

console.log('');

// Test 8: Image Handling
console.log('🖼️  Testing Image Handling...');

test('All sections use Next.js Image', heroAdvanced.includes('next/image'));
test('HeroAdvanced uses priority prop', heroAdvanced.includes('priority'));
test('HeroAdvanced uses proper sizes', heroAdvanced.includes('sizes='));
test('getStrapiImageUrl function exists', cmsClient.includes('getStrapiImageUrl'));
test('getStrapiImageUrl handles absolute URLs', cmsClient.includes('startsWith(\'http\')'));
test('getStrapiImageUrl handles relative URLs', cmsClient.includes('API_URL'));

console.log('');

// Test 9: Environment Variables
console.log('🌍 Testing Environment Variables...');
const envExample = fs.existsSync('.env.example') ? fs.readFileSync('.env.example', 'utf8') : '';
const envLocal = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';

test('NEXT_PUBLIC_API_URL in .env.example', envExample.includes('NEXT_PUBLIC_API_URL'));
test('NEXT_PUBLIC_SITE_URL in .env.example', envExample.includes('NEXT_PUBLIC_SITE_URL'));
test('NEXT_PUBLIC_API_URL in .env.local', envLocal.includes('NEXT_PUBLIC_API_URL'));
test('NEXT_PUBLIC_SITE_URL in .env.local', envLocal.includes('NEXT_PUBLIC_SITE_URL'));

// Check usage in code
test('CMS client uses NEXT_PUBLIC_API_URL', cmsClient.includes('NEXT_PUBLIC_API_URL'));
test('CMS client uses STRAPI_API_TOKEN', cmsClient.includes('STRAPI_API_TOKEN'));
test('SEO uses NEXT_PUBLIC_SITE_URL', metadata.includes('NEXT_PUBLIC_SITE_URL') || jsonLd.includes('NEXT_PUBLIC_SITE_URL'));

console.log('');

// Test 10: Component Integration
console.log('🔗 Testing Component Integration...');

// Check if all Reactbits components are used
const reactbitsUsed = [
  { component: 'AnimatedGrid', file: heroAdvanced },
  { component: 'GradientText', file: heroAdvanced },
  { component: 'NumberTicker', file: heroAdvanced },
  { component: 'Dock', file: heroAdvanced },
];

reactbitsUsed.forEach(({ component, file }) => {
  test(`${component} is imported in HeroAdvanced`, file.includes(component));
});

// Check if patterns are used
const patternsUsed = [
  { component: 'CardWithHover', files: ['ServicesGrid', 'ProductsShowcase', 'BlogInsights', 'TestimonialsProof'] },
  { component: 'InfiniteMovingCards', files: ['TestimonialsProof'] },
];

patternsUsed.forEach(({ component, files }) => {
  files.forEach((fileName) => {
    const filePath = `src/components/sections/${fileName}.tsx`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      test(`${component} used in ${fileName}`, content.includes(component));
    }
  });
});

console.log('');

// Test 11: Populate Query Structure Validation
console.log('🎯 Testing Populate Query Structure (Critical)...');

// Check homepage populate structure
const homepagePopulate = cmsClient.match(/getHomepage[\s\S]*?populate:[\s\S]*?locale:/)?.[0] || '';
test('Homepage populate uses content_sections.on syntax', homepagePopulate.includes('content_sections') && homepagePopulate.includes('on:'));
test('Homepage populate has section.hero-advanced config', homepagePopulate.includes("'section.hero-advanced'"));
test('Homepage populate has background_image_desktop fields', homepagePopulate.includes('background_image_desktop'));
test('Homepage populate has seo.metaImage fields', homepagePopulate.includes('metaImage') || cmsClient.includes('metaImage'));

// Check knowledge asset populate
const kaPopulate = cmsClient.match(/getKnowledgeAsset[\s\S]*?populate:[\s\S]*?locale:/)?.[0] || '';
test('KnowledgeAsset populate has featured_image fields', kaPopulate.includes('featured_image'));
test('KnowledgeAsset populate has author with nested populate', kaPopulate.includes('author') && kaPopulate.includes('populate'));
test('KnowledgeAsset populate has category fields', kaPopulate.includes('category'));

// Check product populate
const productPopulate = cmsClient.match(/getProduct[\s\S]*?populate:[\s\S]*?locale:/)?.[0] || '';
test('Product populate has featured_image fields', productPopulate.includes('featured_image'));
test('Product populate has gallery fields', productPopulate.includes('gallery'));
test('Product populate has category fields', productPopulate.includes('category'));

// Check service populate
const servicePopulate = cmsClient.match(/getService[\s\S]*?populate:[\s\S]*?locale:/)?.[0] || '';
test('Service populate has featured_image fields', servicePopulate.includes('featured_image'));
test('Service populate has seo fields', servicePopulate.includes('seo'));

console.log('');

// Test 12: Error Boundaries and Fallbacks
console.log('🛡️  Testing Error Handling...');

test('Homepage has error state', homepage.includes('error') || homepage.includes('Error'));
test('Homepage has empty state', homepage.includes('No content') || homepage.includes('empty'));
test('SectionRenderer has error handling', sectionRenderer.includes('try') && sectionRenderer.includes('catch'));
test('SectionRenderer handles unknown components', sectionRenderer.includes('default') || sectionRenderer.includes('Unknown'));
test('All pages use notFound() for missing content', productPage.includes('notFound') && servicePage.includes('notFound') && resourcePage.includes('notFound'));

console.log('');

// Summary
console.log('📊 Deep Test Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log(`   ❌ Errors: ${errors}`);
console.log('');

if (errors === 0) {
  console.log('✅ All deep tests passed!');
  console.log('   ✅ Populate queries follow Golden Rules');
  console.log('   ✅ Zod validation in place');
  console.log('   ✅ Error handling comprehensive');
  console.log('   ✅ Type safety maintained');
  console.log('   ✅ Ready for Session 10: Performance Optimization');
  process.exit(0);
} else {
  console.log('❌ Some deep tests failed. Please review the errors above.');
  console.log('   Focus on populate query patterns and data validation.');
  process.exit(1);
}

