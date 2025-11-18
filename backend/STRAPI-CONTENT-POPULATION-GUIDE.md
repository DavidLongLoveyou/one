# Strapi Content Population Guide - The Great Beans

**Complete Field-by-Field Reference for Strapi CMS Dashboard**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Content Type Guides](#content-type-guides)
4. [Component Reference](#component-reference)
5. [The Great Beans Specific Content](#the-great-beans-specific-content)
6. [Media Specifications](#media-specifications)
7. [Localization Guide](#localization-guide)
8. [Validation Checklist](#validation-checklist)
9. [Recommended Population Order](#recommended-population-order)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

### Purpose

This guide provides a **complete field-by-field reference** for populating the Strapi CMS dashboard with content for The Great Beans. Every field from every schema has been analyzed and documented with:

- Field type and validation rules
- Character limits and format requirements
- The Great Beans specific examples
- SEO optimization guidelines
- E-E-A-T integration points
- Media specifications

### Principles

- **SEO-First**: All content optimized for search engines and SGE (Search Generative Experience)
- **E-E-A-T**: Experience, Expertise, Authoritativeness, Trustworthiness signals throughout
- **Helpful Content**: Focus on providing value and answering user questions
- **Semantic SEO**: Structured content following Holistic SEO principles

### Based On

- All Strapi schema files analyzed (`backend/src/api/**/schema.json`)
- All component schemas analyzed (`backend/src/components/**/*.json`)
- Company information from `info` file
- Existing content strategy and SEO guidelines

### Localization

All major content types support internationalization (i18n) with English (`en`) and Vietnamese (`vi`) locales. This guide includes instructions for populating both locales.

---

## Prerequisites & Setup

### Before You Begin

1. **Strapi Admin Access**
   - Ensure you have admin access to Strapi dashboard
   - URL: `http://localhost:1337/admin` (development) or your production URL

2. **Enable Vietnamese Locale (CRITICAL)**
   
   **If you only see English (EN) in the locale dropdown**, you need to add Vietnamese locale:
   
   **Steps to Add Vietnamese Locale**:
   1. In Strapi admin panel, go to **Settings** (gear icon, bottom left)
   2. Click **Internationalization** in the left sidebar
   3. Click **Locales** tab
   4. Click **"Add new locale"** button (top right)
   5. Fill in the form:
      - **Name**: `Vietnamese`
      - **Code**: `vi`
      - **Default locale**: Leave unchecked (EN is default)
   6. Click **"Save"**
   7. **Restart Strapi** if the locale doesn't appear immediately:
      - Stop the server (Ctrl+C)
      - Run `npm run develop` again
   
   **Verify Locale is Added**:
   - Go to any content type (e.g., Site Settings)
   - You should now see a locale dropdown in the top right showing both `en` and `vi`
   - You can switch between locales to populate content in both languages
   
   **Note**: The locale configuration in `backend/config/plugins.js` already includes `vi`, but you must create the locale entry in the database through the admin panel.

3. **Media Library Preparation**
   - Gather all images in recommended formats (WebP preferred)
   - Prepare images in correct dimensions (see Media Specifications section)
   - Use descriptive, lowercase, hyphenated filenames
   - Example: `robusta-farm-hero-desktop.webp`

3. **Content Preparation**
   - Review company information in `info` file
   - Prepare English and Vietnamese content
   - Gather certification logos and verification URLs
   - Prepare CEO photo and company timeline images

### Permissions Setup

**Critical First Step**: Configure Public role permissions before populating content.

1. Navigate to: **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Under **Permissions**, scroll to content types section
3. Enable **read** permissions for all content types:
   - **Single Types** (enable `find`):
     - `api::homepage.homepage`
     - `api::site-settings.site-settings`
     - `api::global-seo.global-seo`
     - `api::contact-page.contact-page`
     - `api::about-page.about-page`
   - **Collection Types** (enable `find` and `findOne`):
     - `api::product.product`
     - `api::service.service`
     - `api::knowledge-asset.knowledge-asset`
     - `api::category.category`
     - `api::author.author`
     - `api::certification.certification`
     - `api::testimonial.testimonial`
4. **Keep write actions disabled** (`create`, `update`, `delete` should remain unchecked)
5. Click **Save** (top right)

**Note**: If you don't see the content types section, hard refresh the admin panel or restart Strapi dev server.

---

## Content Type Guides

### 3.1 Global SEO (Single Type)

**Path**: `Content Manager` → `Single Types` → `Global SEO`

**Note**: This is a **single type** (not per locale). Configure once for the entire site.

#### Fields

##### `site_url` (Required)
- **Type**: String
- **Description**: Full site URL with protocol
- **Format**: `https://thegreatbeans.com` (production) or `http://localhost:3000` (development)
- **Important**: 
  - Must include protocol (`https://` or `http://`)
  - No trailing slash
  - Used for canonical URLs and Open Graph tags
- **Example**: `https://thegreatbeans.com`

##### `default_meta_title` (Optional, Max 60 characters)
- **Type**: String
- **Description**: Default meta title used as fallback when page-specific title is missing
- **SEO Guidelines**:
  - Keep between 50-60 characters for optimal display
  - Include brand name: "The Great Beans"
  - Include primary keyword: "Premium Robusta Coffee"
  - Include location: "Vietnam" or "Lâm Đồng"
- **Example**: `The Great Beans - Premium Robusta Coffee from Vietnam | Farm-to-Cup Excellence`
- **Character Count**: 67 (slightly over, but acceptable for brand recognition)

##### `default_meta_description` (Optional, Max 160 characters)
- **Type**: Text
- **Description**: Default meta description used as fallback
- **SEO Guidelines**:
  - Keep between 145-160 characters for optimal display
  - Include key differentiators: capacity, certifications, location
  - Include call-to-action or value proposition
- **Example**: `CQI-certified specialty coffee processor in Lâm Đồng, Vietnam. 6 tons/hour capacity, modern facility, OEM/Private Label services. Farm-to-cup excellence since 2018.`
- **Character Count**: 156

##### `default_meta_image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Default Open Graph and Twitter Card image
- **Specifications**:
  - **Dimensions**: 1200 × 630 pixels (1.91:1 aspect ratio)
  - **Format**: WebP preferred, JPG fallback
  - **File Size**: ≤ 250 KB
  - **Content**: Company logo, hero image, or branded visual
- **Alt Text**: `The Great Beans - Premium Robusta Coffee from Vietnam`
- **Usage**: Used when page-specific meta image is not provided

##### `google_site_verification` (Optional)
- **Type**: String
- **Description**: Google Search Console verification code
- **Format**: Just the code value (e.g., `abc123def456...`)
- **Note**: Do NOT include `content=` prefix
- **How to Get**: 
  1. Go to Google Search Console
  2. Add property
  3. Choose "HTML tag" verification method
  4. Copy the `content` value from the meta tag

##### `google_analytics_id` (Optional)
- **Type**: String
- **Description**: Google Analytics 4 (GA4) Measurement ID
- **Format**: `G-XXXXXXXXXX`
- **How to Get**:
  1. Go to Google Analytics
  2. Select your property
  3. Go to Admin → Data Streams
  4. Copy the Measurement ID

##### `google_tag_manager_id` (Optional)
- **Type**: String
- **Description**: Google Tag Manager Container ID
- **Format**: `GTM-XXXXXXX`
- **How to Get**:
  1. Go to Google Tag Manager
  2. Select your container
  3. Copy the Container ID from the top right

#### Population Steps

1. Navigate to **Content Manager** → **Single Types** → **Global SEO**
2. Fill in `site_url` (required)
3. Fill in `default_meta_title` (recommended)
4. Fill in `default_meta_description` (recommended)
5. Upload `default_meta_image` (recommended)
6. Add Google verification codes if available
7. Click **Save**
8. **Note**: This is not a draft/publish type, so changes save immediately

---

### 3.2 Site Settings (Single Type, i18n)

**Path**: `Content Manager` → `Single Types` → `Site Settings`

**Note**: This content type supports i18n. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Fields

##### `site_name` (Required, Max 100 characters)
- **Type**: String
- **Description**: Site name displayed in header, footer, and meta tags
- **English Example**: `The Great Beans`
- **Vietnamese Example**: `The Great Beans` (or `Hạt Cà Phê Vĩ Đại` if preferred)
- **Usage**: Used in page titles, Open Graph tags, and site branding

##### `site_description` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Brief site description for meta tags and about sections
- **English Example**: `Premium Robusta specialty coffee from Lâm Đồng, Vietnam. Farm-to-cup excellence with CQI-certified processing, 6 tons/hour capacity, and modern 2024 facility.`
- **Vietnamese Example**: `Cà phê Robusta đặc sản thượng hạng từ Lâm Đồng, Việt Nam. Tinh hoa từ nông trại đến ly cà phê với chế biến được chứng nhận CQI, công suất 6 tấn/giờ, và nhà máy hiện đại năm 2024.`
- **SEO Note**: Include location (Lâm Đồng, Vietnam) and key differentiators

##### `logo` (Optional)
- **Type**: Media (Single Image)
- **Description**: Main site logo
- **Specifications**:
  - **Format**: PNG with transparency preferred, SVG acceptable
  - **Dimensions**: Flexible, but recommended 200-400px width
  - **File Size**: Optimized, typically < 100 KB
  - **Background**: Transparent preferred
- **Usage**: Header, footer, email templates, social sharing

##### `favicon` (Optional)
- **Type**: Media (Single Image)
- **Description**: Browser favicon
- **Specifications**:
  - **Format**: ICO, PNG, or SVG
  - **Dimensions**: 32×32px (standard), 16×16px (legacy), or 512×512px (modern)
  - **File Size**: < 50 KB
- **Usage**: Browser tab icon

##### `contact_email` (Optional)
- **Type**: Email
- **Description**: Primary contact email address
- **Format**: Valid email address
- **Example**: `info@thegreatbeans.com` or `contact@thegreatbeans.com`
- **Usage**: Contact forms, footer, meta tags

##### `contact_phone` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Primary contact phone number
- **Format**: Include country code, spaces or dashes acceptable
- **Example**: `+84 90 000 0000` or `+84-90-000-0000`
- **Usage**: Contact page, footer, structured data

##### `address` (Optional)
- **Type**: Text
- **Description**: Full company address
- **English Example**: 
  ```
  The Great Beans Co., Ltd.
  Trường Xuân Commune
  Lâm Đồng Province, Vietnam
  ```
- **Vietnamese Example**:
  ```
  Công ty TNHH The Great Beans
  Xã Trường Xuân
  Tỉnh Lâm Đồng, Việt Nam
  ```
- **Usage**: Contact page, footer, structured data (Organization schema)

##### `social_media` (Optional)
- **Type**: JSON
- **Description**: Social media profile URLs
- **Format**: JSON object with platform keys
- **Example**:
  ```json
  {
    "facebook": "https://facebook.com/thegreatbeans",
    "linkedin": "https://linkedin.com/company/thegreatbeans",
    "instagram": "https://instagram.com/thegreatbeans",
    "youtube": "https://youtube.com/@thegreatbeans"
  }
  ```
- **Usage**: Footer, social sharing, structured data (`sameAs` array)

#### Population Steps

1. Navigate to **Content Manager** → **Single Types** → **Site Settings**
2. **For English locale**:
   - Switch locale dropdown to `en` (if not already)
   - Fill in all fields
   - Click **Save**
3. **For Vietnamese locale**:
   - Switch locale dropdown to `vi`
   - Fill in all fields with Vietnamese translations
   - Click **Save**
4. **Publish both locales**:
   - Click **Publish** button for each locale
   - Ensure both show as "Published" status

---

### 3.3 Contact Page (Single Type, i18n)

**Path**: `Content Manager` → `Single Types` → `Contact Page`

**Note**: This content type supports i18n. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Fields

##### `headline` (Required, Max 200 characters)
- **Type**: String
- **Description**: Main page headline/title
- **English Example**: `Talk to Our Sales Team`
- **Vietnamese Example**: `Liên Hệ Với Đội Ngũ Bán Hàng Của Chúng Tôi`
- **SEO Note**: Include primary keyword naturally

##### `subheadline` (Optional, Max 500 characters)
- **Type**: Text
- **Description**: Supporting text below headline
- **English Example**: `We respond within 24 hours in English and Vietnamese. Get in touch to discuss your coffee processing needs, request a quote, or schedule a facility tour.`
- **Vietnamese Example**: `Chúng tôi phản hồi trong vòng 24 giờ bằng tiếng Anh và tiếng Việt. Liên hệ để thảo luận về nhu cầu chế biến cà phê của bạn, yêu cầu báo giá hoặc đặt lịch tham quan nhà máy.`
- **SEO Note**: Include location and response time for trust signals

##### `factory_address` (Required)
- **Type**: Rich Text
- **Description**: Full factory address with formatting
- **English Example**:
  ```
  The Great Beans Co., Ltd.
  Trường Xuân Commune
  Lâm Đồng Province, Vietnam
  
  Adjacent to our 10-hectare Robusta farm
  ```
- **Vietnamese Example**:
  ```
  Công ty TNHH The Great Beans
  Xã Trường Xuân
  Tỉnh Lâm Đồng, Việt Nam
  
  Liền kề với nông trại Robusta 10ha của chúng tôi
  ```
- **SEO Note**: Include location keywords (Lâm Đồng, Vietnam) for local SEO

##### `google_maps_embed_url` (Optional)
- **Type**: String
- **Description**: Google Maps embed URL for map display
- **Format**: Full embed URL from Google Maps
- **How to Get**:
  1. Go to Google Maps
  2. Search for your address
  3. Click "Share" → "Embed a map"
  4. Copy the `src` URL from the iframe code
- **Example**: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...`

##### `email_sales` (Required)
- **Type**: Email
- **Description**: Sales inquiry email address
- **Format**: Valid email address
- **Example**: `sales@thegreatbeans.com`
- **Usage**: Contact form, email links

##### `email_support` (Optional)
- **Type**: Email
- **Description**: Support/technical inquiry email
- **Format**: Valid email address
- **Example**: `support@thegreatbeans.com`
- **Usage**: Support inquiries, technical questions

##### `phone_primary` (Required, Max 50 characters)
- **Type**: String
- **Description**: Primary contact phone number
- **Format**: Include country code
- **Example**: `+84 90 000 0000`
- **Usage**: Click-to-call links, contact display

##### `business_hours` (Optional, Max 200 characters)
- **Type**: Text
- **Description**: Business operating hours
- **English Example**: `Monday - Friday: 9:00 AM - 5:00 PM (ICT) | Saturday: 9:00 AM - 12:00 PM | Sunday: Closed`
- **Vietnamese Example**: `Thứ Hai - Thứ Sáu: 9:00 - 17:00 (ICT) | Thứ Bảy: 9:00 - 12:00 | Chủ Nhật: Nghỉ`
- **Usage**: Contact page display, structured data

##### `contact_faq` (Optional, Repeatable)
- **Type**: Component (shared.faq-item)
- **Description**: Frequently asked questions about contact/shipping
- **See Component Reference** for FAQ Item structure
- **Recommended FAQs**:
  - "What is your response time?"
  - "Do you ship internationally?"
  - "What is your minimum order quantity (MOQ)?"
  - "How can I schedule a facility tour?"

##### `form_inquiry_types` (Optional, Repeatable)
- **Type**: Component (contact.inquiry-type)
- **Description**: Inquiry type options for contact form
- **See Component Reference** for Inquiry Type structure
- **Recommended Types**:
  - General Inquiry
  - Sales/Quote Request
  - OEM/Private Label Inquiry
  - Facility Tour Request
  - Partnership Inquiry

##### `success_message` (Optional, Max 500 characters)
- **Type**: Text
- **Description**: Message displayed after successful form submission
- **English Example**: `Thank you for contacting The Great Beans! Our sales team will respond within 24 hours. For urgent matters, please call +84 90 000 0000.`
- **Vietnamese Example**: `Cảm ơn bạn đã liên hệ với The Great Beans! Đội ngũ bán hàng của chúng tôi sẽ phản hồi trong vòng 24 giờ. Đối với các vấn đề khẩn cấp, vui lòng gọi +84 90 000 0000.`

##### `seo` (Optional)
- **Type**: Component (seo.metadata)
- **Description**: SEO metadata for contact page
- **See Component Reference** for SEO Metadata structure
- **Recommended**:
  - Meta Title: `Contact Us | The Great Beans - Coffee Processing Services`
  - Meta Description: Include location, response time, and CTA

#### Population Steps

1. Navigate to **Content Manager** → **Single Types** → **Contact Page**
2. **For English locale**:
   - Switch locale to `en` (or ensure it's selected)
   - Fill in all required fields
   - Add contact FAQs (recommended: 3-5 FAQs)
   - Add inquiry types for contact form
   - Configure SEO component
   - Click **Save** then **Publish**
3. **For Vietnamese locale**:
   - Switch locale to `vi`
   - **Important**: Strapi will auto-fill Vietnamese fields with English data as a starting point. This is normal behavior.
   - **You MUST manually replace text fields with Vietnamese translations**:
     - `headline` → Translate to Vietnamese
     - `subheadline` → Translate to Vietnamese
     - `factory_address` → Translate to Vietnamese (address format)
     - `business_hours` → Translate to Vietnamese
     - `success_message` → Translate to Vietnamese
     - `contact_faq` → Translate each FAQ question and answer
     - `form_inquiry_types` → Translate each label (keep `value` the same)
     - `seo` → Translate meta title and description
   - **Keep these fields the SAME (no translation needed)**:
     - `email_sales` → Same email address
     - `email_support` → Same email address
     - `phone_primary` → Same phone number
     - `google_maps_embed_url` → Same map URL
   - Click **Save** then **Publish**

**Important Schema Update**: The schema has been configured so that `email_sales`, `email_support`, `phone_primary`, and `google_maps_embed_url` are **NOT localized** (they are shared across all locales). This means:
- These fields will show the same value in both EN and VI
- When you edit them in one locale, they update for all locales
- This is the correct behavior for contact information

**After Schema Update**: If you just updated the schema, you need to:
1. **Restart Strapi** (stop with Ctrl+C, then run `npm run develop`)
2. The non-localized fields will now be shared between locales
3. Text fields (headline, subheadline, etc.) remain localized and separate

---

### 3.4 About Page (Single Type, i18n)

**Path**: `Content Manager` → `Single Types` → `About Us Page`

**Note**: This content type supports i18n. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Fields

##### `hero_headline` (Required, Max 200 characters)
- **Type**: String
- **Description**: Main hero section headline
- **English Example**: `Leading Specialty Coffee from Vietnam's Highlands`
- **Vietnamese Example**: `Cà Phê Đặc Sản Hàng Đầu từ Cao Nguyên Việt Nam`
- **SEO Note**: Include location and specialty focus

##### `hero_image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Hero section background/image
- **Specifications**:
  - **Dimensions**: 1920 × 1080 pixels or 1600 × 900 pixels
  - **Format**: WebP preferred, JPG fallback
  - **File Size**: ≤ 350 KB
  - **Content**: Farm, facility, or coffee processing scene
- **Alt Text**: `The Great Beans coffee processing facility in Lâm Đồng, Vietnam`

##### `mission_statement` (Required, Max 1000 characters)
- **Type**: Text
- **Description**: Company mission statement
- **Source**: From `info` file
- **English Example**:
  ```
  Lead globally in specialty coffee, promoting the heritage and unique flavors of Vietnamese Robusta coffee through sustainability and ethical sourcing. We are committed to farm-to-cup excellence, combining our 10-hectare farm with state-of-the-art processing facilities to deliver exceptional quality to partners worldwide.
  ```
- **Vietnamese Example**: (Translate from English, maintaining meaning)
- **SEO Note**: Include keywords: specialty coffee, Robusta, Vietnam, sustainability

##### `vision_statement` (Required, Max 1000 characters)
- **Type**: Text
- **Description**: Company vision statement
- **Source**: From `info` file
- **English Example**:
  ```
  Become one of the top 3 leading companies in Vietnam's specialty coffee market. We envision a future where Vietnamese Robusta coffee is recognized globally for its exceptional quality, achieved through ethical practices, modern technology, and unwavering commitment to excellence.
  ```
- **Vietnamese Example**: (Translate from English, maintaining meaning)

##### `timeline_events` (Optional, Repeatable)
- **Type**: Component (about.timeline-event)
- **Description**: Company milestones and achievements
- **See Component Reference** for Timeline Event structure
- **Recommended Events** (from `info` file):
  1. **January 2018**: Company founded as Nazola; CEO attends CQI course
  2. **September 2023**: Rebranded to The Great Beans
  3. **February 2024**: Modern facility construction begins
  4. **April 2024**: Vietnam Amazing Cup 2024 Co-Sponsor
  5. **May 2024**: All samples certified as Vietnam Specialty Coffee
  6. **August 2024**: CEO achieves CQI Q Processing Level 2 certification

##### `ceo_section` (Optional)
- **Type**: Component (about.ceo-profile)
- **Description**: CEO profile and bio
- **See Component Reference** for CEO Profile structure
- **Key Information**:
  - **Name**: `Nguyễn Khánh Tùng`
  - **Title**: `CEO`
  - **Bio**: Include CQI certification, founding story, expertise
  - **Quote**: Optional inspirational quote
  - **Photo**: Professional CEO photo

##### `core_values` (Optional, Repeatable)
- **Type**: Component (about.value)
- **Description**: Company core values
- **See Component Reference** for Value structure
- **Four Core Values** (from `info` file):
  1. **Quality Excellence** - Superior quality
  2. **Sustainability** - Long-term sustainability
  3. **Innovation** - Continuous improvement
  4. **Trust** - Reliability and trustworthiness

##### `factory_tour_cta` (Optional)
- **Type**: Component (shared.button)
- **Description**: Call-to-action button for facility tour
- **See Component Reference** for Button structure
- **Recommended**:
  - **Text**: `Schedule a Facility Tour`
  - **URL**: `/contact` or `#contact`
  - **Variant**: `primary`

##### `seo` (Optional)
- **Type**: Component (seo.metadata)
- **Description**: SEO metadata for about page
- **See Component Reference** for SEO Metadata structure
- **Recommended**:
  - Meta Title: `About Us | The Great Beans - Specialty Coffee from Vietnam`
  - Meta Description: Include company history, certifications, and expertise

#### Population Steps

1. Navigate to **Content Manager** → **Single Types** → **About Us Page**
2. **For English locale**:
   - Switch locale to `en`
   - Fill in hero headline and upload hero image
   - Add mission and vision statements (from `info` file)
   - Add timeline events (6 events from company history)
   - Configure CEO section with photo and bio
   - Add 4 core values
   - Configure factory tour CTA button
   - Configure SEO component
   - Click **Save** then **Publish**
3. **For Vietnamese locale**:
   - Switch locale to `vi`
   - Translate all text fields
   - Keep same images (or use Vietnamese-specific if available)
   - Translate timeline events
   - Translate CEO bio
   - Translate core values
   - Configure SEO component
   - Click **Save** then **Publish**

---

### 3.5 Homepage (Single Type, i18n)

**Path**: `Content Manager` → `Single Types` → `Homepage`

**Note**: This is the most complex content type with a dynamic zone containing 9 different section components. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Overview

The homepage uses a **Dynamic Zone** called `content_sections` that allows you to add multiple section components in any order. However, for optimal SEO and user experience, follow the recommended order below.

#### Recommended Section Order

1. **Hero Advanced** - Main hero section with CTAs
2. **Trust Bar Enhanced** - Certifications and trust indicators
3. **Services Grid** - B2B services showcase
4. **Factory Story** - Facility and process story
5. **Products Showcase** - Featured products
6. **Testimonials Proof** - Customer testimonials
7. **Blog Insights** - Featured knowledge assets/articles
8. **FAQ SEO** - Frequently asked questions with schema
9. **CTA Conversion** - Final conversion section

#### Fields

##### `content_sections` (Required, Dynamic Zone)
- **Type**: Dynamic Zone
- **Description**: Flexible content sections for homepage
- **Available Components**:
  - `section.hero-advanced`
  - `section.trust-bar-enhanced`
  - `section.services-grid`
  - `section.factory-story`
  - `section.products-showcase`
  - `section.testimonials-proof`
  - `section.blog-insights`
  - `section.faq-seo`
  - `section.cta-conversion`

**How to Add Sections**:
1. Click **"Add a component to content_sections"**
2. Select component type from dropdown
3. Fill in all fields for that section
4. Click **"Add another entry"** to add next section
5. Use drag handles to reorder sections

**See Section Components Reference** below for detailed field documentation for each section type.

##### `seo` (Optional)
- **Type**: Component (seo.metadata)
- **Description**: SEO metadata for homepage
- **See Component Reference** for SEO Metadata structure
- **Recommended**:
  - Meta Title: `The Great Beans - Premium Robusta Coffee from Vietnam | Farm-to-Cup Excellence`
  - Meta Description: `CQI-certified specialty coffee processor in Lâm Đồng, Vietnam. 6 tons/hour capacity, modern facility, OEM/Private Label services. Farm-to-cup excellence since 2018.`
  - Meta Image: Hero image or company logo (1200×630 WebP)

#### Population Steps

1. Navigate to **Content Manager** → **Single Types** → **Homepage**
2. **For English locale**:
   - Switch locale to `en`
   - Click **"Add a component to content_sections"**
   - Add sections in recommended order (see Section Components Reference below)
   - Configure SEO component
   - Click **Save** then **Publish**
3. **For Vietnamese locale**:
   - Switch locale to `vi`
   - Add same sections with Vietnamese translations
   - Translate all text content in each section
   - Keep same images and relations (products, services, etc.)
   - Configure SEO component
   - Click **Save** then **Publish**

#### Section Components Reference

Each section component has specific fields. See **Component Reference** section (Section 4) for complete documentation of:
- `section.hero-advanced` - All fields including stats, trust indicators, hotspots
- `section.trust-bar-enhanced` - Certification display options
- `section.services-grid` - Service grid layout
- `section.factory-story` - Facility story with stats
- `section.products-showcase` - Product grid options
- `section.testimonials-proof` - Testimonial carousel
- `section.blog-insights` - Knowledge asset display
- `section.faq-seo` - FAQ with schema support
- `section.cta-conversion` - Final CTA section

---

### 3.6 Category (Collection Type, i18n)

**Path**: `Content Manager` → `Collection Types` → `Category`

**Note**: Categories support i18n and function as pillar pages for SEO. Create categories before products/services/knowledge assets.

#### Fields

##### `name` (Required, Max 100 characters)
- **Type**: String
- **Description**: Category name
- **Examples**:
  - `Coffee Processing & Quality`
  - `Company Story & Expertise`
  - `Industry Insights`
  - `Practical Guides`
- **SEO Note**: Use descriptive, keyword-rich names

##### `slug` (Auto-generated, Required)
- **Type**: UID (Unique Identifier)
- **Description**: URL-friendly identifier
- **Auto-generated from**: `name` field
- **Format**: Lowercase, hyphenated
- **Example**: `coffee-processing-quality` (from "Coffee Processing & Quality")
- **Note**: Can be manually edited if needed

##### `description` (Optional, Max 500 characters)
- **Type**: Text
- **Description**: Brief category description
- **Example**: `Insights and standards for specialty Robusta processing, quality assurance, and certifications. Learn about wet/dry methods, CQI impact, and quality control.`
- **SEO Note**: Include primary keywords and value proposition

##### `pillar_page_content` (Optional)
- **Type**: Rich Text
- **Description**: Comprehensive pillar page content for SEO
- **Purpose**: Creates authoritative category pages that rank for topic clusters
- **Content Guidelines**:
  - 2000+ words recommended for pillar pages
  - Cover topic comprehensively
  - Include internal links to related content
  - Use proper heading hierarchy (H2, H3)
  - Include images, lists, and structured content
- **Example Topics**:
  - Coffee Processing & Quality: Comprehensive guide to processing methods, QA, certifications
  - Company Story: Full company history, achievements, expertise
- **SEO Note**: This is your main content for topical authority

##### `pillar_page_faq` (Optional, Repeatable)
- **Type**: Component (shared.faq-item)
- **Description**: FAQ section for pillar page
- **See Component Reference** for FAQ Item structure
- **Recommended**: 5-10 FAQs per category
- **SEO Note**: FAQs generate FAQPage schema for rich results

##### `featured_image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Category featured image
- **Specifications**:
  - **Dimensions**: 1200 × 800 pixels
  - **Format**: WebP preferred, JPG fallback
  - **File Size**: ≤ 220 KB
  - **Content**: Category-relevant visual
- **Alt Text**: Descriptive text including category name

##### `meta_description` (Optional, Max 160 characters)
- **Type**: Text
- **Description**: Meta description for category page
- **SEO Guidelines**: Include category name, location, and value proposition
- **Example**: `Specialty Robusta processing and quality standards. Learn about CQI certification, processing methods, and quality control from Vietnam's leading coffee processor.`

##### `color` (Optional, Max 7 characters)
- **Type**: String
- **Description**: Hex color code for category branding
- **Format**: `#RRGGBB` (7 characters including #)
- **Example**: `#059669` (green), `#7C3AED` (purple)
- **Usage**: Category tags, visual indicators

#### Population Steps

1. Navigate to **Content Manager** → **Collection Types** → **Category**
2. Click **"Create new entry"**
3. **For English locale**:
   - Switch locale to `en`
   - Fill in `name` (slug auto-generates)
   - Add `description`
   - Add comprehensive `pillar_page_content` (2000+ words)
   - Add 5-10 FAQs in `pillar_page_faq`
   - Upload `featured_image`
   - Add `meta_description`
   - Choose `color` (optional)
   - Click **Save** then **Publish**
4. **For Vietnamese locale**:
   - Switch locale to `vi`
   - Translate `name`, `description`, `pillar_page_content`
   - Translate FAQs
   - Keep same image (or use Vietnamese-specific)
   - Translate `meta_description`
   - Click **Save** then **Publish**

#### Recommended Categories

Based on content strategy:
1. **Coffee Processing & Quality** - Processing methods, QA, certifications
2. **Company Story & Expertise** - Company history, CEO profile, achievements
3. **Industry Insights** - Market trends, Vietnamese coffee heritage
4. **Practical Guides** - B2B buyer guides, supplier selection

---

### 3.7 Author (Collection Type)

**Path**: `Content Manager` → `Collection Types` → `Author`

**Note**: Authors do NOT support i18n. Create one entry per author (can be referenced in both en/vi content).

#### Fields

##### `name` (Required, Max 100 characters)
- **Type**: String
- **Description**: Author's full name
- **Example**: `Nguyễn Khánh Tùng`
- **Usage**: Displayed in article bylines, author pages

##### `slug` (Auto-generated, Required)
- **Type**: UID
- **Description**: URL-friendly identifier
- **Auto-generated from**: `name` field
- **Example**: `nguyen-khanh-tung` (from "Nguyễn Khánh Tùng")
- **Note**: Can be manually edited for better URLs

##### `title` (Optional, Max 100 characters)
- **Type**: String
- **Description**: Author's job title or role
- **Example**: `CEO` or `Processing Team Lead` or `Quality Control Specialist`
- **Usage**: Displayed with author name for E-E-A-T signals

##### `bio` (Optional, Max 500 characters)
- **Type**: Text
- **Description**: Author biography
- **Example for CEO**: `Founder and CEO of The Great Beans. CQI Q Processing Level 2 certified professional. One of the first participants in CQI specialty coffee processing course taught by Dr. Manuel Diaz in Vietnam. Leading Vietnam's specialty Robusta coffee industry since 2018.`
- **SEO Note**: Include credentials, certifications, and expertise for E-E-A-T

##### `avatar` (Optional)
- **Type**: Media (Single Image)
- **Description**: Author profile photo
- **Specifications**:
  - **Dimensions**: 512 × 512 pixels (square)
  - **Format**: WebP preferred, JPG/PNG fallback
  - **File Size**: ≤ 120 KB
  - **Content**: Professional headshot
- **Alt Text**: `[Author Name] - [Title] at The Great Beans`

##### `email` (Optional)
- **Type**: Email
- **Description**: Author contact email
- **Format**: Valid email address
- **Example**: `ceo@thegreatbeans.com` or `team@thegreatbeans.com`
- **Usage**: Contact links, structured data

##### `social_links` (Optional)
- **Type**: JSON
- **Description**: Social media profile URLs
- **Format**: JSON object
- **Example**:
  ```json
  {
    "linkedin": "https://linkedin.com/in/nguyen-khanh-tung",
    "twitter": "https://twitter.com/nguyen_khanh_tung"
  }
  ```
- **Usage**: Author profile pages, structured data

#### Population Steps

1. Navigate to **Content Manager** → **Collection Types** → **Author**
2. Click **"Create new entry"**
3. Fill in `name` (slug auto-generates)
4. Add `title` (job title/role)
5. Write comprehensive `bio` with credentials
6. Upload `avatar` (professional photo)
7. Add `email` if available
8. Add `social_links` JSON if available
9. Click **Save** then **Publish**

#### Recommended Authors

1. **Nguyễn Khánh Tùng** - CEO, CQI Q Processing Level 2 certified
2. **Processing Team** - Collective author for technical articles
3. **Quality Control Team** - For QA and certification content

---

### 3.8 Certification (Collection Type, i18n)

**Path**: `Content Manager` → `Collection Types` → `Certification`

**Note**: Certifications support i18n. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Fields

##### `name` (Required, Max 100 characters)
- **Type**: String
- **Description**: Certification name
- **Examples**:
  - `CQI Q Processing Level 2`
  - `Vietnam Specialty Coffee Certified`
  - `Vietnam Amazing Cup 2024 Co-Sponsor`
- **SEO Note**: Use official certification names

##### `description` (Optional, Max 500 characters)
- **Type**: Text
- **Description**: Certification description and significance
- **English Example**: `Professional processing certification from the Coffee Quality Institute. Q Processing Level 2 signifies advanced knowledge and expertise in specialty coffee processing methods, quality control, and industry standards.`
- **Vietnamese Example**: (Translate maintaining technical accuracy)
- **SEO Note**: Explain what the certification means and why it matters

##### `logo` (Optional)
- **Type**: Media (Single Image)
- **Description**: Certification logo/badge
- **Specifications**:
  - **Dimensions**: 400 × 400 pixels (square)
  - **Format**: PNG with transparency preferred, WebP acceptable
  - **File Size**: ≤ 120 KB
  - **Content**: Official certification logo
- **Alt Text**: `[Certification Name] logo`

##### `verification_url` (Optional)
- **Type**: String
- **Description**: URL to verify certification (if publicly available)
- **Format**: Full URL
- **Example**: `https://coffeeinstitute.org/certifications/...`
- **Usage**: Trust signals, verification links

##### `issued_date` (Optional)
- **Type**: Date
- **Description**: Date certification was issued
- **Format**: YYYY-MM-DD
- **Example**: `2024-08-15` (August 15, 2024)
- **Usage**: Timeline, structured data

##### `expiry_date` (Optional)
- **Type**: Date
- **Description**: Date certification expires (if applicable)
- **Format**: YYYY-MM-DD
- **Example**: `2027-08-15` (if 3-year validity)
- **Note**: Leave empty if certification doesn't expire

#### Population Steps

1. Navigate to **Content Manager** → **Collection Types** → **Certification**
2. Click **"Create new entry"**
3. **For English locale**:
   - Switch locale to `en`
   - Fill in `name` (official certification name)
   - Add `description` explaining significance
   - Upload `logo` (official logo)
   - Add `verification_url` if available
   - Set `issued_date` and `expiry_date` if applicable
   - Click **Save** then **Publish**
4. **For Vietnamese locale**:
   - Switch locale to `vi`
   - Translate `name` and `description`
   - Keep same `logo` (certification logos are usually universal)
   - Keep same dates and URLs
   - Click **Save** then **Publish**

#### Recommended Certifications

Based on company info:
1. **CQI Q Processing Level 2** - CEO certification (August 2024)
2. **Vietnam Specialty Coffee Certified** - All samples (May 2024)
3. **Vietnam Amazing Cup 2024 Co-Sponsor** - Partnership (April 2024)

---

### 3.9 Product (Collection Type, i18n)

**Path**: `Content Manager` → `Collection Types` → `Product`

**Note**: Products support i18n. This is a complex content type with many fields. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Fields

##### `name` (Required, Max 100 characters)
- **Type**: String
- **Description**: Product name/title
- **Examples**:
  - `Premium Robusta Green Beans`
  - `Specialty Robusta Roasted Coffee`
  - `Robusta Blend for Espresso`
- **SEO Note**: Include product type and quality indicator

##### `slug` (Auto-generated, Required)
- **Type**: UID
- **Description**: URL-friendly identifier
- **Auto-generated from**: `name` field
- **Example**: `premium-robusta-green-beans`
- **Note**: Can be manually edited

##### `short_description` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Brief product description for cards/lists
- **Example**: `High-quality Robusta green beans from our 10-hectare farm in Lâm Đồng. Processed using modern equipment with full quality control. Suitable for specialty coffee production and export.`
- **SEO Note**: Include location, quality indicators, use cases

##### `full_description` (Required)
- **Type**: Rich Text
- **Description**: Comprehensive product description
- **Content Guidelines**:
  - Detailed product information
  - Processing methods
  - Quality specifications
  - Use cases and applications
  - Certifications and quality assurance
  - Include location (Lâm Đồng, Vietnam)
  - Mention capacity and facility details
- **Example Structure**:
  ```
  Our Premium Robusta Green Beans are sourced from our own 10-hectare farm in Lâm Đồng, Vietnam, and processed at our state-of-the-art facility.
  
  Processing:
  - Wet processing: 1,500m² facility
  - Dry processing: 1,000m² facility
  - Capacity: 6 tons/hour
  - Equipment: Modern 2024 machinery
  
  Quality Assurance:
  - Full quality control throughout process
  - CQI-certified processing
  - Vietnam Specialty Coffee Certified
  
  Ideal for:
  - Specialty coffee roasters
  - Export markets
  - Private label applications
  ```
- **SEO Note**: Comprehensive content for E-E-A-T and helpful content

##### `featured_image` (Required)
- **Type**: Media (Single Image)
- **Description**: Main product image
- **Specifications**:
  - **Dimensions**: 1600 × 1200 pixels (4:3 aspect ratio)
  - **Format**: WebP preferred, JPG fallback
  - **File Size**: ≤ 250 KB
  - **Content**: High-quality product photo
- **Alt Text**: `[Product Name] from The Great Beans in Lâm Đồng, Vietnam`

##### `gallery` (Optional, Max 8 images)
- **Type**: Media (Multiple Images)
- **Description**: Additional product images
- **Specifications** (per image):
  - **Dimensions**: 1200 × 900 pixels
  - **Format**: WebP preferred
  - **File Size**: ≤ 220 KB each
- **Recommended Images**:
  - Processing/facility shots
  - Quality inspection
  - Packaging
  - End product/lifestyle
- **Alt Text**: Descriptive text for each image

##### `category` (Optional, Relation)
- **Type**: Relation (Many-to-One)
- **Description**: Product category
- **Target**: `api::category.category`
- **How to Link**: Select existing category from dropdown
- **Note**: Create categories first (see Category section)

##### `cupping_score` (Optional)
- **Type**: Decimal
- **Description**: Coffee cupping score
- **Range**: 75.0 - 95.0
- **Example**: `84.5`
- **Usage**: Quality indicator, structured data
- **Note**: Specialty coffee typically 80+

##### `processing_method` (Optional)
- **Type**: Enumeration
- **Options**: `washed`, `honey`, `natural`, `other`
- **Description**: Coffee processing method
- **Example**: `washed`
- **Usage**: Product filtering, specifications

##### `origin_region` (Optional, Max 100 characters)
- **Type**: String
- **Description**: Coffee origin region
- **Example**: `Lâm Đồng, Vietnam`
- **SEO Note**: Always include location for local SEO

##### `altitude_range` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Growing altitude range
- **Example**: `800-1,000m` or `800m - 1,000m`
- **Usage**: Product specifications

##### `harvest_season` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Harvest season
- **Example**: `November - March` or `Nov-Mar`
- **Usage**: Product specifications, availability

##### `moisture_content` (Optional)
- **Type**: Decimal
- **Description**: Moisture content percentage
- **Example**: `12.0` (for 12%)
- **Usage**: Quality specifications

##### `screen_size` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Bean screen size
- **Example**: `18` or `16-18`
- **Usage**: Product specifications

##### `specifications` (Optional, Repeatable)
- **Type**: Component (product.specification)
- **Description**: Additional product specifications
- **See Component Reference** for Specification structure
- **Recommended Specs**:
  - Moisture: 12%
  - Screen Size: 18
  - Density: High
  - Defects: < 5%
- **Usage**: Detailed product information

##### `packaging_options` (Optional, Repeatable)
- **Type**: Component (product.packaging)
- **Description**: Available packaging options
- **See Component Reference** for Packaging structure
- **Recommended Options**:
  - Jute bags: 60kg
  - Vacuum bags: 5kg, 10kg
  - Custom packaging available
- **Usage**: B2B ordering information

##### `certifications` (Optional, Relation)
- **Type**: Relation (Many-to-Many)
- **Description**: Product certifications
- **Target**: `api::certification.certification`
- **How to Link**: Select multiple certifications from list
- **Recommended**: Link relevant certifications (CQI, Vietnam Specialty Coffee)

##### `related_products` (Optional, Relation)
- **Type**: Relation (Many-to-Many)
- **Description**: Related/complementary products
- **Target**: `api::product.product`
- **How to Link**: Select other products from list
- **Usage**: Cross-selling, internal linking

##### `origin_story` (Optional)
- **Type**: Rich Text
- **Description**: Story behind the product
- **Content Ideas**:
  - Farm location and history
  - Processing story
  - Quality journey
  - Farmer relationships
- **SEO Note**: Adds E-E-A-T through storytelling

##### `sku` (Optional, Unique, Max 50 characters)
- **Type**: String
- **Description**: Stock Keeping Unit (product code)
- **Format**: Alphanumeric, unique
- **Example**: `TGB-RGB-001` (The Great Beans - Robusta Green Beans - 001)
- **Usage**: Inventory, ordering

##### `price_range` (Optional, Max 100 characters)
- **Type**: String
- **Description**: Price range or pricing note
- **Example**: `Contact for pricing` or `$X.XX - $Y.YY per kg` or `MOQ: 100kg`
- **Usage**: B2B pricing information

##### `seo` (Optional)
- **Type**: Component (seo.metadata)
- **Description**: SEO metadata for product page
- **See Component Reference** for SEO Metadata structure
- **Recommended**:
  - Meta Title: `[Product Name] | The Great Beans - Premium Coffee from Vietnam`
  - Meta Description: Include product type, location, key features, certifications
  - Meta Image: Use featured image resized to 1200×630

#### Population Steps

1. Navigate to **Content Manager** → **Collection Types** → **Product**
2. Click **"Create new entry"**
3. **For English locale**:
   - Switch locale to `en`
   - Fill in `name` (slug auto-generates)
   - Add `short_description`
   - Write comprehensive `full_description` (rich text)
   - Upload `featured_image` (required)
   - Upload `gallery` images (up to 8)
   - Select `category` from dropdown
   - Fill in product specs (cupping_score, processing_method, etc.)
   - Add `specifications` components
   - Add `packaging_options` components
   - Link `certifications` (select multiple)
   - Link `related_products` (select multiple)
   - Add `origin_story` if available
   - Add `sku` (unique product code)
   - Add `price_range` or pricing note
   - Configure `seo` component
   - Click **Save** then **Publish**
4. **For Vietnamese locale**:
   - Switch locale to `vi`
   - Translate `name`, `short_description`, `full_description`
   - Keep same images
   - Keep same category, certifications, related products (relations are shared)
   - Keep same specs (numbers don't need translation)
   - Translate `specifications` and `packaging_options` text
   - Translate `origin_story`
   - Keep same `sku` (product codes are universal)
   - Translate `price_range` if needed
   - Configure `seo` component with Vietnamese content
   - Click **Save** then **Publish**

---

### 3.10 Service (Collection Type, i18n)

**Path**: `Content Manager` → `Collection Types` → `Service`

**Note**: Services support i18n. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Fields

##### `name` (Required, Max 200 characters)
- **Type**: String
- **Description**: Service name/title
- **Examples**:
  - `Green Bean Processing Services`
  - `OEM/Private Label Coffee Production`
  - `Roasting & Profiling Services`
  - `Custom Processing Solutions`
- **SEO Note**: Include service type and B2B focus

##### `slug` (Auto-generated, Required)
- **Type**: UID
- **Description**: URL-friendly identifier
- **Auto-generated from**: `name` field
- **Example**: `green-bean-processing-services`

##### `tagline` (Optional, Max 150 characters)
- **Type**: String
- **Description**: Short service tagline
- **Example**: `Professional processing with full QA` or `Complete OEM/private label solutions`
- **Usage**: Service cards, hero sections

##### `overview` (Required)
- **Type**: Rich Text
- **Description**: Comprehensive service overview
- **Content Guidelines**:
  - Service description
  - Capacity and capabilities (6 tons/hour, 60kg batch)
  - Equipment and technology (modern 2024 equipment)
  - Quality assurance processes
  - Certifications and standards
  - Use cases and applications
  - Include location (Lâm Đồng, Vietnam)
- **Example Structure**:
  ```
  With modern 2024 equipment and a 6-tons/hour capacity, we provide reliable green bean processing services for B2B partners worldwide.
  
  Our Capabilities:
  - Processing capacity: 6 tons/hour
  - Wet processing: 1,500m² facility
  - Dry processing: 1,000m² facility
  - Full quality control
  - Comprehensive wastewater treatment
  - Export preparation
  
  Ideal for:
  - Coffee exporters
  - Roasters seeking processing partners
  - B2B partners requiring reliable processing
  ```
- **SEO Note**: Comprehensive content highlighting expertise and capacity

##### `hero_image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Service hero/featured image
- **Specifications**:
  - **Dimensions**: 1400 × 900 pixels
  - **Format**: WebP preferred, JPG fallback
  - **File Size**: ≤ 220 KB
  - **Content**: Service-related visual (processing, facility, etc.)
- **Alt Text**: `[Service Name] at The Great Beans facility in Lâm Đồng, Vietnam`

##### `process_steps` (Optional, Repeatable)
- **Type**: Component (service.process-step)
- **Description**: Step-by-step process breakdown
- **See Component Reference** for Process Step structure
- **Recommended Steps** (for Green Bean Processing):
  1. Intake & Sorting
  2. Wet Processing (if applicable)
  3. Drying & Color Sorting
  4. Quality Inspection
  5. Packaging & Export Preparation
- **Usage**: Visual process explanation, transparency

##### `capabilities` (Optional, Repeatable)
- **Type**: Component (service.capability)
- **Description**: Service capabilities and metrics
- **See Component Reference** for Capability structure
- **Recommended Capabilities**:
  - Processing Capacity: 6 tons/hour
  - Quality Control: Full QA process
  - Traceability: Farm-to-cup tracking
  - Certifications: CQI-certified processing
- **Usage**: Highlight key differentiators

##### `case_studies` (Optional, Relation)
- **Type**: Relation (Many-to-Many)
- **Description**: Customer testimonials/case studies
- **Target**: `api::testimonial.testimonial`
- **How to Link**: Select testimonials from list
- **Note**: Create testimonials first, then link them
- **Usage**: Social proof, trust signals

##### `faq_items` (Optional, Repeatable)
- **Type**: Component (shared.faq-item)
- **Description**: Service-specific FAQs
- **See Component Reference** for FAQ Item structure
- **Recommended FAQs**:
  - "What is your processing capacity?"
  - "Do you offer custom processing profiles?"
  - "What is your minimum order quantity?"
  - "How do you ensure quality control?"
- **SEO Note**: FAQs generate FAQPage schema

##### `related_products` (Optional, Relation)
- **Type**: Relation (Many-to-Many)
- **Description**: Products related to this service
- **Target**: `api::product.product`
- **How to Link**: Select products from list
- **Example**: Link "Premium Robusta Green Beans" to "Green Bean Processing Services"
- **Usage**: Cross-linking, internal SEO

##### `primary_cta` (Optional)
- **Type**: Component (shared.button)
- **Description**: Primary call-to-action button
- **See Component Reference** for Button structure
- **Recommended**:
  - **Text**: `Request a Quote` or `Contact Our Sales Team`
  - **URL**: `/contact` or `#contact`
  - **Variant**: `primary`

##### `seo` (Optional)
- **Type**: Component (seo.metadata)
- **Description**: SEO metadata for service page
- **See Component Reference** for SEO Metadata structure
- **Recommended**:
  - Meta Title: `[Service Name] | The Great Beans - Professional Coffee Services`
  - Meta Description: Include service type, capacity, location, certifications

#### Population Steps

1. Navigate to **Content Manager** → **Collection Types** → **Service**
2. Click **"Create new entry"**
3. **For English locale**:
   - Switch locale to `en`
   - Fill in `name` (slug auto-generates)
   - Add `tagline`
   - Write comprehensive `overview` (rich text)
   - Upload `hero_image`
   - Add `process_steps` (3-5 steps recommended)
   - Add `capabilities` (3-5 capabilities)
   - Link `case_studies` (select testimonials)
   - Add `faq_items` (3-5 FAQs)
   - Link `related_products` (select products)
   - Configure `primary_cta` button
   - Configure `seo` component
   - Click **Save** then **Publish**
4. **For Vietnamese locale**:
   - Switch locale to `vi`
   - Translate `name`, `tagline`, `overview`
   - Keep same `hero_image`
   - Translate `process_steps` text
   - Translate `capabilities` text
   - Keep same `case_studies` and `related_products` (relations shared)
   - Translate `faq_items`
   - Translate `primary_cta` button text
   - Configure `seo` component with Vietnamese content
   - Click **Save** then **Publish**

#### Recommended Services

Based on company capabilities:
1. **Green Bean Processing Services** - 6 tons/hour capacity
2. **OEM/Private Label Coffee Production** - Custom branding
3. **Roasting & Profiling Services** - 60kg batch roasting
4. **Custom Processing Solutions** - Tailored services

---

### 3.11 Knowledge Asset (Collection Type, i18n)

**Path**: `Content Manager` → `Collection Types` → `Knowledge Asset`

**Note**: Knowledge Assets (blog posts/articles) support i18n. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Fields

##### `title` (Required, Max 200 characters)
- **Type**: String
- **Description**: Article title
- **Examples**:
  - `The Great Beans: Our Journey from Farm to Global Market`
  - `Understanding Specialty Coffee Processing: Wet vs Dry Method`
  - `CQI Certification: What It Means for Coffee Quality`
- **SEO Note**: Include primary keyword, be descriptive

##### `slug` (Auto-generated, Required)
- **Type**: UID
- **Description**: URL-friendly identifier
- **Auto-generated from**: `title` field
- **Example**: `the-great-beans-journey-farm-to-global-market`
- **Note**: Can be manually edited for better URLs

##### `excerpt` (Optional, Max 300 characters)
- **Type**: Text
- **Description**: Article excerpt/summary
- **Example**: `Discover how The Great Beans evolved from a 10-hectare farm in 2018 to a state-of-the-art processing facility serving global markets. Learn about our commitment to quality, sustainability, and Vietnamese coffee heritage.`
- **Usage**: Article cards, meta descriptions, social sharing
- **SEO Note**: Include key points and value proposition

##### `content_sections` (Required, Dynamic Zone)
- **Type**: Dynamic Zone
- **Description**: Flexible article content sections
- **Available Components**:
  - `section.text-block` - Rich text content
  - `section.image-block` - Images with captions
  - `section.quote-block` - Pull quotes
  - `section.code-block` - Code snippets (if needed)
- **How to Use**:
  1. Click **"Add a component to content_sections"**
  2. Select component type
  3. Fill in component fields
  4. Add more sections as needed
  5. Reorder with drag handles
- **Content Guidelines**:
  - Use proper heading hierarchy (H2, H3)
  - Include images throughout
  - Add pull quotes for emphasis
  - Break up long text blocks
  - Include internal links to related content
- **Note**: Dynamic zone components are documented in Component Reference section

##### `table_of_contents` (Optional)
- **Type**: JSON
- **Description**: Table of contents structure
- **Format**: JSON object mapping headings to anchor IDs
- **Example**:
  ```json
  {
    "Introduction": "#introduction",
    "Processing Methods": "#processing-methods",
    "Quality Control": "#quality-control",
    "Conclusion": "#conclusion"
  }
  ```
- **Usage**: Auto-generated TOC in frontend
- **Note**: Can be auto-generated from headings in content

##### `featured_image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Article featured image
- **Specifications**:
  - **Dimensions**: 1600 × 900 pixels (16:9 aspect ratio)
  - **Format**: WebP preferred, JPG fallback
  - **File Size**: ≤ 220 KB
  - **Content**: Article-relevant visual
- **Alt Text**: Descriptive text related to article topic
- **Usage**: Article cards, Open Graph images, social sharing

##### `author` (Optional, Relation)
- **Type**: Relation (Many-to-One)
- **Description**: Article author
- **Target**: `api::author.author`
- **How to Link**: Select author from dropdown
- **Note**: Create authors first (see Author section)
- **Usage**: Author byline, structured data (Article schema)
- **E-E-A-T Note**: Assigning authors with credentials builds expertise signals

##### `category` (Optional, Relation)
- **Type**: Relation (Many-to-One)
- **Description**: Article category
- **Target**: `api::category.category`
- **How to Link**: Select category from dropdown
- **Note**: Create categories first (see Category section)
- **Usage**: Content organization, topic clustering

##### `published_date` (Optional)
- **Type**: DateTime
- **Description**: Publication date
- **Format**: YYYY-MM-DD HH:mm:ss
- **Example**: `2024-08-15 10:00:00`
- **Usage**: Article ordering, structured data (Article schema)
- **Note**: Set to current date/time if publishing immediately

##### `read_time` (Optional, Integer ≥ 0)
- **Type**: Integer
- **Description**: Estimated reading time in minutes
- **Example**: `7` (for 7 minutes)
- **Calculation**: Typically ~200 words per minute
- **Usage**: Article display, user experience

##### `word_count` (Optional, Integer ≥ 0)
- **Type**: Integer
- **Description**: Total word count
- **Example**: `1600` (for 1,600 words)
- **Usage**: Content analysis, SEO metrics
- **Note**: Can be auto-calculated from content

##### `seo` (Optional)
- **Type**: Component (seo.metadata)
- **Description**: SEO metadata for article
- **See Component Reference** for SEO Metadata structure
- **Recommended**:
  - Meta Title: `[Article Title] | The Great Beans Coffee Blog`
  - Meta Description: Use excerpt or expand slightly (145-160 chars)
  - Meta Image: Use featured image resized to 1200×630

#### Population Steps

1. Navigate to **Content Manager** → **Collection Types** → **Knowledge Asset**
2. Click **"Create new entry"**
3. **For English locale**:
   - Switch locale to `en`
   - Fill in `title` (slug auto-generates)
   - Add `excerpt` (compelling summary)
   - Build `content_sections` using dynamic zone:
     - Add text blocks with headings
     - Add image blocks with captions
     - Add quote blocks for emphasis
   - Add `table_of_contents` JSON (optional, can be auto-generated)
   - Upload `featured_image`
   - Select `author` from dropdown
   - Select `category` from dropdown
   - Set `published_date` (current date/time)
   - Calculate and add `read_time` (minutes)
   - Calculate and add `word_count`
   - Configure `seo` component
   - Click **Save** then **Publish**
4. **For Vietnamese locale**:
   - Switch locale to `vi`
   - Translate `title`, `excerpt`
   - Translate all `content_sections` text
   - Keep same images (or use Vietnamese-specific)
   - Keep same `author` and `category` (relations shared)
   - Set `published_date` (can be same or different)
   - Recalculate `read_time` and `word_count` for Vietnamese
   - Configure `seo` component with Vietnamese content
   - Click **Save** then **Publish**

#### Recommended Knowledge Assets

Based on content strategy:
1. **Company Journey** - From 2018 to 2024
2. **Processing Expertise** - Wet vs dry methods
3. **CQI Certification Guide** - What it means
4. **Vietnamese Robusta Heritage** - Industry insights
5. **B2B Buyer Guides** - Practical guides

---

### 3.12 Testimonial (Collection Type, i18n)

**Path**: `Content Manager` → `Collection Types` → `Testimonial`

**Note**: Testimonials support i18n. Populate both English (`en`) and Vietnamese (`vi`) locales.

#### Fields

##### `quote` (Required, Max 1000 characters)
- **Type**: Text
- **Description**: Testimonial quote/review text
- **Example**: `"The Great Beans is our trusted OEM partner. Quality and consistency are outstanding. Their 6-tons/hour processing capacity and CQI-certified expertise make them the ideal partner for our specialty coffee needs."`
- **SEO Note**: Include specific details (capacity, certifications) for E-E-A-T

##### `reviewer_name` (Required, Max 100 characters)
- **Type**: String
- **Description**: Reviewer's full name
- **Example**: `Jane Nguyen` or `David Tran`
- **Usage**: Displayed with quote, structured data

##### `reviewer_title` (Optional, Max 100 characters)
- **Type**: String
- **Description**: Reviewer's job title
- **Example**: `Sourcing Manager` or `Operations Director`
- **Usage**: Credibility indicator, E-E-A-T signal

##### `reviewer_company` (Optional, Max 100 characters)
- **Type**: String
- **Description**: Reviewer's company name
- **Example**: `VietCafe Co.` or `Global Roast Ltd.`
- **Usage**: Company association, trust signals

##### `reviewer_avatar` (Optional)
- **Type**: Media (Single Image)
- **Description**: Reviewer profile photo
- **Specifications**:
  - **Dimensions**: 512 × 512 pixels (square)
  - **Format**: WebP preferred, JPG/PNG fallback
  - **File Size**: ≤ 120 KB
  - **Content**: Professional headshot
- **Alt Text**: `[Reviewer Name] - [Title] at [Company]`

##### `company_logo` (Optional)
- **Type**: Media (Single Image)
- **Description**: Reviewer's company logo
- **Specifications**:
  - **Dimensions**: 400 × 200 pixels (2:1 aspect ratio)
  - **Format**: PNG with transparency preferred, WebP acceptable
  - **File Size**: ≤ 120 KB
  - **Content**: Company logo
- **Alt Text**: `[Company Name] logo`

##### `rating` (Optional, Integer 1-5)
- **Type**: Integer
- **Description**: Star rating
- **Range**: 1 - 5
- **Example**: `5` (for 5 stars)
- **Usage**: Visual rating display, structured data (AggregateRating)

##### `featured` (Optional, Boolean)
- **Type**: Boolean
- **Description**: Feature this testimonial prominently
- **Default**: `false`
- **Usage**: Homepage testimonials section, featured displays
- **Note**: Set to `true` for best testimonials

##### `review_date` (Optional)
- **Type**: Date
- **Description**: Date review was given
- **Format**: YYYY-MM-DD
- **Example**: `2024-09-10`
- **Usage**: Timeline, structured data

#### Population Steps

1. Navigate to **Content Manager** → **Collection Types** → **Testimonial**
2. Click **"Create new entry"**
3. **For English locale**:
   - Switch locale to `en`
   - Add `quote` (testimonial text)
   - Fill in `reviewer_name` (required)
   - Add `reviewer_title` (job title)
   - Add `reviewer_company` (company name)
   - Upload `reviewer_avatar` (if available)
   - Upload `company_logo` (if available)
   - Set `rating` (1-5 stars)
   - Set `featured` to `true` for best testimonials
   - Set `review_date`
   - Click **Save** then **Publish**
4. **For Vietnamese locale**:
   - Switch locale to `vi`
   - Translate `quote` (maintain meaning and specifics)
   - Keep same reviewer information (names, titles, companies are usually same)
   - Keep same images
   - Keep same `rating` and `review_date`
   - Keep same `featured` status
   - Click **Save** then **Publish**

#### Recommended Testimonials

Create testimonials from:
- B2B partners
- Export customers
- OEM/Private Label clients
- Processing service clients

Include specific details:
- Company names (if permitted)
- Specific services/products used
- Results and outcomes
- Capacity and quality mentions

---

## Component Reference

This section documents all reusable components used throughout content types. Components can be nested within other components or used directly in content types.

### 4.1 SEO Metadata Component (`seo.metadata`)

**Used in**: Homepage, Products, Services, Knowledge Assets, Contact Page, About Page

#### Fields

##### `metaTitle` (Optional, Max 60 characters)
- **Type**: String
- **Description**: Page-specific meta title
- **SEO Guidelines**:
  - Overrides default meta title from Global SEO
  - Keep between 50-60 characters
  - Include brand name and primary keyword
  - Include location for local SEO
- **Example**: `Premium Robusta Green Beans | The Great Beans - Vietnam`
- **Character Count**: 54

##### `metaDescription` (Optional, Max 160 characters)
- **Type**: Text
- **Description**: Page-specific meta description
- **SEO Guidelines**:
  - Overrides default meta description from Global SEO
  - Keep between 145-160 characters
  - Include location, capacity, certifications, CTA
  - Be compelling and action-oriented
- **Example**: `High-quality Robusta green beans from Lâm Đồng, Vietnam. 6 tons/hour processing capacity, CQI-certified. Request a quote today.`
- **Character Count**: 128

##### `metaImage` (Optional)
- **Type**: Media (Single Image)
- **Description**: Page-specific Open Graph and Twitter Card image
- **Specifications**:
  - **Dimensions**: 1200 × 630 pixels (1.91:1 aspect ratio)
  - **Format**: WebP preferred, JPG fallback
  - **File Size**: ≤ 250 KB
  - **Content**: Page-specific visual or use featured image
- **Alt Text**: Descriptive text matching page content
- **Usage**: Social sharing, Open Graph, Twitter Cards

##### `keywords` (Optional)
- **Type**: String
- **Description**: Comma-separated keywords
- **Format**: `keyword1, keyword2, keyword3`
- **Example**: `Vietnamese coffee, Robusta, green beans, specialty coffee, Lâm Đồng`
- **Note**: Not used by search engines but helpful for internal organization
- **SEO Note**: Focus on semantic keywords and topic clusters

##### `metaRobots` (Optional, Default: "index, follow")
- **Type**: String
- **Description**: Robots meta directive
- **Options**:
  - `index, follow` - Default, allow indexing and following links
  - `noindex, follow` - Don't index but follow links
  - `index, nofollow` - Index but don't follow links
  - `noindex, nofollow` - Don't index or follow links
- **Usage**: Control search engine crawling
- **Note**: Use `noindex` only for draft/test content

##### `canonicalURL` (Optional)
- **Type**: String
- **Description**: Absolute URL for canonical tag
- **Format**: Full URL with protocol
- **Example**: `https://thegreatbeans.com/products/premium-robusta-green-beans`
- **Vietnamese Example**: `https://thegreatbeans.com/vi/products/premium-robusta-green-beans`
- **Note**: Leave empty to auto-generate from slug
- **Usage**: Prevent duplicate content issues

##### `metaSocial` (Optional, Repeatable)
- **Type**: Component (seo.social-share)
- **Description**: Platform-specific social media metadata
- **See Social Share Component** below for structure
- **Usage**: Override default meta for Facebook/Twitter
- **Recommended**: Configure for Facebook and Twitter

---

### 4.2 Social Share Component (`seo.social-share`)

**Used in**: SEO Metadata component (nested)

#### Fields

##### `socialNetwork` (Required)
- **Type**: Enumeration
- **Options**: `Facebook`, `Twitter`
- **Description**: Social media platform
- **Usage**: Platform-specific overrides

##### `title` (Optional, Max 60 characters)
- **Type**: String
- **Description**: Platform-specific title
- **Facebook**: Can differ from meta title for better engagement
- **Twitter**: Optimized for Twitter's character limits
- **Example**: `Premium Vietnamese Coffee | Farm-to-Cup Excellence`

##### `description` (Optional, Max 160 characters)
- **Type**: Text
- **Description**: Platform-specific description
- **Facebook**: Can expand on meta description with more context
- **Twitter**: Concise, action-oriented
- **Example**: `Experience premium Robusta coffee from Vietnam's highlands. CQI-certified processing, 6 tons/hour capacity. Partner with us for quality.`

##### `image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Platform-specific image
- **Specifications**:
  - **Dimensions**: 1200 × 630 pixels
  - **Format**: WebP preferred
  - **File Size**: ≤ 250 KB
- **Facebook**: Branded image with text overlay recommended
- **Twitter**: Square or landscape with minimal text

---

### 4.3 Button Component (`shared.button`)

**Used in**: Hero Advanced, CTA Conversion, Services, About Page

#### Fields

##### `text` (Required, Max 100 characters)
- **Type**: String
- **Description**: Button label text
- **Examples**:
  - `Request a Quote`
  - `Contact Our Sales Team`
  - `Explore Our Products`
  - `Schedule a Facility Tour`
- **SEO Note**: Use action-oriented, clear CTAs

##### `url` (Required)
- **Type**: String
- **Description**: Link destination
- **Formats**:
  - **Internal**: `/products`, `/contact`, `/about`
  - **External**: `https://example.com` (full URL)
  - **Anchor**: `#section-id` (page anchor)
- **Example**: `/contact` or `https://thegreatbeans.com/contact`

##### `variant` (Optional, Default: "primary")
- **Type**: Enumeration
- **Options**: `primary`, `outline`, `ghost`, `destructive`
- **Description**: Button style variant
- **Usage**:
  - `primary`: Main action (green, prominent)
  - `outline`: Secondary action (outlined)
  - `ghost`: Tertiary action (transparent)
  - `destructive`: Delete/destructive actions (red)

##### `open_in_new_tab` (Optional, Default: false)
- **Type**: Boolean
- **Description**: Open link in new tab/window
- **Usage**: External links, PDFs, documents
- **Note**: Use sparingly, typically for external links only

##### `icon_name` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Lucide icon name
- **Examples**: `arrow-right`, `mail`, `phone`, `download`, `external-link`
- **Usage**: Visual enhancement, clarity
- **Note**: Icon displays before or after text depending on frontend implementation

---

### 4.4 FAQ Item Component (`shared.faq-item`)

**Used in**: Category (pillar_page_faq), Service (faq_items), Contact Page (contact_faq), FAQ SEO section

#### Fields

##### `question` (Required, Max 200 characters)
- **Type**: String
- **Description**: FAQ question text
- **SEO Guidelines**:
  - Be specific and keyword-rich
  - Match user search queries
  - Use natural language
  - Include location/keywords where relevant
- **Examples**:
  - `What is your processing capacity?`
  - `Do you offer OEM/private label services?`
  - `Where is your facility located?`
  - `What certifications do you hold?`

##### `answer` (Required)
- **Type**: Rich Text
- **Description**: Comprehensive FAQ answer
- **Content Guidelines**:
  - Provide thorough, helpful answers
  - Include relevant keywords naturally
  - Reference specific details (capacity, certifications, location)
  - Can include formatting, lists, links
  - Aim for 50-200 words per answer
- **Example**:
  ```
  Our facility processes 6 tons of green coffee beans per hour using modern 2024 equipment. We maintain full quality control throughout the process, from intake to packaging. Our 1,500m² wet processing plant and 1,000m² dry processing area ensure efficient, high-quality processing for B2B partners worldwide.
  ```
- **SEO Note**: Comprehensive answers build E-E-A-T and helpful content

##### `category` (Optional, Default: "general")
- **Type**: Enumeration
- **Options**: `general`, `product`, `service`, `shipping`, `other`
- **Description**: FAQ category for filtering
- **Usage**: Organize FAQs by topic
- **Note**: Used in split-categories layout

---

### 4.5 Product Specification Component (`product.specification`)

**Used in**: Product (specifications field, repeatable)

#### Fields

##### `spec_name` (Required, Max 100 characters)
- **Type**: String
- **Description**: Specification name/label
- **Examples**:
  - `Moisture Content`
  - `Screen Size`
  - `Density`
  - `Defect Rate`
  - `Processing Method`
- **Usage**: Specification label

##### `spec_value` (Required, Max 100 characters)
- **Type**: String
- **Description**: Specification value
- **Examples**:
  - `12%`
  - `18`
  - `High`
  - `< 5%`
  - `Washed`
- **Usage**: Specification value display

##### `spec_unit` (Optional, Max 20 characters)
- **Type**: String
- **Description**: Unit of measurement
- **Examples**: `%`, `kg`, `m`, `°C`, `tons/hour`
- **Usage**: Clarify measurement units
- **Note**: Can be included in `spec_value` if preferred

#### Example Usage

For a product, add multiple specifications:
1. **Spec Name**: `Moisture Content`, **Spec Value**: `12`, **Spec Unit**: `%`
2. **Spec Name**: `Screen Size`, **Spec Value**: `18`, **Spec Unit**: (empty)
3. **Spec Name**: `Processing Capacity`, **Spec Value**: `6`, **Spec Unit**: `tons/hour`

---

### 4.6 Product Packaging Component (`product.packaging`)

**Used in**: Product (packaging_options field, repeatable)

#### Fields

##### `type` (Required)
- **Type**: Enumeration
- **Options**: `bulk`, `bag`, `box`, `custom`
- **Description**: Packaging type
- **Examples**:
  - `bulk` - Bulk packaging (jute bags, etc.)
  - `bag` - Bag packaging (vacuum bags, etc.)
  - `box` - Box packaging
  - `custom` - Custom packaging solutions

##### `size` (Required, Max 100 characters)
- **Type**: String
- **Description**: Packaging size
- **Examples**:
  - `60kg`
  - `5kg`
  - `10kg`
  - `250g`
  - `Custom sizes available`
- **Usage**: Display packaging size options

##### `description` (Optional, Max 500 characters)
- **Type**: Text
- **Description**: Packaging description
- **Example**: `Standard jute bags suitable for export. Moisture-proof and durable.`
- **Usage**: Additional packaging details

##### `minimum_order` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Minimum order quantity for this packaging
- **Example**: `100kg` or `1 pallet` or `Contact for MOQ`
- **Usage**: B2B ordering information

#### Example Usage

For a product, add multiple packaging options:
1. **Type**: `bulk`, **Size**: `60kg`, **Description**: `Standard jute bags for export`, **Minimum Order**: `100kg`
2. **Type**: `bag`, **Size**: `5kg`, **Description**: `Vacuum-sealed bags`, **Minimum Order**: `50 units`
3. **Type**: `custom`, **Size**: `Custom sizes available`, **Description**: `Tailored packaging solutions`, **Minimum Order**: `Contact for MOQ`

---

### 4.7 Service Process Step Component (`service.process-step`)

**Used in**: Service (process_steps field, repeatable)

#### Fields

##### `step_number` (Required, Integer ≥ 1)
- **Type**: Integer
- **Description**: Step sequence number
- **Range**: 1, 2, 3, 4, 5...
- **Example**: `1` (for first step)
- **Usage**: Display step order

##### `title` (Required, Max 200 characters)
- **Type**: String
- **Description**: Step title/name
- **Examples**:
  - `Intake & Sorting`
  - `Wet Processing`
  - `Drying & Color Sorting`
  - `Quality Inspection`
  - `Packaging & Export Preparation`
- **SEO Note**: Use clear, descriptive titles

##### `description` (Required, Max 1000 characters)
- **Type**: Text
- **Description**: Detailed step description
- **Content Guidelines**:
  - Explain what happens in this step
  - Include equipment/technology used
  - Mention quality control measures
  - Reference capacity or specifications where relevant
- **Example**:
  ```
  Initial inspection and sorting by size and color. Our modern sorting equipment ensures uniform bean quality. All incoming beans are checked for defects and moisture content before processing begins.
  ```
- **SEO Note**: Detailed descriptions build expertise signals

##### `icon_name` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Lucide icon name for visual representation
- **Examples**: `factory`, `filter`, `package`, `check-circle`, `truck`
- **Usage**: Visual step indicators

##### `illustration` (Optional)
- **Type**: Media (Single Image)
- **Description**: Step illustration/image
- **Specifications**:
  - **Dimensions**: 1200 × 800 pixels
  - **Format**: WebP preferred
  - **File Size**: ≤ 200 KB
  - **Content**: Step-specific visual
- **Alt Text**: `[Step Title] at The Great Beans processing facility`

#### Example Usage

For "Green Bean Processing Services", add steps:
1. **Step Number**: `1`, **Title**: `Intake & Sorting`, **Description**: (detailed), **Icon**: `package`, **Illustration**: (image)
2. **Step Number**: `2`, **Title**: `Wet Processing`, **Description**: (detailed), **Icon**: `droplet`, **Illustration**: (image)
3. **Step Number**: `3`, **Title**: `Drying & Color Sorting`, **Description**: (detailed), **Icon**: `sun`, **Illustration**: (image)

---

### 4.8 Service Capability Component (`service.capability`)

**Used in**: Service (capabilities field, repeatable)

#### Fields

##### `title` (Required, Max 200 characters)
- **Type**: String
- **Description**: Capability name
- **Examples**:
  - `Processing Capacity`
  - `Quality Control`
  - `Traceability`
  - `Certifications`
  - `Export Preparation`
- **Usage**: Capability label

##### `description` (Optional, Max 500 characters)
- **Type**: Text
- **Description**: Capability description
- **Example**: `Full quality control throughout the entire processing chain, from intake to packaging.`
- **Usage**: Explain capability in detail

##### `metric_value` (Required, Max 50 characters)
- **Type**: String
- **Description**: Capability metric value
- **Examples**:
  - `6 Tons/Hour`
  - `100%`
  - `Full`
  - `CQI-Certified`
- **Usage**: Highlight key metric

##### `metric_label` (Required, Max 100 characters)
- **Type**: String
- **Description**: Metric label/description
- **Examples**:
  - `Processing Capacity`
  - `Quality Assurance`
  - `Traceability Coverage`
  - `Certification Level`
- **Usage**: Context for metric value

##### `icon_name` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Lucide icon name
- **Examples**: `factory`, `shield`, `map-pin`, `award`, `check-circle`
- **Usage**: Visual capability indicator

#### Example Usage

For a service, add capabilities:
1. **Title**: `Processing Capacity`, **Description**: `6 tons per hour processing`, **Metric Value**: `6`, **Metric Label**: `Tons/Hour`, **Icon**: `factory`
2. **Title**: `Quality Control`, **Description**: `Full QA process`, **Metric Value**: `100%`, **Metric Label**: `Coverage`, **Icon**: `shield`

---

### 4.9 About CEO Profile Component (`about.ceo-profile`)

**Used in**: About Page (ceo_section field)

#### Fields

##### `name` (Required, Max 100 characters)
- **Type**: String
- **Description**: CEO full name
- **Example**: `Nguyễn Khánh Tùng`
- **Usage**: CEO name display

##### `title` (Required, Max 100 characters)
- **Type**: String
- **Description**: CEO job title
- **Example**: `CEO` or `Founder & CEO`
- **Usage**: Title display

##### `photo` (Optional)
- **Type**: Media (Single Image)
- **Description**: CEO professional photo
- **Specifications**:
  - **Dimensions**: 512 × 512 pixels or larger (square or portrait)
  - **Format**: WebP preferred, JPG/PNG fallback
  - **File Size**: ≤ 200 KB
  - **Content**: Professional headshot
- **Alt Text**: `Nguyễn Khánh Tùng - CEO of The Great Beans`

##### `bio` (Required)
- **Type**: Rich Text
- **Description**: CEO biography
- **Content Guidelines**:
  - Include founding story
  - Mention CQI certification (Q Processing Level 2)
  - Reference early CQI course participation (2018)
  - Highlight expertise and achievements
  - Include company vision and values
- **Example Structure**:
  ```
  Nguyễn Khánh Tùng is the founder and CEO of The Great Beans, established in 2018 (originally as Nazola). He is a CQI Q Processing Level 2 certified professional and was one of the first participants in the CQI specialty coffee processing course taught by Dr. Manuel Diaz in Vietnam.
  
  Under his leadership, The Great Beans has grown from a 10-hectare farm to a state-of-the-art processing facility with 6 tons/hour capacity, serving global markets while maintaining commitment to quality, sustainability, and Vietnamese coffee heritage.
  ```
- **SEO Note**: Comprehensive bio builds E-E-A-T (Expertise, Authoritativeness)

##### `quote` (Optional, Max 500 characters)
- **Type**: Text
- **Description**: Inspirational or mission-focused quote
- **Example**: `"Our commitment is to bring Vietnamese Robusta coffee to the world stage through excellence, sustainability, and ethical practices."`
- **Usage**: Featured quote display

---

### 4.10 About Timeline Event Component (`about.timeline-event`)

**Used in**: About Page (timeline_events field, repeatable)

#### Fields

##### `year` (Required, Max 20 characters)
- **Type**: String
- **Description**: Event year
- **Format**: Can include month if needed
- **Examples**:
  - `2018`
  - `January 2018`
  - `September 2023`
  - `August 2024`
- **Usage**: Timeline display

##### `title` (Required, Max 200 characters)
- **Type**: String
- **Description**: Event title
- **Examples**:
  - `Company Founded`
  - `Rebranded to The Great Beans`
  - `Modern Facility Construction Begins`
  - `Vietnam Amazing Cup 2024 Co-Sponsor`
  - `CEO Achieves CQI Q Processing Level 2`
- **SEO Note**: Include key achievements

##### `description` (Required, Max 1000 characters)
- **Type**: Text
- **Description**: Event description
- **Content Guidelines**:
  - Provide context and significance
  - Include specific details (dates, certifications, achievements)
  - Reference capacity, facility, or other metrics where relevant
- **Example**:
  ```
  CEO Nguyễn Khánh Tùng achieved Q Processing Level 2 – Professional certification from the Coffee Quality Institute (CQI). This certification demonstrates advanced knowledge and expertise in specialty coffee processing methods, quality control, and industry standards.
  ```
- **SEO Note**: Detailed descriptions build authority

##### `image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Event-related image
- **Specifications**:
  - **Dimensions**: 1200 × 800 pixels or similar
  - **Format**: WebP preferred
  - **File Size**: ≤ 250 KB
  - **Content**: Event photo, certificate, facility, etc.
- **Alt Text**: Descriptive text about the event/image

#### Recommended Timeline Events

Based on company info (from `info` file):
1. **January 2018**: Company founded as Nazola; CEO attends CQI course
2. **September 2023**: Rebranded to The Great Beans
3. **February 2024**: Modern facility construction begins (4 ha)
4. **April 2024**: Vietnam Amazing Cup 2024 Co-Sponsor
5. **May 2024**: All samples certified as Vietnam Specialty Coffee
6. **August 2024**: CEO achieves CQI Q Processing Level 2 certification

---

### 4.11 About Value Component (`about.value`)

**Used in**: About Page (core_values field, repeatable)

#### Fields

##### `title` (Required, Max 100 characters)
- **Type**: String
- **Description**: Core value name
- **Examples** (from `info` file):
  - `Quality Excellence`
  - `Sustainability`
  - `Innovation`
  - `Trust`
- **Usage**: Value title display

##### `description` (Required, Max 500 characters)
- **Type**: Text
- **Description**: Value description and meaning
- **Examples**:
  - **Quality Excellence**: `Superior quality in every aspect of our operations, from farm to cup. We maintain the highest standards in processing, quality control, and product delivery.`
  - **Sustainability**: `Long-term sustainability through ethical sourcing, environmental responsibility, and sustainable farming practices.`
  - **Innovation**: `Continuous improvement and innovation in processing methods, technology, and service delivery.`
  - **Trust**: `Reliability and trustworthiness in all business relationships, built through transparency and consistent quality.`
- **SEO Note**: Values align with E-E-A-T principles

##### `icon_name` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Lucide icon name
- **Examples**: `award` (Quality), `leaf` (Sustainability), `lightbulb` (Innovation), `shield` (Trust)
- **Usage**: Visual value indicator

---

### 4.12 Contact Inquiry Type Component (`contact.inquiry-type`)

**Used in**: Contact Page (form_inquiry_types field, repeatable)

#### Fields

##### `label` (Required, Max 100 characters)
- **Type**: String
- **Description**: Display label for inquiry type
- **Examples**:
  - `General Inquiry`
  - `Sales/Quote Request`
  - `OEM/Private Label Inquiry`
  - `Facility Tour Request`
  - `Partnership Inquiry`
- **Usage**: Dropdown option label

##### `value` (Required, Max 50 characters)
- **Type**: String
- **Description**: Form value/identifier
- **Format**: Lowercase, hyphenated
- **Examples**:
  - `general-inquiry`
  - `sales-quote`
  - `oem-inquiry`
  - `facility-tour`
  - `partnership`
- **Usage**: Form submission value

#### Example Usage

Add multiple inquiry types:
1. **Label**: `General Inquiry`, **Value**: `general-inquiry`
2. **Label**: `Sales/Quote Request`, **Value**: `sales-quote`
3. **Label**: `OEM/Private Label Inquiry`, **Value**: `oem-inquiry`
4. **Label**: `Facility Tour Request`, **Value**: `facility-tour`

---

### 4.13 Hero Stat Component (`hero.stat`)

**Used in**: Hero Advanced section (stats field), Factory Story section (key_stats field)

#### Fields

##### `value` (Required, Max 20 characters)
- **Type**: String
- **Description**: Statistic value/number
- **Examples**:
  - `10`
  - `6 Tons/Hour`
  - `2018`
  - `4 Hectares`
  - `60kg`
- **Usage**: Main stat display

##### `label` (Required, Max 50 characters)
- **Type**: String
- **Description**: Statistic description/label
- **Examples**:
  - `Farm Size`
  - `Processing Capacity`
  - `Established`
  - `Total Facility`
  - `Batch Size`
- **Usage**: Context for stat value

##### `prefix` (Optional, Max 5 characters)
- **Type**: String
- **Description**: Text before value
- **Examples**: `$`, `+`, `~`, `≈`
- **Usage**: Currency symbols, modifiers

##### `suffix` (Optional, Max 5 characters)
- **Type**: String
- **Description**: Text after value
- **Examples**: `%`, `/Hour`, `+`, `kg`
- **Usage**: Units, modifiers

##### `icon_name` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Lucide icon name
- **Examples**: `truck`, `factory`, `calendar`, `users`, `award`
- **Usage**: Visual stat indicator

##### `animation_delay` (Optional, Default: 0)
- **Type**: Decimal
- **Description**: Animation delay in seconds
- **Range**: 0 - 5 seconds
- **Example**: `0.5` (half second delay)
- **Usage**: Staggered animation effects

#### Example Usage

For Hero Advanced section, add stats:
1. **Value**: `4`, **Label**: `Hectares`, **Suffix**: (empty), **Icon**: `factory`, **Animation Delay**: `0`
2. **Value**: `6`, **Label**: `Tons`, **Suffix**: `/Hour`, **Icon**: `truck`, **Animation Delay**: `0.2`
3. **Value**: `2018`, **Label**: `Established`, **Suffix**: (empty), **Icon**: `calendar`, **Animation Delay**: `0.4`

---

### 4.14 Hero Trust Indicator Component (`hero.trust-indicator`)

**Used in**: Hero Advanced section (trust_indicators field), Factory Story section (expertise_proofs field)

#### Fields

##### `text` (Required, Max 100 characters)
- **Type**: String
- **Description**: Trust statement or certification name
- **Examples**:
  - `CQI Q Processing Level 2 Certified`
  - `Vietnam Amazing Cup 2024 Co-Sponsor`
  - `Ethical & Sustainable Sourcing`
  - `Modern 2024 Equipment`
- **SEO Note**: Include specific certifications for E-E-A-T

##### `icon_name` (Optional, Max 50 characters)
- **Type**: String
- **Description**: Lucide icon name
- **Examples**: `award`, `check-circle`, `shield`, `star`, `certificate`
- **Usage**: Visual trust indicator

##### `show_on_mobile` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Display on mobile devices
- **Default**: `true`
- **Usage**: Control mobile visibility

#### Example Usage

For Hero Advanced section, add trust indicators:
1. **Text**: `CQI Q Processing Level 2 Certified`, **Icon**: `award`, **Show on Mobile**: `true`
2. **Text**: `Vietnam Amazing Cup 2024 Co-Sponsor`, **Icon**: `star`, **Show on Mobile**: `true`
3. **Text**: `Ethical & Sustainable Sourcing`, **Icon**: `leaf`, **Show on Mobile**: `true`

---

### 4.15 Hero Hotspot Component (`hero.hotspot`)

**Used in**: Hero Advanced section (hotspots field)

#### Fields

##### `position_x` (Required, Decimal 0-100)
- **Type**: Decimal
- **Description**: Horizontal position as percentage from left edge
- **Range**: 0.0 - 100.0
- **Example**: `25.5` (25.5% from left)
- **Usage**: Hotspot placement on image

##### `position_y` (Required, Decimal 0-100)
- **Type**: Decimal
- **Description**: Vertical position as percentage from top edge
- **Range**: 0.0 - 100.0
- **Example**: `40.2` (40.2% from top)
- **Usage**: Hotspot placement on image

##### `tooltip_title` (Required, Max 100 characters)
- **Type**: String
- **Description**: Hotspot title shown on hover
- **Examples**:
  - `Processing Facility`
  - `Wastewater Treatment`
  - `Quality Control Lab`
  - `Packaging Area`
- **Usage**: Hotspot tooltip header

##### `tooltip_content` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Detailed description shown on hover
- **Example**: `Our 4-hectare facility processes 6 tons per hour using modern 2024 equipment with full quality control.`
- **Usage**: Hotspot tooltip body

##### `icon_type` (Optional, Default: "info")
- **Type**: Enumeration
- **Options**: `question`, `info`, `star`, `check`
- **Description**: Hotspot icon type
- **Usage**: Visual hotspot indicator

#### Example Usage

For Hero Advanced section, add hotspots on hero image:
1. **Position X**: `25`, **Position Y**: `40`, **Title**: `Processing Facility`, **Content**: `Modern 2024 equipment with full QA`, **Icon**: `info`
2. **Position X**: `70`, **Position Y**: `55`, **Title**: `Wastewater Treatment`, **Content**: `Comprehensive, environment-friendly treatment system`, **Icon**: `info`

---

## Section Components for Homepage

These components are used in the Homepage `content_sections` dynamic zone. Each section has specific fields and configuration options.

### 4.16 Hero Advanced Section (`section.hero-advanced`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Main hero section with headline, CTAs, background images, stats, trust indicators, and interactive hotspots.

#### Fields

##### `headline` (Required, Max 100 characters)
- **Type**: String
- **Description**: Main hero title
- **English Example**: `Premium Robusta Coffee from Vietnam's Highlands`
- **Vietnamese Example**: `Cà Phê Robusta Thượng Hạng từ Cao Nguyên Việt Nam`
- **SEO Note**: Include primary keyword and location

##### `subheadline` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Supporting text below headline
- **English Example**: `Farm-to-Cup Excellence Since 2018 | CQI Certified Processing | 6 Tons/Hour Capacity`
- **Vietnamese Example**: `Tinh Hoa Farm-to-Cup từ 2018 | Chứng nhận CQI | Công suất 6 Tấn/giờ`
- **SEO Note**: Use pipe (`|`) to separate key points, include certifications and capacity

##### `primary_cta` (Required)
- **Type**: Component (shared.button)
- **Description**: Main call-to-action button
- **See Button Component** (Section 4.3) for structure
- **Recommended**:
  - **Text**: `Request a Quote`
  - **URL**: `/contact` or `#contact`
  - **Variant**: `primary`
  - **Icon**: `arrow-right` or `mail`

##### `secondary_cta` (Optional)
- **Type**: Component (shared.button)
- **Description**: Secondary action button
- **See Button Component** (Section 4.3) for structure
- **Recommended**:
  - **Text**: `Explore Our Products`
  - **URL**: `/products`
  - **Variant**: `outline` or `ghost`

##### `background_image_desktop` (Required)
- **Type**: Media (Single Image)
- **Description**: Desktop hero background image
- **Specifications**:
  - **Dimensions**: 2560 × 1440 pixels (16:9 aspect ratio)
  - **Format**: WebP preferred, JPG fallback
  - **File Size**: ≤ 400 KB
  - **Content**: Hero scene (farm, facility, coffee processing)
- **Alt Text**: `Premium Robusta processing at The Great Beans facility in Lâm Đồng, Vietnam`

##### `background_image_mobile` (Optional)
- **Type**: Media (Single Image)
- **Description**: Mobile-optimized background (optional)
- **Specifications**:
  - **Dimensions**: 1080 × 1920 pixels (9:16 aspect ratio, portrait)
  - **Format**: WebP preferred
  - **File Size**: ≤ 300 KB
  - **Content**: Mobile-optimized hero scene
- **Note**: If not provided, desktop image will be used (may not be optimal)

##### `overlay_opacity` (Optional, Default: 40)
- **Type**: Integer
- **Description**: Dark overlay opacity for text readability
- **Range**: 0 (no overlay) - 100 (fully opaque)
- **Default**: `40`
- **Recommended**: 40-60 for good contrast
- **Usage**: Ensures text is readable over background image

##### `trust_indicators` (Optional, Repeatable)
- **Type**: Component (hero.trust-indicator)
- **Description**: Trust badges displayed in hero
- **See Hero Trust Indicator Component** (Section 4.14) for structure
- **Recommended**: 2-4 trust indicators
- **Examples**:
  - CQI Q Processing Level 2 Certified
  - Vietnam Amazing Cup 2024 Co-Sponsor
  - Ethical & Sustainable Sourcing

##### `stats` (Optional, Repeatable)
- **Type**: Component (hero.stat)
- **Description**: Key statistics displayed as cards
- **See Hero Stat Component** (Section 4.13) for structure
- **Recommended**: 3-4 stats
- **Examples**:
  - Value: `4`, Label: `Hectares`, Suffix: (empty)
  - Value: `6`, Label: `Tons`, Suffix: `/Hour`
  - Value: `2018`, Label: `Established`, Suffix: (empty)

##### `hotspots` (Optional, Repeatable)
- **Type**: Component (hero.hotspot)
- **Description**: Interactive markers on hero image
- **See Hero Hotspot Component** (Section 4.15) for structure
- **Recommended**: 2-4 hotspots
- **Usage**: Interactive elements on hero image

##### `layout_variant` (Optional, Default: "golden-ratio-split")
- **Type**: Enumeration
- **Options**: `golden-ratio-split`, `centered-overlay`, `full-width`
- **Description**: Hero layout style
- **Options**:
  - `golden-ratio-split`: Text on left (60%), image on right (40%)
  - `centered-overlay`: Centered text over full-width image
  - `full-width`: Full-width image with text overlay
- **Default**: `golden-ratio-split`

##### `enable_gradient_text` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Applies gradient effect to headline text
- **Default**: `true`
- **Usage**: Visual enhancement

##### `enable_animated_grid` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Shows animated background grid pattern
- **Default**: `true`
- **Usage**: Visual enhancement

---

### 4.17 Trust Bar Enhanced Section (`section.trust-bar-enhanced`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Display certifications, partnerships, and trust indicators in a visually appealing format.

#### Fields

##### `headline` (Optional, Max 100 characters)
- **Type**: String
- **Description**: Section title (optional)
- **Example**: `Trusted by Industry Leaders`
- **Note**: Leave empty if you want logo-only display

##### `display_style` (Optional, Default: "logo-wall")
- **Type**: Enumeration
- **Options**: `logo-wall`, `carousel`, `grid`
- **Description**: Display format
- **Options**:
  - `logo-wall`: Static grid of logos
  - `carousel`: Scrolling carousel
  - `grid`: Responsive grid layout
- **Default**: `logo-wall`

##### `layout_desktop` (Optional, Default: "single-row")
- **Type**: Enumeration
- **Options**: `single-row`, `two-rows`, `masonry`
- **Description**: Desktop layout
- **Options**:
  - `single-row`: All logos in one row
  - `two-rows`: Logos in two rows
  - `masonry`: Masonry/pinterest-style layout
- **Default**: `single-row`

##### `layout_mobile` (Optional, Default: "carousel")
- **Type**: Enumeration
- **Options**: `carousel`, `grid-2col`
- **Description**: Mobile layout
- **Options**:
  - `carousel`: Horizontal scrolling carousel
  - `grid-2col`: 2-column grid
- **Default**: `carousel`

##### `certifications` (Optional, Relation)
- **Type**: Relation (One-to-Many)
- **Description**: Link to Certification content type entries
- **Target**: `api::certification.certification`
- **How to Link**: Select existing certifications from dropdown
- **Note**: Create certifications first (see Certification section)
- **Recommended**: Select 3-6 certifications
- **Usage**: Displays certification logos

##### `background_color` (Optional, Default: "white")
- **Type**: Enumeration
- **Options**: `white`, `earth`, `green-50`
- **Description**: Background color
- **Default**: `white`
- **Usage**: Visual styling

##### `logo_max_height` (Optional, Default: 60)
- **Type**: Integer
- **Description**: Maximum height in pixels for certification logos
- **Range**: 30 - 120 pixels
- **Default**: `60`
- **Recommended**: 60-80px for consistency

##### `enable_grayscale` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Converts logos to grayscale (hover shows color)
- **Default**: `true`
- **Usage**: Visual effect, hover interaction

---

### 4.18 Services Grid Section (`section.services-grid`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Display B2B services in a grid layout with customizable card styles.

#### Fields

##### `headline` (Required, Max 100 characters)
- **Type**: String
- **Description**: Section title
- **English Example**: `Our B2B Services`
- **Vietnamese Example**: `Dịch Vụ B2B Của Chúng Tôi`
- **SEO Note**: Include B2B/service keywords

##### `subheadline` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Supporting text
- **English Example**: `Comprehensive coffee processing and production services for global partners worldwide.`
- **Vietnamese Example**: (Translate maintaining meaning)

##### `services` (Optional, Relation)
- **Type**: Relation (One-to-Many)
- **Description**: Link to Service content type entries
- **Target**: `api::service.service`
- **How to Link**: Select existing services from dropdown
- **Note**: Create services first (see Service section)
- **Recommended**: Select 3-4 key services
- **Usage**: Displays service cards

##### `services_per_row_desktop` (Optional, Default: "3")
- **Type**: Enumeration
- **Options**: `3`, `4`
- **Description**: Number of services per row on desktop
- **Default**: `3`
- **Usage**: Grid layout control

##### `services_per_row_mobile` (Optional, Default: "1")
- **Type**: Enumeration
- **Options**: `1`, `2`
- **Description**: Number of services per row on mobile
- **Default**: `1` (stacked)
- **Usage**: Mobile layout control

##### `card_style` (Optional, Default: "detailed")
- **Type**: Enumeration
- **Options**: `minimal`, `detailed`, `image-focus`
- **Description**: Service card style
- **Options**:
  - `minimal`: Simple card with title and image
  - `detailed`: Card with image, title, excerpt, and CTA
  - `image-focus`: Large image with overlay text
- **Default**: `detailed`

##### `enable_hover_effect` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Adds hover animations and effects
- **Default**: `true`
- **Usage**: Interactive enhancement

---

### 4.19 Factory Story Section (`section.factory-story`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Tell the story of your facility with text, images, stats, and expertise proofs.

#### Fields

##### `headline` (Required, Max 100 characters)
- **Type**: String
- **Description**: Section title
- **English Example**: `State-of-the-Art Processing Facility`
- **Vietnamese Example**: `Nhà Máy Chế Biến Hiện Đại`
- **SEO Note**: Include facility/processing keywords

##### `story_text` (Required)
- **Type**: Rich Text
- **Description**: Main narrative content
- **Content Guidelines**:
  - Use rich text formatting (headings, lists, links)
  - Include key facts: capacity, equipment, certifications
  - Mention facility size and capabilities
  - Reference location (Lâm Đồng, Vietnam)
- **English Example**:
  ```
  Our 4-hectare facility in Lâm Đồng represents the pinnacle of modern coffee processing. With a 1,500m² wet processing plant and a 1,000m² dry processing and color sorting area, we maintain full quality control. Equipped in 2024, our system handles 6 tons of green beans per hour and ensures sustainability through a comprehensive wastewater treatment system.
  ```
- **Vietnamese Example**: (Translate maintaining technical accuracy)
- **SEO Note**: Comprehensive content with E-E-A-T signals

##### `image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Facility or process image
- **Specifications**:
  - **Dimensions**: 1920 × 1080 pixels or 1200 × 800 pixels
  - **Format**: WebP, ≤ 350 KB
  - **Content**: Facility exterior, processing line, equipment
- **Alt Text**: `The Great Beans modern processing facility in Lâm Đồng, Vietnam`

##### `image_position` (Optional, Default: "left")
- **Type**: Enumeration
- **Options**: `left`, `right`
- **Description**: Image position relative to text
- **Options**:
  - `left`: Image on left, text on right
  - `right`: Image on right, text on left
- **Default**: `left`

##### `key_stats` (Optional, Repeatable)
- **Type**: Component (hero.stat)
- **Description**: Important facility statistics
- **See Hero Stat Component** (Section 4.13) for structure
- **Recommended**: 3-4 stats
- **Examples**:
  - Value: `4 Hectares`, Label: `Total Facility`
  - Value: `1,500m²`, Label: `Wet Processing`
  - Value: `6 Tons/Hour`, Label: `Processing Capacity`

##### `expertise_proofs` (Optional, Repeatable)
- **Type**: Component (hero.trust-indicator)
- **Description**: Trust indicators specific to facility
- **See Hero Trust Indicator Component** (Section 4.14) for structure
- **Recommended**: 2-4 proofs
- **Examples**:
  - CQI Certified Processing
  - Modern 2024 Equipment
  - Ethical & Sustainable Practices

##### `layout` (Optional, Default: "split-60-40")
- **Type**: Enumeration
- **Options**: `split-60-40`, `split-50-50`, `image-full`
- **Description**: Section layout
- **Options**:
  - `split-60-40`: 60% text, 40% image
  - `split-50-50`: Equal split
  - `image-full`: Full-width image with text overlay
- **Default**: `split-60-40`

##### `enable_counter_animation` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Animates stat numbers on scroll
- **Default**: `true`
- **Usage**: Visual enhancement

---

### 4.20 Products Showcase Section (`section.products-showcase`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Display featured products in a grid or carousel layout.

#### Fields

##### `headline` (Required, Max 100 characters)
- **Type**: String
- **Description**: Section title
- **English Example**: `Our Premium Products`
- **Vietnamese Example**: `Sản Phẩm Thượng Hạng Của Chúng Tôi`

##### `subheadline` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Supporting text
- **English Example**: `High-quality Robusta products for specialty coffee markets worldwide.`

##### `products` (Optional, Relation)
- **Type**: Relation (One-to-Many)
- **Description**: Link to Product content type entries
- **Target**: `api::product.product`
- **How to Link**: Select existing products from dropdown
- **Note**: Create products first (see Product section)
- **Recommended**: Select 3-6 featured products
- **Usage**: Displays product cards

##### `products_per_row_desktop` (Optional, Default: "3")
- **Type**: Enumeration
- **Options**: `3`, `4`
- **Description**: Number of products per row on desktop
- **Default**: `3`

##### `products_per_row_mobile` (Optional, Default: "1")
- **Type**: Enumeration
- **Options**: `1`, `2`
- **Description**: Number of products per row on mobile
- **Default**: `1`

##### `show_specifications` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Displays product specifications on cards
- **Default**: `true`
- **Usage**: Show/hide specs on product cards

##### `show_price` (Optional, Default: false)
- **Type**: Boolean
- **Description**: Displays price range (if available in product)
- **Default**: `false`
- **Usage**: Show/hide pricing

##### `show_categories` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Displays product category tags
- **Default**: `true`
- **Usage**: Show/hide category badges

##### `card_layout` (Optional, Default: "image-top")
- **Type**: Enumeration
- **Options**: `image-top`, `image-left`, `overlay`
- **Description**: Product card layout
- **Options**:
  - `image-top`: Image above content
  - `image-left`: Image on left side
  - `overlay`: Image with text overlay
- **Default**: `image-top`

##### `enable_quick_view` (Optional, Default: false)
- **Type**: Boolean
- **Description**: Adds quick view modal functionality
- **Default**: `false`
- **Usage**: Enhanced user experience

---

### 4.21 Testimonials Proof Section (`section.testimonials-proof`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Display customer testimonials and social proof.

#### Fields

##### `headline` (Required, Max 100 characters)
- **Type**: String
- **Description**: Section title
- **English Example**: `What Our Partners Say`
- **Vietnamese Example**: `Đối Tác Nói Gì Về Chúng Tôi`

##### `testimonials` (Optional, Relation)
- **Type**: Relation (One-to-Many)
- **Description**: Link to Testimonial content type entries
- **Target**: `api::testimonial.testimonial`
- **How to Link**: Select existing testimonials from dropdown
- **Note**: Create testimonials first (see Testimonial section)
- **Recommended**: Select 3-6 testimonials
- **Usage**: Displays testimonial cards

##### `display_style` (Optional, Default: "carousel")
- **Type**: Enumeration
- **Options**: `carousel`, `grid`, `masonry`
- **Description**: Display format
- **Options**:
  - `carousel`: Horizontal scrolling carousel
  - `grid`: Static grid layout
  - `masonry`: Masonry/pinterest-style layout
- **Default**: `carousel`

##### `show_company_logos` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Displays company logos if available in testimonials
- **Default**: `true`
- **Usage**: Visual trust signals

##### `show_ratings` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Displays star ratings if available
- **Default**: `true`
- **Usage**: Visual rating display

##### `autoplay` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Enables automatic carousel rotation
- **Default**: `true`
- **Usage**: Auto-rotation for carousel

##### `autoplay_delay` (Optional, Default: 5000)
- **Type**: Integer
- **Description**: Delay between slides in milliseconds
- **Range**: 2000 - 10000 milliseconds
- **Default**: `5000` (5 seconds)
- **Recommended**: 5000ms (5 seconds)
- **Usage**: Carousel timing control

---

### 4.22 Blog Insights Section (`section.blog-insights`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Display featured knowledge assets/blog posts.

#### Fields

##### `headline` (Required, Max 100 characters)
- **Type**: String
- **Description**: Section title
- **English Example**: `Coffee Insights & Resources`
- **Vietnamese Example**: `Thông Tin & Tài Nguyên Về Cà Phê`

##### `subheadline` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Supporting text
- **English Example**: `Expert insights on coffee processing, quality, and industry trends.`

##### `knowledge_assets` (Optional, Relation)
- **Type**: Relation (One-to-Many)
- **Description**: Link to Knowledge Asset content type entries
- **Target**: `api::knowledge-asset.knowledge-asset`
- **How to Link**: Select existing articles from dropdown
- **Note**: Create knowledge assets first (see Knowledge Asset section)
- **Recommended**: Select 3-6 featured articles
- **Usage**: Displays article cards

##### `max_posts` (Optional, Default: "3")
- **Type**: Enumeration
- **Options**: `3`, `6`
- **Description**: Maximum number of posts to display
- **Default**: `3`
- **Usage**: Limit displayed posts

##### `layout` (Optional, Default: "grid")
- **Type**: Enumeration
- **Options**: `grid`, `featured-left`, `carousel`
- **Description**: Article layout
- **Options**:
  - `grid`: Equal-sized grid cards
  - `featured-left`: Large featured post on left, smaller on right
  - `carousel`: Horizontal scrolling carousel
- **Default**: `grid`

##### `show_author` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Displays author name and avatar
- **Default**: `true`
- **Usage**: E-E-A-T signals

##### `show_read_time` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Displays estimated reading time
- **Default**: `true`
- **Usage**: User experience

##### `show_excerpt` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Displays article excerpt/preview text
- **Default**: `true`
- **Usage**: Content preview

---

### 4.23 FAQ SEO Section (`section.faq-seo`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Display frequently asked questions with SEO schema support.

#### Fields

##### `headline` (Required, Max 100 characters)
- **Type**: String
- **Description**: Section title
- **English Example**: `Frequently Asked Questions`
- **Vietnamese Example**: `Câu Hỏi Thường Gặp`

##### `subheadline` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Supporting text
- **English Example**: `Find answers to common questions about our coffee processing services, products, and partnerships.`

##### `faq_items` (Optional, Repeatable)
- **Type**: Component (section.faq-item or shared.faq-item)
- **Description**: Individual FAQ questions and answers
- **Note**: Uses FAQ Item component structure (see Section 4.4)
- **Recommended**: At least 3 FAQs (required for FAQPage schema)
- **SEO Note**: FAQs generate FAQPage JSON-LD schema for Google rich results

##### `layout` (Optional, Default: "accordion")
- **Type**: Enumeration
- **Options**: `accordion`, `grid`, `split-categories`
- **Description**: Display format
- **Options**:
  - `accordion`: Collapsible Q&A pairs
  - `grid`: Card-based grid layout
  - `split-categories`: Category-filtered view
- **Default**: `accordion`

##### `default_open_first` (Optional, Default: false)
- **Type**: Boolean
- **Description**: Expands first FAQ item by default
- **Default**: `false`
- **Usage**: Improves initial content visibility for SEO

##### `enable_search` (Optional, Default: false)
- **Type**: Boolean
- **Description**: Adds search functionality to filter FAQs
- **Default**: `false`
- **Usage**: Improves user experience and engagement

##### `enable_faqpage_schema` (Optional, Default: true)
- **Type**: Boolean
- **Description**: Generates FAQPage JSON-LD schema
- **Default**: `true`
- **Critical**: **Always keep enabled** for SEO (unless testing)
- **Usage**: Required for Google FAQ rich results
- **SEO Note**: This is critical for FAQ rich snippets in search results

---

### 4.24 CTA Conversion Section (`section.cta-conversion`)

**Used in**: Homepage (content_sections dynamic zone)

**Purpose**: Final conversion call-to-action section with customizable styling.

#### Fields

##### `headline` (Required, Max 100 characters)
- **Type**: String
- **Description**: Main CTA headline
- **English Example**: `Ready to Partner with The Great Beans?`
- **Vietnamese Example**: `Sẵn Sàng Hợp Tác Với The Great Beans?`
- **SEO Note**: Action-oriented, compelling

##### `subheadline` (Optional, Max 250 characters)
- **Type**: Text
- **Description**: Supporting description
- **English Example**: `Experience farm-to-cup excellence powered by CQI-certified processing.`
- **Vietnamese Example**: (Translate maintaining meaning)

##### `cta_button` (Required)
- **Type**: Component (shared.button)
- **Description**: Primary call-to-action
- **See Button Component** (Section 4.3) for structure
- **Recommended**:
  - **Text**: `Contact Our Sales Team` or `Request a Quote`
  - **URL**: `/contact` or `#contact`
  - **Variant**: `primary`
  - **Icon**: `arrow-right`, `mail`, or `phone`

##### `secondary_cta` (Optional)
- **Type**: Component (shared.button)
- **Description**: Secondary action button
- **See Button Component** (Section 4.3) for structure
- **Recommended**:
  - **Text**: `Learn More` or `View Products`
  - **URL**: `/products` or `/about`
  - **Variant**: `outline` or `ghost`

##### `background_style` (Optional, Default: "gradient")
- **Type**: Enumeration
- **Options**: `solid`, `gradient`, `image`
- **Description**: Background style
- **Options**:
  - `solid`: Solid color background
  - `gradient`: Gradient background (default)
  - `image`: Image background
- **Default**: `gradient`

##### `background_color_primary` (Optional, Default: "#059669")
- **Type**: String
- **Description**: Primary color for solid/gradient backgrounds
- **Format**: Hex color code (`#RRGGBB`)
- **Default**: `#059669` (green)
- **Usage**: Background color

##### `background_color_secondary` (Optional, Default: "#047857")
- **Type**: String
- **Description**: Secondary color for gradient backgrounds
- **Format**: Hex color code (`#RRGGBB`)
- **Default**: `#047857` (darker green)
- **Usage**: Gradient end color

##### `background_image` (Optional)
- **Type**: Media (Single Image)
- **Description**: Background image (if Background Style is `image`)
- **Specifications**:
  - **Dimensions**: 1920 × 1080 pixels
  - **Format**: WebP, ≤ 280 KB
  - **Content**: CTA-relevant visual
- **Alt Text**: Descriptive text

##### `text_color` (Optional, Default: "white")
- **Type**: Enumeration
- **Options**: `white`, `dark`
- **Description**: Text color
- **Options**:
  - `white`: White text (for dark backgrounds)
  - `dark`: Dark text (for light backgrounds)
- **Default**: `white`

##### `layout` (Optional, Default: "centered")
- **Type**: Enumeration
- **Options**: `centered`, `split`, `minimal`
- **Description**: Section layout
- **Options**:
  - `centered`: Centered text and buttons
  - `split`: Split layout with text on left, CTA on right
  - `minimal`: Minimal layout with just headline and button
- **Default**: `centered`

---

## Media Specifications

### Image Format Standards

#### Preferred Format: WebP
- **Why**: Better compression, faster loading, modern browser support
- **Fallback**: JPG for compatibility, PNG for transparency
- **Tools**: Use tools like Squoosh, ImageOptim, or online converters

#### File Naming Conventions
- **Format**: Lowercase, hyphenated, descriptive
- **Examples**:
  - `robusta-farm-hero-desktop.webp`
  - `processing-facility-exterior.webp`
  - `ceo-nguyen-khanh-tung.webp`
  - `cqi-certification-logo.png`
- **Avoid**: Spaces, special characters, uppercase

### Image Dimensions by Use Case

#### Hero Images
- **Desktop Hero**: 2560 × 1440 pixels (16:9)
- **Mobile Hero**: 1080 × 1920 pixels (9:16 portrait)
- **File Size**: ≤ 400 KB (desktop), ≤ 300 KB (mobile)
- **Usage**: Homepage hero, section backgrounds

#### Product Images
- **Featured Image**: 1600 × 1200 pixels (4:3)
- **Gallery Images**: 1200 × 900 pixels (4:3)
- **File Size**: ≤ 250 KB (featured), ≤ 220 KB (gallery)
- **Usage**: Product pages, product cards

#### Article/Knowledge Asset Images
- **Featured Image**: 1600 × 900 pixels (16:9)
- **Content Images**: 1200 × 800 pixels (3:2)
- **File Size**: ≤ 220 KB
- **Usage**: Blog posts, knowledge assets

#### Service Images
- **Hero Image**: 1400 × 900 pixels
- **Process Illustrations**: 1200 × 800 pixels
- **File Size**: ≤ 220 KB
- **Usage**: Service pages, process steps

#### Category Images
- **Featured Image**: 1200 × 800 pixels
- **File Size**: ≤ 220 KB
- **Usage**: Category pages, pillar pages

#### Meta/Open Graph Images
- **Dimensions**: 1200 × 630 pixels (1.91:1)
- **File Size**: ≤ 250 KB
- **Usage**: Social sharing, Open Graph, Twitter Cards

#### Profile/Avatar Images
- **Author Avatar**: 512 × 512 pixels (square)
- **CEO Photo**: 512 × 512 pixels or larger (square/portrait)
- **Reviewer Avatar**: 512 × 512 pixels (square)
- **File Size**: ≤ 120 KB
- **Usage**: Author profiles, testimonials

#### Logo Images
- **Site Logo**: 200-400px width (flexible)
- **Certification Logo**: 400 × 400 pixels (square)
- **Company Logo (Testimonials)**: 400 × 200 pixels (2:1)
- **Favicon**: 32×32px, 16×16px, or 512×512px
- **File Size**: ≤ 120 KB (logos), ≤ 50 KB (favicon)
- **Format**: PNG with transparency preferred for logos

### Image Optimization Checklist

- [ ] Images converted to WebP format (with JPG fallback if needed)
- [ ] File sizes within recommended limits
- [ ] Dimensions match specifications
- [ ] Descriptive, lowercase, hyphenated filenames
- [ ] Alt text added for all images (descriptive, keyword-rich)
- [ ] Images compressed without visible quality loss
- [ ] Responsive images prepared (desktop + mobile where needed)

### Alt Text Guidelines

- **Format**: Descriptive, include location and context
- **Examples**:
  - `Premium Robusta green beans from The Great Beans farm in Lâm Đồng, Vietnam`
  - `Modern coffee processing facility at The Great Beans, 4-hectare site with 6 tons/hour capacity`
  - `Nguyễn Khánh Tùng, CEO of The Great Beans, CQI Q Processing Level 2 certified`
- **SEO Note**: Include keywords naturally, mention location (Lâm Đồng, Vietnam) for local SEO

---

## Localization Guide

### Overview

The Great Beans website supports **English (`en`)** and **Vietnamese (`vi`)** locales. Most content types support i18n, meaning you need to populate content for both languages.

### Content Types with i18n Support

**Single Types** (populate both locales):
- Site Settings
- Contact Page
- About Page
- Homepage

**Collection Types** (populate both locales):
- Category
- Certification
- Product
- Service
- Knowledge Asset
- Testimonial

**Collection Types WITHOUT i18n** (create once, can be referenced in both locales):
- Author

### Localization Workflow

#### Step 1: Create English Content First
1. Switch locale dropdown to `en` (or ensure it's selected)
2. Fill in all fields
3. Upload images
4. Link relations (categories, certifications, etc.)
5. Click **Save** then **Publish**

#### Step 2: Create Vietnamese Translation
1. Switch locale dropdown to `vi`
2. **Important**: Strapi will auto-fill Vietnamese fields with English data as a starting point. This is normal Strapi behavior.
3. **You MUST manually replace text fields with Vietnamese translations**:
   - Titles, headlines, descriptions
   - Rich text content
   - Component text (buttons, FAQs, etc.)
   - All user-facing text content
4. **Keep same images** (unless you have Vietnamese-specific visuals)
5. **Keep same relations** (categories, products, etc. are shared across locales)
6. **Keep same numbers/specs** (capacity, dates, etc. don't need translation)
7. **For contact info** (email, phone, URLs): Keep the same values (copy-paste if needed)
8. Click **Save** then **Publish**

**Why Strapi Auto-Fills**: When you create a new locale entry, Strapi copies all fields from the default locale (EN) to help you get started. This is intentional - you should then replace the text with proper translations. Non-text fields (emails, phone numbers, URLs, images, relations) can remain the same.

### Translation Guidelines

#### Company-Specific Terms
- **"The Great Beans"**: Keep as-is in both locales (brand name)
- **"CQI"**: Keep as-is (acronym)
- **"Lâm Đồng"**: Keep as-is (location name)
- **"Vietnam"**: Keep as-is or use "Việt Nam" in Vietnamese

#### Technical Terms
- **Processing terms**: Use industry-standard Vietnamese translations
- **Certifications**: Translate description but keep certification name (e.g., "CQI Q Processing Level 2")
- **Equipment specs**: Keep numbers/metrics the same

#### SEO Considerations
- **Keywords**: Translate primary keywords naturally
- **Location**: Always include "Lâm Đồng, Vietnam" or "Lâm Đồng, Việt Nam"
- **Meta descriptions**: Translate but maintain keyword density
- **Alt text**: Translate for Vietnamese locale

### Common Translation Patterns

#### Headlines
- **English**: `Premium Robusta Coffee from Vietnam's Highlands`
- **Vietnamese**: `Cà Phê Robusta Thượng Hạng từ Cao Nguyên Việt Nam`

#### CTAs
- **English**: `Request a Quote`
- **Vietnamese**: `Yêu Cầu Báo Giá`

#### Service Names
- **English**: `Green Bean Processing Services`
- **Vietnamese**: `Dịch Vụ Chế Biến Cà Phê Nhân Xanh`

### Quality Checklist

- [ ] All text fields translated (no English text in Vietnamese locale)
- [ ] Images appropriate for both locales (or Vietnamese-specific if available)
- [ ] Relations properly linked (shared across locales)
- [ ] Numbers and specs consistent (no translation needed)
- [ ] SEO metadata translated with keywords
- [ ] Both locales published

---

## Validation Checklist

Use this checklist before publishing any content to ensure quality and SEO compliance.

### General Content Validation

- [ ] All required fields filled
- [ ] Character limits respected (meta titles ≤ 60, meta descriptions ≤ 160, etc.)
- [ ] No placeholder text left in content
- [ ] Spelling and grammar checked
- [ ] Content aligns with The Great Beans brand voice
- [ ] E-E-A-T signals included (certifications, expertise, location)

### SEO Validation

- [ ] Meta title includes brand name and primary keyword
- [ ] Meta title is 50-60 characters
- [ ] Meta description is 145-160 characters
- [ ] Meta description includes location (Lâm Đồng, Vietnam)
- [ ] Meta description includes key differentiators (capacity, certifications)
- [ ] Meta image is 1200×630 pixels, ≤ 250 KB
- [ ] Alt text added to all images (descriptive, keyword-rich)
- [ ] Canonical URL set (if needed)
- [ ] Keywords included (comma-separated)

### Media Validation

- [ ] Images in WebP format (or optimized JPG)
- [ ] File sizes within limits
- [ ] Dimensions match specifications
- [ ] Filenames are lowercase, hyphenated, descriptive
- [ ] Alt text added to all images
- [ ] Images compressed without quality loss

### Relations Validation

- [ ] Categories created before products/services/knowledge assets
- [ ] Authors created before knowledge assets
- [ ] Certifications created before linking to products/services
- [ ] Products/services created before linking to homepage sections
- [ ] Testimonials created before linking to services/homepage

### Localization Validation

- [ ] English (`en`) locale populated and published
- [ ] Vietnamese (`vi`) locale populated and published
- [ ] All text fields translated (no English in Vietnamese locale)
- [ ] Images appropriate for both locales
- [ ] Relations properly linked (shared across locales)

### Component Validation

- [ ] All component fields filled (if component is added)
- [ ] Button URLs are valid (internal or external)
- [ ] FAQ answers are comprehensive (50-200 words)
- [ ] Stats have proper values and labels
- [ ] Trust indicators include specific certifications
- [ ] Hotspots have correct position coordinates (0-100)

### Homepage Section Validation

- [ ] Sections added in recommended order
- [ ] Hero Advanced section has required fields (headline, primary CTA, background image)
- [ ] Trust Bar has certifications linked
- [ ] Services Grid has services linked
- [ ] Products Showcase has products linked
- [ ] Testimonials Proof has testimonials linked
- [ ] Blog Insights has knowledge assets linked
- [ ] FAQ SEO has at least 3 FAQs and schema enabled
- [ ] CTA Conversion has primary CTA button

### Publishing Validation

- [ ] Content saved (not just draft)
- [ ] Content published (not just saved)
- [ ] Both locales published (if i18n supported)
- [ ] Public role permissions configured (see Prerequisites)
- [ ] Content visible on frontend after publishing

---

## Recommended Population Order

Follow this order to ensure dependencies are created before they're needed.

### Phase 1: Foundation (Do First)

1. **Global SEO** (Single Type)
   - Configure site URL, default meta, Google verification
   - No dependencies

2. **Site Settings** (Single Type, i18n)
   - Configure site name, logo, contact info, social media
   - No dependencies

3. **Author** (Collection Type, no i18n)
   - Create CEO and team authors
   - No dependencies

4. **Certification** (Collection Type, i18n)
   - Create CQI, Vietnam Specialty Coffee, Vietnam Amazing Cup certifications
   - No dependencies

5. **Category** (Collection Type, i18n)
   - Create 4 recommended categories with pillar page content
   - No dependencies

### Phase 2: Core Content

6. **Product** (Collection Type, i18n)
   - Create products
   - **Dependencies**: Category, Certification (link these)

7. **Service** (Collection Type, i18n)
   - Create B2B services
   - **Dependencies**: Certification (link these)
   - **Note**: Can link testimonials later (Phase 3)

8. **Testimonial** (Collection Type, i18n)
   - Create customer testimonials
   - No dependencies

9. **Knowledge Asset** (Collection Type, i18n)
   - Create blog posts/articles
   - **Dependencies**: Author, Category (link these)

### Phase 3: Pages

10. **Contact Page** (Single Type, i18n)
    - Configure contact information, FAQs, inquiry types
    - No dependencies

11. **About Page** (Single Type, i18n)
    - Configure mission, vision, timeline, CEO profile, values
    - **Dependencies**: Certification (for timeline events)

12. **Homepage** (Single Type, i18n)
    - Build homepage with all 9 sections
    - **Dependencies**: 
      - Certification (for Trust Bar)
      - Service (for Services Grid)
      - Product (for Products Showcase)
      - Testimonial (for Testimonials Proof)
      - Knowledge Asset (for Blog Insights)

### Phase 4: Finalization

13. **Link Relations**
    - Link related products to each other
    - Link testimonials to services
    - Link related knowledge assets
    - Cross-link content for internal SEO

14. **Review & Publish**
    - Review all content using Validation Checklist
    - Ensure both locales published
    - Test frontend display
    - Verify SEO metadata

### Estimated Time

- **Phase 1**: 2-3 hours (foundation setup)
- **Phase 2**: 4-6 hours (core content creation)
- **Phase 3**: 3-4 hours (page configuration)
- **Phase 4**: 1-2 hours (linking and review)
- **Total**: 10-15 hours for complete population

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Content not appearing on frontend

**Possible Causes**:
1. Content not published (only saved as draft)
2. Public role permissions not configured
3. Locale not published (if i18n supported)
4. Frontend cache needs clearing

**Solutions**:
1. Check content status - must be "Published" (green badge)
2. Go to Settings → Users & Permissions → Roles → Public
3. Enable `find` and `findOne` permissions for content types
4. Clear frontend cache or hard refresh browser
5. Check locale - ensure correct locale is published

#### Issue: Images not displaying

**Possible Causes**:
1. Image not uploaded properly
2. File size too large
3. Format not supported
4. Alt text missing (may affect display in some cases)

**Solutions**:
1. Re-upload image, ensure it's attached to the field
2. Compress image to recommended size
3. Convert to WebP or use JPG/PNG
4. Add descriptive alt text

#### Issue: Relations not showing in dropdown

**Possible Causes**:
1. Related content not created yet
2. Related content not published
3. Wrong content type selected

**Solutions**:
1. Create the related content first (see Recommended Population Order)
2. Publish the related content
3. Verify you're selecting the correct content type

#### Issue: Dynamic zone components not saving

**Possible Causes**:
1. Required fields in component not filled
2. Component validation errors
3. Browser cache issues

**Solutions**:
1. Check all required fields in component are filled
2. Review component validation (character limits, etc.)
3. Clear browser cache, try different browser
4. Save parent content type first, then add components

#### Issue: SEO metadata not appearing

**Possible Causes**:
1. SEO component not added
2. Meta fields not filled
3. Frontend not implementing meta tags
4. Cache issues

**Solutions**:
1. Add SEO component to content type
2. Fill in meta title, description, image
3. Verify frontend is reading and displaying meta tags
4. Clear cache and test

#### Issue: i18n content showing wrong locale

**Possible Causes**:
1. Wrong locale selected in Strapi
2. Frontend locale detection not working
3. Default locale not set

**Solutions**:
1. Check locale dropdown in Strapi (top right)
2. Verify frontend locale routing is configured
3. Check default locale in Strapi Settings → Internationalization

#### Issue: Vietnamese locale auto-fills with English data

**Description**: When switching to Vietnamese (`vi`) locale, all fields are automatically filled with English data.

**This is Normal Behavior**: Strapi copies all fields from the default locale (EN) to the new locale (VI) as a starting point. This is intentional to help you get started.

**What to Do**:
1. **For text fields**: Manually replace English text with Vietnamese translations:
   - Headlines, titles, descriptions
   - Rich text content
   - FAQ questions and answers
   - Component text (buttons, labels, etc.)
2. **For non-text fields**: Keep the same values (no translation needed):
   - Email addresses (`email_sales`, `email_support`)
   - Phone numbers (`phone_primary`)
   - URLs (`google_maps_embed_url`)
   - Images (unless you have Vietnamese-specific visuals)
   - Relations (categories, products, etc.)
   - Numbers and specs (capacity, dates, etc.)

**Example for Contact Page**:
- ✅ Keep same: `email_sales`, `email_support`, `phone_primary`, `google_maps_embed_url`
- ❌ Must translate: `headline`, `subheadline`, `factory_address`, `business_hours`, `success_message`, `contact_faq`, `form_inquiry_types`, `seo`

#### Issue: Editing Vietnamese (vi) changes English (en) content

**Description**: When you edit Vietnamese locale, the English locale also shows the same content.

**Root Cause**: Some fields that should be shared (like email, phone) are currently localized, causing them to sync incorrectly. OR text fields are not properly separated between locales.

**Solution - Schema Update**:
The schema has been updated so that contact information fields (`email_sales`, `email_support`, `phone_primary`, `google_maps_embed_url`) are **NOT localized** (shared across locales). This is the correct behavior.

**Steps to Fix**:
1. **Restart Strapi** after schema update:
   - Stop Strapi (Ctrl+C)
   - Run `npm run develop` again
2. **Verify the fix**:
   - Go to Contact Page
   - Switch between EN and VI locales
   - Email, phone, and map URL should be the same in both
   - Text fields (headline, subheadline, etc.) should be separate
3. **If text fields still sync**:
   - Check that you're editing the correct locale (check dropdown in top right)
   - Make sure you're saving after editing
   - Clear browser cache and hard refresh (Ctrl+Shift+R)
   - Verify both locales are published separately

**Note**: After schema update, the non-localized fields (email, phone, URL) will be shared. Text fields remain localized and should be edited separately for each locale.

**Comprehensive Schema Fix**: All schemas have been reviewed and updated. See `SCHEMA-I18N-FIXES.md` for complete list of changes. The following content types have non-localized fields:

- **Contact Page**: email, phone, map URL
- **Site Settings**: email, phone, social media
- **Testimonial**: reviewer info, rating, date (quote remains localized)
- **Certification**: logo, URL, dates (name/description remain localized)
- **Product**: SKU, scores, specs (name/description remain localized)
- **Knowledge Asset**: dates, counts (title/content remain localized)

**After All Schema Updates**: You MUST restart Strapi for changes to take effect.

#### Issue: FAQ schema not generating

**Possible Causes**:
1. Less than 3 FAQs added
2. `enable_faqpage_schema` set to false
3. FAQ component structure incorrect

**Solutions**:
1. Add at least 3 FAQs (required for FAQPage schema)
2. Check `enable_faqpage_schema` is `true` in FAQ SEO section
3. Verify FAQ items have both question and answer fields filled

#### Issue: Slug conflicts or invalid

**Possible Causes**:
1. Duplicate slugs
2. Special characters in name (auto-generates slug)
3. Slug manually edited incorrectly

**Solutions**:
1. Check for existing entries with same slug
2. Edit slug manually to resolve conflict
3. Use lowercase, hyphenated format for slugs
4. Avoid special characters in names

### Getting Help

If you encounter issues not covered here:

1. **Check Strapi Documentation**: https://docs.strapi.io
2. **Review Validation Checklist**: Ensure all requirements met
3. **Check Browser Console**: Look for JavaScript errors
4. **Review Server Logs**: Check Strapi server output for errors
5. **Test in Different Browser**: Rule out browser-specific issues

---

## The Great Beans Specific Content

This section provides ready-to-use content templates based on the `info` file and company information.

### Company Information Quick Reference

- **Company Name**: The Great Beans Co., Ltd. (Công ty TNHH The Great Beans)
- **CEO**: Nguyễn Khánh Tùng
- **Founded**: 2018 (as Nazola), rebranded 2023
- **Location**: Trường Xuân Commune, Lâm Đồng Province, Vietnam
- **Farm Size**: 10 hectares
- **Facility Size**: 4 hectares total
- **Processing Capacity**: 6 tons/hour
- **Roasting Capacity**: 60kg per batch (~20 minutes per batch)
- **Wet Processing**: 1,500m² facility
- **Dry Processing**: 1,000m² facility
- **Equipment**: Modern 2024 machinery
- **Certifications**: CQI Q Processing Level 2 (CEO, August 2024), Vietnam Specialty Coffee Certified (May 2024), Vietnam Amazing Cup 2024 Co-Sponsor (April 2024)

### Mission Statement Template

**English**:
```
Lead globally in specialty coffee, promoting the heritage and unique flavors of Vietnamese Robusta coffee through sustainability and ethical sourcing. We are committed to farm-to-cup excellence, combining our 10-hectare farm with state-of-the-art processing facilities to deliver exceptional quality to partners worldwide.
```

**Vietnamese**: (Translate maintaining meaning and keywords)

### Vision Statement Template

**English**:
```
Become one of the top 3 leading companies in Vietnam's specialty coffee market. We envision a future where Vietnamese Robusta coffee is recognized globally for its exceptional quality, achieved through ethical practices, modern technology, and unwavering commitment to excellence.
```

**Vietnamese**: (Translate maintaining meaning)

### Core Values Templates

1. **Quality Excellence**
   - **English**: `Superior quality in every aspect of our operations, from farm to cup. We maintain the highest standards in processing, quality control, and product delivery.`
   - **Vietnamese**: (Translate)

2. **Sustainability**
   - **English**: `Long-term sustainability through ethical sourcing, environmental responsibility, and sustainable farming practices.`
   - **Vietnamese**: (Translate)

3. **Innovation**
   - **English**: `Continuous improvement and innovation in processing methods, technology, and service delivery.`
   - **Vietnamese**: (Translate)

4. **Trust**
   - **English**: `Reliability and trustworthiness in all business relationships, built through transparency and consistent quality.`
   - **Vietnamese**: (Translate)

### Timeline Events Templates

1. **January 2018**
   - **Title**: `Company Founded & CQI Training`
   - **Description**: `Nguyễn Khánh Tùng founded the company (originally as Nazola) and was among the first participants in the CQI specialty coffee processing course taught by Dr. Manuel Diaz in Vietnam.`

2. **September 2023**
   - **Title**: `Rebranded to The Great Beans`
   - **Description**: `Company rebranded from Nazola to The Great Beans to align with global market ambitions and reflect the company's growth and vision.`

3. **February 2024**
   - **Title**: `Modern Facility Construction Begins`
   - **Description**: `Construction began on the 4-hectare modern processing facility, featuring 1,500m² wet processing and 1,000m² dry processing areas with state-of-the-art equipment.`

4. **April 2024**
   - **Title**: `Vietnam Amazing Cup 2024 Co-Sponsor`
   - **Description**: `The Great Beans became a co-sponsor of the Vietnam Amazing Cup 2024, demonstrating commitment to Vietnam's specialty coffee industry.`

5. **May 2024**
   - **Title**: `Vietnam Specialty Coffee Certification`
   - **Description**: `All Robusta samples submitted by The Great Beans were certified as Vietnam Specialty Coffee, validating the company's quality standards and processing expertise.`

6. **August 2024**
   - **Title**: `CEO Achieves CQI Q Processing Level 2`
   - **Description**: `CEO Nguyễn Khánh Tùng achieved Q Processing Level 2 – Professional certification from the Coffee Quality Institute (CQI), demonstrating advanced knowledge and expertise in specialty coffee processing methods, quality control, and industry standards.`

### CEO Bio Template

**English**:
```
Nguyễn Khánh Tùng is the founder and CEO of The Great Beans, established in 2018 (originally as Nazola). He is a CQI Q Processing Level 2 certified professional and was one of the first participants in the CQI specialty coffee processing course taught by Dr. Manuel Diaz in Vietnam.

Under his leadership, The Great Beans has grown from a 10-hectare farm to a state-of-the-art processing facility with 6 tons/hour capacity, serving global markets while maintaining commitment to quality, sustainability, and Vietnamese coffee heritage.
```

**Vietnamese**: (Translate maintaining technical accuracy and credentials)

### Service Description Templates

#### Green Bean Processing Services
**English**:
```
With modern 2024 equipment and a 6-tons/hour capacity, we provide reliable green bean processing services for B2B partners worldwide. Our 1,500m² wet processing facility and 1,000m² dry processing area ensure efficient, high-quality processing with full quality control throughout the entire chain, from intake to packaging.
```

#### OEM/Private Label Coffee Production
**English**:
```
Complete OEM and private label solutions for coffee brands seeking reliable, high-quality production partners. We handle everything from processing to packaging, allowing you to focus on branding and market expansion while we ensure consistent quality and timely delivery.
```

### Product Description Template

**English**:
```
Our Premium Robusta Green Beans are sourced from our own 10-hectare farm in Lâm Đồng, Vietnam, and processed at our state-of-the-art facility.

**Processing:**
- Wet processing: 1,500m² facility
- Dry processing: 1,000m² facility
- Capacity: 6 tons/hour
- Equipment: Modern 2024 machinery

**Quality Assurance:**
- Full quality control throughout process
- CQI-certified processing
- Vietnam Specialty Coffee Certified

**Ideal for:**
- Specialty coffee roasters
- Export markets
- Private label applications
```

### FAQ Templates

**Q: What is your processing capacity?**
**A**: `Our facility processes 6 tons of green coffee beans per hour using modern 2024 equipment. We maintain full quality control throughout the process, from intake to packaging.`

**Q: Where is your facility located?**
**A**: `Our 4-hectare processing facility is located in Trường Xuân Commune, Lâm Đồng Province, Vietnam, adjacent to our 10-hectare Robusta farm.`

**Q: What certifications do you hold?**
**A**: `Our CEO holds CQI Q Processing Level 2 certification, and all our samples have been certified as Vietnam Specialty Coffee. We were also a co-sponsor of Vietnam Amazing Cup 2024.`

**Q: Do you offer OEM/private label services?**
**A**: `Yes, we provide complete OEM and private label solutions, handling everything from processing to custom packaging for B2B partners worldwide.`

---

## Conclusion

This guide provides a complete reference for populating the Strapi CMS dashboard with content for The Great Beans. Every field from every schema has been documented with:

- Field types and validation rules
- Character limits and format requirements
- The Great Beans specific examples
- SEO optimization guidelines
- E-E-A-T integration points
- Media specifications

### Key Principles to Remember

1. **SEO-First**: All content optimized for search engines and SGE
2. **E-E-A-T**: Include Experience, Expertise, Authoritativeness, Trustworthiness signals
3. **Helpful Content**: Focus on providing value and answering user questions
4. **Localization**: Populate both English and Vietnamese locales
5. **Quality**: Use validation checklist before publishing

### Next Steps

1. Follow the **Recommended Population Order** (Section 9)
2. Use **The Great Beans Specific Content** templates (Section 5)
3. Validate content using the **Validation Checklist** (Section 8)
4. Test frontend display after publishing
5. Monitor SEO performance and adjust as needed

### Support

For questions or issues:
- Review the **Troubleshooting** section (Section 10)
- Check Strapi documentation: https://docs.strapi.io
- Refer back to specific sections in this guide

---

**Last Updated**: 2024
**Version**: 1.0
**For**: The Great Beans Strapi CMS Content Population

