# Quick Start - Tự Động Điền Nội Dung Strapi

## Bước 1: Chuẩn bị

1. **Đảm bảo Strapi đang chạy**:
   ```bash
   cd backend
   npm run develop
   ```

2. **Cấu hình .env** (nếu chưa có):
   ```bash
   # Thêm vào backend/.env
   STRAPI_URL=http://localhost:1337
   ADMIN_EMAIL=admin@thegreatbeans.com
   ADMIN_PASSWORD=your_admin_password_here
   ```

3. **Cài đặt dotenv** (nếu chưa có):
   ```bash
   cd backend
   npm install dotenv --save-dev
   ```

## Bước 2: Chạy Scripts

### Chạy từng Phase (Khuyến nghị)

```bash
# Phase 1: Foundation
npm run populate:phase1

# Phase 2: Core Content  
npm run populate:phase2

# Phase 3: Pages
npm run populate:phase3

# Phase 4: Link Relations (manual)
npm run populate:phase4
```

### Hoặc chạy tất cả cùng lúc

```bash
npm run populate:all
```

## Bước 3: Kiểm tra kết quả

1. Mở Strapi Admin: http://localhost:1337/admin
2. Kiểm tra Content Manager:
   - ✅ Global SEO
   - ✅ Site Settings (EN + VI)
   - ✅ Authors
   - ✅ Certifications (EN + VI)
   - ✅ Categories (EN + VI)
   - ✅ Products (EN + VI)
   - ✅ Services (EN + VI)
   - ✅ Testimonials (EN + VI)
   - ✅ Knowledge Assets (EN + VI)
   - ✅ Contact Page (EN + VI)
   - ✅ About Page (EN + VI)

## Bước 4: Công việc thủ công cần làm

1. **Upload Images**:
   - Featured images cho Products, Services
   - Hero images cho Homepage sections
   - Logo và favicon
   - Certification logos

2. **Cấu hình Homepage**:
   - Vào Content Manager → Homepage
   - Thêm các sections vào dynamic zone
   - Link services, products, testimonials

3. **Link Relations**:
   - Link products to categories
   - Link services to certifications
   - Link testimonials to services

## Troubleshooting

### Lỗi: "Authentication failed"
- Kiểm tra Strapi server đang chạy
- Kiểm tra ADMIN_EMAIL và ADMIN_PASSWORD trong .env
- Đảm bảo admin user đã được tạo

### Lỗi: "Content may already exist"
- Đây là cảnh báo, không phải lỗi
- Script sẽ bỏ qua content đã tồn tại và tiếp tục

### Lỗi: "Phase 1 must be completed first"
- Chạy Phase 1 trước khi chạy Phase 2, 3, 4
- Phase 1 tạo các dependencies cần thiết

## Lưu ý

- Script tự động publish content sau khi tạo
- Content được tạo cho cả EN và VI locales
- File `created-content.json` lưu các ID để link relations
- Nếu cần chạy lại, xóa content cũ trong Strapi admin trước

