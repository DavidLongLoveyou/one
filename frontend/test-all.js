#!/usr/bin/env node

/**
 * Comprehensive test script for The Great Beans frontend
 * Tests all components, files, and configurations
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Running Comprehensive Frontend Tests...\n');

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

// Test 1: Package.json
console.log('📦 Testing Package Configuration...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
test('package.json exists', true);
test('Next.js version is 14.2.15', packageJson.dependencies.next === '14.2.15');
test('React version is ^18.3.1', packageJson.dependencies.react === '^18.3.1');
test('TypeScript version is ^5.6.0', packageJson.dependencies.typescript === '^5.6.0');
test('Zod version is ^3.23.8', packageJson.dependencies.zod === '^3.23.8');
test('Framer Motion version is ^11.11.17', packageJson.dependencies['framer-motion'] === '^11.11.17');
console.log('');

// Test 2: Config Files
console.log('⚙️  Testing Configuration Files...');
test('next.config.js exists', fs.existsSync('next.config.js'));
test('tailwind.config.ts exists', fs.existsSync('tailwind.config.ts'));
test('tsconfig.json exists', fs.existsSync('tsconfig.json'));
test('postcss.config.js exists', fs.existsSync('postcss.config.js'));
test('.eslintrc.json exists', fs.existsSync('.eslintrc.json'));
test('.env.local exists', fs.existsSync('.env.local'), true);
console.log('');

// Test 3: App Structure
console.log('📱 Testing App Structure...');
test('app/layout.tsx exists', fs.existsSync('src/app/layout.tsx'));
test('app/globals.css exists', fs.existsSync('src/app/globals.css'));
test('app/[locale]/page.tsx exists', fs.existsSync('src/app/[locale]/page.tsx'));
test('app/[locale]/layout.tsx exists', fs.existsSync('src/app/[locale]/layout.tsx'));
test('app/sitemap.ts exists', fs.existsSync('src/app/sitemap.ts'));
test('app/robots.ts exists', fs.existsSync('src/app/robots.ts'));
test('middleware.ts exists', fs.existsSync('src/middleware.ts'));
console.log('');

// Test 4: Internal Pages
console.log('📄 Testing Internal Pages...');
test('products/[slug]/page.tsx exists', fs.existsSync('src/app/[locale]/products/[slug]/page.tsx'));
test('services/[slug]/page.tsx exists', fs.existsSync('src/app/[locale]/services/[slug]/page.tsx'));
test('resources/[slug]/page.tsx exists', fs.existsSync('src/app/[locale]/resources/[slug]/page.tsx'));
console.log('');

// Test 5: Components
console.log('🧩 Testing Components...');
test('Header.tsx exists', fs.existsSync('src/components/Header.tsx'));
test('Footer.tsx exists', fs.existsSync('src/components/Footer.tsx'));
test('SectionRenderer.tsx exists', fs.existsSync('src/components/sections/SectionRenderer.tsx'));
test('HeroAdvanced.tsx exists', fs.existsSync('src/components/sections/HeroAdvanced.tsx'));
test('TrustBarEnhanced.tsx exists', fs.existsSync('src/components/sections/TrustBarEnhanced.tsx'));
test('ServicesGrid.tsx exists', fs.existsSync('src/components/sections/ServicesGrid.tsx'));
test('FactoryStory.tsx exists', fs.existsSync('src/components/sections/FactoryStory.tsx'));
test('ProductsShowcase.tsx exists', fs.existsSync('src/components/sections/ProductsShowcase.tsx'));
test('TestimonialsProof.tsx exists', fs.existsSync('src/components/sections/TestimonialsProof.tsx'));
test('BlogInsights.tsx exists', fs.existsSync('src/components/sections/BlogInsights.tsx'));
test('FaqSeo.tsx exists', fs.existsSync('src/components/sections/FaqSeo.tsx'));
test('CtaConversion.tsx exists', fs.existsSync('src/components/sections/CtaConversion.tsx'));
console.log('');

// Test 6: UI Components
console.log('🎨 Testing UI Components...');
test('button.tsx exists', fs.existsSync('src/components/ui/button.tsx'));
test('tooltip.tsx exists', fs.existsSync('src/components/ui/tooltip.tsx'));
test('accordion.tsx exists', fs.existsSync('src/components/ui/accordion.tsx'));
test('staggered-menu.tsx exists', fs.existsSync('src/components/ui/staggered-menu.tsx'));
test('resizable-navbar.tsx exists', fs.existsSync('src/components/ui/resizable-navbar.tsx'));
console.log('');

// Test 7: Reactbits Components
console.log('✨ Testing Reactbits Components...');
test('animated-grid.tsx exists', fs.existsSync('src/components/reactbits/animated-grid.tsx'));
test('gradient-text.tsx exists', fs.existsSync('src/components/reactbits/gradient-text.tsx'));
test('number-ticker.tsx exists', fs.existsSync('src/components/reactbits/number-ticker.tsx'));
test('spotlight.tsx exists', fs.existsSync('src/components/reactbits/spotlight.tsx'));
test('dock.tsx exists', fs.existsSync('src/components/reactbits/dock.tsx'));
console.log('');

// Test 8: Pattern Components
console.log('🔀 Testing Pattern Components...');
test('card-with-hover.tsx exists', fs.existsSync('src/components/patterns/card-with-hover.tsx'));
test('infinite-moving-cards.tsx exists', fs.existsSync('src/components/patterns/infinite-moving-cards.tsx'));
console.log('');

// Test 9: Shared Components
console.log('🔗 Testing Shared Components...');
test('Breadcrumbs.tsx exists', fs.existsSync('src/components/shared/Breadcrumbs.tsx'));
test('PageHeader.tsx exists', fs.existsSync('src/components/shared/PageHeader.tsx'));
console.log('');

// Test 10: Library Files
console.log('📚 Testing Library Files...');
test('cms-client.ts exists', fs.existsSync('src/lib/cms-client.ts'));
test('utils.ts exists', fs.existsSync('src/lib/utils.ts'));
test('metadata.ts exists', fs.existsSync('src/lib/seo/metadata.ts'));
test('json-ld.ts exists', fs.existsSync('src/lib/seo/json-ld.ts'));
test('structured-data.ts exists', fs.existsSync('src/lib/seo/structured-data.ts'));
console.log('');

// Test 11: Validators
console.log('✅ Testing Validators...');
test('homepage.ts validator exists', fs.existsSync('src/lib/validators/homepage.ts'));
test('knowledge-asset.ts validator exists', fs.existsSync('src/lib/validators/knowledge-asset.ts'));
test('product.ts validator exists', fs.existsSync('src/lib/validators/product.ts'));
test('service.ts validator exists', fs.existsSync('src/lib/validators/service.ts'));
console.log('');

// Test 12: Index Files
console.log('📑 Testing Index Files...');
test('components/sections/index.ts exists', fs.existsSync('src/components/sections/index.ts'));
test('components/ui/index.ts exists', fs.existsSync('src/components/ui/index.ts'));
test('components/shared/index.ts exists', fs.existsSync('src/components/shared/index.ts'));
test('components/reactbits/index.ts exists', fs.existsSync('src/components/reactbits/index.ts'));
test('components/patterns/index.ts exists', fs.existsSync('src/components/patterns/index.ts'));
console.log('');

// Test 13: File Content Checks
console.log('🔍 Testing File Content...');

// Check if SectionRenderer exports all sections
const sectionsIndex = fs.readFileSync('src/components/sections/index.ts', 'utf8');
test('SectionRenderer exported', sectionsIndex.includes('SectionRenderer'));
test('HeroAdvanced exported', sectionsIndex.includes('HeroAdvanced'));
test('All 9 sections exported', (sectionsIndex.match(/export/g) || []).length >= 10);

// Check if CMS client has all functions
const cmsClient = fs.readFileSync('src/lib/cms-client.ts', 'utf8');
test('getHomepage function exists', cmsClient.includes('getHomepage'));
test('getKnowledgeAsset function exists', cmsClient.includes('getKnowledgeAsset'));
test('getProduct function exists', cmsClient.includes('getProduct'));
test('getService function exists', cmsClient.includes('getService'));
test('Golden Rules comment exists', cmsClient.includes('GOLDEN RULES OF POPULATE'));

// Check if homepage uses SectionRenderer
const homepage = fs.readFileSync('src/app/[locale]/page.tsx', 'utf8');
test('Homepage uses SectionRenderer', homepage.includes('SectionRenderer'));
test('Homepage generates metadata', homepage.includes('generateMetadata'));
test('Homepage has error handling', homepage.includes('error'));

console.log('');

// Test 14: Design System
console.log('🎨 Testing Design System...');
const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');
test('Tailwind directives present', globalsCss.includes('@tailwind'));
test('Section spacing utility exists', globalsCss.includes('section-spacing'));
test('Accordion animations exist', globalsCss.includes('accordion-down'));

const tailwindConfig = fs.readFileSync('tailwind.config.ts', 'utf8');
test('Primary color configured', tailwindConfig.includes('primary'));
test('Green-600 color configured', tailwindConfig.includes('059669'));
test('Custom colors configured', tailwindConfig.includes('forest'));

console.log('');

// Test 15: SEO Files
console.log('🔎 Testing SEO Files...');
test('sitemap.ts exists', fs.existsSync('src/app/sitemap.ts'));
test('robots.ts exists', fs.existsSync('src/app/robots.ts'));

const sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
test('Sitemap generates routes', sitemap.includes('routes'));
test('Sitemap has locales', sitemap.includes('locales'));

const robots = fs.readFileSync('src/app/robots.ts', 'utf8');
test('Robots allows crawling', robots.includes('allow'));
test('Robots has sitemap', robots.includes('sitemap'));

console.log('');

// Test 16: New Menu Components
console.log('🍔 Testing New Menu Components...');
test('staggered-menu.tsx exists', fs.existsSync('src/components/ui/staggered-menu.tsx'));
test('resizable-navbar.tsx exists', fs.existsSync('src/components/ui/resizable-navbar.tsx'));

const staggeredMenu = fs.readFileSync('src/components/ui/staggered-menu.tsx', 'utf8');
test('StaggeredMenu uses Framer Motion', staggeredMenu.includes('framer-motion'));
test('StaggeredMenu has stagger animation', staggeredMenu.includes('stagger'));

const resizableNavbar = fs.readFileSync('src/components/ui/resizable-navbar.tsx', 'utf8');
test('ResizableNavbar uses scroll detection', resizableNavbar.includes('useScroll'));
test('ResizableNavbar has resize animation', resizableNavbar.includes('height'));

const header = fs.readFileSync('src/components/Header.tsx', 'utf8');
test('Header uses ResizableNavbar', header.includes('ResizableNavbar'));
test('Header uses StaggeredMenu', header.includes('StaggeredMenu'));

console.log('');

// Summary
console.log('📊 Test Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log(`   ❌ Errors: ${errors}`);
console.log('');

if (errors === 0) {
  console.log('✅ All critical tests passed!');
  console.log('   Ready for Session 10: Performance Optimization');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please review the errors above.');
  process.exit(1);
}

