# Fix 405 Method Not Allowed Error

## Vấn đề

Script gặp lỗi **HTTP 405: Method Not Allowed** khi tạo content. Điều này có nghĩa là:

1. **API Token chỉ có quyền "Read-only"** (không phải "Full access")
2. Hoặc API Token không có quyền write

## Giải pháp

### Cách 1: Tạo API Token mới với "Full access" (Khuyến nghị)

1. Mở Strapi Admin: http://localhost:1337/admin
2. Vào: **Settings** > **API Tokens**
3. Xóa token cũ (nếu cần)
4. Click **"Create new API Token"**
5. Điền form:
   - **Name**: Populate Script
   - **Token type**: **Full access** ⚠️ (QUAN TRỌNG: không phải Read-only)
   - **Token duration**: Unlimited
   - Click **"Save"**
6. Copy token (chỉ hiện 1 lần!)
7. Cập nhật `.env`:
   ```
   STRAPI_API_TOKEN=your_new_token_here
   ```
8. Chạy lại:
   ```bash
   npm run populate:master
   ```

### Cách 2: Dùng Admin Password Authentication (Tự động fallback)

Script đã được cập nhật để tự động fallback sang admin password authentication nếu API Token là Read-only.

Đảm bảo `.env` có:
```
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

Script sẽ:
1. Thử dùng API Token trước
2. Nếu gặp 405, tự động chuyển sang admin password auth
3. Dùng admin JWT token để tạo content

### Cách 3: Kiểm tra token hiện tại

Chạy script này để kiểm tra:
```bash
node scripts/test-api-token-permissions.js
```

## Lưu ý

- API Token với "Full access" an toàn hơn cho automation
- Admin password auth chỉ là fallback
- Nên tạo token mới với "Full access" để tránh lỗi 405

