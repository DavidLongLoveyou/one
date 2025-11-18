/**
 * Populate Content using API Token
 * 
 * Alternative approach: Use API Token instead of admin password
 * 
 * To use this:
 * 1. Go to Strapi Admin: Settings > API Tokens
 * 2. Create a new token with "Full access" type
 * 3. Copy the token
 * 4. Add to .env: STRAPI_API_TOKEN=your_token_here
 * 5. Run: node scripts/populate-with-token.js [phase]
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

if (!API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN not set in .env file!');
  console.log('\n💡 To use API Token:');
  console.log('   1. Go to Strapi Admin: Settings > API Tokens');
  console.log('   2. Create new token with "Full access" type');
  console.log('   3. Copy the token');
  console.log('   4. Add to .env: STRAPI_API_TOKEN=your_token_here');
  process.exit(1);
}

/**
 * Make HTTP request with API Token
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
        ...options.headers,
      },
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: json });
          } else {
            const errorMsg = json.error 
              ? `${json.error.name || 'Error'}: ${json.error.message || JSON.stringify(json)}`
              : JSON.stringify(json);
            reject(new Error(`HTTP ${res.statusCode}: ${errorMsg}`));
          }
        } catch (e) {
          reject(new Error(`HTTP ${res.statusCode}: ${data || 'No response data'}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request error: ${err.message}`));
    });
    
    req.setTimeout(10000);
    
    if (options.body) {
      const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      req.write(bodyStr);
    }
    req.end();
  });
}

// Import phase functions from populate-content.js
// For now, just test the connection
async function testConnection() {
  console.log('🔍 Testing API Token connection...');
  try {
    const response = await request(`${STRAPI_URL}/api/global-seo`);
    console.log('✅ API Token is valid!');
    return true;
  } catch (error) {
    console.error('❌ API Token test failed:', error.message);
    return false;
  }
}

// Run populate phases using API token
async function runPhase(phase) {
  console.log(`\n📦 Running Phase ${phase} with API Token...\n`);
  
  // For now, just delegate to original script but with note about using token
  console.log('💡 Note: This script uses API Token authentication');
  console.log('   The original populate-content.js will be updated to support both methods\n');
  
  // You can implement phase logic here or import from populate-content.js
  // For simplicity, we'll just test for now
  return await testConnection();
}

async function main() {
  const phase = process.argv[2] || '1';
  
  console.log('🚀 Strapi Content Population Script (API Token)');
  console.log('='.repeat(50));
  
  if (await testConnection()) {
    await runPhase(phase);
  } else {
    process.exit(1);
  }
}

main().catch(console.error);

