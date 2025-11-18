/**
 * Auto Populate Script
 * 
 * Tự động kiểm tra và chạy tất cả phases
 */

const { spawn } = require('child_process');
const http = require('http');

const STRAPI_URL = 'http://localhost:1337';
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000; // 2 seconds

/**
 * Check if Strapi is running
 */
function checkStrapi() {
  return new Promise((resolve) => {
    // Try multiple endpoints to check if Strapi is running
    const endpoints = [
      '/api/global-seo',
      '/api/homepage',
      '/admin',
    ];
    
    let checked = 0;
    let isRunning = false;
    
    endpoints.forEach((endpoint) => {
      const req = http.get(`${STRAPI_URL}${endpoint}`, (res) => {
        // Any response (even 404) means server is running
        if (!isRunning && (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 404)) {
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
  console.log('⏳ Đang kiểm tra Strapi server...');
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    const isRunning = await checkStrapi();
    if (isRunning) {
      console.log('✅ Strapi server đang chạy!\n');
      return true;
    }
    
    process.stdout.write(`\r⏳ Đang chờ Strapi... (${i + 1}/${MAX_RETRIES})`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }
  
  console.log('\n❌ Không thể kết nối đến Strapi server!');
  console.log('\n💡 Hãy đảm bảo:');
  console.log('   1. Strapi server đang chạy: npm run develop');
  console.log('   2. Server đang lắng nghe tại: http://localhost:1337');
  return false;
}

/**
 * Run populate script for a phase
 */
function runPhase(phase) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Đang chạy Phase ${phase}...\n`);
    
    const script = spawn('node', ['scripts/populate-content.js', phase.toString()], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
    });
    
    script.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ Phase ${phase} hoàn thành!\n`);
        resolve();
      } else {
        console.log(`\n❌ Phase ${phase} thất bại với mã lỗi: ${code}\n`);
        reject(new Error(`Phase ${phase} failed with code ${code}`));
      }
    });
    
    script.on('error', (error) => {
      console.error(`\n❌ Lỗi khi chạy Phase ${phase}:`, error.message);
      reject(error);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🚀 AUTO POPULATE SCRIPT - The Great Beans');
  console.log('='.repeat(60));
  console.log('');
  
  // Check if Strapi is running
  const isRunning = await waitForStrapi();
  if (!isRunning) {
    process.exit(1);
  }
  
  // Run phases sequentially
  const phases = [1, 2, 3, 4];
  
  for (const phase of phases) {
    try {
      await runPhase(phase);
      
      // Small delay between phases
      if (phase < phases.length) {
        console.log('⏸️  Tạm dừng 2 giây trước khi chạy phase tiếp theo...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`\n❌ Dừng lại do lỗi ở Phase ${phase}`);
      console.error('💡 Bạn có thể chạy lại phase bị lỗi bằng:');
      console.error(`   npm run populate:phase${phase}`);
      process.exit(1);
    }
  }
  
  console.log('='.repeat(60));
  console.log('✨ HOÀN THÀNH! Tất cả phases đã được chạy thành công!');
  console.log('='.repeat(60));
  console.log('\n📋 Các bước tiếp theo:');
  console.log('   1. Kiểm tra content trong Strapi Admin: http://localhost:1337/admin');
  console.log('   2. Upload images cho các content entries');
  console.log('   3. Cấu hình Homepage với dynamic zones');
  console.log('   4. Link relations giữa các content types');
  console.log('');
}

// Run
main().catch(console.error);

