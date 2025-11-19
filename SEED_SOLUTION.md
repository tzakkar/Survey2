# Seed Solution - Using Supabase API

## ✅ Problem Solved!

The original `npm run db:seed` fails because Prisma cannot connect directly to the database. However, **we can use Supabase REST API** to seed the data!

## 🎯 Solution: Use API-Based Seed Script

### Quick Start:

```bash
npm run db:seed:api
```

Or directly:
```bash
node seed-complete.js
```

## 📋 What Was Created

### ✅ Working Seed Scripts:

1. **`seed-complete.js`** - Complete seed using Supabase API
   - Creates all 3 questionnaires
   - Creates all 59 questions
   - Handles existing data (deletes and reseeds)
   - Uses Supabase REST API (works even if direct DB connection fails)

2. **`seed-via-api-fixed.js`** - Simplified version (sample data)

### ✅ What Gets Created:

- **Staff Questionnaire**: 23 questions
- **Manager Questionnaire**: 17 questions  
- **HR Questionnaire**: 19 questions
- **Total**: 59 questions with bilingual content (EN/AR)
- **Options**: All multiple choice and scale questions have options

## 🚀 Usage

### Option 1: Use API Seed (Recommended - Works Now)

```bash
npm run db:seed:api
```

This uses Supabase REST API and works even if direct database connection fails.

### Option 2: Use Prisma Seed (When DB Connection Works)

```bash
npm run db:seed
```

This requires direct database connection to work.

## ⚠️ Important Notes

1. **Tables Must Exist First:**
   - Run `supabase-migration.sql` in Supabase Dashboard SQL Editor
   - Or run `npm run db:migrate` (if DB connection works)

2. **Network Issues:**
   - If you get timeout errors, wait a moment and try again
   - The API may be temporarily unavailable

3. **Existing Data:**
   - The script automatically deletes existing questionnaires before seeding
   - This ensures clean data

## 🔍 Troubleshooting

### If seed fails with "table not found":
1. Verify tables exist in Supabase Dashboard → Table Editor
2. Check table names are correct (case-sensitive: `Questionnaire`, `Question`, `Option`)

### If seed fails with timeout:
1. Wait a few minutes and try again
2. Check your internet connection
3. Verify Supabase project is active

### If seed fails with duplicate key:
- The script should handle this automatically
- If it doesn't, delete existing data in Supabase Dashboard first

## ✅ Success Indicators

When seed completes successfully, you should see:

```
✅ COMPLETE SEED SUCCESSFUL!
Created:
  ✅ Staff Questionnaire (23 questions)
  ✅ Manager Questionnaire (17 questions)
  ✅ HR Questionnaire (19 questions)
```

## 🧪 Test Your Application

After seeding, test:

- http://localhost:3000/survey/staff-questionnaire?lang=en
- http://localhost:3000/survey/manager-questionnaire?lang=en
- http://localhost:3000/survey/hr-questionnaire?lang=en
- http://localhost:3000/admin/questionnaires

---

**The seed is now working via Supabase API!** 🎉

