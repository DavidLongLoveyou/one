/**
 * Add API Token to .env and Run Populate
 * 
 * Usage: node scripts/add-token-and-run.js YOUR_API_TOKEN
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ENV_FILE = path.join(__dirname, '../.env');

/**
 * Add token to .env
 */
function addTokenToEnv(token) {
  if (!fs.existsSync(ENV_FILE)) {
    console.error('❌ File .env không tồn tại!');
    process.exit(1);
  }
  
  let content = fs.readFileSync(ENV_FILE, 'utf8');
  
  // Remove existing STRAPI_API_TOKEN
  content = content.replace(/STRAPI_API_TOKEN\s*=.*\n/g, '');
  
  // Add new token
  content += `\n# Strapi API Token for populate scripts\nSTRAPI_API_TOKEN=${token}\n`;
  
  fs.writeFileSync(ENV_FILE, content);
  console.log('✅ Đã thêm API Token vào .env file');
}

/**
 * Run populate
 */
function runPopulate() {
  return new Promise((resolve, reject) => {
    console.log('\n🚀 Đang chạy populate scripts...\n');
    
    const script = spawn('node', ['scripts/populate-content.js', '1'], {
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
}

async function main() {
  const token = process.argv[2];
  
  if (!token) {
    console.log('❌ Vui lòng cung cấp API Token!');
    console.log('\nUsage: node scripts/add-token-and-run.js YOUR_API_TOKEN');
    console.log('\nHoặc thêm trực tiếp vào .env:');
    console.log('   STRAPI_API_TOKEN=your_token_here');
    process.exit(1);
  }
  
  console.log('🔑 Đang thêm API Token vào .env...');
  addTokenToEnv(token);
  
  // Wait a bit for file to be written
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Reload env
  delete require.cache[require.resolve('dotenv')];
  require('dotenv').config({ path: ENV_FILE });
  
  // Run populate
  try {
    await runPopulate();
    console.log('\n✨ Hoàn thành!');
  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);

