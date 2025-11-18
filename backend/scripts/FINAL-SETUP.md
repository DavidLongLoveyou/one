# Final Setup - Chạy Populate với API Token

## Bước 1: Lấy API Token từ Strapi

1. Mở Strapi Admin: http://localhost:1337/admin
2. Đăng nhập với admin account
3. Vào: **Settings** (⚙️) > **API Tokens**
4. Click **"Create new API Token"**
5. Điền form:
   - **Name**: `Populate Script`
   - **Token type**: `Full access`
   - **Token duration**: `Unlimited`
6. Click **"Save"**
7. **Copy token** (chỉ hiện 1 lần!)

## Bước 2: Thêm Token vào .env

### Cách 1: Tự động (Khuyến nghị)

```bash
node scripts/add-token-and-run.js YOUR_API_TOKEN_HERE
```

Script sẽ:
- ✅ Tự động thêm token vào .env
- ✅ Chạy Phase 1 ngay lập tức

### Cách 2: Thủ công

Mở file `backend/.env` và thêm dòng:

```env
STRAPI_API_TOKEN=your_token_here
```

Sau đó chạy:
```bash
npm run populate:master
```

## Bước 3: Chạy Tất Cả Phases

Sau khi token đã được thêm:

```bash
npm run populate:master
```

Script sẽ tự động:
- ✅ Kiểm tra Strapi đang chạy
- ✅ Test API Token
- ✅ Chạy Phase 1, 2, 3 tự động
- ✅ Xử lý lỗi và retry

## Troubleshooting

### Token không hoạt động
- Kiểm tra token có type "Full access" không
- Kiểm tra token chưa hết hạn
- Thử tạo token mới

### Script vẫn dùng password
- Đảm bảo token đã được thêm vào .env
- Kiểm tra không có khoảng trắng: `STRAPI_API_TOKEN=token` (không có space)
- Restart terminal sau khi thêm token

