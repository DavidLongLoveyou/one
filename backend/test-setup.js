#!/usr/bin/env node

/**
 * Basic setup test for Strapi backend
 * Checks if dependencies are installed and basic structure is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Backend Setup...\n');

let errors = 0;
let warnings = 0;

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ node_modules not found. Run: npm install');
  errors++;
} else {
  console.log('✅ node_modules exists');
}

// Check package.json
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found');
  errors++;
} else {
  console.log('✅ package.json exists');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check Strapi version
  if (pkg.dependencies['@strapi/strapi'] === '5.3.0') {
    console.log('✅ Strapi version correct (5.3.0)');
  } else {
    console.warn(`⚠️  Strapi version: ${pkg.dependencies['@strapi/strapi']} (expected 5.3.0)`);
    warnings++;
  }
}

// Check critical config files
const configFiles = [
  'config/database.ts',
  'config/server.ts',
  'config/admin.ts',
  'config/api.ts',
  'config/middlewares.ts',
  'config/plugins.ts',
];

configFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
    errors++;
  }
});

// Check content types
const contentTypes = [
  'src/api/homepage/content-types/homepage/schema.json',
  'src/api/knowledge-asset/content-types/knowledge-asset/schema.json',
  'src/api/product/content-types/product/schema.json',
  'src/api/service/content-types/service/schema.json',
];

contentTypes.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
    errors++;
  }
});

// Check components
const components = [
  'src/components/shared/button.json',
  'src/components/seo/metadata.json',
  'src/components/hero/stat.json',
  'src/components/section/hero-advanced.json',
];

components.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
    errors++;
  }
});

// Check .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️  .env file not found. Copy .env.example to .env and configure it.');
  warnings++;
} else {
  console.log('✅ .env file exists');
}

console.log('\n📊 Test Summary:');
console.log(`   Errors: ${errors}`);
console.log(`   Warnings: ${warnings}`);

if (errors === 0) {
  console.log('\n✅ Backend setup looks good!');
  process.exit(0);
} else {
  console.log('\n❌ Backend setup has errors. Please fix them before proceeding.');
  process.exit(1);
}

