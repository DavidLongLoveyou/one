/**
 * Test Admin Authentication Endpoints for Strapi v5
 * Kiểm tra các endpoint admin auth để tìm endpoint đúng
 */

const http = require('http');
require('dotenv').config();

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD required in .env');
  process.exit(1);
}

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, STRAPI_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 1337,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
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

async function testEndpoint(name, url, body) {
  console.log(`\n🔍 Testing: ${name}`);
  console.log(`   URL: ${url}`);
  console.log(`   Body: ${JSON.stringify(body)}`);
  
  try {
    const result = await makeRequest('POST', url, body);
    console.log(`   Status: ${result.status}`);
    
    if (result.status === 200 || result.status === 201) {
      console.log(`   ✅ SUCCESS!`);
      
      // Try to extract token
      const token = result.data?.data?.token || result.data?.token || result.data?.jwt || result.data?.data?.jwt;
      if (token) {
        console.log(`   Token found: ${token.substring(0, 20)}...${token.substring(token.length - 10)}`);
        console.log(`   Token length: ${token.length}`);
        return { success: true, token, data: result.data };
      } else {
        console.log(`   ⚠️  No token found in response`);
        console.log(`   Response structure:`, JSON.stringify(result.data, null, 2).substring(0, 500));
        return { success: false, data: result.data };
      }
    } else {
      console.log(`   ❌ Failed`);
      console.log(`   Response:`, result.raw.substring(0, 300));
      return { success: false, status: result.status, data: result.data };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🔍 Testing Strapi v5 Admin Authentication Endpoints\n');
  console.log(`URL: ${STRAPI_URL}`);
  console.log(`Email: ${ADMIN_EMAIL}\n`);

  const endpoints = [
    {
      name: '/admin/auth/login (email/password)',
      url: '/admin/auth/login',
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    },
    {
      name: '/admin/auth/login (identifier/password)',
      url: '/admin/auth/login',
      body: { identifier: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    },
    {
      name: '/admin/auth/local (email/password)',
      url: '/admin/auth/local',
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    },
    {
      name: '/admin/auth/local (identifier/password)',
      url: '/admin/auth/local',
      body: { identifier: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    },
  ];

  let successCount = 0;
  let workingEndpoint = null;

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.name, endpoint.url, endpoint.body);
    if (result.success && result.token) {
      successCount++;
      if (!workingEndpoint) {
        workingEndpoint = { ...endpoint, token: result.token, response: result.data };
      }
    }
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Summary:');
  console.log(`   Successful endpoints: ${successCount}`);
  
  if (workingEndpoint) {
    console.log('\n✅ Working endpoint found:');
    console.log(`   URL: ${workingEndpoint.url}`);
    console.log(`   Body format: ${JSON.stringify(workingEndpoint.body)}`);
    console.log(`   Response structure:`, JSON.stringify(workingEndpoint.response, null, 2).substring(0, 500));
  } else {
    console.log('\n❌ No working endpoint found');
    console.log('   Please check:');
    console.log('   1. Strapi server is running');
    console.log('   2. ADMIN_EMAIL and ADMIN_PASSWORD are correct');
    console.log('   3. Admin user exists in Strapi');
  }
  
  console.log('');
}

main().catch(console.error);

