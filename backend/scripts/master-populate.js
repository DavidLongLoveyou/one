/**
 * Master Populate Script - Tự động xử lý tất cả
 * 
 * Script này sẽ:
 * 1. Kiểm tra và đợi Strapi sẵn sàng
 * 2. Kiểm tra API Token hoặc hướng dẫn tạo
 * 3. Chạy tất cả phases với error handling
 * 4. Tự động retry và xử lý lỗi
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const MAX_WAIT_TIME = 120000; // 2 minutes
const CHECK_INTERVAL = 3000; // 3 seconds

/**
 * Check if Strapi is running
 */
async function checkStrapi() {
  return new Promise((resolve) => {
    const endpoints = ['/admin', '/api/global-seo'];
    let checked = 0;
    let isRunning = false;
    
    endpoints.forEach((endpoint) => {
      const req = http.get(`${STRAPI_URL}${endpoint}`, (res) => {
        if (!isRunning && (res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 403 || res.statusCode === 404)) {
          isRunning = true;
        }
        checked++;
        if (checked === endpoints.length) {
          resolve(isRunning);
        }
      });
      
      req.on('error', () => {
        checked++;
        if (checked === endpoints.length) {
          resolve(isRunning);
        }
      });
      
      req.setTimeout(2000, () => {
        req.destroy();
        checked++;
        if (checked === endpoints.length) {
          resolve(isRunning);
        }
      });
    });
  });
}

/**
 * Wait for Strapi to be ready
 */
async function waitForStrapi() {
  console.log('⏳ Đang đợi Strapi server sẵn sàng...');
  const startTime = Date.now();
  
  while (Date.now() - startTime < MAX_WAIT_TIME) {
    const isRunning = await checkStrapi();
    if (isRunning) {
      // Wait a bit more for Strapi to fully initialize
      await new Promise(resolve => setTimeout(resolve, 3000));
      return true;
    }
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    process.stdout.write(`\r⏳ Đang đợi Strapi... (${elapsed}s/${MAX_WAIT_TIME / 1000}s)`);
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
  
  return false;
}

/**
 * Check API Token
 */
function checkApiToken() {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    return { hasToken: false, token: null };
  }
  return { hasToken: true, token };
}

/**
 * Test API Token
 */
async function testApiToken(token) {
  return new Promise((resolve) => {
    const req = http.get(`${STRAPI_URL}/api/global-seo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 404);
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Run populate phase with retry
 */
async function runPhaseWithRetry(phase, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`\n🔄 Retry attempt ${attempt}/${maxRetries}...\n`);
      }
      
      await new Promise((resolve, reject) => {
        const script = spawn('node', ['scripts/populate-content.js', phase], {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit',
          shell: true,
        });
        
        script.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Exit code: ${code}`));
          }
        });
        
        script.on('error', reject);
      });
      
      return true;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`\n⚠️  Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(70));
  console.log('🚀 MASTER POPULATE SCRIPT - Tự Động Xử Lý Tất Cả');
  console.log('='.repeat(70));
  console.log('');
  
  // Step 1: Wait for Strapi
  console.log('1️⃣  Kiểm tra Strapi server...');
  const isRunning = await checkStrapi();
  
  if (!isRunning) {
    console.log('⚠️  Strapi chưa chạy, đang đợi...');
    const ready = await waitForStrapi();
    if (!ready) {
      console.log('\n❌ Không thể kết nối đến Strapi sau 2 phút!');
      console.log('\n💡 Hãy đảm bảo:');
      console.log('   1. Strapi server đang chạy: npm run develop');
      console.log('   2. Server đang lắng nghe tại: http://localhost:1337');
      process.exit(1);
    }
  }
  console.log('✅ Strapi server sẵn sàng!\n');
  
  // Step 2: Check API Token
  console.log('2️⃣  Kiểm tra authentication...');
  const { hasToken, token } = checkApiToken();
  
  if (hasToken) {
    console.log('✅ API Token được tìm thấy trong .env');
    console.log('🔍 Đang test API Token...');
    const isValid = await testApiToken(token);
    if (isValid) {
      console.log('✅ API Token hợp lệ!\n');
    } else {
      console.log('❌ API Token không hợp lệ!');
      console.log('\n💡 Hãy kiểm tra:');
      console.log('   1. Token có đúng trong .env không?');
      console.log('   2. Token có type "Full access" không?');
      console.log('   3. Token chưa hết hạn?');
      console.log('\nScript sẽ thử dùng password authentication...\n');
    }
  } else {
    console.log('⚠️  API Token chưa được cấu hình');
    console.log('\n📋 Để tạo API Token:');
    console.log('   1. Mở: http://localhost:1337/admin');
    console.log('   2. Settings > API Tokens > Create new API Token');
    console.log('   3. Name: "Populate Script", Type: "Full access"');
    console.log('   4. Copy token và thêm vào .env: STRAPI_API_TOKEN=token_here');
    console.log('\n💡 Script sẽ thử dùng password authentication...\n');
  }
  
  // Step 3: Run phases
  console.log('3️⃣  Bắt đầu populate content...\n');
  const phases = ['1', '2', '3'];
  const results = [];
  
  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    try {
      console.log(`${'='.repeat(70)}`);
      console.log(`📦 PHASE ${phase} - ${phase === '1' ? 'Foundation' : phase === '2' ? 'Core Content' : 'Pages'}`);
      console.log('='.repeat(70));
      
      await runPhaseWithRetry(phase);
      results.push({ phase, success: true });
      console.log(`\n✅ Phase ${phase} hoàn thành!\n`);
      
      if (i < phases.length - 1) {
        console.log('⏸️  Tạm dừng 3 giây trước phase tiếp theo...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      results.push({ phase, success: false, error: error.message });
      console.error(`\n❌ Phase ${phase} thất bại:`, error.message);
      
      // If authentication error, stop
      if (error.message.includes('Authentication') || error.message.includes('405')) {
        console.log('\n🛑 Dừng lại do lỗi authentication!');
        console.log('\n💡 Giải pháp:');
        console.log('   1. Tạo API Token trong Strapi Admin');
        console.log('   2. Thêm vào .env: STRAPI_API_TOKEN=your_token');
        console.log('   3. Chạy lại: npm run populate:run');
        break;
      }
      
      // Continue with next phase for other errors
      if (i < phases.length - 1) {
        console.log(`\n⚠️  Tiếp tục với phase tiếp theo...\n`);
      }
    }
  }
  
  // Step 4: Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 KẾT QUẢ');
  console.log('='.repeat(70));
  
  results.forEach(({ phase, success, error }) => {
    const status = success ? '✅' : '❌';
    const phaseName = phase === '1' ? 'Foundation' : phase === '2' ? 'Core Content' : 'Pages';
    console.log(`${status} Phase ${phase} (${phaseName}): ${success ? 'Thành công' : 'Thất bại'}`);
    if (error) {
      console.log(`   Lỗi: ${error}`);
    }
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n✨ Hoàn thành: ${successCount}/${results.length} phases`);
  
  if (successCount === results.length) {
    console.log('\n🎉 Tất cả phases đã chạy thành công!');
    console.log('\n📋 Các bước tiếp theo:');
    console.log('   1. Kiểm tra content trong Strapi Admin');
    console.log('   2. Upload images cho các content entries');
    console.log('   3. Cấu hình Homepage với dynamic zones');
    console.log('   4. Link relations giữa các content types');
  } else {
    console.log('\n⚠️  Một số phases thất bại. Xem chi tiết ở trên.');
    console.log('\n💡 Bạn có thể chạy lại phase bị lỗi:');
    results.forEach(({ phase, success }) => {
      if (!success) {
        console.log(`   npm run populate:phase${phase}`);
      }
    });
  }
  
  console.log('');
}

// Run
main().catch((error) => {
  console.error('\n❌ Lỗi không mong đợi:', error.message);
  console.error(error.stack);
  process.exit(1);
});

