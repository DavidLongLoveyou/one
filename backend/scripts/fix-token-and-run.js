/**
 * Fix API Token and Run Population
 * 
 * Hướng dẫn user tạo API Token và tự động chạy populate
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

const ENV_FILE = path.join(__dirname, '../.env');
const args = process.argv.slice(2);
const token = args[0];

console.log('🔧 Fix API Token and Run Population\n');

if (token) {
  // User provided token - update .env
  console.log('📝 Updating .env with provided token...');
  
  let envContent = '';
  if (fs.existsSync(ENV_FILE)) {
    envContent = fs.readFileSync(ENV_FILE, 'utf8');
  }
  
  // Remove existing STRAPI_API_TOKEN
  envContent = envContent.replace(/STRAPI_API_TOKEN\s*=.*\n/g, '');
  envContent = envContent.replace(/STRAPI_API_TOKEN\s*=.*$/gm, '');
  
  // Add new token
  if (!envContent.endsWith('\n')) {
    envContent += '\n';
  }
  envContent += `# Strapi API Token for populate scripts\nSTRAPI_API_TOKEN=${token}\n`;
  
  fs.writeFileSync(ENV_FILE, envContent);
  console.log('✅ Token đã được cập nhật vào .env\n');
  
  console.log('🚀 Đang chạy populate script...\n');
  try {
    execSync('node scripts/populate-content.js 1', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
  } catch (error) {
    console.error('\n❌ Script failed');
    process.exit(1);
  }
} else {
  // Show instructions
  console.log('❌ API Token chưa được cấu hình đúng!\n');
  console.log('📋 HƯỚNG DẪN:\n');
  console.log('1. Mở Strapi Admin:');
  console.log('   http://localhost:1337/admin\n');
  console.log('2. Vào: Settings (⚙️) > API Tokens\n');
  console.log('3. Click "Create new API Token"\n');
  console.log('4. Điền form:');
  console.log('   - Name: Populate Script');
  console.log('   - Token type: Full access ⚠️  (QUAN TRỌNG: phải là Full access, không phải Read-only)');
  console.log('   - Token duration: Unlimited');
  console.log('   - Click "Save"\n');
  console.log('5. Copy token (chỉ hiện 1 lần!)\n');
  console.log('6. Chạy lệnh này với token:');
  console.log('   node scripts/fix-token-and-run.js YOUR_TOKEN_HERE\n');
  console.log('Hoặc cập nhật thủ công trong .env:');
  console.log('   STRAPI_API_TOKEN=your_token_here\n');
  console.log('Sau đó chạy:');
  console.log('   npm run populate:master\n');
}

