/**
 * Test API Token Permissions
 */

const http = require('http');
require('dotenv').config();

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN not found in .env');
  process.exit(1);
}

function testRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, STRAPI_URL);
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 1337,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data ? JSON.parse(data) : null,
          headers: res.headers,
        });
      });
    });
    
    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  console.log('🔍 Testing API Token Permissions...\n');
  console.log(`Token: ${API_TOKEN.substring(0, 10)}...${API_TOKEN.substring(API_TOKEN.length - 5)}\n`);
  
  // Test 1: GET (should work)
  console.log('1. Testing GET /api/authors...');
  try {
    const getResult = await testRequest('GET', '/api/authors');
    console.log(`   Status: ${getResult.status} ${getResult.status === 200 ? '✅' : '❌'}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 2: POST (might fail if read-only)
  console.log('\n2. Testing POST /api/authors...');
  try {
    const postResult = await testRequest('POST', '/api/authors', {
      data: {
        name: 'Test Author',
        title: 'Test',
      },
    });
    console.log(`   Status: ${postResult.status} ${postResult.status === 200 ? '✅' : '❌'}`);
    if (postResult.status === 405) {
      console.log('   ⚠️  Method Not Allowed - Token might be Read-only');
      console.log('   💡 Solution: Create new token with "Full access" type');
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 3: Check token info
  console.log('\n3. Testing GET /api/users/me (if available)...');
  try {
    const meResult = await testRequest('GET', '/api/users/me');
    console.log(`   Status: ${meResult.status}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  console.log('\n📋 Summary:');
  console.log('   - If GET works but POST returns 405: Token is Read-only');
  console.log('   - Solution: Create new API Token with "Full access" type');
  console.log('');
}

main().catch(console.error);

