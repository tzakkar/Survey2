# Vercel Deployment Guide - Survey2 Repository

## ✅ Build Verification

The build has been tested and verified to work correctly:
- ✅ TypeScript compilation successful
- ✅ All pages properly configured with `export const dynamic = 'force-dynamic'`
- ✅ Prisma Client generation configured via `postinstall` script
- ✅ No build errors

## 🚀 Deployment Steps

### Step 1: Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

**Required Variables:**

```env
DATABASE_URL=postgresql://postgres:Morhaf%401985%21%21%21%21@db.tujbiiqyyqcwxkwpwemr.supabase.co:6543/postgres?sslmode=require&pgbouncer=true

DIRECT_URL=postgresql://postgres:Morhaf%401985%21%21%21%21@db.tujbiiqyyqcwxkwpwemr.supabase.co:5432/postgres?sslmode=require

NEXT_PUBLIC_SUPABASE_URL=https://tujbiiqyyqcwxkwpwemr.supabase.co
```

**Optional (if using Supabase API fallback):**

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
```

**Important Notes:**
- `DATABASE_URL` uses port **6543** (connection pooler) - better for serverless
- `DIRECT_URL` uses port **5432** (direct connection) - needed for migrations
- Password is URL-encoded: `Morhaf%401985%21%21%21%21` (represents `Morhaf@1985!!!!`)
- Set all variables for **Production, Preview, and Development** environments

### Step 2: Vercel Build Settings

**IMPORTANT:** In Vercel Project Settings, verify these settings:

1. Go to **Settings** → **General**
2. Under **Framework Preset**, make sure it's set to **Next.js**
3. **DO NOT** set an Output Directory - leave it empty (Next.js uses `.next` internally)
4. Build Command should be: `npm run build` (or leave default)
5. Install Command should be: `npm install` (or leave default)

**If you see "Output Directory" set to "public" or anything else:**
- Clear it/leave it empty
- Vercel will automatically use `.next` for Next.js projects

### Step 3: Deploy

1. **Automatic Deployment:**
   - Push to the `main` branch
   - Vercel will automatically trigger a deployment

2. **Manual Deployment:**
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on the latest deployment

## 📋 Build Output Verification

After deployment, check the build logs. You should see:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (7/7)
```

**Route Types:**
- `○` (Static) - Pre-rendered static pages
- `●` (SSG) - Static Site Generation
- `ƒ` (Dynamic) - Server-rendered on demand

**Expected Dynamic Routes:**
- `/admin/questionnaires` - ƒ
- `/admin/questionnaires/[id]/edit` - ●
- `/admin/questionnaires/[id]/responses` - ●
- `/survey/[slug]` - ●
- `/survey/[slug]/thank-you` - ƒ

## ✅ Post-Deployment Testing

1. **Home Page:**
   - Visit: `https://your-project.vercel.app`
   - Should load without errors

2. **Admin Panel:**
   - Visit: `https://your-project.vercel.app/admin/questionnaires`
   - Should display questionnaires (if database is accessible)

3. **Survey Pages:**
   - Visit: `https://your-project.vercel.app/survey/staff-questionnaire?lang=en`
   - Visit: `https://your-project.vercel.app/survey/manager-questionnaire?lang=en`
   - Visit: `https://your-project.vercel.app/survey/hr-questionnaire?lang=en`
   - All should load with questionnaire data

## 🔧 Troubleshooting

### Build Fails with "Prisma Client not generated"

**Solution:** The `postinstall` script should handle this automatically. If it doesn't:
1. Check that `prisma` is in `devDependencies`
2. Verify `postinstall: "prisma generate"` is in `package.json`

### Database Connection Errors

**Possible Causes:**
1. Environment variables not set correctly in Vercel
2. Password not URL-encoded properly
3. Database server not accessible from Vercel IPs
4. SSL connection issues

**Solution:**
1. Double-check environment variables in Vercel dashboard
2. Verify password encoding: `@` = `%40`, `!` = `%21`
3. Check Supabase dashboard for connection logs
4. Ensure `sslmode=require` is in connection string

### Pages Show "Database Connection Error"

**Expected Behavior:**
- If database is unreachable, pages will show error messages
- Application won't crash, but functionality will be limited
- This is normal if database credentials are incorrect or database is paused

**Solution:**
1. Verify environment variables are set correctly
2. Check Supabase project status (should be Active)
3. Test database connection from Vercel's serverless function logs

## 📝 Important Files

- `package.json` - Contains `postinstall` script for Prisma generation
- `next.config.mjs` - Next.js configuration
- `prisma/schema.prisma` - Database schema
- `.env` - Local environment variables (not pushed to git)

## 🎯 Summary

Your application is ready for Vercel deployment:

✅ Build tested and verified
✅ Prisma Client generation configured
✅ Dynamic pages properly configured
✅ Environment variables documented
✅ Connection strings use connection pooler (port 6543)

**Next Steps:**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy and test!

