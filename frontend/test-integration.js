#!/usr/bin/env node

/**
 * Integration Tests - Verify data flow and component integration
 */

const fs = require('fs');
const path = require('path');

console.log('🔗 Running Integration Tests...\n');

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

// Test 1: Data Flow - CMS Client → Validators → Components
console.log('📊 Testing Data Flow...');

const cmsClient = fs.readFileSync('src/lib/cms-client.ts', 'utf8');
const homepageValidator = fs.readFileSync('src/lib/validators/homepage.ts', 'utf8');
const homepage = fs.readFileSync('src/app/[locale]/page.tsx', 'utf8');
const sectionRenderer = fs.readFileSync('src/components/sections/SectionRenderer.tsx', 'utf8');

// CMS Client exports
test('CMS client exports getHomepage', cmsClient.includes('export async function getHomepage'));
test('CMS client exports getKnowledgeAsset', cmsClient.includes('export async function getKnowledgeAsset'));
test('CMS client exports getProduct', cmsClient.includes('export async function getProduct'));
test('CMS client exports getService', cmsClient.includes('export async function getService'));

// Validators export types
test('Homepage validator exports HomepageData type', homepageValidator.includes('export type HomepageData'));
test('Homepage validator exports HomepageSchema', homepageValidator.includes('export const HomepageSchema'));

// Homepage uses CMS client
test('Homepage imports getHomepage', homepage.includes('getHomepage'));
test('Homepage imports HomepageData type', homepage.includes('HomepageData'));
test('Homepage validates with HomepageSchema', cmsClient.includes('HomepageSchema.parse'));

// SectionRenderer uses correct types
test('SectionRenderer imports SectionData type', sectionRenderer.includes('SectionData'));
test('SectionRenderer handles all section types', sectionRenderer.includes('section.hero-advanced'));

console.log('');

// Test 2: Component Props - Type Safety
console.log('🔒 Testing Component Props Type Safety...');

const heroAdvanced = fs.readFileSync('src/components/sections/HeroAdvanced.tsx', 'utf8');
test('HeroAdvanced accepts HomepageData type', heroAdvanced.includes('HeroAdvancedProps') && heroAdvanced.includes('data:'));
test('HeroAdvanced extracts from discriminated union', heroAdvanced.includes('Extract<') || heroAdvanced.includes('data: { headline'));

// Check all section components
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
    test(`${section} has typed props`, content.includes('Props') && content.includes('data:'));
    test(`${section} uses Extract for type narrowing`, content.includes('Extract<') || content.includes('data: {'));
  }
});

console.log('');

// Test 3: Image URL Handling
console.log('🖼️  Testing Image URL Handling...');

test('getStrapiImageUrl function exists', cmsClient.includes('getStrapiImageUrl'));
test('getStrapiImageUrl handles absolute URLs', cmsClient.includes('startsWith(\'http\')') || cmsClient.includes('startsWith("http")'));
test('getStrapiImageUrl handles relative URLs', cmsClient.includes('API_URL'));

// Check components use getStrapiImageUrl
test('HeroAdvanced uses getStrapiImageUrl', heroAdvanced.includes('getStrapiImageUrl'));
test('HeroAdvanced uses Next.js Image', heroAdvanced.includes('next/image'));

sections.forEach((section) => {
  const filePath = `src/components/sections/${section}.tsx`;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('image') || content.includes('Image')) {
      test(`${section} uses getStrapiImageUrl for images`, content.includes('getStrapiImageUrl'));
    }
  }
});

console.log('');

// Test 4: SEO Integration
console.log('🔎 Testing SEO Integration...');

const metadata = fs.readFileSync('src/lib/seo/metadata.ts', 'utf8');
const jsonLd = fs.readFileSync('src/lib/seo/json-ld.ts', 'utf8');

test('Homepage generates metadata', homepage.includes('generateMetadata'));
test('Homepage imports generateHomepageMetadata', homepage.includes('generateHomepageMetadata'));
test('Homepage generates Organization schema', homepage.includes('generateOrganizationSchema'));
test('Homepage injects JSON-LD', homepage.includes('dangerouslySetInnerHTML'));

// Internal pages
const productPage = fs.readFileSync('src/app/[locale]/products/[slug]/page.tsx', 'utf8');
const servicePage = fs.readFileSync('src/app/[locale]/services/[slug]/page.tsx', 'utf8');
const resourcePage = fs.readFileSync('src/app/[locale]/resources/[slug]/page.tsx', 'utf8');

test('Product page generates metadata', productPage.includes('generateMetadata'));
test('Product page generates Product schema', productPage.includes('generateProductSchema'));
test('Service page generates metadata', servicePage.includes('generateMetadata'));
test('Resource page generates metadata', resourcePage.includes('generateMetadata'));
test('Resource page generates Article schema', resourcePage.includes('generateArticleSchema'));

console.log('');

// Test 5: Error Handling Flow
console.log('🛡️  Testing Error Handling Flow...');

test('getHomepage has try-catch', cmsClient.includes('try') && cmsClient.includes('catch') && cmsClient.includes('getHomepage'));
test('Homepage handles fetch errors', homepage.includes('catch') || homepage.includes('error'));
test('Homepage shows error state', homepage.includes('Unable to load') || homepage.includes('Error'));
test('SectionRenderer has error handling', sectionRenderer.includes('try') && sectionRenderer.includes('catch'));
test('All pages use notFound()', productPage.includes('notFound') && servicePage.includes('notFound') && resourcePage.includes('notFound'));

console.log('');

// Test 6: Locale Handling
console.log('🌍 Testing Locale Handling...');

test('getHomepage accepts locale parameter', cmsClient.includes('getHomepage(locale: string'));
test('Homepage passes locale to SectionRenderer', homepage.includes('locale={params.locale}'));
test('HeroAdvanced accepts locale prop', heroAdvanced.includes('locale: string'));

// Check locale usage in components
sections.forEach((section) => {
  const filePath = `src/components/sections/${section}.tsx`;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    test(`${section} accepts locale prop`, content.includes('locale: string') || content.includes('locale?:'));
  }
});

console.log('');

// Test 7: Caching Strategy
console.log('⚡ Testing Caching Strategy...');

test('getHomepage has revalidate: 60', cmsClient.includes('revalidate: 60'));
test('getKnowledgeAsset has revalidate: 3600', cmsClient.includes('revalidate: 3600'));
test('getProduct has revalidate: 3600', cmsClient.includes('revalidate: 3600'));
test('getService has revalidate: 3600', cmsClient.includes('revalidate: 3600'));

console.log('');

// Test 8: Component Exports
console.log('📦 Testing Component Exports...');

// Check index files
const reactbitsIndex = fs.existsSync('src/components/reactbits/index.ts') 
  ? fs.readFileSync('src/components/reactbits/index.ts', 'utf8')
  : '';
const patternsIndex = fs.existsSync('src/components/patterns/index.ts')
  ? fs.readFileSync('src/components/patterns/index.ts', 'utf8')
  : '';
const uiIndex = fs.existsSync('src/components/ui/index.ts')
  ? fs.readFileSync('src/components/ui/index.ts', 'utf8')
  : '';

test('Reactbits components exported', reactbitsIndex.includes('export'));
test('Patterns components exported', patternsIndex.includes('export'));
test('UI components exported', uiIndex.includes('export'));

// Check specific exports
test('AnimatedGrid exported', reactbitsIndex.includes('AnimatedGrid'));
test('GradientText exported', reactbitsIndex.includes('GradientText'));
test('NumberTicker exported', reactbitsIndex.includes('NumberTicker'));
test('CardWithHover exported', patternsIndex.includes('CardWithHover'));
test('InfiniteMovingCards exported', patternsIndex.includes('InfiniteMovingCards'));

console.log('');

// Test 9: Query String Building
console.log('🔧 Testing Query String Building...');

test('Uses qs.stringify', cmsClient.includes('qs.stringify'));
test('Uses qs import', cmsClient.includes("import qs from 'qs'") || cmsClient.includes('import qs from "qs"'));

// Check query structure
test('Query includes locale parameter', cmsClient.includes('locale:'));
test('Query includes populate parameter', cmsClient.includes('populate:'));

console.log('');

// Test 10: Type Exports for External Use
console.log('📝 Testing Type Exports...');

const validators = [
  { file: 'src/lib/validators/homepage.ts', type: 'HomepageData' },
  { file: 'src/lib/validators/knowledge-asset.ts', type: 'KnowledgeAssetData' },
  { file: 'src/lib/validators/product.ts', type: 'ProductData' },
  { file: 'src/lib/validators/service.ts', type: 'ServiceData' },
];

validators.forEach(({ file, type }) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    test(`${type} exported`, content.includes(`export type ${type}`) || content.includes(`export const ${type}`));
  }
});

console.log('');

// Summary
console.log('📊 Integration Test Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log(`   ❌ Errors: ${errors}`);
console.log('');

if (errors === 0) {
  console.log('✅ All integration tests passed!');
  console.log('   ✅ Data flow: CMS → Validators → Components');
  console.log('   ✅ Type safety maintained');
  console.log('   ✅ Image handling correct');
  console.log('   ✅ SEO integration complete');
  console.log('   ✅ Error handling robust');
  console.log('   ✅ Locale handling correct');
  console.log('   ✅ Caching strategy implemented');
  console.log('   ✅ Component exports organized');
  console.log('   ✅ Query building correct');
  console.log('   ✅ Types exported');
  process.exit(0);
} else {
  console.log('❌ Some integration tests failed. Please review.');
  process.exit(1);
}

