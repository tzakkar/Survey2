# Fix: Sections and Instructions Not Showing

If you've run the migration but don't see sections or instructions on the survey page, follow these steps:

## Step 1: Verify Migration Was Run

Run this query in Supabase SQL Editor to check if the Section table exists:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'Section';
```

If the table doesn't exist, run `add-sections-migration.sql` first.

## Step 2: Check Current Status

Run `check-sections-status.sql` to see:
- If sections exist
- How many questions are assigned to sections
- Which questions are missing sections

## Step 3: Create Sections and Assign Questions

Run `add-staff-sections-complete.sql` to:
- Create all 11 sections (A through K)
- Assign questions to their correct sections
- Add proper instructions for each section

**Important**: This script assumes questions are ordered 1-76. If your questions have different order numbers, you'll need to adjust the ranges in the UPDATE statements.

## Step 4: Verify Question Orders

Before running the script, check your actual question orders:

```sql
SELECT "order", "textEn" 
FROM "Question" 
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
ORDER BY "order";
```

Then adjust the ranges in `add-staff-sections-complete.sql`:
- Section A: Questions 1-10
- Section B: Questions 11-16
- Section C: Questions 17-24
- etc.

## Step 5: Check Browser Console

After running the SQL, check your browser's developer console (F12) when loading the survey page. You should see:
- `✅ Fetched X sections for questionnaire`
- `📊 Questionnaire data: { sectionsCount: X, questionsCount: Y, ... }`

If sectionsCount is 0, the sections weren't created or fetched correctly.

## Step 6: Clear Cache and Refresh

1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Restart your Next.js dev server if needed

## Step 7: Verify Data Structure

Run this query to see the exact structure:

```sql
SELECT 
    s."order" as section_order,
    s."titleEn",
    COUNT(q.id) as question_count
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
GROUP BY s.id, s."order", s."titleEn"
ORDER BY s."order";
```

## Common Issues

### Issue 1: Sections exist but questions aren't assigned
**Solution**: Run the UPDATE statements in `add-staff-sections-complete.sql` again, or manually assign:

```sql
UPDATE "Question" 
SET "sectionId" = (SELECT id FROM "Section" WHERE "order" = 1 AND "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire'))
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
AND "order" BETWEEN 1 AND 10;
```

### Issue 2: Section table doesn't exist
**Solution**: Run `add-sections-migration.sql` first

### Issue 3: Questions have wrong order numbers
**Solution**: Check your actual question orders and adjust the ranges in the SQL script

### Issue 4: Sections show in database but not on page
**Solution**: 
1. Check browser console for errors
2. Verify the API is returning sections (check Network tab)
3. Make sure you're using the latest code (sections support was just added)

## Quick Fix Script

If you want to quickly assign all questions to sections based on their order, you can use this pattern:

```sql
-- Section A (1-10)
UPDATE "Question" SET "sectionId" = (
    SELECT id FROM "Section" 
    WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
    AND "order" = 1
)
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
AND "order" BETWEEN 1 AND 10;
```

Repeat for each section with the correct order number and range.

