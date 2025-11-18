/**
 * Check and Fix .env file for API Token
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '../.env');

async function main() {
  console.log('🔍 Đang kiểm tra .env file...\n');
  
  if (!fs.existsSync(ENV_FILE)) {
    console.log('❌ File .env không tồn tại!');
    console.log('💡 Hãy tạo file .env từ env.example');
    process.exit(1);
  }
  
  const content = fs.readFileSync(ENV_FILE, 'utf8');
  const lines = content.split('\n');
  
  // Find STRAPI_API_TOKEN line
  const tokenLineIndex = lines.findIndex(l => l.trim().startsWith('STRAPI_API_TOKEN'));
  
  if (tokenLineIndex === -1) {
    console.log('⚠️  STRAPI_API_TOKEN chưa có trong .env file');
    console.log('\n📋 Hãy thêm dòng sau vào file .env:');
    console.log('   STRAPI_API_TOKEN=your_token_here');
    console.log('\nHoặc chạy: node scripts/setup-api-token.js YOUR_TOKEN');
  } else {
    const tokenLine = lines[tokenLineIndex];
    const match = tokenLine.match(/STRAPI_API_TOKEN\s*=\s*(.+)/);
    
    if (match && match[1].trim()) {
      const token = match[1].trim();
      console.log('✅ STRAPI_API_TOKEN đã có trong .env');
      console.log(`   Token length: ${token.length} characters`);
      console.log(`   Token preview: ${token.substring(0, 10)}...${token.substring(token.length - 5)}`);
    } else {
      console.log('⚠️  STRAPI_API_TOKEN có trong .env nhưng giá trị trống');
      console.log('   Dòng:', tokenLine);
    }
  }
  
  // Check other required vars
  console.log('\n📋 Kiểm tra các biến khác:');
  const required = ['STRAPI_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
  required.forEach(varName => {
    const line = lines.find(l => l.trim().startsWith(varName + '='));
    if (line) {
      console.log(`   ✅ ${varName}`);
    } else {
      console.log(`   ❌ ${varName} - CHƯA CÓ`);
    }
  });
}

main().catch(console.error);

