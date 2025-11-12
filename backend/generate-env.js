#!/usr/bin/env node

/**
 * Generate .env file from .env.example with secure keys
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envExamplePath = path.join(__dirname, '.env.example');
const envPath = path.join(__dirname, '.env');

// Generate secure keys
const generateKey = () => crypto.randomBytes(16).toString('base64');
const generateKeys = () => Array.from({length: 4}, () => generateKey()).join(',');

const appKeys = generateKeys();
const salt = generateKey();

// Read .env.example
let envContent = '';
if (fs.existsSync(envExamplePath)) {
  envContent = fs.readFileSync(envExamplePath, 'utf8');
} else {
  // Create default .env.example content
  envContent = `# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# App Keys
APP_KEYS=toBeReplaced1,toBeReplaced2,toBeReplaced3,toBeReplaced4
API_TOKEN_SALT=toBeReplaced
ADMIN_JWT_SECRET=toBeReplaced
TRANSFER_TOKEN_SALT=toBeReplaced
JWT_SECRET=toBeReplaced

# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
`;
}

// Replace placeholders
envContent = envContent.replace(/toBeReplaced1,toBeReplaced2,toBeReplaced3,toBeReplaced4/g, appKeys);
envContent = envContent.replace(/toBeReplaced/g, salt);

// Write .env file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Generated backend/.env file with secure keys');
console.log('   APP_KEYS: Generated');
console.log('   All salts: Generated');

