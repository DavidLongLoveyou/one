#!/usr/bin/env node

/**
 * Generate .env.local file from .env.example
 */

const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, '.env.example');
const envPath = path.join(__dirname, '.env.local');

// Read .env.example
let envContent = '';
if (fs.existsSync(envExamplePath)) {
  envContent = fs.readFileSync(envExamplePath, 'utf8');
} else {
  // Create default .env.example content
  envContent = `# Strapi API
NEXT_PUBLIC_API_URL=http://localhost:1337
STRAPI_API_TOKEN=

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
`;
}

// Write .env.local file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Generated frontend/.env.local file');
console.log('   NEXT_PUBLIC_API_URL=http://localhost:1337');
console.log('   NEXT_PUBLIC_SITE_URL=http://localhost:3000');

