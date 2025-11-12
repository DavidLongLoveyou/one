# Quick Start Guide

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL (optional, SQLite works for development)

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment

### Backend
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# For quick start, use SQLite
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Generate these keys (run 4 times):
# node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-secret
TRANSFER_TOKEN_SALT=your-salt
JWT_SECRET=your-secret

HOST=0.0.0.0
PORT=1337
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: Start Backend

```bash
cd backend
npm run develop
```

1. Visit http://localhost:1337/admin
2. Create admin account
3. Go to Settings > Users & Permissions > Roles > Public
4. Enable `find` and `findOne` for all content types

## Step 4: Start Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Step 5: Verify Setup

```bash
# Test backend structure
cd backend
npm run test:setup

# Test frontend structure
cd frontend
npm run test:setup
```

## Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be >= 20)
- Check if port 1337 is available
- Verify .env file exists and has all required keys

### Frontend won't start
- Check Node.js version: `node --version` (should be >= 20)
- Check if port 3000 is available
- Verify .env.local file exists

### API connection errors
- Ensure backend is running on port 1337
- Check CORS_ORIGIN in backend/.env matches frontend URL
- Verify NEXT_PUBLIC_API_URL in frontend/.env.local

## Next Steps

Once both servers are running:
1. ✅ Backend: http://localhost:1337/admin
2. ✅ Frontend: http://localhost:3000
3. Ready to proceed with Session 3: API Client & SEO Foundation

