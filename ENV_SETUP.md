# Environment Variables Setup

## Frontend Environment Variables

Create `.env.local` in the root directory for local development:

```env
VITE_API_BASE=http://localhost:3001/api
```

For production (set in Vercel dashboard):
```env
VITE_API_BASE=https://api.railbit.io/api
```

## Backend Environment Variables

Create `.env` in the `backend/` directory for local development:

```env
JWT_SECRET=...
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

For production (set in Railway dashboard):
```env
JWT_SECRET=your-super-secret-production-key-minimum-32-characters
PORT=3001
FRONTEND_URL=https://railbit.io
NODE_ENV=production
DATABASE_URL=(automatically provided by Railway PostgreSQL)
```

## Notes

- **Never commit `.env` files** - they're in `.gitignore`
- **JWT_SECRET**: Use a strong random string (minimum 32 characters) in production
- **DATABASE_URL**: Automatically set by Railway when you add PostgreSQL database
- **FRONTEND_URL**: Used for CORS and payment URL generation

## Generating a Secure JWT Secret

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

