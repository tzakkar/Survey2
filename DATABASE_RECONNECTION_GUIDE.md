# Database Reconnection Guide - Step by Step

## Overview
This guide will help you reconnect your application to the Supabase database.

---

## Step 1: Verify Supabase Project Status

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Log in with your account

2. **Find Your Project:**
   - Look for project: `sjjzoxcmtgzbyunnmopo`
   - Or check the project URL: `https://sjjzoxcmtgzbyunnmopo.supabase.co`

3. **Check Project Status:**
   - ✅ **Active** → Continue to Step 2
   - ⚠️ **Paused** → Click the "Resume" or "Restore" button
   - ❌ **Not Found/Deleted** → You'll need to create a new project (see Step 1.5)

### Step 1.5: If Project Doesn't Exist (Create New Project)

1. Click **"New Project"** in Supabase Dashboard
2. Fill in:
   - **Name:** Survey System (or your preferred name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
3. Wait for project to be created (2-3 minutes)
4. **Note the new project reference** (the part before `.supabase.co`)

---

## Step 2: Get Fresh Connection Strings

1. **In Supabase Dashboard:**
   - Go to: **Project Settings** (gear icon in left sidebar)
   - Click: **Database** tab

2. **Find Connection String:**
   - Scroll to **"Connection string"** section
   - Select **"URI"** tab (not "JDBC" or "Golang")
   - You'll see something like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
     ```

3. **Copy the Connection String:**
   - Click the **copy icon** next to the connection string
   - **Important:** Replace `[YOUR-PASSWORD]` with your actual database password
   - Make sure password is **URL-encoded** (special characters like `&` become `%26`)

4. **Get Direct URL (for Prisma):**
   - Use the same connection string
   - Both `DATABASE_URL` and `DIRECT_URL` can be the same for Supabase

---

## Step 3: Get Supabase API Keys

1. **Still in Project Settings:**
   - Click: **API** tab (next to Database)

2. **Copy These Values:**
   - **Project URL:** `https://[PROJECT-REF].supabase.co`
   - **anon/public key:** (starts with `eyJ...` or `sb_publishable_...`)
   - **service_role key:** (starts with `eyJ...` or `sb_secret_...`)
     - ⚠️ **Keep this secret!** Never expose in client-side code

---

## Step 4: Update Environment Variables

1. **Create/Update `.env` file** in your project root:
   ```bash
   # Database Connection (from Step 2)
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
   DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
   
   # Supabase API (from Step 3)
   NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
   SUPABASE_SERVICE_KEY="your_service_role_key_here"
   ```

2. **Replace Placeholders:**
   - `YOUR_PASSWORD` → Your actual database password (URL-encoded)
   - `PROJECT_REF` → Your project reference (e.g., `sjjzoxcmtgzbyunnmopo`)
   - `your_anon_key_here` → Your anon/public key
   - `your_service_role_key_here` → Your service role key

3. **Password URL Encoding:**
   - If your password contains special characters:
     - `&` → `%26`
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`
   - Example: Password `MyP@ss&123` becomes `MyP%40ss%26123`

---

## Step 5: Test Connection Locally

1. **Regenerate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Test Database Connection:**
   ```bash
   npm run db:test-connection
   ```
   - ✅ If successful → Continue to Step 6
   - ❌ If failed → Check error message and go back to Step 2

---

## Step 6: Run Database Migrations

1. **Push Prisma Schema to Database:**
   ```bash
   npx prisma db push
   ```
   - This creates/updates tables in your database
   - ⚠️ **Warning:** This may modify your database schema

2. **Alternative (if you have migrations):**
   ```bash
   npm run db:migrate
   ```

---

## Step 7: Seed Database (Optional)

If you need to populate initial data:

1. **Check if seed file exists:**
   ```bash
   ls prisma/seed.ts
   ```

2. **Run seed:**
   ```bash
   npm run db:seed
   ```

   Or if you have a SQL seed file:
   ```bash
   # Run SQL file in Supabase Dashboard → SQL Editor
   ```

---

## Step 8: Update Vercel Environment Variables

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Go to Settings → Environment Variables**

3. **Add/Update These Variables:**
   - `DATABASE_URL` → Your connection string from Step 2
   - `DIRECT_URL` → Same as DATABASE_URL
   - `NEXT_PUBLIC_SUPABASE_URL` → From Step 3
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → From Step 3
   - `SUPABASE_SERVICE_KEY` → From Step 3

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on latest deployment
   - Or push a new commit to trigger deployment

---

## Step 9: Verify Everything Works

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```

2. **Test Pages:**
   - Visit: http://localhost:3000
   - Visit: http://localhost:3000/admin/questionnaires
   - Visit: http://localhost:3000/survey/staff-questionnaire

3. **Check Console:**
   - Look for connection errors
   - Should see successful database queries

---

## Troubleshooting

### Error: "Can't reach database server"
- **Check:** Project is not paused in Supabase
- **Check:** Connection string is correct
- **Check:** Password is URL-encoded
- **Check:** Network/firewall isn't blocking port 5432

### Error: "Invalid credentials"
- **Check:** Password is correct (try resetting in Supabase Dashboard)
- **Check:** Password is properly URL-encoded
- **Check:** Using correct project reference

### Error: "SSL required"
- **Check:** Connection string includes `?sslmode=require`
- **Check:** Using port 5432 (not 5433)

### Error: "Table doesn't exist"
- **Run:** `npx prisma db push` (Step 6)
- **Or:** Create tables manually in Supabase Dashboard → SQL Editor

---

## Quick Reference

### Current Configuration (from your code):
- **Project URL:** `https://sjjzoxcmtgzbyunnmopo.supabase.co`
- **Database Host:** `db.sjjzoxcmtgzbyunnmopo.supabase.co:5432`
- **Database Name:** `postgres`
- **SSL Mode:** `require`

### Files to Check:
- `.env` → Environment variables
- `prisma/schema.prisma` → Database schema
- `lib/db.ts` → Prisma client
- `lib/supabase.ts` → Supabase client

---

## Need Help?

If you're still having issues:
1. Check Supabase Dashboard → Logs for errors
2. Check Vercel deployment logs
3. Verify all environment variables are set correctly
4. Try connecting via Supabase Dashboard → SQL Editor (if that works, it's a connection string issue)

