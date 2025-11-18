/**
 * Fix Database SSL Config and Populate Script
 * 
 * Tự động fix database SSL config và chạy populate
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ENV_FILE = path.join(__dirname, '../.env');
const ENV_EXAMPLE = path.join(__dirname, '../env.example');

/**
 * Fix .env file - ensure DATABASE_SSL=false
 */
function fixEnvFile() {
  console.log('🔧 Đang kiểm tra và sửa file .env...\n');
  
  let envContent = '';
  let needsFix = false;
  
  // Read existing .env or create from example
  if (fs.existsSync(ENV_FILE)) {
    envContent = fs.readFileSync(ENV_FILE, 'utf8');
  } else if (fs.existsSync(ENV_EXAMPLE)) {
    console.log('📋 Tạo .env từ env.example...');
    envContent = fs.readFileSync(ENV_EXAMPLE, 'utf8');
    needsFix = true;
  } else {
    console.log('❌ Không tìm thấy .env hoặc env.example!');
    return false;
  }
  
  // Check if DATABASE_SSL is set
  if (!envContent.includes('DATABASE_SSL=')) {
    console.log('➕ Thêm DATABASE_SSL=false vào .env...');
    // Add after DATABASE_PASSWORD line
    if (envContent.includes('DATABASE_PASSWORD=')) {
      envContent = envContent.replace(
        /(DATABASE_PASSWORD=.*)/,
        `$1\nDATABASE_SSL=false`
      );
    } else {
      // Add at end of database section
      envContent += '\n# Disable SSL for local development\nDATABASE_SSL=false\n';
    }
    needsFix = true;
  } else if (envContent.includes('DATABASE_SSL=true')) {
    console.log('🔧 Đang đổi DATABASE_SSL từ true sang false...');
    envContent = envContent.replace(/DATABASE_SSL\s*=\s*true/gi, 'DATABASE_SSL=false');
    needsFix = true;
  }
  
  // Ensure DATABASE_SSL_REJECT_UNAUTHORIZED is not set or false
  if (envContent.includes('DATABASE_SSL_REJECT_UNAUTHORIZED=true')) {
    console.log('🔧 Đang đổi DATABASE_SSL_REJECT_UNAUTHORIZED từ true sang false...');
    envContent = envContent.replace(/DATABASE_SSL_REJECT_UNAUTHORIZED\s*=\s*true/gi, 'DATABASE_SSL_REJECT_UNAUTHORIZED=false');
    needsFix = true;
  }
  
  if (needsFix) {
    fs.writeFileSync(ENV_FILE, envContent);
    console.log('✅ Đã sửa file .env!\n');
  } else {
    console.log('✅ File .env đã đúng cấu hình!\n');
  }
  
  return true;
}

/**
 * Check if PostgreSQL is running
 */
function checkPostgreSQL() {
  return new Promise((resolve) => {
    console.log('🔍 Đang kiểm tra PostgreSQL...');
    
    // Try to connect using psql or check port
    const net = require('net');
    const socket = new net.Socket();
    
    socket.setTimeout(2000);
    socket.on('connect', () => {
      socket.destroy();
      console.log('✅ PostgreSQL đang chạy!\n');
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      console.log('⚠️  Không thể kết nối PostgreSQL (có thể đang chạy nhưng không trả lời)\n');
      resolve(true); // Assume it's running, let Strapi handle the error
    });
    
    socket.on('error', () => {
      console.log('❌ PostgreSQL không chạy!');
      console.log('💡 Hãy chạy: docker-compose up -d\n');
      resolve(false);
    });
    
    socket.connect(5432, 'localhost');
  });
}

/**
 * Run populate script
 */
function runPopulate() {
  return new Promise((resolve, reject) => {
    console.log('📦 Đang chạy populate scripts...\n');
    console.log('='.repeat(60));
    
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
  console.log('🔧 FIX DATABASE & POPULATE SCRIPT');
  console.log('='.repeat(60));
  console.log('');
  
  // Step 1: Fix .env file
  if (!fixEnvFile()) {
    process.exit(1);
  }
  
  // Step 2: Check PostgreSQL (optional, just a warning)
  await checkPostgreSQL();
  
  // Step 3: Run populate
  try {
    await runPopulate();
    console.log('\n✨ Hoàn thành!');
  } catch (error) {
    console.error('\n❌ Lỗi khi chạy populate:', error.message);
    console.log('\n💡 Nếu lỗi vẫn còn, hãy:');
    console.log('   1. Kiểm tra PostgreSQL đang chạy: docker-compose up -d');
    console.log('   2. Kiểm tra .env có DATABASE_SSL=false');
    console.log('   3. Restart Strapi: npm run develop');
    console.log('   4. Chạy lại: npm run populate:auto');
    process.exit(1);
  }
}

// Run
main().catch(console.error);

