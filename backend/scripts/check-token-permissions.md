# Kiểm tra API Token Permissions trong Strapi v5

## Vấn đề: 405 Method Not Allowed dù token là "Full access"

Trong Strapi v5, ngay cả khi API Token có type "Full access", bạn vẫn có thể gặp lỗi 405 nếu permissions chưa được cấu hình đúng.

## Cách kiểm tra và sửa:

### 1. Kiểm tra Token Permissions

1. Mở Strapi Admin: http://localhost:1337/admin
2. Vào: **Settings** > **API Tokens**
3. Click vào token của bạn (ví dụ: "Full Access 1")
4. Scroll xuống phần **"Permissions"**
5. Kiểm tra xem có section **"Content-type-builder"** hoặc **"Application"** không
6. Mở rộng các content types và kiểm tra permissions:
   - `api::author.author` - cần có `create`, `update`, `delete`
   - `api::category.category` - cần có `create`, `update`, `delete`
   - `api::certification.certification` - cần có `create`, `update`, `delete`
   - Và các content types khác

### 2. Cấu hình Permissions cho Token

Nếu permissions chưa được cấu hình:

1. Trong token settings, scroll xuống **"Permissions"**
2. Mở rộng section **"Content-type-builder"** hoặc **"Application"**
3. Với mỗi content type cần populate:
   - Enable `create`
   - Enable `update`
   - Enable `delete` (nếu cần)
4. Click **"Save"** ở góc trên bên phải

### 3. Hoặc dùng Admin JWT Token (Tự động)

Script đã được cập nhật để tự động fallback sang admin password authentication khi gặp 405.

Đảm bảo `.env` có:
```
ADMIN_EMAIL=your_email
ADMIN_PASSWORD=your_password
```

Script sẽ:
1. Thử dùng API Token trước
2. Nếu gặp 405, tự động chuyển sang admin auth
3. Dùng admin JWT token để tạo content

### 4. Test Token Permissions

Chạy script test:
```bash
node scripts/test-token-write.js
```

Script này sẽ:
- Test GET request (should work)
- Test POST request (should work nếu permissions đúng)
- Hiển thị chi tiết lỗi nếu có

## Lưu ý

- Strapi v5 có thể yêu cầu permissions được cấu hình riêng cho từng content type
- "Full access" type có thể không đủ nếu permissions chưa được enable trong token settings
- Admin JWT token thường hoạt động tốt hơn cho automation scripts

