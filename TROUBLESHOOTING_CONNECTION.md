# Database Connection Troubleshooting

## Current Status
❌ **All connection methods failing:**
- Direct database (port 5432) ❌
- Connection pooling (port 6543) ❌  
- API connection ❌

This indicates the **Supabase project itself** is not accessible.

## Immediate Actions Required

### Step 1: Verify Project Status in Dashboard

1. **Go to:** https://supabase.com/dashboard/project/sjjzoxcmtgzbyunnmopo

2. **Check Project Status:**
   - Look at the top of the dashboard
   - Does it show **"Active"** or **"Paused"**?
   - If paused → Click **"Resume"** or **"Restore"**

3. **Try SQL Editor:**
   - Go to **SQL Editor** in left sidebar
   - Click **"New query"**
   - Try running: `SELECT 1;`
   - ✅ If this works → Database is accessible, issue is with connection string
   - ❌ If this fails → Project is paused or has issues

### Step 2: Restart the Project

If SQL Editor doesn't work:

1. **Go to:** Settings → General
2. **Click:** "Restart project" button
3. **Wait:** 3-5 minutes for restart
4. **Test again:** `npm run db:test-simple`

### Step 3: Check Network/Firewall

If project is active but still can't connect:

1. **Test from different network:**
   - Try from home vs work network
   - Check if corporate firewall blocks port 5432

2. **Test Supabase Dashboard:**
   - If Dashboard → SQL Editor works → It's a local network issue
   - If Dashboard → SQL Editor doesn't work → It's a Supabase project issue

### Step 4: Verify Connection String Format

Double-check your `.env` file has exactly:

```env
DATABASE_URL="postgresql://postgres:Morhaf%401985%21%21%21%21@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:Morhaf%401985%21%21%21%21@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://sjjzoxcmtgzbyunnmopo.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqanpveGNtdGd6Ynl1bm5tb3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTE1NjksImV4cCI6MjA3OTEyNzU2OX0.Oiwg35Csxws26-l4g92QnCCaGeor7M3aihL1zAC4Cvk"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqanpveGNtdGd6Ynl1bm5tb3BvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MTU2OSwiZXhwIjoyMDc5MTI3NTY5fQ.ZNmrMCPnHZAxx_M9Szb4p2voPNTjRF_gE8c00WworLw"
```

### Step 5: Test API Connection

Try testing if Supabase API works:

```bash
npm run db:verify-project
```

If API also fails → Project is definitely paused or has issues.

---

## Most Likely Issue

Based on all tests failing, the **most likely issue** is:

1. **Project is paused** (even if dashboard shows it as active)
2. **Project needs restart** after being paused/resumed
3. **Network/firewall blocking** all Supabase connections

---

## Quick Test

**Try this first:**
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Run: `SELECT 1;`
4. If this works → Your connection string might be wrong
5. If this doesn't work → Project is paused/needs restart

