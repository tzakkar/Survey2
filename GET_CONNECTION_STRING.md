# Get Fresh Connection String from Supabase

## Your Project Status
✅ **Project is ACTIVE** - Good!

## Next Steps to Fix Connection

### Step 1: Get Database Connection String
1. **In Supabase Dashboard**, navigate to:
   - **Settings** (gear icon in left sidebar)
   - Click **"Database"** tab

2. **Find Connection String:**
   - Scroll down to **"Connection string"** section
   - Select **"URI"** tab (not JDBC or other formats)
   - You'll see something like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require
     ```

3. **Copy the Connection String:**
   - Click the **copy icon** (📋) next to the connection string
   - **Important:** The string will have `[YOUR-PASSWORD]` placeholder
   - You need to replace this with your actual database password

### Step 2: Get Your Database Password
1. **Still in Settings → Database:**
   - Look for **"Database password"** section
   - If you see it displayed, copy it
   - If you don't remember it, click **"Reset database password"**
   - **Save the new password securely!**

### Step 3: Update Your .env File
1. **Open `.env` file** in your project root
2. **Replace the connection strings:**

```env
# Replace [YOUR-PASSWORD] with your actual password
# URL-encode special characters: & → %26, @ → %40, # → %23

DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
```

**Password URL Encoding Examples:**
- Password: `MyP@ss&123` → Use: `MyP%40ss%26123`
- Password: `Test#Pass` → Use: `Test%23Pass`
- Password: `Simple123` → Use: `Simple123` (no encoding needed)

### Step 4: Test Connection
After updating `.env`:
```bash
npm run db:test-simple
```

### Step 5: If Still Failing
If connection still fails, try:
1. **Restart the project** (from Project Settings → Restart project)
   - Wait 2-3 minutes after restart
   - Test again

2. **Check API Keys:**
   - Go to **Settings → API**
   - Verify `service_role` key matches your `.env` file
   - Copy fresh keys if needed

3. **Verify Network:**
   - Try accessing Supabase Dashboard → SQL Editor
   - If SQL Editor works, it's a connection string issue
   - If SQL Editor doesn't work, it might be network/firewall

---

## Quick Checklist
- [ ] Project is Active ✅
- [ ] Got fresh connection string from Settings → Database
- [ ] Got database password (or reset it)
- [ ] Updated `.env` with correct password (URL-encoded)
- [ ] Tested connection: `npm run db:test-simple`

