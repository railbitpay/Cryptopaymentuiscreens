# Deployment Guide: Hosting RailBit on railbit.io

This guide walks you through deploying your RailBit application to production on your GoDaddy domain.

 Overview

You'll need to deploy:
1. **Frontend** (React/Vite) - Static site hosting
2. **Backend** (Node.js/Express) - Server hosting
3. **Database** (SQLite → PostgreSQL for production)

 Recommended Hosting Options

Option 1: Vercel + Railway (Easiest & Free Tier Available)
- Frontend: Vercel (free, excellent for React)
- Backend: Railway (free tier, easy setup)
- Database: Railway PostgreSQL (included)

 Option 2: Netlify + Render
- Frontend: Netlify (free tier)
- Backend: Render (free tier available)
- Database: Render PostgreSQL

 Option 3: AWS/Azure/GCP (More Complex, More Control)
- Full control but requires more setup

---

 Step-by-Step: Vercel + Railway Setup

 Part 1: Prepare Your Code

 1. Update Environment Variables

Create `.env.production` in the root:
```env
VITE_API_BASE=https://api.railbit.io/api
```

Create `.env` in `backend/`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
FRONTEND_URL=https://railbit.io
NODE_ENV=production
```

#### 2. Update Backend for Production Database

Update `backend/server.js` to use PostgreSQL instead of SQLite:

```javascript
// Replace SQLite with PostgreSQL
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Update all dbGet, dbAll, dbRun functions to use pool.query()
```

#### 3. Update package.json Scripts

In `package.json`, add:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

In `backend/package.json`, add:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

---

### Part 2: Deploy Backend to Railway

1. **Sign up at Railway** (https://railway.app)
   - Use GitHub to sign in

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will provide `DATABASE_URL` automatically

4. **Set Environment Variables**
   - In your service settings, go to "Variables"
   - Add:
     ```
     JWT_SECRET=your-super-secret-jwt-key
     FRONTEND_URL=https://railbit.io
     NODE_ENV=production
     DATABASE_URL=(automatically set by Railway)
     ```

5. **Deploy**
   - Railway will auto-deploy
   - Note the generated domain (e.g., `railbit-production.up.railway.app`)
   - Copy this URL - you'll need it for DNS

6. **Get Custom Domain**
   - In Railway service settings → "Settings" → "Networking"
   - Add custom domain: `api.railbit.io`
   - Railway will provide DNS records to add

---

### Part 3: Deploy Frontend to Vercel

1. **Sign up at Vercel** (https://vercel.com)
   - Use GitHub to sign in

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework Preset: **Vite**
   - Root Directory: `/` (root of repo)

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   - In project settings → "Environment Variables"
   - Add:
     ```
     VITE_API_BASE=https://api.railbit.io/api
     ```

5. **Add Custom Domain**
   - In project settings → "Domains"
   - Add: `railbit.io` and `www.railbit.io`
   - Vercel will provide DNS records

6. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

---

### Part 4: Configure DNS on GoDaddy

1. **Log into GoDaddy**
   - Go to your domain management
   - Click on `railbit.io`
   - Go to "DNS" or "DNS Management"

2. **Add DNS Records**

   **For Frontend (Vercel):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP - check Vercel dashboard for current IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

   **For Backend API (Railway):**
   ```
   Type: CNAME
   Name: api
   Value: [your-railway-domain].up.railway.app
   ```
   (Railway will provide the exact CNAME value)

3. **Alternative: Use Nameservers (Easier)**
   - If using Vercel's nameservers:
     - In GoDaddy, change nameservers to Vercel's
     - Vercel will manage all DNS
   - Vercel nameservers: (check Vercel dashboard)

4. **Wait for Propagation**
   - DNS changes take 24-48 hours to propagate
   - Use https://dnschecker.org to check status

---

### Part 5: Update Code for Production

#### Update API Base URL

In `src/services/api.ts`:
```typescript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';
```

This will use `https://api.railbit.io/api` in production.

#### Update Backend CORS

In `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://railbit.io',
  credentials: true
}));
```

#### Update Payment URLs

The backend already uses `FRONTEND_URL` environment variable, so payment URLs will be correct.

---

### Part 6: Database Migration (SQLite → PostgreSQL)

You'll need to update your backend to use PostgreSQL. Here's a quick migration:

1. **Install PostgreSQL client**:
   ```bash
   cd backend
   npm install pg
   ```

2. **Update database connection** in `server.js`:
   ```javascript
   import pg from 'pg';
   const { Pool } = pg;
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
   });
   
   // Replace dbGet, dbAll, dbRun with pool.query()
   const dbGet = async (query, params = []) => {
     const result = await pool.query(query, params);
     return result.rows[0] || null;
   };
   
   const dbAll = async (query, params = []) => {
     const result = await pool.query(query, params);
     return result.rows;
   };
   
   const dbRun = async (query, params = []) => {
     const result = await pool.query(query, params);
     return { lastID: null, changes: result.rowCount };
   };
   ```

3. **Update table creation** (PostgreSQL syntax):
   ```sql
   -- Change TEXT to VARCHAR or use TEXT (both work in PostgreSQL)
   -- Change DATETIME to TIMESTAMP
   -- SQLite's AUTOINCREMENT becomes SERIAL in PostgreSQL
   ```

---

## Alternative: Netlify + Render Setup

### Frontend on Netlify

1. Sign up at https://netlify.com
2. "Add new site" → "Import an existing project"
3. Connect GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add custom domain: `railbit.io`
6. Set environment variable: `VITE_API_BASE=https://api.railbit.io/api`

### Backend on Render

1. Sign up at https://render.com
2. "New" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: `Node`
5. Add PostgreSQL database (Render → New → PostgreSQL)
6. Set environment variables
7. Add custom domain: `api.railbit.io`

---

## SSL/HTTPS

Both Vercel and Railway provide **free SSL certificates** automatically via Let's Encrypt. No additional setup needed!

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible at `https://api.railbit.io`
- [ ] Frontend deployed and accessible at `https://railbit.io`
- [ ] DNS records configured correctly
- [ ] SSL certificates active (automatic)
- [ ] Environment variables set correctly
- [ ] Database migrated to PostgreSQL
- [ ] Test registration/login flow
- [ ] Test payment creation
- [ ] Test payment URLs work correctly
- [ ] Monitor error logs

---

## Monitoring & Maintenance

### Railway
- View logs in Railway dashboard
- Set up alerts for errors
- Monitor database usage

### Vercel
- View analytics in dashboard
- Check build logs
- Monitor performance

### Recommended Tools
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **UptimeRobot** - Uptime monitoring

---

## Cost Estimate

### Free Tier (Sufficient for MVP):
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: $5/month (after free trial) or free with usage limits
- **Domain**: Already paid ($10-15/year)
- **Total**: ~$5-10/month

### Production Scale:
- **Vercel Pro**: $20/month
- **Railway Pro**: $20/month
- **Database**: Included
- **Total**: ~$40/month

---

## Troubleshooting

### DNS Not Working
- Wait 24-48 hours for propagation
- Check DNS records with `dig railbit.io` or `nslookup railbit.io`
- Verify records in GoDaddy match hosting provider

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check CORS configuration allows your domain

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check SSL settings for production databases
- Ensure database is accessible from hosting provider

### Build Failures
- Check build logs in hosting dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version matches (check hosting provider requirements)

---

## Quick Start Commands

After setup, your URLs will be:
- **Frontend**: https://railbit.io
- **API**: https://api.railbit.io/api
- **Payment URLs**: https://railbit.io/payment/{payment_id}

Test your deployment:
```bash
# Test API
curl https://api.railbit.io/api/auth/me

# Test Frontend
open https://railbit.io
```

---

## Need Help?

Common issues and solutions are documented above. For platform-specific help:
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **GoDaddy DNS Help**: https://www.godaddy.com/help


