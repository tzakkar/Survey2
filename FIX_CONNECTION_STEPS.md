# Fix Database Connection - Action Required

## Current Status
- ✅ Project URL: `https://sjjzoxcmtgzbyunnmopo.supabase.co`
- ✅ Project appears Active in dashboard
- ❌ Database server not reachable
- ❌ API connection also failing

## Solution: Restart Your Supabase Project

The connection string format is correct, but the database server isn't responding. This often happens when:
1. Project needs a restart
2. Project was recently resumed but connections aren't active yet
3. Network connectivity issues

### Step 1: Restart the Project

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/sjjzoxcmtgzbyunnmopo

2. **Navigate to Project Settings:**
   - Click **Settings** (gear icon)
   - Or go directly to: **Settings → General**

3. **Restart the Project:**
   - Find **"Restart project"** section
   - Click **"Restart project"** button
   - ⚠️ **Warning:** Project will be unavailable for 2-3 minutes

4. **Wait for Restart:**
   - Wait 3-5 minutes for the project to fully restart
   - You'll see status indicators in the dashboard

### Step 2: Verify Project is Active

After restart:
1. Check project status shows **"Active"**
2. Try accessing **SQL Editor** in Supabase Dashboard
3. If SQL Editor works, the database is ready

### Step 3: Test Connection Again

After restart completes:
```bash
npm run db:test-simple
```

### Step 4: If Still Failing - Reset Password

If restart doesn't work:

1. **Reset Database Password:**
   - Go to **Settings → Database**
   - Click **"Reset database password"**
   - **Save the new password!**

2. **Get Fresh Connection String:**
   - Still in **Settings → Database**
   - Copy **Connection string (URI)**
   - Replace `[YOUR-PASSWORD]` with the NEW password

3. **Update .env:**
   - Update `DATABASE_URL` and `DIRECT_URL` with new connection string
   - Make sure password is URL-encoded (`&` → `%26`)

4. **Test Again:**
   ```bash
   npm run db:test-simple
   ```

---

## Alternative: Check Network/Firewall

If restart doesn't help, it might be a network issue:

1. **Try from Different Network:**
   - Test from home network vs work network
   - Check if corporate firewall blocks port 5432

2. **Use Supabase Connection Pooling:**
   - Try port `6543` instead of `5432`
   - Connection string: `...@db.sjjzoxcmtgzbyunnmopo.supabase.co:6543/postgres?sslmode=require`

3. **Test SQL Editor:**
   - If Supabase Dashboard → SQL Editor works, it's a local network issue
   - If SQL Editor doesn't work, it's a Supabase project issue

---

## Current .env Configuration

Your `.env` file is correctly configured with:
```
DATABASE_URL="postgresql://postgres:6DLn.%26XkA9fgML8@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:6DLn.%26XkA9fgML8@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
```

The format is correct. The issue is that the database server isn't responding, which suggests the project needs a restart.

