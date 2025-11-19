# Database Update Guide

This guide explains how to update the database when network connectivity issues prevent direct API access.

## Methods to Update Database

### Method 1: Direct SQL (Recommended when API is blocked)

**Best for:** When Node.js can't reach Supabase API due to network/firewall issues.

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `update-database-direct.sql`
3. Click **Run**
4. This will:
   - Fix all missing options for SCALE_1_5 questions
   - Show verification queries

**Advantages:**
- ✅ Works even when API is blocked
- ✅ Fast and reliable
- ✅ No network dependencies

### Method 2: Node.js Script (When API works)

**Best for:** When network connectivity allows API access.

```bash
# Fix all missing options
npm run db:fix-options

# Test database connection
npm run db:test-connection
```

**Advantages:**
- ✅ Can be automated
- ✅ Works from command line
- ✅ Can be integrated into CI/CD

### Method 3: Admin Panel (When app is running)

**Best for:** Quick fixes from the web interface.

1. Navigate to Admin Panel
2. Use the "Fix Missing Options" button (if implemented)
3. Or use server actions directly

**Advantages:**
- ✅ User-friendly interface
- ✅ No command line needed
- ✅ Real-time feedback

## Current Network Issue

**Problem:** Node.js fetch requests to Supabase API are timing out.

**Symptoms:**
- `TypeError: fetch failed`
- `ConnectTimeoutError`
- Prisma direct connection also fails

**Root Cause:** Network/firewall blocking outbound HTTPS connections from Node.js.

## Solutions Implemented

### 1. Improved Supabase Client (`lib/supabase.ts`)
- ✅ Increased timeout to 60 seconds
- ✅ Added retry logic (2 retries)
- ✅ Better error handling
- ✅ Connection keep-alive headers

### 2. Database Update Utilities (`lib/db-update.ts`)
- ✅ `updateQuestionOptions()` - Update options for a question
- ✅ `createScaleOptionsForQuestion()` - Create 1-5 scale options
- ✅ `fixAllMissingScaleOptions()` - Fix all missing options

### 3. Server Actions (`app/actions/admin.ts`)
- ✅ `fixMissingOptionsForQuestion()` - Fix options for one question
- ✅ `fixAllMissingOptions()` - Fix all missing options
- ✅ Works with Prisma first, falls back to Supabase API

### 4. SQL Scripts
- ✅ `update-database-direct.sql` - Direct SQL execution
- ✅ `fix-question-options.sql` - Fix specific question
- ✅ `verify-options.sql` - Verify options exist

## Quick Fix for Missing Options

### Using SQL (Always works):

```sql
-- Run in Supabase Dashboard → SQL Editor
-- This fixes ALL SCALE_1_5 questions missing options

DO $$
DECLARE
    question_record RECORD;
BEGIN
    FOR question_record IN 
        SELECT id FROM "Question" WHERE type = 'SCALE_1_5'
    LOOP
        -- Delete existing options
        DELETE FROM "Option" WHERE "questionId" = question_record.id;
        
        -- Create new options
        INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
        VALUES
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '1', question_record.id, 1, '1', '1 - Strongly Disagree', '١ - أختلف بشدة'),
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '2', question_record.id, 2, '2', '2 - Disagree', '٢ - أختلف'),
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '3', question_record.id, 3, '3', '3 - Neutral', '٣ - محايد'),
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '4', question_record.id, 4, '4', '4 - Agree', '٤ - أتفق'),
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '5', question_record.id, 5, '5', '5 - Strongly Agree', '٥ - أتفق بشدة');
    END LOOP;
END $$;
```

## Verification

After updating, verify options exist:

```sql
-- Check questions missing options
SELECT 
    q."order",
    q."textEn",
    COUNT(o.id) AS option_count
FROM "Question" q
LEFT JOIN "Option" o ON q.id = o."questionId"
WHERE q.type = 'SCALE_1_5'
GROUP BY q.id, q."order", q."textEn"
HAVING COUNT(o.id) < 5
ORDER BY q."order";
```

## Troubleshooting

### If SQL script fails:
- Check table names are correct (case-sensitive: `"Question"`, `"Option"`)
- Verify you have write permissions
- Check for foreign key constraints

### If API script fails:
- Check network connectivity
- Verify Supabase credentials in `.env`
- Check firewall/proxy settings
- Try increasing timeout in `lib/supabase.ts`

### If server actions fail:
- Check server logs for detailed errors
- Verify Supabase API is accessible
- Check database permissions

## Next Steps

1. **For immediate fixes:** Use SQL scripts in Supabase Dashboard
2. **For automation:** Set up scripts to run when network allows
3. **For production:** Implement admin panel UI for database maintenance

