# Alternative Seed Methods

## Problem: Network Timeouts with API Seed

The `seed-complete.js` script is experiencing network timeouts when connecting to Supabase API. Here are alternative solutions:

---

## ✅ Solution 1: Use SQL Seed Script (Recommended)

### Step 1: Run SQL Seed in Supabase Dashboard

1. Go to: **Supabase Dashboard → SQL Editor**
2. Open: `supabase-seed.sql`
3. Copy the entire SQL script
4. Paste into SQL Editor
5. Click **Run**

This creates:
- ✅ 3 Questionnaires (Staff, Manager, HR)
- ✅ Sample questions with options
- ✅ Handles conflicts (won't error if already exists)

### Step 2: Add More Questions (Optional)

You can add more questions manually via:
- **Supabase Dashboard → Table Editor → Question**
- Or expand the SQL script

---

## ✅ Solution 2: Manual Seeding via Supabase Dashboard

### Create Questionnaires:

1. Go to: **Supabase Dashboard → Table Editor → Questionnaire**
2. Click **Insert → Insert row**
3. Fill in:
   - **slug**: `staff-questionnaire`
   - **titleEn**: `Survey on Competency Frameworks...`
   - **titleAr**: `استبيان عن أطر الكفاءات...`
   - **audienceType**: `STAFF`
   - **isActive**: `true`
   - **createdAt**: Click "Now"
   - **updatedAt**: Click "Now"
4. Click **Save**

Repeat for Manager and HR questionnaires.

### Create Questions:

1. Go to: **Table Editor → Question**
2. Click **Insert → Insert row**
3. Fill in question details
4. For options, go to **Option** table and link to question

---

## ✅ Solution 3: Fix Network Issues and Retry API Seed

If network connectivity improves:

```bash
npm run db:seed:api
```

The script now includes:
- ✅ Retry logic for network errors
- ✅ Better error handling
- ✅ Verification before creating

---

## 📋 Quick Comparison

| Method | Pros | Cons |
|--------|------|------|
| **SQL Script** | ✅ Fast, reliable, no network issues | ⚠️ Need to expand for all questions |
| **Manual Dashboard** | ✅ Visual, easy to verify | ⚠️ Time-consuming for many questions |
| **API Script** | ✅ Automated, complete | ❌ Network timeout issues |

---

## 🎯 Recommended Approach

1. **Start with SQL Script** (`supabase-seed.sql`)
   - Creates basic structure
   - Quick and reliable

2. **Expand with API Script** (when network is stable)
   - Run `npm run db:seed:api` to add all questions
   - Or manually add questions via Dashboard

3. **Verify in Dashboard**
   - Check Table Editor
   - Test application: http://localhost:3000

---

*The SQL seed script is the most reliable method when API connections are unstable.*

