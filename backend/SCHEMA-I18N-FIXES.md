# Schema i18n Localization Fixes

## Summary

Đã kiểm tra và sửa tất cả các schema để đảm bảo các field không nên được localized (shared across locales) được đánh dấu đúng cách.

## Fields That Should NOT Be Localized

Các field sau đây được đánh dấu `"localized": false` vì chúng giống nhau cho tất cả locales:

### Contact Information
- Email addresses
- Phone numbers
- URLs (maps, verification, etc.)

### Dates & Numbers
- Dates (published_date, review_date, issued_date, expiry_date)
- Ratings (1-5 stars)
- Scores (cupping_score, moisture_content)
- Counts (read_time, word_count)

### Identifiers & Codes
- SKU codes
- Verification URLs
- Analytics IDs

### Media & Relations
- Images (logos, avatars) - thường giống nhau
- Relations (categories, products, authors) - shared

### Metadata
- Boolean flags (featured)
- Enumerations (processing_method)
- Technical specs (altitude, screen_size, etc.)

## Schema Changes Made

### 1. Contact Page (`contact-page/schema.json`)
**Fields marked as NOT localized:**
- `email_sales`
- `email_support`
- `phone_primary`
- `google_maps_embed_url`

### 2. Site Settings (`site-settings/schema.json`)
**Fields marked as NOT localized:**
- `contact_email`
- `contact_phone`
- `social_media` (JSON)

### 3. Testimonial (`testimonial/schema.json`)
**Fields marked as NOT localized:**
- `reviewer_name`
- `reviewer_title`
- `reviewer_company`
- `reviewer_avatar`
- `company_logo`
- `rating`
- `featured`
- `review_date`

**Note:** `quote` remains localized (needs translation)

### 4. Certification (`certification/schema.json`)
**Fields marked as NOT localized:**
- `logo`
- `verification_url`
- `issued_date`
- `expiry_date`

**Note:** `name` and `description` remain localized (need translation)

### 5. Product (`product/schema.json`)
**Fields marked as NOT localized:**
- `sku`
- `cupping_score`
- `processing_method`
- `origin_region`
- `altitude_range`
- `harvest_season`
- `moisture_content`
- `screen_size`

**Note:** `name`, `description`, `price_range` remain localized (need translation)

### 6. Knowledge Asset (`knowledge-asset/schema.json`)
**Fields marked as NOT localized:**
- `published_date`
- `read_time`
- `word_count`

**Note:** `title`, `excerpt`, `content_sections` remain localized (need translation)

## Fields That SHOULD Be Localized

Các field sau đây vẫn được localized (riêng biệt cho mỗi locale):

### Text Content
- Headlines, titles, descriptions
- Rich text content
- Meta descriptions
- FAQ questions and answers
- Component text (buttons, labels)

### User-Facing Content
- Product names and descriptions
- Service names and overviews
- Article titles and content
- Testimonial quotes
- Category names and content

## After Schema Updates

**IMPORTANT:** Sau khi cập nhật schema, bạn PHẢI:

1. **Restart Strapi**:
   ```bash
   # Stop Strapi (Ctrl+C)
   cd backend
   npm run develop
   ```

2. **Verify Changes**:
   - Các field không localized sẽ hiển thị cùng giá trị ở cả EN và VI
   - Các field localized sẽ riêng biệt cho mỗi locale
   - Khi sửa field không localized ở một locale, nó sẽ cập nhật cho tất cả locales

3. **Update Existing Content** (if needed):
   - Nếu đã có dữ liệu, có thể cần xóa và nhập lại các field không localized
   - Hoặc đảm bảo giá trị giống nhau ở cả hai locale

## Testing Checklist

- [ ] Restart Strapi after schema changes
- [ ] Verify contact info (email, phone) is shared between locales
- [ ] Verify dates and numbers are shared
- [ ] Verify text fields are separate for each locale
- [ ] Test editing: non-localized fields update for all locales
- [ ] Test editing: localized fields only update for current locale

## Files Modified

1. `backend/src/api/contact-page/content-types/contact-page/schema.json`
2. `backend/src/api/site-settings/content-types/site-settings/schema.json`
3. `backend/src/api/testimonial/content-types/testimonial/schema.json`
4. `backend/src/api/certification/content-types/certification/schema.json`
5. `backend/src/api/product/content-types/product/schema.json`
6. `backend/src/api/knowledge-asset/content-types/knowledge-asset/schema.json`

## Notes

- **Author** schema không có i18n nên không cần sửa
- **Global SEO** schema không có i18n nên không cần sửa
- **Category** schema: Tất cả fields đều nên được localized (nội dung cần dịch)
- **Service** schema: Chỉ có text fields cần localized, không có field nào cần sửa
- **About Page** schema: Chỉ có text fields cần localized, không có field nào cần sửa
- **Homepage** schema: Chỉ có text fields cần localized, không có field nào cần sửa

