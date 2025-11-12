#!/usr/bin/env node

/**
 * Performance Configuration Test
 */

const fs = require('fs');
const path = require('path');

console.log('⚡ Testing Performance Configuration...\n');

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

// Test 1: Next.js Config
console.log('🔧 Testing Next.js Configuration...');
const nextConfig = fs.existsSync('next.config.js') 
  ? fs.readFileSync('next.config.js', 'utf8')
  : '';

test('next.config.js exists', fs.existsSync('next.config.js'));
test('Bundle analyzer configured', nextConfig.includes('@next/bundle-analyzer'));
test('Image optimization configured', nextConfig.includes('images:'));
test('AVIF format enabled', nextConfig.includes('avif') || nextConfig.includes('image/avif'));
test('WebP format enabled', nextConfig.includes('webp') || nextConfig.includes('image/webp'));
test('Compiler optimizations', nextConfig.includes('compiler:'));
test('Package import optimization', nextConfig.includes('optimizePackageImports'));
test('Webpack optimizations', nextConfig.includes('webpack:'));
test('Cache headers configured', nextConfig.includes('Cache-Control'));

console.log('');

// Test 2: Package.json
console.log('📦 Testing Package Configuration...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

test('Bundle analyzer in devDependencies', packageJson.devDependencies?.['@next/bundle-analyzer']);
test('web-vitals in dependencies', packageJson.dependencies?.['web-vitals']);
test('cross-env in devDependencies', packageJson.devDependencies?.['cross-env']);
test('analyze script exists', packageJson.scripts?.analyze);
test('build:analyze script exists', packageJson.scripts?.['build:analyze']);
test('sharp installed (image optimization)', packageJson.dependencies?.sharp);

console.log('');

// Test 3: Performance Utilities
console.log('🛠️  Testing Performance Utilities...');
const performanceLib = fs.existsSync('src/lib/performance.ts')
  ? fs.readFileSync('src/lib/performance.ts', 'utf8')
  : '';

test('performance.ts exists', fs.existsSync('src/lib/performance.ts'));
test('Performance budget constants', performanceLib.includes('PERFORMANCE_BUDGET'));
test('LCP target defined', performanceLib.includes('LCP:'));
test('FID target defined', performanceLib.includes('FID:'));
test('CLS target defined', performanceLib.includes('CLS:'));
test('reportWebVitals function', performanceLib.includes('reportWebVitals'));
test('meetsPerformanceBudget function', performanceLib.includes('meetsPerformanceBudget'));
test('getPerformanceScore function', performanceLib.includes('getPerformanceScore'));
test('debounce function', performanceLib.includes('debounce'));
test('throttle function', performanceLib.includes('throttle'));

console.log('');

// Test 4: Image Optimization
console.log('🖼️  Testing Image Optimization...');
const imageOpt = fs.existsSync('src/lib/image-optimization.ts')
  ? fs.readFileSync('src/lib/image-optimization.ts', 'utf8')
  : '';

test('image-optimization.ts exists', fs.existsSync('src/lib/image-optimization.ts'));
test('IMAGE_SIZES defined', imageOpt.includes('IMAGE_SIZES'));
test('IMAGE_QUALITY defined', imageOpt.includes('IMAGE_QUALITY'));
test('getImageConfig function', imageOpt.includes('getImageConfig'));
test('generateSrcSet function', imageOpt.includes('generateSrcSet'));
test('getBlurDataURL function', imageOpt.includes('getBlurDataURL'));

console.log('');

// Test 5: Web Vitals Component
console.log('📊 Testing Web Vitals Component...');
const webVitals = fs.existsSync('src/components/performance/WebVitals.tsx')
  ? fs.readFileSync('src/components/performance/WebVitals.tsx', 'utf8')
  : '';

test('WebVitals.tsx exists', fs.existsSync('src/components/performance/WebVitals.tsx'));
test('WebVitals imports web-vitals', webVitals.includes('web-vitals'));
test('WebVitals reports metrics', webVitals.includes('reportWebVitals'));
test('WebVitals tracks LCP', webVitals.includes('onLCP'));
test('WebVitals tracks FID', webVitals.includes('onFID'));
test('WebVitals tracks CLS', webVitals.includes('onCLS'));
test('WebVitals tracks FCP', webVitals.includes('onFCP'));

console.log('');

// Test 6: Layout Integration
console.log('🏗️  Testing Layout Integration...');
const localeLayout = fs.existsSync('src/app/[locale]/layout.tsx')
  ? fs.readFileSync('src/app/[locale]/layout.tsx', 'utf8')
  : '';

test('WebVitals imported in layout', localeLayout.includes('WebVitals'));
test('WebVitals rendered in layout', localeLayout.includes('<WebVitals'));

console.log('');

// Test 7: Documentation
console.log('📚 Testing Documentation...');
test('PERFORMANCE-OPTIMIZATION.md exists', fs.existsSync('PERFORMANCE-OPTIMIZATION.md'));
test('SESSION-10-COMPLETE.md exists', fs.existsSync('SESSION-10-COMPLETE.md'));

console.log('');

// Summary
console.log('📊 Performance Configuration Test Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log(`   ❌ Errors: ${errors}`);
console.log('');

if (errors === 0) {
  console.log('✅ All performance configurations verified!');
  console.log('   ✅ Next.js config optimized');
  console.log('   ✅ Bundle analyzer ready');
  console.log('   ✅ Performance utilities available');
  console.log('   ✅ Image optimization configured');
  console.log('   ✅ Web Vitals monitoring active');
  console.log('   ✅ Documentation complete');
  console.log('');
  console.log('🚀 Ready to test:');
  console.log('   1. Run: npm install');
  console.log('   2. Run: npm run analyze');
  console.log('   3. Test with Lighthouse');
  process.exit(0);
} else {
  console.log('❌ Some configurations missing. Please review errors above.');
  process.exit(1);
}

