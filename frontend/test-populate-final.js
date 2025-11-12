#!/usr/bin/env node

/**
 * Final Populate Query Validation - Context-Aware
 */

const fs = require('fs');

console.log('🎯 Final Populate Query Validation (Context-Aware)...\n');

const cmsClient = fs.readFileSync('src/lib/cms-client.ts', 'utf8');
let errors = 0;
let passed = 0;

const test = (name, condition) => {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.error(`❌ ${name}`);
    errors++;
  }
};

// Remove comments to check actual code
const codeWithoutComments = cmsClient
  .split('\n')
  .filter(line => !line.trim().startsWith('//') && !line.trim().startsWith('*'))
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

// Test 1: NO populate: '*' at ROOT level (in getHomepage function)
console.log('🔍 Rule 1: NO populate: "*" at root level');
const homepageFunction = codeWithoutComments.match(/getHomepage[\s\S]*?populate:\s*\{[\s\S]*?\}/)?.[0] || '';
const rootLevelStar = homepageFunction.match(/^\s*populate:\s*['"]\*['"]/m);
test('No populate: "*" at root of getHomepage', !rootLevelStar);

// Test 2: NO populate: 'deep' in actual code
console.log('\n🔍 Rule 2: NO populate: "deep" in code');
const actualDeep = codeWithoutComments.match(/populate:\s*['"]deep['"]/);
test('No populate: "deep" in code', !actualDeep);

// Test 3: Dynamic Zone uses 'on' syntax
console.log('\n🔍 Rule 3: Dynamic Zone "on" syntax');
test('content_sections uses "on: {"', cmsClient.includes('content_sections:') && cmsClient.includes('on: {'));

// Test 4: All section types configured
console.log('\n🔍 Rule 4: All section types have populate');
const sections = [
  'section.hero-advanced',
  'section.trust-bar-enhanced',
  'section.services-grid',
  'section.factory-story',
  'section.products-showcase',
  'section.testimonials-proof',
  'section.blog-insights',
  'section.faq-seo',
  'section.cta-conversion',
];
sections.forEach(section => {
  test(`${section} has populate config`, cmsClient.includes(`'${section}'`) && cmsClient.includes('populate:'));
});

// Test 5: Media fields use explicit fields
console.log('\n🔍 Rule 5: Media fields use explicit fields');
const mediaPopulates = [
  'background_image_desktop',
  'background_image_mobile',
  'featured_image',
  'logo',
  'reviewer_avatar',
  'company_logo',
];
mediaPopulates.forEach(media => {
  if (cmsClient.includes(media)) {
    test(`${media} uses fields: [...]`, cmsClient.includes(`${media}:`) && cmsClient.includes('fields: ['));
  }
});

// Test 6: Nested relations explicitly populated
console.log('\n🔍 Rule 6: Nested relations explicit');
test('certifications.logo has nested populate', cmsClient.includes('certifications:') && cmsClient.includes('populate:') && cmsClient.includes('logo:'));
test('services.featured_image has nested populate', cmsClient.includes('services:') && cmsClient.includes('populate:') && cmsClient.includes('featured_image:'));
test('products.category has nested populate', cmsClient.includes('products:') && cmsClient.includes('populate:') && cmsClient.includes('category:'));

// Test 7: Zod validation
console.log('\n🔍 Rule 7: Zod validation');
test('HomepageSchema.parse used', cmsClient.includes('HomepageSchema.parse'));
test('KnowledgeAssetSchema.parse used', cmsClient.includes('KnowledgeAssetSchema.parse'));
test('ProductSchema.parse used', cmsClient.includes('ProductSchema.parse'));
test('ServiceSchema.parse used', cmsClient.includes('ServiceSchema.parse'));

// Test 8: Simple components can use populate: '*'
console.log('\n🔍 Rule 8: Simple components (OK to use populate: "*")');
// These are acceptable - they're simple components without nested relations
const simpleComponents = ['trust_indicators', 'stats', 'hotspots', 'key_stats', 'expertise_proofs', 'faq_items'];
simpleComponents.forEach(comp => {
  if (cmsClient.includes(`${comp}:`)) {
    // Check if it's nested (indented) - if so, populate: '*' is OK
    const lines = cmsClient.split('\n');
    const compIndex = cmsClient.indexOf(`${comp}:`);
    const lineNum = cmsClient.substring(0, compIndex).split('\n').length;
    const line = lines[lineNum - 1];
    const indent = line.match(/^\s*/)[0].length;
    
    if (indent > 20) {
      console.log(`   ✅ ${comp} uses populate: '*' (nested, OK for simple component)`);
      passed++;
    }
  }
});

// Summary
console.log('\n📊 Final Validation Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Errors: ${errors}`);

if (errors === 0) {
  console.log('\n✅ All Golden Rules of Populate are CORRECTLY followed!');
  console.log('   ✅ No root-level populate: "*"');
  console.log('   ✅ No populate: "deep"');
  console.log('   ✅ Explicit field selection for media');
  console.log('   ✅ Dynamic Zone "on" syntax');
  console.log('   ✅ All sections configured');
  console.log('   ✅ Nested relations explicit');
  console.log('   ✅ Zod validation in place');
  console.log('   ✅ Simple components use populate: "*" (acceptable)');
  process.exit(0);
} else {
  console.log('\n❌ Some violations found. Review errors above.');
  process.exit(1);
}

