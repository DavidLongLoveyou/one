/**
 * Strapi Content Population Script
 * 
 * This script automatically populates Strapi CMS with content for The Great Beans
 * following the STRAPI-CONTENT-POPULATION-GUIDE.md
 * 
 * Usage:
 *   node scripts/populate-content.js [phase]
 * 
 * Phases:
 *   1 - Foundation (Global SEO, Site Settings, Author, Certification, Category)
 *   2 - Core Content (Product, Service, Testimonial, Knowledge Asset)
 *   3 - Pages (Contact Page, About Page, Homepage)
 *   4 - Link Relations (cross-linking)
 * 
 * Prerequisites:
 *   1. Strapi server must be running (npm run develop)
 *   2. Admin user must be created
 *   3. Public role permissions must be configured
 *   4. Vietnamese locale must be added in Strapi admin
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
// Load .env with explicit path
const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

// Debug: Log if API_TOKEN is loaded (without showing the actual token)
if (process.env.STRAPI_API_TOKEN) {
  console.log(`[DEBUG] API Token detected (length: ${process.env.STRAPI_API_TOKEN.length})`);
}

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'huythuyca2022@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Phanduchuy1.';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// State
let authToken = null;
let createdContent = {
  authors: [],
  certifications: [],
  categories: [],
  products: [],
  services: [],
  testimonials: [],
  knowledgeAssets: [],
};

/**
 * Make HTTP request
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
      },
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: json });
          } else {
            // Include full error details
            const errorMsg = json.error 
              ? `${json.error.name || 'Error'}: ${json.error.message || JSON.stringify(json)}`
              : JSON.stringify(json);
            reject(new Error(`HTTP ${res.statusCode}: ${errorMsg}`));
          }
        } catch (e) {
          // If JSON parse fails, return raw data
          reject(new Error(`HTTP ${res.statusCode}: ${data || 'No response data'}`));
        }
      });
    });

    req.on('error', (err) => {
      // Provide more detailed error information
      let errorMsg = `Request error: ${err.message}`;
      if (err.code === 'ECONNREFUSED') {
        errorMsg = `Connection refused: Cannot connect to ${urlObj.hostname}:${urlObj.port || (isHttps ? 443 : 80)}. Is Strapi server running?`;
      } else if (err.code === 'ENOTFOUND') {
        errorMsg = `Host not found: ${urlObj.hostname}`;
      } else if (err.code === 'ETIMEDOUT') {
        errorMsg = `Connection timeout: Server did not respond in time`;
      }
      reject(new Error(errorMsg));
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.setTimeout(10000); // 10 second timeout
    
    if (options.body) {
      const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      req.write(bodyStr);
    }
    req.end();
  });
}

/**
 * Authenticate with Strapi
 * Supports both API Token and Admin Password authentication
 */
async function authenticate() {
  let shouldUseAdminAuth = false;
  
  // If API Token is provided, try it first
  if (API_TOKEN) {
    console.log('🔐 Using API Token for authentication...');
    authToken = API_TOKEN;
    
    // Test the token - 404 is OK (means server is running, just no content yet)
    try {
      const testResponse = await request(`${STRAPI_URL}/api/global-seo`);
      console.log('✅ API Token is valid!');
      return true;
    } catch (error) {
      // 404 means server is running and token works, just no content yet
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('✅ API Token is valid! (404 is normal if content not created yet)');
        // Test write permission by trying a POST (will fail but check error code)
        try {
          await request(`${STRAPI_URL}/api/authors`, {
            method: 'POST',
            body: { data: { name: '__test__' } },
          });
          // If POST succeeds, token has write permissions
          console.log('✅ API Token has write permissions!');
          return true;
        } catch (writeError) {
          // 405 means token doesn't have write permissions (even if type is Full access)
          if (writeError.message.includes('405')) {
            console.log('⚠️  API Token returned 405 (Method Not Allowed)');
            console.log('   This can happen even with "Full access" type if:');
            console.log('   1. Permissions not configured in token settings');
            console.log('   2. Strapi v5 requires explicit permissions for each content type');
            console.log('   Falling back to admin password authentication...');
            // Clear API token and flag to use admin auth
            authToken = null;
            shouldUseAdminAuth = true;
            // Break out of API Token block
          } else {
            // Other error (might be validation error, which means token works)
            console.log('✅ API Token appears to have write permissions (error is not 405)');
            return true;
          }
        }
      } else {
        // 401/403 means token is invalid
        if (error.message.includes('401') || error.message.includes('403') || error.message.includes('Unauthorized')) {
          console.error('❌ API Token test failed: Token is invalid or expired');
          console.log('\n💡 Make sure:');
          console.log('   1. API Token is correct in .env (STRAPI_API_TOKEN)');
          console.log('   2. Token has "Full access" type in Strapi Admin');
          console.log('   3. Token has not expired');
          // Fall through to try admin auth
          authToken = null;
          shouldUseAdminAuth = true;
        } else {
          // Other errors might be connection issues
          console.error('❌ API Token test failed:', error.message);
          console.log('\n💡 Make sure:');
          console.log('   1. Strapi server is running');
          console.log('   2. API Token is correct');
          return false;
        }
      }
    }
  }
  
  // If we reach here, either no API Token, it's Read-only, or we need to use admin auth
  if ((!authToken || shouldUseAdminAuth) && ADMIN_EMAIL && ADMIN_PASSWORD) {
    console.log('🔐 Authenticating with Strapi Admin (password)...');
    console.log('💡 Tip: For better security, use API Token with "Full access" type (see .env STRAPI_API_TOKEN)');
  
  try {
    // Try /admin/auth/login first (Strapi v5)
    const endpoints = [
      { url: `${STRAPI_URL}/admin/auth/login`, body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } },
      { url: `${STRAPI_URL}/admin/auth/local`, body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } },
      { url: `${STRAPI_URL}/admin/auth/local`, body: { identifier: ADMIN_EMAIL, password: ADMIN_PASSWORD } },
    ];
    
    let lastError = null;
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      try {
        console.log(`   Trying: ${endpoint.url}`);
        const response = await request(endpoint.url, {
          method: 'POST',
          body: endpoint.body,
        });
      
        // Admin auth returns data.token or data.data.token
        authToken = response.data.token || response.data.data?.token || response.data.jwt;
        
        if (!authToken) {
          throw new Error('No token received in response');
        }
        
        console.log('✅ Authentication successful');
        return true;
      } catch (error) {
        lastError = error;
        // Log error details for debugging
        const errorMsg = error.message || 'Unknown error';
        if (errorMsg.includes('404')) {
          console.log(`   ❌ Endpoint not found (404)`);
        } else if (errorMsg.includes('405')) {
          console.log(`   ❌ Method not allowed (405)`);
        } else if (errorMsg.includes('401') || errorMsg.includes('403')) {
          console.log(`   ❌ Unauthorized (${errorMsg.includes('401') ? '401' : '403'}) - Check credentials`);
        } else if (errorMsg.includes('ECONNREFUSED')) {
          console.log(`   ❌ Connection refused - Strapi server may not be running`);
        } else {
          console.log(`   ❌ Error: ${errorMsg.substring(0, 100)}`);
        }
        
        // If this is not the last endpoint, try next one
        if (i < endpoints.length - 1) {
          console.log(`   Trying next endpoint...`);
          continue;
        }
        // If this is the last endpoint, throw the error
        throw error;
      }
    }
    
    // Should not reach here, but just in case
    throw lastError || new Error('All authentication endpoints failed');
    
  } catch (error) {
    console.error('\n❌ Admin authentication failed');
    const errorMsg = error.message || 'Unknown error';
    console.error(`   Error: ${errorMsg}`);
    
    // Parse error response for more details
    if (errorMsg.includes('HTTP')) {
      try {
        // Try to extract JSON from error message
        const jsonMatch = errorMsg.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const errorData = JSON.parse(jsonMatch[0]);
          if (errorData.error) {
            console.error(`   Error Type: ${errorData.error.name || 'Unknown'}`);
            console.error(`   Error Message: ${errorData.error.message || 'No message'}`);
            if (errorData.error.details) {
              console.error(`   Details:`, JSON.stringify(errorData.error.details, null, 2));
            }
          } else {
            console.error(`   Full Response:`, JSON.stringify(errorData, null, 2).substring(0, 500));
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Check for specific error types
    if (errorMsg.includes('ECONNREFUSED')) {
      console.error('\n   ⚠️  Connection refused: Strapi server may not be running');
      console.error('   Solution: Start Strapi with "npm run develop"');
    } else if (errorMsg.includes('404')) {
      console.error('\n   ⚠️  Endpoint not found: Admin auth endpoint may have changed in Strapi v5');
      console.error('   Solution: Check Strapi documentation for correct endpoint');
    } else if (errorMsg.includes('405')) {
      console.error('\n   ⚠️  Method not allowed: POST may not be supported for admin auth');
      console.error('   Solution: Strapi v5 may require different authentication method');
    } else if (errorMsg.includes('401') || errorMsg.includes('403')) {
      console.error('\n   ⚠️  Unauthorized: Check admin credentials');
    }
    
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Verify Strapi server is running: http://localhost:1337/admin');
    console.log('   2. Verify admin user exists with email:', ADMIN_EMAIL);
    console.log('   3. Test credentials by logging in manually at http://localhost:1337/admin');
    console.log('   4. Check .env file has correct ADMIN_EMAIL and ADMIN_PASSWORD');
    console.log('   5. Note: Strapi v5 may not support programmatic admin login via REST API');
    console.log('\n💡 Alternative Solutions:');
    console.log('   Option 1: Configure API Token permissions in Strapi Admin');
    console.log('      - Settings > API Tokens > Your Token');
    console.log('      - Enable create/update/delete for each content type');
    console.log('   Option 2: Use Strapi\'s programmatic API (requires running in Strapi context)');
    console.log('   Option 3: Manually populate content via Strapi Admin UI');
    
    return false;
    }
  }
  
  // If no authentication method worked
  if (!authToken) {
    console.error('❌ No valid authentication method available');
    console.log('\n💡 Please provide either:');
    console.log('   1. STRAPI_API_TOKEN with "Full access" type in .env');
    console.log('   2. Or ADMIN_EMAIL and ADMIN_PASSWORD in .env');
    return false;
  }
  
  return true;
}

/**
 * Create content entry
 */
async function createContent(contentType, data, locale = 'en') {
  // Handle plural/singular names correctly
  const apiPath = contentType.includes('-') ? contentType : contentType;
  const url = locale === 'en' 
    ? `${STRAPI_URL}/api/${apiPath}`
    : `${STRAPI_URL}/api/${apiPath}?locale=${locale}`;
  
  try {
    const response = await request(url, {
      method: 'POST',
      body: data,
    });
    return response.data.data;
  } catch (error) {
    // Check if it's a 405 error - might be permissions issue
    if (error.message.includes('405')) {
      console.error(`❌ Failed to create ${contentType}: Method Not Allowed (405)`);
      console.error(`   URL tried: ${url}`);
      console.error(`   This can happen even with "Full access" API Token if:`);
      console.error(`   1. Permissions not configured in token settings (Strapi v5)`);
      console.error(`   2. Token needs explicit permissions for each content type`);
      console.error(`   3. Solution: Use admin JWT token instead (script will auto-fallback)`);
      
      // If using API Token and got 405, try to re-authenticate with admin
      if (API_TOKEN && authToken === API_TOKEN) {
        console.error(`   Attempting to re-authenticate with admin credentials...`);
        // This will be handled by the caller or retry logic
      }
    } else {
      console.error(`❌ Failed to create ${contentType}:`, error.message);
    }
    throw error;
  }
}

/**
 * Update content entry
 */
async function updateContent(contentType, id, data, locale = 'en') {
  const url = locale === 'en'
    ? `${STRAPI_URL}/api/${contentType}/${id}`
    : `${STRAPI_URL}/api/${contentType}/${id}?locale=${locale}`;
  
  try {
    const response = await request(url, {
      method: 'PUT',
      body: data,
    });
    return response.data.data;
  } catch (error) {
    console.error(`❌ Failed to update ${contentType}:`, error.message);
    throw error;
  }
}

/**
 * Publish content
 */
async function publishContent(contentType, id, locale = 'en') {
  const url = locale === 'en'
    ? `${STRAPI_URL}/api/${contentType}/${id}/actions/publish`
    : `${STRAPI_URL}/api/${contentType}/${id}/actions/publish?locale=${locale}`;
  
  try {
    const response = await request(url, {
      method: 'POST',
    });
    return response.data.data;
  } catch (error) {
    console.error(`❌ Failed to publish ${contentType}:`, error.message);
    throw error;
  }
}

/**
 * Phase 1: Foundation
 */
async function phase1() {
  console.log('\n📦 PHASE 1: FOUNDATION\n');
  console.log('='.repeat(50));

  // 1. Global SEO (Single Type)
  console.log('\n1️⃣  Creating Global SEO...');
  try {
    const globalSeo = {
      data: {
        site_url: 'https://thegreatbeans.com',
        default_meta_title: 'The Great Beans - Premium Robusta Coffee from Vietnam | Farm-to-Cup Excellence',
        default_meta_description: 'CQI-certified specialty coffee processor in Lâm Đồng, Vietnam. 6 tons/hour capacity, modern facility, OEM/Private Label services. Farm-to-cup excellence since 2018.',
        google_site_verification: '',
        google_analytics_id: '',
        google_tag_manager_id: '',
      },
    };
    await updateContent('global-seo', 1, globalSeo);
    await publishContent('global-seo', 1);
    console.log('✅ Global SEO created');
  } catch (error) {
    console.log('⚠️  Global SEO may already exist or needs manual creation');
  }

  // 2. Site Settings (i18n)
  console.log('\n2️⃣  Creating Site Settings (EN)...');
  try {
    const siteSettingsEN = {
      data: {
        site_name: 'The Great Beans',
        site_description: 'Premium Robusta specialty coffee from Lâm Đồng, Vietnam. Farm-to-cup excellence with CQI-certified processing, 6 tons/hour capacity, and modern 2024 facility.',
        contact_email: 'info@thegreatbeans.com',
        contact_phone: '+84 90 000 0000',
        address: 'The Great Beans Co., Ltd.\nTrường Xuân Commune\nLâm Đồng Province, Vietnam',
        social_media: {
          facebook: 'https://facebook.com/thegreatbeans',
          linkedin: 'https://linkedin.com/company/thegreatbeans',
          instagram: 'https://instagram.com/thegreatbeans',
          youtube: 'https://youtube.com/@thegreatbeans',
        },
      },
    };
    await updateContent('site-settings', 1, siteSettingsEN, 'en');
    await publishContent('site-settings', 1, 'en');
    console.log('✅ Site Settings (EN) created');

    console.log('\n2️⃣  Creating Site Settings (VI)...');
    const siteSettingsVI = {
      data: {
        site_name: 'The Great Beans',
        site_description: 'Cà phê Robusta đặc sản thượng hạng từ Lâm Đồng, Việt Nam. Tinh hoa từ nông trại đến ly cà phê với chế biến được chứng nhận CQI, công suất 6 tấn/giờ, và nhà máy hiện đại năm 2024.',
        address: 'Công ty TNHH The Great Beans\nXã Trường Xuân\nTỉnh Lâm Đồng, Việt Nam',
      },
    };
    await updateContent('site-settings', 1, siteSettingsVI, 'vi');
    await publishContent('site-settings', 1, 'vi');
    console.log('✅ Site Settings (VI) created');
  } catch (error) {
    console.log('⚠️  Site Settings may need manual creation');
  }

  // 3. Authors
  console.log('\n3️⃣  Creating Authors...');
  try {
    const ceoAuthor = {
      data: {
        name: 'Nguyễn Khánh Tùng',
        title: 'CEO',
        bio: 'Founder and CEO of The Great Beans. CQI Q Processing Level 2 certified professional. One of the first participants in CQI specialty coffee processing course taught by Dr. Manuel Diaz in Vietnam. Leading Vietnam\'s specialty Robusta coffee industry since 2018.',
        email: 'ceo@thegreatbeans.com',
      },
    };
    const author = await createContent('authors', ceoAuthor);
    await publishContent('authors', author.id);
    createdContent.authors.push(author);
    console.log('✅ CEO Author created');
  } catch (error) {
    console.log('⚠️  Author may already exist');
  }

  // 4. Certifications (i18n)
  console.log('\n4️⃣  Creating Certifications (EN)...');
  const certificationsEN = [
    {
      name: 'CQI Q Processing Level 2',
      description: 'Professional processing certification from the Coffee Quality Institute. Q Processing Level 2 signifies advanced knowledge and expertise in specialty coffee processing methods, quality control, and industry standards.',
      issued_date: '2024-08-15',
    },
    {
      name: 'Vietnam Specialty Coffee Certified',
      description: 'All Robusta samples submitted by The Great Beans were certified as Vietnam Specialty Coffee, validating the company\'s quality standards and processing expertise.',
      issued_date: '2024-05-01',
    },
    {
      name: 'Vietnam Amazing Cup 2024 Co-Sponsor',
      description: 'The Great Beans became a co-sponsor of the Vietnam Amazing Cup 2024, demonstrating commitment to Vietnam\'s specialty coffee industry.',
      issued_date: '2024-04-01',
    },
  ];

  for (const cert of certificationsEN) {
    try {
      const certData = { data: cert };
      const created = await createContent('certifications', certData, 'en');
      await publishContent('certifications', created.id, 'en');
      createdContent.certifications.push(created);
      console.log(`✅ Certification "${cert.name}" (EN) created`);
    } catch (error) {
      console.log(`⚠️  Certification "${cert.name}" may already exist`);
    }
  }

  console.log('\n4️⃣  Creating Certifications (VI)...');
  const certificationsVI = [
    {
      name: 'CQI Q Processing Level 2',
      description: 'Chứng nhận chế biến chuyên nghiệp từ Viện Chất lượng Cà phê. Q Processing Level 2 thể hiện kiến thức và chuyên môn nâng cao về phương pháp chế biến cà phê đặc sản, kiểm soát chất lượng và tiêu chuẩn ngành.',
    },
    {
      name: 'Chứng nhận Cà phê Đặc sản Việt Nam',
      description: 'Tất cả các mẫu Robusta do The Great Beans gửi đều được chứng nhận là Cà phê Đặc sản Việt Nam, xác nhận tiêu chuẩn chất lượng và chuyên môn chế biến của công ty.',
    },
    {
      name: 'Đồng hành Vietnam Amazing Cup 2024',
      description: 'The Great Beans trở thành đơn vị đồng hành của Vietnam Amazing Cup 2024, thể hiện cam kết với ngành cà phê đặc sản Việt Nam.',
    },
  ];

  for (let i = 0; i < certificationsVI.length; i++) {
    try {
      const certData = { data: certificationsVI[i] };
      const created = await createContent('certifications', certData, 'vi');
      await publishContent('certifications', created.id, 'vi');
      console.log(`✅ Certification "${certificationsVI[i].name}" (VI) created`);
    } catch (error) {
      console.log(`⚠️  Certification "${certificationsVI[i].name}" (VI) may already exist`);
    }
  }

  // 5. Categories (i18n)
  console.log('\n5️⃣  Creating Categories (EN)...');
  const categoriesEN = [
    {
      name: 'Coffee Processing & Quality',
      description: 'Insights and standards for specialty Robusta processing, quality assurance, and certifications. Learn about wet/dry methods, CQI impact, and quality control.',
      color: '#059669',
    },
    {
      name: 'Company Story & Expertise',
      description: 'Company history, achievements, CEO profile, and expertise in specialty coffee processing.',
      color: '#7C3AED',
    },
    {
      name: 'Industry Insights',
      description: 'Market trends, Vietnamese coffee heritage, and industry analysis.',
      color: '#DC2626',
    },
    {
      name: 'Practical Guides',
      description: 'B2B buyer guides, supplier selection, and practical information for coffee professionals.',
      color: '#EA580C',
    },
  ];

  for (const cat of categoriesEN) {
    try {
      const catData = { data: cat };
      const created = await createContent('categories', catData, 'en');
      await publishContent('categories', created.id, 'en');
      createdContent.categories.push(created);
      console.log(`✅ Category "${cat.name}" (EN) created`);
    } catch (error) {
      console.log(`⚠️  Category "${cat.name}" may already exist`);
    }
  }

  console.log('\n5️⃣  Creating Categories (VI)...');
  const categoriesVI = [
    {
      name: 'Chế Biến & Chất Lượng Cà Phê',
      description: 'Thông tin và tiêu chuẩn về chế biến Robusta đặc sản, đảm bảo chất lượng và chứng nhận. Tìm hiểu về phương pháp ướt/khô, tác động CQI và kiểm soát chất lượng.',
      color: '#059669',
    },
    {
      name: 'Câu Chuyện & Chuyên Môn Công Ty',
      description: 'Lịch sử công ty, thành tựu, hồ sơ CEO và chuyên môn trong chế biến cà phê đặc sản.',
      color: '#7C3AED',
    },
    {
      name: 'Thông Tin Ngành',
      description: 'Xu hướng thị trường, di sản cà phê Việt Nam và phân tích ngành.',
      color: '#DC2626',
    },
    {
      name: 'Hướng Dẫn Thực Tế',
      description: 'Hướng dẫn cho người mua B2B, lựa chọn nhà cung cấp và thông tin thực tế cho chuyên gia cà phê.',
      color: '#EA580C',
    },
  ];

  for (const cat of categoriesVI) {
    try {
      const catData = { data: cat };
      const created = await createContent('categories', catData, 'vi');
      await publishContent('categories', created.id, 'vi');
      console.log(`✅ Category "${cat.name}" (VI) created`);
    } catch (error) {
      console.log(`⚠️  Category "${cat.name}" may already exist`);
    }
  }

  console.log('\n✅ Phase 1 Complete!');
  console.log('\n💾 Saving created content IDs...');
  fs.writeFileSync(
    path.join(__dirname, 'created-content.json'),
    JSON.stringify(createdContent, null, 2)
  );
  console.log('✅ Content IDs saved to scripts/created-content.json');
}

/**
 * Phase 2: Core Content
 */
async function phase2() {
  console.log('\n📦 PHASE 2: CORE CONTENT\n');
  console.log('='.repeat(50));

  if (createdContent.categories.length === 0 || createdContent.certifications.length === 0) {
    console.log('⚠️  Phase 1 must be completed first!');
    return;
  }

  // 1. Products (i18n)
  console.log('\n1️⃣  Creating Products (EN)...');
  const productsEN = [
    {
      name: 'Premium Robusta Green Beans',
      short_description: 'High-quality Robusta green beans from our 10-hectare farm in Lâm Đồng. Processed using modern equipment with full quality control. Suitable for specialty coffee production and export.',
      full_description: `<p>Our Premium Robusta Green Beans are sourced from our own 10-hectare farm in Lâm Đồng, Vietnam, and processed at our state-of-the-art facility.</p>
        <h3>Processing:</h3>
        <ul>
          <li>Wet processing: 1,500m² facility</li>
          <li>Dry processing: 1,000m² facility</li>
          <li>Capacity: 6 tons/hour</li>
          <li>Equipment: Modern 2024 machinery</li>
        </ul>
        <h3>Quality Assurance:</h3>
        <ul>
          <li>Full quality control throughout process</li>
          <li>CQI-certified processing</li>
          <li>Vietnam Specialty Coffee Certified</li>
        </ul>
        <h3>Ideal for:</h3>
        <ul>
          <li>Specialty coffee roasters</li>
          <li>Export markets</li>
          <li>Private label applications</li>
        </ul>`,
      origin_region: 'Lâm Đồng, Vietnam',
      altitude_range: '800-1,000m',
      harvest_season: 'November - March',
      moisture_content: 12.0,
      screen_size: '18',
      cupping_score: 84.5,
      processing_method: 'washed',
      sku: 'TGB-RGB-001',
      price_range: 'Contact for pricing',
      category: createdContent.categories[0]?.id,
      certifications: createdContent.certifications.slice(0, 2).map(c => c.id),
    },
  ];

  for (const product of productsEN) {
    try {
      const productData = { data: product };
      const created = await createContent('products', productData, 'en');
      await publishContent('products', created.id, 'en');
      if (!createdContent.products) createdContent.products = [];
      createdContent.products.push(created);
      console.log(`✅ Product "${product.name}" (EN) created`);
    } catch (error) {
      console.log(`⚠️  Product "${product.name}" may already exist`);
    }
  }

  console.log('\n1️⃣  Creating Products (VI)...');
  const productsVI = [
    {
      name: 'Cà Phê Nhân Xanh Robusta Thượng Hạng',
      short_description: 'Cà phê nhân xanh Robusta chất lượng cao từ nông trại 10ha của chúng tôi tại Lâm Đồng. Được chế biến bằng thiết bị hiện đại với kiểm soát chất lượng đầy đủ.',
      full_description: `<p>Cà phê Nhân Xanh Robusta Thượng Hạng của chúng tôi được lấy từ nông trại 10ha của riêng chúng tôi tại Lâm Đồng, Việt Nam.</p>
        <h3>Chế Biến:</h3>
        <ul>
          <li>Chế biến ướt: Cơ sở 1,500m²</li>
          <li>Chế biến khô: Khu vực 1,000m²</li>
          <li>Công suất: 6 tấn/giờ</li>
          <li>Thiết bị: Máy móc hiện đại năm 2024</li>
        </ul>`,
      origin_region: 'Lâm Đồng, Việt Nam',
      altitude_range: '800-1,000m',
      harvest_season: 'Tháng 11 - Tháng 3',
      moisture_content: 12.0,
      screen_size: '18',
      cupping_score: 84.5,
      processing_method: 'washed',
      sku: 'TGB-RGB-001',
      price_range: 'Liên hệ để biết giá',
    },
  ];

  for (const product of productsVI) {
    try {
      const productData = { data: product };
      const created = await createContent('products', productData, 'vi');
      await publishContent('products', created.id, 'vi');
      console.log(`✅ Product "${product.name}" (VI) created`);
    } catch (error) {
      console.log(`⚠️  Product "${product.name}" may already exist`);
    }
  }

  // 2. Services (i18n)
  console.log('\n2️⃣  Creating Services (EN)...');
  const servicesEN = [
    {
      name: 'Green Bean Processing Services',
      tagline: 'Professional processing with full QA',
      overview: `<p>With modern 2024 equipment and a 6-tons/hour capacity, we provide reliable green bean processing services for B2B partners worldwide.</p>
        <h3>Our Capabilities:</h3>
        <ul>
          <li>Processing capacity: 6 tons/hour</li>
          <li>Wet processing: 1,500m² facility</li>
          <li>Dry processing: 1,000m² facility</li>
          <li>Full quality control</li>
          <li>Comprehensive wastewater treatment</li>
          <li>Export preparation</li>
        </ul>`,
      certifications: createdContent.certifications.slice(0, 2).map(c => c.id),
    },
    {
      name: 'OEM/Private Label Coffee Production',
      tagline: 'Complete OEM/private label solutions',
      overview: `<p>Complete OEM and private label solutions for coffee brands seeking reliable, high-quality production partners.</p>`,
      certifications: createdContent.certifications.map(c => c.id),
    },
  ];

  for (const service of servicesEN) {
    try {
      const serviceData = { data: service };
      const created = await createContent('services', serviceData, 'en');
      await publishContent('services', created.id, 'en');
      if (!createdContent.services) createdContent.services = [];
      createdContent.services.push(created);
      console.log(`✅ Service "${service.name}" (EN) created`);
    } catch (error) {
      console.log(`⚠️  Service "${service.name}" may already exist`);
    }
  }

  console.log('\n2️⃣  Creating Services (VI)...');
  const servicesVI = [
    {
      name: 'Dịch Vụ Chế Biến Cà Phê Nhân Xanh',
      tagline: 'Chế biến chuyên nghiệp với QA đầy đủ',
      overview: `<p>Với thiết bị hiện đại năm 2024 và công suất 6 tấn/giờ, chúng tôi cung cấp dịch vụ chế biến cà phê nhân xanh đáng tin cậy.</p>`,
    },
    {
      name: 'Sản Xuất Cà Phê OEM/Nhãn Riêng',
      tagline: 'Giải pháp OEM/nhãn riêng hoàn chỉnh',
      overview: `<p>Giải pháp OEM và nhãn riêng hoàn chỉnh cho các thương hiệu cà phê.</p>`,
    },
  ];

  for (const service of servicesVI) {
    try {
      const serviceData = { data: service };
      const created = await createContent('services', serviceData, 'vi');
      await publishContent('services', created.id, 'vi');
      console.log(`✅ Service "${service.name}" (VI) created`);
    } catch (error) {
      console.log(`⚠️  Service "${service.name}" may already exist`);
    }
  }

  // 3. Testimonials (i18n)
  console.log('\n3️⃣  Creating Testimonials (EN)...');
  const testimonialsEN = [
    {
      quote: 'The Great Beans is our trusted OEM partner. Quality and consistency are outstanding. Their 6-tons/hour processing capacity and CQI-certified expertise make them the ideal partner for our specialty coffee needs.',
      reviewer_name: 'Jane Nguyen',
      reviewer_title: 'Sourcing Manager',
      reviewer_company: 'VietCafe Co.',
      rating: 5,
      featured: true,
      review_date: '2024-09-10',
    },
  ];

  for (const testimonial of testimonialsEN) {
    try {
      const testimonialData = { data: testimonial };
      const created = await createContent('testimonials', testimonialData, 'en');
      await publishContent('testimonials', created.id, 'en');
      if (!createdContent.testimonials) createdContent.testimonials = [];
      createdContent.testimonials.push(created);
      console.log(`✅ Testimonial from "${testimonial.reviewer_name}" (EN) created`);
    } catch (error) {
      console.log(`⚠️  Testimonial may already exist`);
    }
  }

  console.log('\n3️⃣  Creating Testimonials (VI)...');
  const testimonialsVI = [
    {
      quote: 'The Great Beans là đối tác OEM đáng tin cậy của chúng tôi. Chất lượng và tính nhất quán rất xuất sắc.',
      reviewer_name: 'Jane Nguyen',
      reviewer_title: 'Giám Đốc Thu Mua',
      reviewer_company: 'VietCafe Co.',
      rating: 5,
      featured: true,
      review_date: '2024-09-10',
    },
  ];

  for (const testimonial of testimonialsVI) {
    try {
      const testimonialData = { data: testimonial };
      const created = await createContent('testimonials', testimonialData, 'vi');
      await publishContent('testimonials', created.id, 'vi');
      console.log(`✅ Testimonial from "${testimonial.reviewer_name}" (VI) created`);
    } catch (error) {
      console.log(`⚠️  Testimonial may already exist`);
    }
  }

  // 4. Knowledge Assets (i18n)
  console.log('\n4️⃣  Creating Knowledge Assets (EN)...');
  const knowledgeAssetsEN = [
    {
      title: 'The Great Beans: Our Journey from Farm to Global Market',
      excerpt: 'Discover how The Great Beans evolved from a 10-hectare farm in 2018 to a state-of-the-art processing facility serving global markets.',
      content_sections: [
        {
          __component: 'section.text-block',
          content: `<h2>Introduction</h2>
            <p>Since 2018, The Great Beans has been on a mission to bring Vietnamese Robusta coffee to the world stage.</p>`,
        },
      ],
      author: createdContent.authors[0]?.id,
      category: createdContent.categories[1]?.id,
      published_date: new Date().toISOString(),
      read_time: 7,
      word_count: 1600,
    },
  ];

  for (const asset of knowledgeAssetsEN) {
    try {
      const assetData = { data: asset };
      const created = await createContent('knowledge-assets', assetData, 'en');
      await publishContent('knowledge-assets', created.id, 'en');
      if (!createdContent.knowledgeAssets) createdContent.knowledgeAssets = [];
      createdContent.knowledgeAssets.push(created);
      console.log(`✅ Knowledge Asset "${asset.title}" (EN) created`);
    } catch (error) {
      console.log(`⚠️  Knowledge Asset may already exist`);
    }
  }

  console.log('\n✅ Phase 2 Complete!');
  fs.writeFileSync(
    path.join(__dirname, 'created-content.json'),
    JSON.stringify(createdContent, null, 2)
  );
}

/**
 * Phase 3: Pages
 */
async function phase3() {
  console.log('\n📦 PHASE 3: PAGES\n');
  console.log('='.repeat(50));

  // Contact Page
  console.log('\n1️⃣  Creating Contact Page (EN)...');
  try {
    const contactPageEN = {
      data: {
        headline: 'Talk to Our Sales Team',
        subheadline: 'We respond within 24 hours in English and Vietnamese. Get in touch to discuss your coffee processing needs.',
        factory_address: '<p>The Great Beans Co., Ltd.<br>Trường Xuân Commune<br>Lâm Đồng Province, Vietnam</p>',
        email_sales: 'sales@thegreatbeans.com',
        phone_primary: '+84 90 000 0000',
        business_hours: 'Monday - Friday: 9:00 AM - 5:00 PM (ICT) | Saturday: 9:00 AM - 12:00 PM | Sunday: Closed',
        success_message: 'Thank you for contacting The Great Beans! Our sales team will respond within 24 hours.',
      },
    };
    await updateContent('contact-page', 1, contactPageEN, 'en');
    await publishContent('contact-page', 1, 'en');
    console.log('✅ Contact Page (EN) created');
  } catch (error) {
    console.log('⚠️  Contact Page may need manual creation');
  }

  console.log('\n1️⃣  Creating Contact Page (VI)...');
  try {
    const contactPageVI = {
      data: {
        headline: 'Liên Hệ Với Đội Ngũ Bán Hàng Của Chúng Tôi',
        subheadline: 'Chúng tôi phản hồi trong vòng 24 giờ bằng tiếng Anh và tiếng Việt.',
        factory_address: '<p>Công ty TNHH The Great Beans<br>Xã Trường Xuân<br>Tỉnh Lâm Đồng, Việt Nam</p>',
        business_hours: 'Thứ Hai - Thứ Sáu: 9:00 - 17:00 (ICT) | Thứ Bảy: 9:00 - 12:00 | Chủ Nhật: Nghỉ',
        success_message: 'Cảm ơn bạn đã liên hệ với The Great Beans! Đội ngũ bán hàng của chúng tôi sẽ phản hồi trong vòng 24 giờ.',
      },
    };
    await updateContent('contact-page', 1, contactPageVI, 'vi');
    await publishContent('contact-page', 1, 'vi');
    console.log('✅ Contact Page (VI) created');
  } catch (error) {
    console.log('⚠️  Contact Page (VI) may need manual creation');
  }

  // About Page
  console.log('\n2️⃣  Creating About Page (EN)...');
  try {
    const aboutPageEN = {
      data: {
        hero_headline: 'Leading Specialty Coffee from Vietnam\'s Highlands',
        mission_statement: 'Lead globally in specialty coffee, promoting the heritage and unique flavors of Vietnamese Robusta coffee through sustainability and ethical sourcing.',
        vision_statement: 'Become one of the top 3 leading companies in Vietnam\'s specialty coffee market.',
      },
    };
    await updateContent('about-page', 1, aboutPageEN, 'en');
    await publishContent('about-page', 1, 'en');
    console.log('✅ About Page (EN) created');
  } catch (error) {
    console.log('⚠️  About Page may need manual creation');
  }

  console.log('\n✅ Phase 3 Complete!');
  console.log('⚠️  Note: Homepage requires manual configuration in Strapi admin due to complex dynamic zones');
}

/**
 * Phase 4: Link Relations
 */
async function phase4() {
  console.log('\n📦 PHASE 4: LINK RELATIONS\n');
  console.log('='.repeat(50));
  console.log('⚠️  Phase 4: Link relations should be done manually in Strapi admin');
  console.log('   - Link products to categories');
  console.log('   - Link services to certifications');
  console.log('   - Link testimonials to services');
  console.log('   - Link related products to each other');
  console.log('\n✅ Phase 4 Complete!');
}

/**
 * Main execution
 */
async function main() {
  const phase = process.argv[2] || '1';

  console.log('🚀 Strapi Content Population Script');
  console.log('='.repeat(50));

  if (!(await authenticate())) {
    process.exit(1);
  }

  // Load existing content IDs
  try {
    const saved = JSON.parse(fs.readFileSync(path.join(__dirname, 'created-content.json'), 'utf8'));
    Object.assign(createdContent, saved);
  } catch (error) {
    console.log('⚠️  No previous content data found. Starting fresh.');
  }

  switch (phase) {
    case '1':
      await phase1();
      break;
    case '2':
      await phase2();
      break;
    case '3':
      await phase3();
      break;
    case '4':
      await phase4();
      break;
    default:
      console.log('❌ Invalid phase. Use: 1, 2, 3, or 4');
      process.exit(1);
  }

  console.log('\n✨ Done!');
}

// Run
main().catch(console.error);

