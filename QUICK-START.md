# Quick Start Guide

**PostgreSQL is required** for this project according to architecture guidelines.

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker Desktop (for PostgreSQL)

## Step 1: Start PostgreSQL

From project root:

```bash
# Start PostgreSQL using Docker Compose
docker-compose up -d

# Verify it's running
docker-compose ps
# Should show: thegreatbeans-db with status "Up"
```

**Database credentials (development):**
- Host: `localhost`
- Port: `5432`
- Database: `thegreatbeans`
- User: `strapi`
- Password: `strapi_dev_password`

## Step 2: Install Dependencies

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

## Step 3: Configure Environment

### Backend

```bash
cd backend
cp env.example .env
```

Generate secrets:
```bash
# Generate 4 keys for APP_KEYS (run 4 times)
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Edit `backend/.env`:
```env
# Database - PostgreSQL (REQUIRED)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=thegreatbeans
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_dev_password
DATABASE_SSL=false

# Secrets (replace with generated values)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-secret
TRANSFER_TOKEN_SALT=your-salt
JWT_SECRET=your-secret

# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend

```bash
cd frontend
cp env.local.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 4: Start Backend

```bash
cd backend
npm run develop
```

1. Visit http://localhost:1337/admin
2. Create admin account
3. Go to Settings > Users & Permissions > Roles > Public
4. Enable `find` and `findOne` for all content types

## Step 5: Start Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Troubleshooting

### PostgreSQL issues

**"Cannot connect to database"**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Start if not running
docker-compose up -d

# Check logs if issues
docker-compose logs postgres
```

**"Database does not exist"**
- The database is created automatically by Docker
- If issues persist, recreate container:
```bash
docker-compose down
docker-compose up -d
```

### Backend won't start
- Check Node.js version: `node --version` (should be >= 20)
- Check if port 1337 is available
- Verify .env file exists and has all required keys
- Ensure PostgreSQL is running (see above)

### Frontend won't start
- Check Node.js version: `node --version` (should be >= 20)
- Check if port 3000 is available
- Verify .env.local file exists

### API connection errors
- Ensure backend is running on port 1337
- Check CORS_ORIGIN in backend/.env matches frontend URL
- Verify NEXT_PUBLIC_API_URL in frontend/.env.local

## Migration from SQLite

If you have existing SQLite data, see [MIGRATION-GUIDE.md](backend/MIGRATION-GUIDE.md) for complete migration instructions using Strapi native CLI.

## Next Steps

Once both servers are running:
1. ✅ PostgreSQL: Running via Docker
2. ✅ Backend: http://localhost:1337/admin
3. ✅ Frontend: http://localhost:3000
4. ✅ Ready for content population

## Additional Resources

- **Database Setup:** See [DATABASE-SETUP.md](backend/DATABASE-SETUP.md)
- **Environment Variables:** See [ENVIRONMENT-VARIABLES.md](ENVIRONMENT-VARIABLES.md)
- **Deployment:** See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

