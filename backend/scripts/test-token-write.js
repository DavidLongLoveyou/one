/**
 * Test API Token Write Permissions
 * Kiểm tra chi tiết quyền write của API Token
 */

const http = require('http');
require('dotenv').config();

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN not found');
  process.exit(1);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, STRAPI_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 1337,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: json,
            raw: data,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            raw: data,
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  console.log('🔍 Testing API Token Write Permissions\n');
  console.log(`URL: ${STRAPI_URL}`);
  console.log(`Token: ${API_TOKEN.substring(0, 20)}...${API_TOKEN.substring(API_TOKEN.length - 10)}\n`);

  // Test 1: GET request (should work)
  console.log('1️⃣  Testing GET /api/authors...');
  try {
    const getResult = await makeRequest('GET', '/api/authors');
    console.log(`   Status: ${getResult.status}`);
    if (getResult.status === 200 || getResult.status === 404) {
      console.log('   ✅ GET works');
    } else {
      console.log(`   ❌ GET failed: ${getResult.status}`);
      console.log(`   Response:`, getResult.raw.substring(0, 200));
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 2: POST request với format đúng
  console.log('\n2️⃣  Testing POST /api/authors (with { data: {...} })...');
  try {
    const postResult = await makeRequest('POST', '/api/authors', {
      data: {
        name: 'Test Author',
        title: 'Test',
        bio: 'Test bio',
      },
    });
    console.log(`   Status: ${postResult.status}`);
    if (postResult.status === 200 || postResult.status === 201) {
      console.log('   ✅ POST works! Token has write permissions');
      console.log(`   Created ID: ${postResult.data?.data?.id || 'N/A'}`);
    } else {
      console.log(`   ❌ POST failed: ${postResult.status}`);
      console.log(`   Response:`, JSON.stringify(postResult.data, null, 2).substring(0, 500));
      
      // Check specific error codes
      if (postResult.status === 405) {
        console.log('\n   ⚠️  405 Method Not Allowed - Possible causes:');
        console.log('      1. Token type might not be "Full access" (check in Strapi Admin)');
        console.log('      2. Content-type permissions not configured');
        console.log('      3. Strapi v5 might require different endpoint format');
      } else if (postResult.status === 403) {
        console.log('\n   ⚠️  403 Forbidden - Token lacks permissions');
      } else if (postResult.status === 401) {
        console.log('\n   ⚠️  401 Unauthorized - Token is invalid');
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 3: Check token info via admin API
  console.log('\n3️⃣  Testing GET /admin/users/me (admin endpoint)...');
  try {
    const adminResult = await makeRequest('GET', '/admin/users/me');
    console.log(`   Status: ${adminResult.status}`);
    if (adminResult.status === 200) {
      console.log('   ✅ Can access admin endpoint');
    } else {
      console.log(`   ⚠️  Cannot access admin endpoint: ${adminResult.status}`);
      console.log('   (This is normal - API Tokens might not work with admin endpoints)');
    }
  } catch (error) {
    console.log(`   ⚠️  Error: ${error.message} (This is normal)`);
  }

  // Test 4: Try different endpoint format
  console.log('\n4️⃣  Testing POST /api/authors (alternative format)...');
  try {
    // Try without wrapping in data
    const altResult = await makeRequest('POST', '/api/authors', {
      name: 'Test Author 2',
      title: 'Test',
    });
    console.log(`   Status: ${altResult.status}`);
    if (altResult.status === 200 || altResult.status === 201) {
      console.log('   ✅ Alternative format works');
    } else {
      console.log(`   ❌ Alternative format failed: ${altResult.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n📋 Summary:');
  console.log('   - If GET works but POST returns 405: Token permissions issue');
  console.log('   - Check Strapi Admin: Settings > API Tokens > Your Token');
  console.log('   - Verify token type is "Full access"');
  console.log('   - Check if content-type has proper permissions configured');
  console.log('');
}

main().catch(console.error);

