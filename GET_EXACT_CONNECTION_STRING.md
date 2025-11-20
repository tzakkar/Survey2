# Get Exact Connection String from Supabase

## Since SQL Editor Works But Connections Fail

This means:
- ✅ Database IS accessible
- ✅ Project IS active
- ❌ Network/firewall blocking connections from your machine

## Solution: Get Exact Connection String

### Step 1: Get Connection String from Supabase

1. **Go to:** Supabase Dashboard → Settings → Database

2. **Find "Connection string" section**

3. **Select "URI" tab**

4. **Copy the EXACT connection string** - it will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres
   ```
   OR it might have additional parameters like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require
   ```

5. **Replace `[YOUR-PASSWORD]`** with: `Morhaf@1985!!!!`

6. **Copy the ENTIRE string** and share it with me

### Step 2: Alternative - Use Connection Pooling

If direct connection doesn't work, try connection pooling:

1. In **Settings → Database**
2. Look for **"Connection pooling"** section
3. Copy that connection string instead
4. It will use port **6543** instead of **5432**

### Step 3: Check for IP Restrictions

1. Go to **Settings → Database**
2. Check if there are **"IP Restrictions"** or **"Allowed IPs"**
3. If yes, add your current IP address

---

## What to Share

Please share:
1. The EXACT connection string from Supabase (with password replaced)
2. Whether you see any IP restrictions in Settings → Database
3. Whether you're on a corporate network/VPN

This will help me give you the exact `.env` configuration that works.

