# Deployment Checklist for railbit.io

## ✅ Code Updates Completed

- [x] Added `preview` script to frontend `package.json`
- [x] Backend `package.json` already has `start` and `dev` scripts
- [x] Added `pg` dependency to backend for PostgreSQL support
- [x] Updated `backend/server.js` to support both SQLite (dev) and PostgreSQL (production)
- [x] Updated CORS to use `FRONTEND_URL` environment variable
- [x] Updated payment URL generation to use `FRONTEND_URL`
- [x] Created query adapter to convert SQLite syntax (?) to PostgreSQL syntax ($1, $2, ...)
- [x] Fixed date functions for both database types

## 📋 What You Need to Do

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment Files (Local Development)

**Root directory** - Create `.env.local`:
```env
VITE_API_BASE=http://localhost:3001/api
```

**Backend directory** - Create `.env`:
```env
JWT_SECRET=your-secret-key-for-local-dev
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Test Locally
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 4. Deploy to Production

Follow the steps in `DEPLOYMENT_GUIDE.md` or `QUICK_DEPLOY.md`.

**Key Environment Variables for Production:**

**Vercel (Frontend):**
- `VITE_API_BASE=https://api.railbit.io/api`

**Railway (Backend):**
- `JWT_SECRET=(generate secure random string)`
- `FRONTEND_URL=https://railbit.io`
- `NODE_ENV=production`
- `DATABASE_URL=(auto-set by Railway)`

## 🔍 What Changed

### Backend (`backend/server.js`)
1. **Dual Database Support**: Automatically uses PostgreSQL if `DATABASE_URL` is set and `NODE_ENV=production`, otherwise uses SQLite
2. **Query Adapter**: Converts SQLite `?` parameters to PostgreSQL `$1, $2, ...` automatically
3. **CORS Configuration**: Uses `FRONTEND_URL` environment variable
4. **Date Functions**: Handles both SQLite `datetime()` and PostgreSQL `NOW()` functions

### Frontend (`package.json`)
1. **Added `preview` script**: For testing production builds locally

### Backend (`backend/package.json`)
1. **Added `pg` dependency**: For PostgreSQL support

## ⚠️ Important Notes

1. **Database Migration**: The code will automatically create tables in PostgreSQL when deployed. No manual migration needed.

2. **Local Development**: Still uses SQLite - no changes needed for local dev workflow.

3. **Production**: When `DATABASE_URL` is set (by Railway), it automatically switches to PostgreSQL.

4. **SQL Compatibility**: All queries use SQLite syntax (`?`), which is automatically converted to PostgreSQL syntax (`$1, $2, ...`) when needed.

## 🧪 Testing Before Deployment

1. **Test locally with SQLite**:
   ```bash
   npm run dev  # Frontend
   cd backend && npm run dev  # Backend
   ```

2. **Test production build locally**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Verify environment variables** are set correctly in hosting platforms.

## 🚀 Ready to Deploy!

Your code is now production-ready. Follow `QUICK_DEPLOY.md` for step-by-step deployment instructions.




