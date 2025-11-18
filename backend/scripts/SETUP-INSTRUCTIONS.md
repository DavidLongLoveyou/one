# Hướng Dẫn Tự Động Điền Nội Dung Strapi

## Tình huống 1: Strapi ĐANG chạy

Nếu Strapi server đã đang chạy (bạn đã chạy `npm run develop`), chỉ cần:

```bash
cd backend
npm run populate:auto
```

Script sẽ tự động:
1. ✅ Kiểm tra Strapi đang chạy
2. ✅ Chạy Phase 1 (Foundation)
3. ✅ Chạy Phase 2 (Core Content)
4. ✅ Chạy Phase 3 (Pages)
5. ✅ Chạy Phase 4 (Link Relations)

## Tình huống 2: Strapi CHƯA chạy

Nếu Strapi server chưa chạy, sử dụng script tự động:

```bash
cd backend
npm run populate:start
```

Script sẽ tự động:
1. ✅ Khởi động Strapi server
2. ✅ Đợi Strapi sẵn sàng
3. ✅ Chạy tất cả populate phases
4. ⚠️  Giữ Strapi server chạy (nhấn Ctrl+C để dừng)

## Tình huống 3: Chạy từng Phase riêng

Nếu muốn kiểm soát từng bước:

```bash
cd backend

# Phase 1: Foundation
npm run populate:phase1

# Phase 2: Core Content
npm run populate:phase2

# Phase 3: Pages
npm run populate:phase3

# Phase 4: Link Relations
npm run populate:phase4
```

## Prerequisites (Yêu cầu)

Trước khi chạy scripts, đảm bảo:

1. ✅ **Admin user đã được tạo** trong Strapi
   - Truy cập: http://localhost:1337/admin
   - Tạo admin user nếu chưa có

2. ✅ **Public role permissions đã được cấu hình**
   - Settings → Users & Permissions → Roles → Public
   - Enable `find` và `findOne` cho tất cả content types

3. ✅ **Vietnamese locale đã được thêm**
   - Settings → Internationalization → Locales
   - Add locale: Vietnamese (vi)

4. ✅ **.env file đã được cấu hình** (optional)
   ```env
   STRAPI_URL=http://localhost:1337
   ADMIN_EMAIL=your_email@example.com
   ADMIN_PASSWORD=your_password
   ```
   
   Nếu không có .env, script sẽ dùng default credentials trong code.

## Sau khi chạy scripts

1. **Kiểm tra content trong Strapi Admin**
   - Truy cập: http://localhost:1337/admin
   - Kiểm tra Content Manager

2. **Upload Images** (thủ công)
   - Featured images cho Products, Services
   - Hero images cho Homepage
   - Logo và favicon

3. **Cấu hình Homepage** (thủ công)
   - Content Manager → Homepage
   - Thêm sections vào dynamic zone
   - Link services, products, testimonials

4. **Link Relations** (thủ công nếu cần)
   - Link products to categories
   - Link services to certifications
   - Link testimonials to services

## Troubleshooting

### Lỗi: "Authentication failed"
- Kiểm tra ADMIN_EMAIL và ADMIN_PASSWORD trong .env
- Hoặc sửa default credentials trong `scripts/populate-content.js`

### Lỗi: "Content may already exist"
- Đây là cảnh báo, không phải lỗi
- Script sẽ bỏ qua content đã tồn tại

### Lỗi: "Cannot connect to Strapi"
- Đảm bảo Strapi server đang chạy
- Kiểm tra port 1337 không bị block
- Thử restart Strapi server

### Script chạy quá lâu
- Kiểm tra Strapi server logs
- Đảm bảo database connection OK
- Kiểm tra network không có vấn đề

## Tips

- 💡 Chạy từng phase riêng để dễ debug
- 💡 Kiểm tra `created-content.json` để xem content IDs
- 💡 Xem logs trong terminal để biết progress
- 💡 Nếu lỗi, có thể chạy lại phase bị lỗi riêng

