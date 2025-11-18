/**
 * Start Strapi and Populate Script
 * 
 * Tự động start Strapi server và chạy populate scripts
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';
const MAX_WAIT_TIME = 120000; // 2 minutes
const CHECK_INTERVAL = 3000; // 3 seconds

let strapiProcess = null;

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
 * Start Strapi server
 */
function startStrapi() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Đang khởi động Strapi server...\n');
    
    strapiProcess = spawn('npm', ['run', 'develop'], {
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });
    
    let output = '';
    
    strapiProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      
      // Show important messages
      if (text.includes('Server started') || text.includes('localhost:1337')) {
        console.log('✅ Strapi server đã khởi động!\n');
      }
    });
    
    strapiProcess.stderr.on('data', (data) => {
      const text = data.toString();
      // Only show errors, not warnings
      if (text.includes('Error') || text.includes('error')) {
        console.error('❌ Strapi Error:', text);
      }
    });
    
    strapiProcess.on('error', (error) => {
      console.error('❌ Không thể khởi động Strapi:', error.message);
      reject(error);
    });
    
    // Wait for server to be ready
    const startTime = Date.now();
    const checkInterval = setInterval(async () => {
      const isRunning = await checkStrapi();
      
      if (isRunning) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > MAX_WAIT_TIME) {
        clearInterval(checkInterval);
        reject(new Error('Strapi server không khởi động được trong thời gian cho phép'));
      }
    }, CHECK_INTERVAL);
  });
}

/**
 * Stop Strapi server
 */
function stopStrapi() {
  if (strapiProcess) {
    console.log('\n🛑 Đang dừng Strapi server...');
    strapiProcess.kill();
    strapiProcess = null;
    console.log('✅ Strapi server đã dừng');
  }
}

/**
 * Run populate script
 */
function runPopulate() {
  return new Promise((resolve, reject) => {
    console.log('📦 Đang chạy populate scripts...\n');
    
    const script = spawn('node', ['scripts/auto-populate.js'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
    });
    
    script.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Populate script failed with code ${code}`));
      }
    });
    
    script.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🚀 START AND POPULATE SCRIPT');
  console.log('='.repeat(60));
  console.log('');
  
  // Check if Strapi is already running
  const isRunning = await checkStrapi();
  
  if (isRunning) {
    console.log('✅ Strapi server đã đang chạy!\n');
    // Just run populate
    await runPopulate();
  } else {
    // Start Strapi first
    try {
      await startStrapi();
      
      // Wait a bit more for Strapi to be fully ready
      console.log('⏳ Đang chờ Strapi sẵn sàng...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Run populate
      await runPopulate();
      
    } catch (error) {
      console.error('\n❌ Lỗi:', error.message);
      stopStrapi();
      process.exit(1);
    }
  }
  
  console.log('\n✨ Hoàn thành!');
  console.log('\n💡 Lưu ý: Strapi server vẫn đang chạy.');
  console.log('   Để dừng server, nhấn Ctrl+C hoặc đóng terminal.\n');
  
  // Keep process alive
  process.on('SIGINT', () => {
    stopStrapi();
    process.exit(0);
  });
}

// Run
main().catch((error) => {
  console.error('\n❌ Lỗi:', error.message);
  stopStrapi();
  process.exit(1);
});

