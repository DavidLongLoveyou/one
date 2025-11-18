/**
 * Restart Strapi and Populate Script
 * 
 * Tự động restart Strapi với config mới và chạy populate
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';

/**
 * Check if Strapi is running (improved)
 */
function checkStrapi() {
  return new Promise((resolve) => {
    // Try admin endpoint which always exists
    const req = http.get(`${STRAPI_URL}/admin`, (res) => {
      // Any response means server is running
      resolve(true);
    });
    
    req.on('error', () => {
      // Try one more endpoint
      const req2 = http.get(`${STRAPI_URL}/_health`, (res) => {
        resolve(true);
      });
      
      req2.on('error', () => {
        // Last try - just check if port is open
        const net = require('net');
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.on('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        socket.on('error', () => resolve(false));
        socket.connect(1337, 'localhost');
      });
      
      req2.setTimeout(1000, () => {
        req2.destroy();
        resolve(false);
      });
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Wait for Strapi to be ready
 */
async function waitForStrapi(maxWait = 120000) {
  console.log('⏳ Đang đợi Strapi sẵn sàng...');
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    const isRunning = await checkStrapi();
    if (isRunning) {
      // Wait a bit more for Strapi to fully initialize
      await new Promise(resolve => setTimeout(resolve, 3000));
      return true;
    }
    
    process.stdout.write(`\r⏳ Đang đợi... (${Math.floor((Date.now() - startTime) / 1000)}s)`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return false;
}

/**
 * Run populate script
 */
function runPopulate() {
  return new Promise((resolve, reject) => {
    console.log('\n📦 Đang chạy populate scripts...\n');
    
    const script = spawn('node', ['scripts/populate-content.js', '1'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
    });
    
    script.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Phase 1 failed with code ${code}`));
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
  console.log('🔄 RESTART & POPULATE SCRIPT');
  console.log('='.repeat(60));
  console.log('');
  console.log('📋 Hướng dẫn:');
  console.log('   1. Script sẽ kiểm tra Strapi đang chạy');
  console.log('   2. Nếu chưa chạy, bạn cần start Strapi trong terminal khác:');
  console.log('      npm run develop');
  console.log('   3. Sau đó chạy lại script này');
  console.log('');
  
  // Check if Strapi is running
  console.log('🔍 Đang kiểm tra Strapi server...');
  const isRunning = await checkStrapi();
  
  if (!isRunning) {
    console.log('❌ Strapi server chưa chạy!');
    console.log('');
    console.log('💡 Hãy làm theo các bước sau:');
    console.log('   1. Mở terminal mới');
    console.log('   2. cd backend');
    console.log('   3. npm run develop');
    console.log('   4. Đợi Strapi khởi động xong (thấy "Server started")');
    console.log('   5. Quay lại terminal này và chạy lại: npm run populate:auto');
    console.log('');
    process.exit(1);
  }
  
  console.log('✅ Strapi server đang chạy!\n');
  
  // Wait a bit to ensure Strapi is fully ready
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Run populate phases sequentially
  const phases = [1, 2, 3];
  
  for (const phase of phases) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🚀 Đang chạy Phase ${phase}...`);
      console.log('='.repeat(60));
      
      const script = spawn('node', ['scripts/populate-content.js', phase.toString()], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        shell: true,
      });
      
      await new Promise((resolve, reject) => {
        script.on('close', (code) => {
          if (code === 0) {
            console.log(`\n✅ Phase ${phase} hoàn thành!\n`);
            resolve();
          } else {
            reject(new Error(`Phase ${phase} failed with code ${code}`));
          }
        });
        script.on('error', reject);
      });
      
      // Small delay between phases
      if (phase < phases.length) {
        console.log('⏸️  Tạm dừng 3 giây...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`\n❌ Lỗi ở Phase ${phase}:`, error.message);
      console.log(`\n💡 Bạn có thể chạy lại phase này: npm run populate:phase${phase}`);
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

