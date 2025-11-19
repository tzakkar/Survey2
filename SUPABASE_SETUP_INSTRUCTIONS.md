# Supabase Setup Instructions Using API Keys

## ✅ API Keys Received

- **Publishable Key:** `sb_publishable_enVwtG3Uu6QE9xj0hPWf4w_ZdAREIqD`
- **Secret Key:** `sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K`
- **Project URL:** `https://sjjzoxcmtgzbyunnmopo.supabase.co`

---

## 🎯 Solution: Create Tables via Supabase Dashboard

Since direct database connection is not working, use the Supabase Dashboard SQL Editor to create tables:

### Step 1: Create Database Schema

1. **Go to Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/sjjzoxcmtgzbyunnmopo
   - Navigate to: **SQL Editor**

2. **Run Migration SQL:**
   - Open file: `supabase-migration.sql`
   - Copy the entire SQL script
   - Paste into SQL Editor
   - Click **Run** or press `Ctrl+Enter`

3. **Verify Tables Created:**
   - Go to: **Table Editor**
   - You should see 5 tables:
     - `Questionnaire`
     - `Question`
     - `Option`
     - `Response`
     - `Answer`

### Step 2: Seed Data (Option A - Using Supabase Dashboard)

1. **Go to Table Editor → Questionnaire**
2. **Click "Insert" → "Insert row"**
3. **Manually add questionnaires** (or use Option B below)

### Step 2: Seed Data (Option B - Using API Script)

Once tables exist, you can use the API to create data:

```bash
# Tables must exist first!
node create-data-via-api.js
```

### Step 2: Seed Data (Option C - Using Prisma - Recommended)

Once database connection works:

```bash
npm run db:seed
```

---

## 🔧 Alternative: Fix Database Connection

### Option 1: Check Supabase Project Status

1. Go to: https://supabase.com/dashboard/project/sjjzoxcmtgzbyunnmopo
2. Check project status:
   - ✅ **Active** → Continue
   - ⚠️ **Paused** → Click "Resume"
   - ❌ **Deleted** → Create new project

### Option 2: Get Fresh Connection String

1. In Supabase Dashboard → **Project Settings** → **Database**
2. Under **Connection string** → Select **URI**
3. Copy the connection string
4. Update `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:PASSWORD@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
   DIRECT_URL="postgresql://postgres:PASSWORD@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
   ```

### Option 3: Use Connection Pooler

Try using port 6543 (connection pooler):

1. In Supabase Dashboard → **Project Settings** → **Database**
2. Under **Connection pooling** → Copy connection string
3. Update `.env` with pooler URL

---

## 📋 Quick Setup Checklist

- [ ] ✅ API keys received
- [ ] ⏳ Create tables via SQL Editor (`supabase-migration.sql`)
- [ ] ⏳ Verify tables exist in Table Editor
- [ ] ⏳ Seed data (choose one method above)
- [ ] ⏳ Test application: http://localhost:3000

---

## 🚀 Once Tables Are Created

### Test the Application:

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Visit survey pages:**
   - http://localhost:3000/survey/staff-questionnaire?lang=en
   - http://localhost:3000/survey/manager-questionnaire?lang=en
   - http://localhost:3000/survey/hr-questionnaire?lang=en

3. **Admin panel:**
   - http://localhost:3000/admin/questionnaires

### Create Data via API:

Once tables exist, you can use the Supabase client:

```javascript
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  'https://sjjzoxcmtgzbyunnmopo.supabase.co',
  'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K'
)

// Create questionnaire
const { data, error } = await supabase
  .from('questionnaire')
  .insert({
    slug: 'staff-questionnaire',
    titleEn: 'Staff Survey',
    titleAr: 'استبيان الموظفين',
    audienceType: 'STAFF',
    isActive: true
  })
```

---

## 📝 Files Created

1. ✅ `supabase-migration.sql` - SQL script to create all tables
2. ✅ `create-data-via-api.js` - Script to create data via API (requires tables)
3. ✅ `test-supabase-client.js` - Test Supabase client connection
4. ✅ `SUPABASE_SETUP_INSTRUCTIONS.md` - This file

---

## 💡 Recommended Approach

1. **Create tables:** Use `supabase-migration.sql` in SQL Editor
2. **Seed data:** Use `npm run db:seed` (once DB connection works) OR manually via Dashboard
3. **Verify:** Check tables in Table Editor, test application

---

*All scripts and SQL are ready. Run the SQL migration in Supabase Dashboard to create tables.*

