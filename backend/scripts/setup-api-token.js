/**
 * Setup API Token Helper
 * 
 * Hướng dẫn và kiểm tra API Token setup
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ENV_FILE = path.join(__dirname, '../.env');

/**
 * Test API Token
 */
async function testToken(token) {
  return new Promise((resolve) => {
    const req = http.get(`${STRAPI_URL}/api/global-seo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          success: res.statusCode === 200 || res.statusCode === 404,
          statusCode: res.statusCode,
          data: data ? JSON.parse(data) : null,
        });
      });
    });
    
    req.on('error', () => {
      resolve({ success: false, statusCode: 0, error: 'Connection error' });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, statusCode: 0, error: 'Timeout' });
    });
  });
}

/**
 * Add token to .env
 */
function addTokenToEnv(token) {
  let envContent = '';
  
  if (fs.existsSync(ENV_FILE)) {
    envContent = fs.readFileSync(ENV_FILE, 'utf8');
  }
  
  // Remove existing STRAPI_API_TOKEN if any
  envContent = envContent.replace(/STRAPI_API_TOKEN\s*=.*\n/g, '');
  
  // Add new token
  envContent += `\n# Strapi API Token for populate scripts\nSTRAPI_API_TOKEN=${token}\n`;
  
  fs.writeFileSync(ENV_FILE, envContent);
  console.log('✅ Đã thêm API Token vào .env file');
}

/**
 * Main
 */
async function main() {
  console.log('='.repeat(70));
  console.log('🔑 API TOKEN SETUP HELPER');
  console.log('='.repeat(70));
  console.log('');
  
  const args = process.argv.slice(2);
  const token = args[0];
  
  if (token) {
    console.log('🔍 Đang test API Token...');
    const result = await testToken(token);
    
    if (result.success) {
      console.log('✅ API Token hợp lệ!');
      console.log('💾 Đang lưu vào .env file...');
      addTokenToEnv(token);
      console.log('\n✨ Hoàn thành! Bây giờ bạn có thể chạy:');
      console.log('   npm run populate:master');
    } else {
      console.log('❌ API Token không hợp lệ!');
      console.log(`   Status Code: ${result.statusCode}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('\n💡 Hãy kiểm tra:');
      console.log('   1. Token có đúng không?');
      console.log('   2. Token có type "Full access" không?');
      console.log('   3. Strapi server đang chạy không?');
    }
  } else {
    console.log('📋 HƯỚNG DẪN TẠO API TOKEN:\n');
    console.log('1. Mở Strapi Admin trong browser:');
    console.log(`   ${STRAPI_URL}/admin\n`);
    console.log('2. Đăng nhập với admin account\n');
    console.log('3. Vào: Settings (⚙️) > API Tokens\n');
    console.log('4. Click "Create new API Token"\n');
    console.log('5. Điền form:');
    console.log('   - Name: Populate Script');
    console.log('   - Token type: Full access');
    console.log('   - Token duration: Unlimited (hoặc chọn thời gian)');
    console.log('   - Click "Save"\n');
    console.log('6. Copy token (chỉ hiện 1 lần!)\n');
    console.log('7. Chạy lệnh này với token:');
    console.log('   node scripts/setup-api-token.js YOUR_TOKEN_HERE\n');
    console.log('Hoặc thêm trực tiếp vào .env:');
    console.log('   STRAPI_API_TOKEN=your_token_here\n');
  }
}

main().catch(console.error);

