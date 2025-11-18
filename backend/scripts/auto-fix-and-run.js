/**
 * Auto Fix and Run Populate Script
 * 
 * Tự động xử lý các vấn đề và chạy populate
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ENV_FILE = path.join(__dirname, '../.env');

/**
 * Check if Strapi is running
 */
function checkStrapi() {
  return new Promise((resolve) => {
    const req = http.get(`${STRAPI_URL}/admin`, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 403);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Check if API Token exists
 */
function hasApiToken() {
  return !!process.env.STRAPI_API_TOKEN;
}

/**
 * Run populate script
 */
function runPopulate(phase = '1') {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 Đang chạy Phase ${phase}...\n`);
    
    const script = spawn('node', ['scripts/populate-content.js', phase], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
    });
    
    script.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Phase ${phase} failed with code ${code}`));
      }
    });
    
    script.on('error', reject);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🚀 AUTO FIX AND RUN POPULATE');
  console.log('='.repeat(60));
  console.log('');
  
  // Step 1: Check Strapi
  console.log('1️⃣  Kiểm tra Strapi server...');
  const isRunning = await checkStrapi();
  if (!isRunning) {
    console.log('❌ Strapi server chưa chạy!');
    console.log('\n💡 Hãy chạy Strapi trong terminal khác:');
    console.log('   cd backend');
    console.log('   npm run develop');
    console.log('\nSau đó chạy lại script này.');
    process.exit(1);
  }
  console.log('✅ Strapi server đang chạy\n');
  
  // Step 2: Check API Token
  console.log('2️⃣  Kiểm tra API Token...');
  if (!hasApiToken()) {
    console.log('⚠️  API Token chưa được cấu hình!');
    console.log('\n📋 Hướng dẫn tạo API Token:');
    console.log('   1. Mở Strapi Admin: http://localhost:1337/admin');
    console.log('   2. Vào: Settings > API Tokens');
    console.log('   3. Click "Create new API Token"');
    console.log('   4. Điền:');
    console.log('      - Name: Populate Script');
    console.log('      - Token type: Full access');
    console.log('      - Token duration: Unlimited');
    console.log('   5. Click "Save" và copy token');
    console.log('   6. Thêm vào file backend/.env:');
    console.log('      STRAPI_API_TOKEN=your_token_here');
    console.log('   7. Chạy lại script này');
    console.log('');
    console.log('⏳ Đang thử dùng password authentication...\n');
  } else {
    console.log('✅ API Token đã được cấu hình\n');
  }
  
  // Step 3: Run phases
  const phases = ['1', '2', '3'];
  
  for (const phase of phases) {
    try {
      await runPopulate(phase);
      
      if (phase < phases[phases.length - 1]) {
        console.log('\n⏸️  Tạm dừng 2 giây...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`\n❌ Phase ${phase} thất bại:`, error.message);
      
      if (error.message.includes('Authentication failed') || error.message.includes('405')) {
        console.log('\n💡 Giải pháp: Tạo API Token');
        console.log('   Script sẽ dừng lại. Hãy tạo API Token và chạy lại.');
        process.exit(1);
      }
      
      // Continue with next phase if it's not auth error
      console.log(`\n⚠️  Bỏ qua Phase ${phase}, tiếp tục với phase tiếp theo...\n`);
    }
  }
  
  console.log('='.repeat(60));
  console.log('✨ HOÀN THÀNH!');
  console.log('='.repeat(60));
}

main().catch(console.error);

