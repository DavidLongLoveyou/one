#!/usr/bin/env node

/**
 * Basic setup test for Next.js frontend
 * Checks if dependencies are installed and basic structure is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Frontend Setup...\n');

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
  
  // Check Next.js version
  if (pkg.dependencies.next === '14.2.15') {
    console.log('✅ Next.js version correct (14.2.15)');
  } else {
    console.warn(`⚠️  Next.js version: ${pkg.dependencies.next} (expected 14.2.15)`);
    warnings++;
  }
  
  // Check React version
  if (pkg.dependencies.react === '^18.3.1') {
    console.log('✅ React version correct (^18.3.1)');
  } else {
    console.warn(`⚠️  React version: ${pkg.dependencies.react} (expected ^18.3.1)`);
    warnings++;
  }
}

// Check critical config files
const configFiles = [
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'postcss.config.js',
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

// Check source files
const sourceFiles = [
  'src/app/layout.tsx',
  'src/app/globals.css',
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/layout.tsx',
  'src/middleware.ts',
  'src/lib/utils.ts',
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
];

sourceFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
    errors++;
  }
});

// Check .env.local file
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️  .env.local file not found. Copy .env.example to .env.local and configure it.');
  warnings++;
} else {
  console.log('✅ .env.local file exists');
}

console.log('\n📊 Test Summary:');
console.log(`   Errors: ${errors}`);
console.log(`   Warnings: ${warnings}`);

if (errors === 0) {
  console.log('\n✅ Frontend setup looks good!');
  process.exit(0);
} else {
  console.log('\n❌ Frontend setup has errors. Please fix them before proceeding.');
  process.exit(1);
}

