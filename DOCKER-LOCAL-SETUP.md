# 🐳 Docker Local Setup Guide

Complete guide to set up PostgreSQL locally using Docker for The Great Beans project.

---

## Prerequisites

### 1. Install Docker Desktop

**Download and install Docker Desktop:**
- Windows: https://www.docker.com/products/docker-desktop/
- Select "Docker Desktop for Windows"
- Run the installer
- **Restart your computer after installation**

**After restart, verify installation:**
```bash
docker --version
docker-compose --version
```

Expected output:
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

---

## Quick Start (3 Commands)

```bash
# 1. Start PostgreSQL container
docker-compose up -d

# 2. Start Strapi backend
cd backend
npm run develop

# 3. Open browser to http://localhost:1337/admin
```

---

## Detailed Setup Steps

### Step 1: Start PostgreSQL Container

From the project root directory (`E:\one\one`):

```bash
docker-compose up -d
```

**What this does:**
- Downloads PostgreSQL 15 Alpine image (if not already downloaded)
- Creates container named `thegreatbeans-db`
- Starts PostgreSQL on port 5432
- Creates volume `postgres_data` for data persistence

**Expected output:**
```
[+] Running 2/2
 ✔ Network one_default           Created
 ✔ Container thegreatbeans-db    Started
```

---

### Step 2: Verify PostgreSQL is Running

```bash
docker-compose ps
```

**Expected output:**
```
NAME                IMAGE               STATUS              PORTS
thegreatbeans-db    postgres:15-alpine  Up (healthy)        0.0.0.0:5432->5432/tcp
```

**Status must show:** `Up (healthy)`

**If not healthy yet:**
- Wait 10-20 seconds for health check
- Run `docker-compose ps` again

---

### Step 3: Verify Database Configuration

The configuration is already set automatically! Check:

**File:** `backend/.env`

Should contain:
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=thegreatbeans
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_dev_password
DATABASE_SSL=false
```

✅ This was already configured by the migration script!

---

### Step 4: Start Strapi Backend

```bash
cd backend
npm run develop
```

**First run will:**
1. Connect to PostgreSQL
2. Create all database tables automatically
3. Set up Strapi schema
4. Start admin panel

**Expected output:**
```
[2024-XX-XX XX:XX:XX.XXX] info: Starting Strapi application...
[2024-XX-XX XX:XX:XX.XXX] info: Database connection established
[2024-XX-XX XX:XX:XX.XXX] info: Server started on port 1337

┌──────────────────────────────────────────────────┐
│ Strapi is running │
│                                                  │
│ http://localhost:1337/admin                      │
└──────────────────────────────────────────────────┘

[2024-XX-XX XX:XX:XX.XXX] info: Admin panel ready
```

---

### Step 5: Create Admin User

1. **Open browser:** http://localhost:1337/admin

2. **You'll see:** "Create your first admin user" page

3. **Fill in the form:**
   - First name: `Admin`
   - Last name: `User`
   - Email: `admin@thegreatbeans.com`
   - Password: (minimum 8 characters, use a strong password)
   - Confirm password

4. **Click:** "Let's start"

5. **You're in!** Welcome to Strapi Admin Panel 🎉

---

### Step 6: Verify Database Connection

**In Strapi Admin Panel:**

1. Click **Content Manager** (left sidebar)
2. You should see all content types:
   - Product (Collection Type)
   - Service (Collection Type)
   - Knowledge Asset (Collection Type)
   - Category (Collection Type)
   - Author (Collection Type)
   - Certification (Collection Type)
   - Testimonial (Collection Type)
   - Homepage (Single Type)
   - Site Settings (Single Type)
   - Global SEO (Single Type)
   - Contact Page (Single Type)

✅ If you see these, **PostgreSQL is working perfectly!**

---

### Step 7: Start Frontend (Optional)

Open a **new terminal** (keep backend running):

```bash
cd frontend
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Visit:** http://localhost:3000

---

## Database Management

### View PostgreSQL Data

**Option 1: Using psql (command line)**
```bash
docker-compose exec postgres psql -U strapi -d thegreatbeans
```

**Common commands:**
```sql
\dt              -- List all tables
\d+ table_name   -- Describe table
SELECT * FROM admin_users;  -- View admin users
\q               -- Quit
```

**Option 2: Using DBeaver (GUI - Recommended)**

1. Download DBeaver: https://dbeaver.io/download/
2. New Connection → PostgreSQL
3. Connection settings:
   - Host: `localhost`
   - Port: `5432`
   - Database: `thegreatbeans`
   - Username: `strapi`
   - Password: `strapi_dev_password`
4. Test Connection → Finish

---

## Docker Commands Cheat Sheet

### Start PostgreSQL
```bash
docker-compose up -d
```

### Stop PostgreSQL
```bash
docker-compose down
```

### View PostgreSQL Logs
```bash
docker-compose logs postgres
docker-compose logs -f postgres  # Follow logs
```

### Check Container Status
```bash
docker-compose ps
docker ps  # All containers
```

### Restart PostgreSQL
```bash
docker-compose restart postgres
```

### Stop and Remove (keeps data)
```bash
docker-compose down
```

### Stop and Remove ALL data (⚠️ destructive)
```bash
docker-compose down -v  # Removes volumes
```

### Access PostgreSQL Shell
```bash
docker-compose exec postgres psql -U strapi -d thegreatbeans
```

### Backup Database
```bash
docker-compose exec -T postgres pg_dump -U strapi thegreatbeans > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U strapi -d thegreatbeans < backup.sql
```

---

## Troubleshooting

### "Docker not found" error

**Issue:** Docker Desktop not installed or not in PATH

**Solution:**
1. Install Docker Desktop
2. Restart computer
3. Verify: `docker --version`

### Port 5432 already in use

**Issue:** Another PostgreSQL instance running

**Solution:**
```bash
# Windows - Find process on port 5432
netstat -ano | findstr :5432

# Stop other PostgreSQL services
# Or change port in docker-compose.yml to 5433
```

### Container keeps restarting

**Check logs:**
```bash
docker-compose logs postgres
```

**Common issues:**
- Corrupted volume: `docker-compose down -v` then `docker-compose up -d`
- Permission issues: Run Docker Desktop as Administrator

### "Database connection error" in Strapi

**Check:**
1. Container is running: `docker-compose ps`
2. Status is "healthy": Wait 30 seconds if "starting"
3. `.env` file has correct settings
4. Restart Strapi: `npm run develop`

### Strapi shows "SQLite" warning

**Issue:** `.env` file not updated

**Solution:**
```bash
# Check DATABASE_CLIENT in backend/.env
# Should be: DATABASE_CLIENT=postgres
# Not: DATABASE_CLIENT=sqlite
```

---

## Data Persistence

### Where is data stored?

Docker volume: `postgres_data`

**View volume:**
```bash
docker volume ls
docker volume inspect one_postgres_data
```

### Data survives:
✅ Container restart
✅ `docker-compose down`
✅ Computer restart

### Data is lost with:
❌ `docker-compose down -v` (removes volumes)
❌ Manual volume deletion

### Backup Your Data

**Before any destructive action:**
```bash
# Strapi native backup
cd backend
npm run strapi export -- --file backup

# Or PostgreSQL dump
docker-compose exec -T postgres pg_dump -U strapi thegreatbeans > backup-$(date +%Y%m%d).sql
```

---

## Performance Tips

### Speed up container startup

**Pre-pull the image:**
```bash
docker pull postgres:15-alpine
```

### Optimize Docker Desktop

**Settings → Resources:**
- CPUs: 2-4
- Memory: 4GB minimum
- Disk: 60GB minimum

---

## Development Workflow

### Daily workflow:

**Morning (Start work):**
```bash
# Start PostgreSQL
docker-compose up -d

# Start backend
cd backend
npm run develop

# Start frontend (new terminal)
cd frontend
npm run dev
```

**Evening (End work):**
```bash
# Stop Strapi (Ctrl+C in terminal)
# Stop frontend (Ctrl+C in terminal)

# Stop PostgreSQL
docker-compose down
```

**Or leave PostgreSQL running** (uses minimal resources when idle)

---

## Production Deployment

When ready to deploy, PostgreSQL will be hosted on:
- **Supabase** (Managed PostgreSQL)
- **Railway** (Managed PostgreSQL)
- **DigitalOcean** (Managed PostgreSQL)
- **VPS** (Self-hosted PostgreSQL)

See: `DEPLOYMENT-GUIDE.md`

---

## Next Steps

✅ **You've completed:**
- Docker installed
- PostgreSQL running
- Strapi connected
- Admin user created

**What's next:**

1. **Populate content:** See `frontend/STRAPI-CONTENT-GUIDE.md`
2. **Test APIs:** See `TESTING-GUIDE.md`
3. **Deploy:** See `DEPLOYMENT-GUIDE.md`

---

## Quick Reference

### URLs
- **Admin Panel:** http://localhost:1337/admin
- **API:** http://localhost:1337/api
- **Frontend:** http://localhost:3000

### Credentials (Local Dev)
- **Database:** `thegreatbeans`
- **Username:** `strapi`
- **Password:** `strapi_dev_password`
- **Admin User:** (You create this on first run)

### Commands
```bash
# Start all
docker-compose up -d && cd backend && npm run develop

# Stop all
docker-compose down

# Reset everything (⚠️ loses data)
docker-compose down -v && docker-compose up -d
```

---

**Last Updated:** November 2024  
**Project:** The Great Beans Digital Flagship  
**Status:** Docker Local Development 🐳


