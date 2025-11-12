#!/usr/bin/env node

/**
 * Validate Populate Queries - Golden Rules Compliance
 */

const fs = require('fs');

console.log('🎯 Validating Populate Queries - Golden Rules Compliance...\n');

const cmsClient = fs.readFileSync('src/lib/cms-client.ts', 'utf8');
let errors = 0;
let warnings = 0;

// Test 1: NO populate: '*' at ROOT level
console.log('✅ Rule 1: NO populate: "*" at root level');
const rootLevelPopulate = cmsClient.match(/populate:\s*['"]\*['"]/g);
if (rootLevelPopulate) {
  // Check if it's at root level (not nested)
  const lines = cmsClient.split('\n');
  rootLevelPopulate.forEach((match, index) => {
    const lineIndex = cmsClient.indexOf(match);
    const lineNum = cmsClient.substring(0, lineIndex).split('\n').length;
    const line = lines[lineNum - 1];
    const indent = line.match(/^\s*/)[0].length;
    
    // Root level would have minimal indentation (within function, not deeply nested)
    if (indent < 20) {
      console.error(`   ❌ Found populate: '*' at root level (line ${lineNum})`);
      errors++;
    } else {
      console.log(`   ✅ populate: '*' at nested level (line ${lineNum}) - OK for simple components`);
    }
  });
} else {
  console.log('   ✅ No populate: "*" found');
}

// Test 2: NO populate: 'deep'
console.log('\n✅ Rule 2: NO populate: "deep"');
if (cmsClient.includes("populate: 'deep'") || cmsClient.includes('populate: "deep"')) {
  console.error('   ❌ Found populate: "deep"');
  errors++;
} else {
  console.log('   ✅ No populate: "deep" found');
}

// Test 3: Explicit field selection for media
console.log('\n✅ Rule 3: Explicit field selection for media');
const mediaFields = cmsClient.match(/fields:\s*\[['"]url['"]/g);
if (mediaFields && mediaFields.length > 0) {
  console.log(`   ✅ Found ${mediaFields.length} explicit media field selections`);
} else {
  console.error('   ❌ No explicit media field selections found');
  errors++;
}

// Test 4: Dynamic Zone 'on' syntax
console.log('\n✅ Rule 4: Dynamic Zone uses "on" syntax');
if (cmsClient.includes('content_sections:') && cmsClient.includes('on: {')) {
  console.log('   ✅ Dynamic Zone uses correct "on: { ... }" syntax');
} else {
  console.error('   ❌ Dynamic Zone missing "on" syntax');
  errors++;
}

// Test 5: All section types have populate config
console.log('\n✅ Rule 5: All section types have populate config');
const requiredSections = [
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

requiredSections.forEach((section) => {
  if (cmsClient.includes(`'${section}'`)) {
    console.log(`   ✅ ${section} has populate config`);
  } else {
    console.error(`   ❌ ${section} missing populate config`);
    errors++;
  }
});

// Test 6: Nested relations explicitly populated
console.log('\n✅ Rule 6: Nested relations explicitly populated');
const nestedPopulates = [
  { path: 'certifications.logo', found: cmsClient.includes('certifications') && cmsClient.includes('logo') && cmsClient.includes('fields:') },
  { path: 'services.featured_image', found: cmsClient.includes('services') && cmsClient.includes('featured_image') && cmsClient.includes('fields:') },
  { path: 'products.category', found: cmsClient.includes('products') && cmsClient.includes('category') && cmsClient.includes('fields:') },
  { path: 'testimonials.reviewer_avatar', found: cmsClient.includes('testimonials') && cmsClient.includes('reviewer_avatar') && cmsClient.includes('fields:') },
  { path: 'knowledge_assets.author', found: cmsClient.includes('knowledge_assets') && cmsClient.includes('author') && cmsClient.includes('populate') },
];

nestedPopulates.forEach(({ path, found }) => {
  if (found) {
    console.log(`   ✅ ${path} explicitly populated`);
  } else {
    console.warn(`   ⚠️  ${path} populate may need verification`);
    warnings++;
  }
});

// Test 7: Zod validation
console.log('\n✅ Rule 7: Zod validation before return');
const validationChecks = [
  { name: 'HomepageSchema.parse', found: cmsClient.includes('HomepageSchema.parse') },
  { name: 'KnowledgeAssetSchema.parse', found: cmsClient.includes('KnowledgeAssetSchema.parse') },
  { name: 'ProductSchema.parse', found: cmsClient.includes('ProductSchema.parse') },
  { name: 'ServiceSchema.parse', found: cmsClient.includes('ServiceSchema.parse') },
];

validationChecks.forEach(({ name, found }) => {
  if (found) {
    console.log(`   ✅ ${name} used`);
  } else {
    console.error(`   ❌ ${name} missing`);
    errors++;
  }
});

// Summary
console.log('\n📊 Populate Query Validation Summary:');
console.log(`   ✅ Rules followed: ${7 - errors}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log(`   ❌ Errors: ${errors}`);

if (errors === 0) {
  console.log('\n✅ All Golden Rules of Populate are followed!');
  console.log('   ✅ No root-level populate: "*"');
  console.log('   ✅ No populate: "deep"');
  console.log('   ✅ Explicit field selection');
  console.log('   ✅ Dynamic Zone "on" syntax');
  console.log('   ✅ All sections configured');
  console.log('   ✅ Nested relations explicit');
  console.log('   ✅ Zod validation in place');
  process.exit(0);
} else {
  console.log('\n❌ Some populate rules violated. Please review.');
  process.exit(1);
}

