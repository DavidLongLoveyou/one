/**
 * Check API Token and provide fix instructions
 */

require('dotenv').config();

const API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🔍 Checking API Token Configuration...\n');

if (!API_TOKEN) {
  console.log('❌ STRAPI_API_TOKEN not found in .env');
  console.log('\n💡 Solution:');
  console.log('   1. Go to Strapi Admin: http://localhost:1337/admin');
  console.log('   2. Navigate to: Settings > API Tokens');
  console.log('   3. Click "Create new API Token"');
  console.log('   4. Set Token type: "Full access" (NOT "Read-only")');
  console.log('   5. Copy the token');
  console.log('   6. Add to .env: STRAPI_API_TOKEN=your_token_here');
  process.exit(1);
}

console.log('✅ STRAPI_API_TOKEN found in .env');
console.log(`   Token length: ${API_TOKEN.length} characters`);
console.log(`   Token preview: ${API_TOKEN.substring(0, 15)}...${API_TOKEN.substring(API_TOKEN.length - 5)}`);

// Check if it's a placeholder
if (API_TOKEN.includes('YOUR_API_TOKEN') || API_TOKEN.includes('your_token') || API_TOKEN.length < 20) {
  console.log('\n⚠️  Token appears to be a placeholder or too short');
  console.log('\n💡 Solution:');
  console.log('   1. Go to Strapi Admin: http://localhost:1337/admin');
  console.log('   2. Navigate to: Settings > API Tokens');
  console.log('   3. Click "Create new API Token"');
  console.log('   4. Set Token type: "Full access" (NOT "Read-only")');
  console.log('   5. Copy the token (it will only show once!)');
  console.log('   6. Update .env: STRAPI_API_TOKEN=your_actual_token_here');
  process.exit(1);
}

console.log('\n✅ Token looks valid!');
console.log('\n⚠️  If you still get 405 errors, the token might be "Read-only"');
console.log('\n💡 To fix:');
console.log('   1. Go to Strapi Admin: Settings > API Tokens');
console.log('   2. Check your token type - it MUST be "Full access"');
console.log('   3. If it\'s "Read-only", create a new token with "Full access"');
console.log('   4. Update .env with the new token');
console.log('');

