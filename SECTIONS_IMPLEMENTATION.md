# Sections and Instructions Implementation

This document describes the implementation of sections and instructions for questionnaires, specifically for the staff questionnaire.

## Overview

The system now supports organizing questions into sections with titles and instructions. This allows for better structure and user guidance in surveys.

## Changes Made

### 1. Database Schema Updates

**Prisma Schema (`prisma/schema.prisma`)**
- Added `Section` model with:
  - `id`, `questionnaireId`, `order`
  - `titleEn`, `titleAr` (section titles in both languages)
  - `instructionsEn`, `instructionsAr` (optional instructions)
- Updated `Question` model to include:
  - `sectionId` (optional, nullable for backward compatibility)
  - Relationship to `Section` model

### 2. Component Updates

**SurveyForm Component (`components/SurveyForm.tsx`)**
- Updated to group questions by sections
- Displays section headers with titles
- Shows section instructions when available
- Maintains backward compatibility with questions that don't have sections
- Questions are sorted within each section by their order

### 3. Server Actions Updates

**Survey Actions (`app/actions/survey.ts`)**
- Updated `getQuestionnaireBySlug` to fetch sections
- Includes sections in both Prisma and Supabase API queries
- Returns sections ordered by their `order` field

### 4. Database Migration

**Migration File (`add-sections-migration.sql`)**
- Creates `Section` table
- Adds `sectionId` column to `Question` table (nullable)
- Creates necessary indexes for performance
- Adds foreign key constraints

## How to Use

### Step 1: Run the Migration

Execute the migration SQL in your Supabase Dashboard → SQL Editor:

```sql
-- Run add-sections-migration.sql
```

This creates the `Section` table and updates the `Question` table.

### Step 2: Add Sections to Your Questionnaire

You can add sections using SQL. See `add-staff-sections-example.sql` for a complete example.

Example:
```sql
INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
VALUES (
    generate_cuid(),
    'your-questionnaire-id',
    1,
    'SECTION I: DEMOGRAPHIC INFORMATION',
    'القسم الأول: المعلومات الديموغرافية',
    'Please provide the following demographic information.',
    'يرجى تقديم المعلومات الديموغرافية التالية.'
);
```

### Step 3: Assign Questions to Sections

Update questions to reference their section:

```sql
UPDATE "Question" 
SET "sectionId" = 'section-id-here'
WHERE "questionnaireId" = 'questionnaire-id'
AND "order" BETWEEN 1 AND 10;  -- Adjust range as needed
```

### Step 4: Verify

After adding sections and assigning questions:
1. Visit your survey page
2. You should see sections with headers and instructions
3. Questions should be grouped under their respective sections

## Staff Questionnaire Structure

Based on the questionnaire document, the staff questionnaire should have:

1. **Section I**: Individual/Demographic Information (20 questions)
2. **Section II**: Competency Assessment (5 questions)
3. **Section III**: Performance Evaluation (5 questions)
4. **Section IV**: Employee Development and Training (5 questions)
5. **Section V**: Work Environment and Culture (5 questions)
6. **Section VI**: Leadership and Management (5 questions)
7. **Section VII**: Job Satisfaction and Engagement (5 questions)
8. **Section VIII**: Compensation and Benefits (5 questions)
9. **Section IX**: Overall Satisfaction (5 questions)
10. **Section X**: Open-ended Questions (5 questions)

**Note**: Adjust the question order ranges in `add-staff-sections-example.sql` to match your actual question orders in the database.

## Backward Compatibility

- Questions without a `sectionId` will still display (grouped at the end)
- Existing questionnaires without sections will continue to work
- The `sectionId` field is nullable, so no breaking changes

## Next Steps

1. Run the migration SQL
2. Review your current question orders in the database
3. Update `add-staff-sections-example.sql` with correct question order ranges
4. Run the example SQL to create sections for staff questionnaire
5. Test the survey form to verify sections display correctly

## Troubleshooting

**Sections not showing?**
- Verify sections were created in the database
- Check that questions have `sectionId` set
- Ensure `getQuestionnaireBySlug` is returning sections

**Questions in wrong sections?**
- Verify question `order` values match your UPDATE statements
- Check that `sectionId` values are correct

**Instructions not displaying?**
- Verify `instructionsEn` or `instructionsAr` are not NULL
- Check the language parameter in the survey page

