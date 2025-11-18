# Quick Guide - Chạy Populate Scripts

## ✅ Đã Fix: DATABASE_SSL=false

Script đã tự động sửa file `.env` để tắt SSL cho local development.

## 🚀 Cách Chạy Populate

### Option 1: Strapi ĐANG chạy (Khuyến nghị)

1. **Đảm bảo Strapi đang chạy** trong terminal khác:
   ```bash
   cd backend
   npm run develop
   ```
   
2. **Đợi Strapi khởi động xong** (thấy "Server started")

3. **Chạy populate**:
   ```bash
   npm run populate:auto
   ```

### Option 2: Tự động kiểm tra và chạy

```bash
npm run populate:restart
```

Script sẽ:
- ✅ Kiểm tra Strapi đang chạy
- ✅ Chạy Phase 1, 2, 3 tự động
- ⚠️  Nếu Strapi chưa chạy, sẽ hướng dẫn bạn start

### Option 3: Chạy từng Phase

```bash
# Phase 1: Foundation
npm run populate:phase1

# Phase 2: Core Content  
npm run populate:phase2

# Phase 3: Pages
npm run populate:phase3
```

## 🔧 Troubleshooting

### Lỗi: "The server does not support SSL connections"

✅ **Đã fix!** Script đã tự động thêm `DATABASE_SSL=false` vào `.env`

**Nếu vẫn lỗi:**
1. Kiểm tra file `backend/.env` có dòng: `DATABASE_SSL=false`
2. Restart Strapi: Dừng (Ctrl+C) và chạy lại `npm run develop`

### Lỗi: "Cannot connect to Strapi"

**Nguyên nhân:** Strapi server chưa chạy hoặc chưa sẵn sàng

**Giải pháp:**
1. Mở terminal mới
2. `cd backend`
3. `npm run develop`
4. Đợi thấy "Server started"
5. Chạy lại: `npm run populate:auto`

### Lỗi: "Authentication failed"

**Nguyên nhân:** Admin credentials sai

**Giải pháp:**
1. Kiểm tra `backend/.env` có:
   ```env
   ADMIN_EMAIL=your_email@example.com
   ADMIN_PASSWORD=your_password
   ```
2. Hoặc sửa default trong `scripts/populate-content.js` dòng 31-32

### Lỗi: "Content may already exist"

⚠️  **Đây là cảnh báo, không phải lỗi!**
- Script sẽ bỏ qua content đã tồn tại
- Nếu muốn tạo lại, xóa content cũ trong Strapi admin trước

## 📋 Checklist Sau Khi Chạy

- [ ] Kiểm tra content trong Strapi Admin
- [ ] Upload images cho Products, Services
- [ ] Upload logo và favicon
- [ ] Cấu hình Homepage với dynamic zones
- [ ] Link relations giữa content types
- [ ] Publish tất cả content (EN + VI)

## 💡 Tips

- Chạy từng phase để dễ debug
- Kiểm tra `scripts/created-content.json` để xem content IDs
- Xem logs trong terminal để biết progress
- Nếu lỗi, có thể chạy lại phase bị lỗi riêng

