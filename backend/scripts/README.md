# Strapi Content Population Scripts

Scripts tự động điền nội dung vào Strapi CMS theo hướng dẫn `STRAPI-CONTENT-POPULATION-GUIDE.md`.

## Prerequisites (Yêu cầu)

1. **Strapi server đang chạy**:
   ```bash
   cd backend
   npm run develop
   ```

2. **Admin user đã được tạo** (truy cập http://localhost:1337/admin để tạo)

3. **Public role permissions đã được cấu hình**:
   - Settings → Users & Permissions → Roles → Public
   - Enable `find` và `findOne` cho tất cả content types

4. **Vietnamese locale đã được thêm**:
   - Settings → Internationalization → Locales
   - Add locale: Vietnamese (vi)

5. **Cấu hình .env**:
   ```env
   STRAPI_URL=http://localhost:1337
   ADMIN_EMAIL=admin@thegreatbeans.com
   ADMIN_PASSWORD=your_admin_password
   ```

## Cách sử dụng

### Option 1: Chạy từng phase riêng biệt

```bash
# Phase 1: Foundation (Global SEO, Site Settings, Authors, Certifications, Categories)
node scripts/populate-content.js 1

# Phase 2: Core Content (Products, Services, Testimonials, Knowledge Assets)
node scripts/populate-content.js 2

# Phase 3: Pages (Contact Page, About Page, Homepage)
node scripts/populate-content.js 3

# Phase 4: Link Relations (cross-linking)
node scripts/populate-content.js 4
```

### Option 2: Chạy tất cả phases

```bash
# Chạy tuần tự tất cả phases
npm run populate:all
```

## Các Phase

### Phase 1: Foundation
- ✅ Global SEO (Single Type)
- ✅ Site Settings (EN + VI)
- ✅ Authors (CEO)
- ✅ Certifications (EN + VI)
- ✅ Categories (EN + VI)

### Phase 2: Core Content
- ✅ Products (EN + VI)
- ✅ Services (EN + VI)
- ✅ Testimonials (EN + VI)
- ✅ Knowledge Assets (EN + VI)

### Phase 3: Pages
- ⏳ Contact Page (EN + VI)
- ⏳ About Page (EN + VI)
- ⏳ Homepage (EN + VI)

### Phase 4: Link Relations
- ⏳ Cross-link related content

## Lưu ý

1. **Chạy theo thứ tự**: Phase 1 → Phase 2 → Phase 3 → Phase 4
2. **Kiểm tra kết quả**: Sau mỗi phase, kiểm tra trong Strapi admin panel
3. **Xử lý lỗi**: Nếu content đã tồn tại, script sẽ bỏ qua và tiếp tục
4. **Media files**: Script không tự động upload images. Bạn cần upload images thủ công trong Strapi admin sau khi tạo content.

## Troubleshooting

### Lỗi Authentication
- Kiểm tra Strapi server đang chạy
- Kiểm tra ADMIN_EMAIL và ADMIN_PASSWORD trong .env
- Đảm bảo admin user đã được tạo

### Lỗi Permission
- Kiểm tra Public role permissions đã được enable
- Restart Strapi server sau khi thay đổi permissions

### Lỗi Locale
- Đảm bảo Vietnamese locale đã được thêm trong Strapi admin
- Restart Strapi server sau khi thêm locale

### Content không hiển thị
- Đảm bảo content đã được **Published** (không chỉ Saved)
- Kiểm tra locale đúng (en hoặc vi)
- Kiểm tra Public role permissions

## File Output

Sau mỗi phase, script sẽ lưu các ID của content đã tạo vào:
- `backend/scripts/created-content.json`

File này được sử dụng bởi các phase tiếp theo để link relations.

## Manual Steps (Cần làm thủ công)

1. **Upload Images**: 
   - Featured images cho Products, Services, Knowledge Assets
   - Hero images cho Homepage sections
   - Logo và favicon cho Site Settings
   - Certification logos

2. **Link Relations**:
   - Link products to categories
   - Link services to certifications
   - Link testimonials to services
   - Link knowledge assets to authors and categories

3. **Homepage Sections**:
   - Cấu hình dynamic zone sections
   - Link services, products, testimonials, knowledge assets

## Next Steps

Sau khi chạy scripts:
1. Review content trong Strapi admin
2. Upload images cho các content entries
3. Link relations giữa các content types
4. Cấu hình Homepage với dynamic zones
5. Publish tất cả content (EN + VI)
6. Test frontend display

