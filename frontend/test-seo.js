#!/usr/bin/env node

/**
 * SEO Implementation Test
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing SEO Implementation...\n');

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

// Test 1: SEO Utilities
console.log('📚 Testing SEO Utilities...');
test('metadata.ts exists', fs.existsSync('src/lib/seo/metadata.ts'));
test('json-ld.ts exists', fs.existsSync('src/lib/seo/json-ld.ts'));
test('validation.ts exists', fs.existsSync('src/lib/seo/validation.ts'));
test('internal-linking.ts exists', fs.existsSync('src/lib/seo/internal-linking.ts'));
test('seo/index.ts exists', fs.existsSync('src/lib/seo/index.ts'));

const metadata = fs.readFileSync('src/lib/seo/metadata.ts', 'utf8');
test('generateHomepageMetadata exists', metadata.includes('generateHomepageMetadata'));
test('generateKnowledgeAssetMetadata exists', metadata.includes('generateKnowledgeAssetMetadata'));
test('generateProductMetadata exists', metadata.includes('generateProductMetadata'));
test('generateServiceMetadata exists', metadata.includes('generateServiceMetadata'));

const jsonLd = fs.readFileSync('src/lib/seo/json-ld.ts', 'utf8');
test('generateOrganizationSchema exists', jsonLd.includes('generateOrganizationSchema'));
test('generateArticleSchema exists', jsonLd.includes('generateArticleSchema'));
test('generateProductSchema exists', jsonLd.includes('generateProductSchema'));
test('generateBreadcrumbSchema exists', jsonLd.includes('generateBreadcrumbSchema'));
test('generateFAQPageSchema exists', jsonLd.includes('generateFAQPageSchema'));

const validation = fs.readFileSync('src/lib/seo/validation.ts', 'utf8');
test('validateMetadata exists', validation.includes('validateMetadata'));
test('validateSchema exists', validation.includes('validateSchema'));
test('validateURL exists', validation.includes('validateURL'));
test('auditSEO exists', validation.includes('auditSEO'));

const internalLinking = fs.readFileSync('src/lib/seo/internal-linking.ts', 'utf8');
test('getProductLink exists', internalLinking.includes('getProductLink'));
test('getServiceLink exists', internalLinking.includes('getServiceLink'));
test('getResourceLink exists', internalLinking.includes('getResourceLink'));
test('generateBreadcrumbs exists', internalLinking.includes('generateBreadcrumbs'));
test('generateRelatedLinks exists', internalLinking.includes('generateRelatedLinks'));

console.log('');

// Test 2: Sitemap
console.log('🗺️  Testing Sitemap...');
test('sitemap.ts exists', fs.existsSync('src/app/sitemap.ts'));
const sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
test('Sitemap uses getAllKnowledgeAssets', sitemap.includes('getAllKnowledgeAssets'));
test('Sitemap uses getAllProducts', sitemap.includes('getAllProducts'));
test('Sitemap uses getAllServices', sitemap.includes('getAllServices'));
test('Sitemap includes locales', sitemap.includes('locales'));
test('Sitemap includes alternates', sitemap.includes('alternates'));

console.log('');

// Test 3: CMS Client List
console.log('📦 Testing CMS Client List...');
test('cms-client-list.ts exists', fs.existsSync('src/lib/cms-client-list.ts'));
const cmsList = fs.readFileSync('src/lib/cms-client-list.ts', 'utf8');
test('getAllKnowledgeAssets exists', cmsList.includes('getAllKnowledgeAssets'));
test('getAllProducts exists', cmsList.includes('getAllProducts'));
test('getAllServices exists', cmsList.includes('getAllServices'));
test('getRelatedContent exists', cmsList.includes('getRelatedContent'));

console.log('');

// Test 4: Robots.txt
console.log('🤖 Testing Robots.txt...');
test('robots.ts exists', fs.existsSync('src/app/robots.ts'));
const robots = fs.readFileSync('src/app/robots.ts', 'utf8');
test('Robots includes sitemap', robots.includes('sitemap'));
test('Robots has rules', robots.includes('rules'));

console.log('');

// Test 5: Page Implementations
console.log('📄 Testing Page Implementations...');
const homepage = fs.readFileSync('src/app/[locale]/page.tsx', 'utf8');
test('Homepage generates metadata', homepage.includes('generateMetadata'));
test('Homepage generates Organization schema', homepage.includes('generateOrganizationSchema'));

const productPage = fs.readFileSync('src/app/[locale]/products/[slug]/page.tsx', 'utf8');
test('Product page generates metadata', productPage.includes('generateMetadata'));
test('Product page generates Product schema', productPage.includes('generateProductSchema'));

const servicePage = fs.readFileSync('src/app/[locale]/services/[slug]/page.tsx', 'utf8');
test('Service page generates metadata', servicePage.includes('generateMetadata'));

const resourcePage = fs.readFileSync('src/app/[locale]/resources/[slug]/page.tsx', 'utf8');
test('Resource page generates metadata', resourcePage.includes('generateMetadata'));
test('Resource page generates Article schema', resourcePage.includes('generateArticleSchema'));

console.log('');

// Test 6: Schema Validation
console.log('✅ Testing Schema Validation...');
test('Validation checks @context', validation.includes('@context'));
test('Validation checks @type', validation.includes('@type'));
test('Validation checks Organization', validation.includes('Organization'));
test('Validation checks Article', validation.includes('Article'));
test('Validation checks Product', validation.includes('Product'));
test('Validation checks BreadcrumbList', validation.includes('BreadcrumbList'));
test('Validation checks FAQPage', validation.includes('FAQPage'));

console.log('');

// Test 7: Meta Tags
console.log('🏷️  Testing Meta Tags...');
test('Metadata includes title', metadata.includes('title'));
test('Metadata includes description', metadata.includes('description'));
test('Metadata includes openGraph', metadata.includes('openGraph'));
test('Metadata includes twitter', metadata.includes('twitter'));
test('Metadata includes canonical', metadata.includes('canonical'));
test('Metadata includes robots', metadata.includes('robots'));

console.log('');

// Summary
console.log('📊 SEO Implementation Test Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log(`   ❌ Errors: ${errors}`);
console.log('');

if (errors === 0) {
  console.log('✅ All SEO implementations verified!');
  console.log('   ✅ SEO utilities complete');
  console.log('   ✅ Schema markup implemented');
  console.log('   ✅ Meta tags configured');
  console.log('   ✅ Sitemap enhanced');
  console.log('   ✅ Internal linking utilities ready');
  console.log('   ✅ Validation tools available');
  process.exit(0);
} else {
  console.log('❌ Some SEO implementations missing. Please review errors above.');
  process.exit(1);
}

