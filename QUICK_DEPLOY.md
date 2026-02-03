# Quick Deployment Checklist for railbit.io

## Prerequisites
- ✅ Domain: railbit.io (GoDaddy)
- ✅ GitHub repository with your code
- ✅ Accounts: Vercel + Railway (free tiers work)

---

## Step 1: Update Backend for PostgreSQL (5 minutes)

1. **Add PostgreSQL dependency**:
   ```bash
   cd backend
   npm install pg
   ```

2. **Update `backend/server.js`**:
   - Replace SQLite imports with PostgreSQL (see `server.production.js` for reference)
   - Replace `db.get()`, `db.all()`, `db.run()` with `pool.query()`
   - Change `DATETIME` to `TIMESTAMP` in SQL
   - Change `TEXT` stays the same (works in PostgreSQL)

3. **Update `backend/package.json`**:
   ```json
   {
     "dependencies": {
       "pg": "^8.11.3"
     }
   }
   ```

---

## Step 2: Deploy Backend to Railway (10 minutes)

1. Go to https://railway.app → Sign up with GitHub
2. "New Project" → "Deploy from GitHub repo"
3. Select your repo → Choose `backend` folder
4. Add PostgreSQL database (Railway → + New → Database → PostgreSQL)
5. Set environment variables:
   ```
   JWT_SECRET=your-super-secret-key-here
   FRONTEND_URL=https://railbit.io
   NODE_ENV=production
   DATABASE_URL=(auto-set by Railway)
   ```
6. In service settings → Networking → Add custom domain: `api.railbit.io`
7. Copy the CNAME value Railway provides

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com → Sign up with GitHub
2. "Add New" → "Project" → Import your repo
3. Framework: **Vite**
4. Root Directory: `/` (root)
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variable:
   ```
   VITE_API_BASE=https://api.railbit.io/api
   ```
8. Settings → Domains → Add: `railbit.io` and `www.railbit.io`
9. Copy DNS records Vercel provides

---

## Step 4: Configure DNS on GoDaddy (5 minutes)

1. Log into GoDaddy → My Products → railbit.io → DNS
2. Add these records:

   **For API (Railway):**
   ```
   Type: CNAME
   Name: api
   Value: [railway-provided-domain].up.railway.app
   TTL: 600
   ```

   **For Frontend (Vercel):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (check Vercel for current IP)
   TTL: 600
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600
   ```

3. **OR** use Vercel's nameservers (easier):
   - Change nameservers in GoDaddy to Vercel's
   - Vercel manages all DNS

---

## Step 5: Wait & Test (24-48 hours)

1. **Wait for DNS propagation** (check with https://dnschecker.org)
2. **Test your sites**:
   - https://railbit.io (should show marketing page)
   - https://api.railbit.io/api/auth/me (should return 401,not 404)

---

## Environment Variables Summary

### Backend (Railway):
```
JWT_SECRET=your-secret-key
FRONTEND_URL=https://railbit.io
NODE_ENV=production
DATABASE_URL=(auto-set)
```

### Frontend (Vercel):
```
VITE_API_BASE=https://api.railbit.io/api
```

---

## Common Issues

**"Cannot connect to database"**
- Check DATABASE_URL is set
- Verify PostgreSQL is running in Railway
- Check SSL settings

**"CORS errors"**
- Verify FRONTEND_URL matches your domain
- Check CORS config in backend

**"404 on API routes"**
- Verify DNS CNAME for `api.railbit.io` points to Railway
- Check Railway service is running

**"Frontend can't reach API"**
- Verify VITE_API_BASE is set correctly
- Check API is accessible at https://api.railbit.io

---

## Cost

- **Vercel**: Free (100GB/month)
- **Railway**: $5/month (after free trial) or free with limits
- **Domain**: Already paid
- **Total**: ~$5-10/month

---

## Next Steps After Deployment

1. ✅ Test registration flow
2. ✅ Test login flow  
3. ✅ Test payment creation
4. ✅ Test payment URLs
5. ✅ Set up error monitoring (Sentry)
6. ✅ Set up analytics (Vercel Analytics)
7. ✅ Configure backups for database

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Full guide: See `DEPLOYMENT_GUIDE.md`







