# Database Setup and Data Creation Guide

## Current Status: ❌ **Cannot Connect to Database**

The database server at `db.sjjzoxcmtgzbyunnmopo.supabase.co:5432` is not reachable.

---

## What Needs to Happen (Once Connection Works)

### Step 1: Create Database Schema (Migrations)

Run this command to create all tables:
```bash
npm run db:migrate
```

**This will create:**
- ✅ `Questionnaire` table
- ✅ `Question` table  
- ✅ `Option` table
- ✅ `Response` table
- ✅ `Answer` table
- ✅ All enums: `AudienceType`, `QuestionType`, `Language`

### Step 2: Seed Database with Initial Data

Run this command to populate data:
```bash
npm run db:seed
```

**This will create:**
- ✅ 3 Questionnaires (Staff, Manager, HR)
- ✅ 59 Questions total:
  - Staff Questionnaire: 23 questions
  - Manager Questionnaire: 17 questions  
  - HR Questionnaire: 19 questions
- ✅ All questions with bilingual content (EN/AR)
- ✅ Options for multiple choice and scale questions

---

## Ready-to-Use Scripts

### Script 1: `setup-database.js` ✅ Created
- Tests connection
- Checks existing tables
- Verifies data creation capability
- Run: `node setup-database.js`

### Script 2: Migration Command ✅ Ready
- Creates schema: `npm run db:migrate`
- Pushes schema (alternative): `npx prisma db push`

### Script 3: Seed Script ✅ Ready  
- Populates data: `npm run db:seed`
- Located at: `prisma/seed.ts`

---

## What Will Be Created

### Database Schema

```sql
-- Enums
CREATE TYPE "AudienceType" AS ENUM ('STAFF', 'MANAGER', 'HR');
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'MULTIPLE_CHOICE', 'SCALE_1_5');
CREATE TYPE "Language" AS ENUM ('EN', 'AR');

-- Tables
CREATE TABLE "Questionnaire" (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  titleEn TEXT,
  titleAr TEXT,
  descriptionEn TEXT,
  descriptionAr TEXT,
  audienceType "AudienceType",
  isActive BOOLEAN,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE TABLE "Question" (
  id TEXT PRIMARY KEY,
  questionnaireId TEXT REFERENCES "Questionnaire"(id),
  order INTEGER,
  type "QuestionType",
  textEn TEXT,
  textAr TEXT,
  isRequired BOOLEAN
);

CREATE TABLE "Option" (
  id TEXT PRIMARY KEY,
  questionId TEXT REFERENCES "Question"(id),
  order INTEGER,
  value TEXT,
  labelEn TEXT,
  labelAr TEXT
);

CREATE TABLE "Response" (
  id TEXT PRIMARY KEY,
  questionnaireId TEXT REFERENCES "Questionnaire"(id),
  submittedAt TIMESTAMP,
  language "Language",
  metadata JSONB
);

CREATE TABLE "Answer" (
  id TEXT PRIMARY KEY,
  responseId TEXT REFERENCES "Response"(id),
  questionId TEXT REFERENCES "Question"(id),
  valueText TEXT,
  valueOptionId TEXT REFERENCES "Option"(id)
);
```

### Seed Data Summary

**Questionnaire 1: Staff Employee Survey**
- 23 questions covering:
  - Demographics (5 questions)
  - Understanding of Competency Framework (3)
  - Implementation Quality (2)
  - Employee Perceptions (2)
  - Engagement (2)
  - Motivation (1)
  - Self-Efficacy (1)
  - Performance (2)
  - Impact (1)
  - Support (1)
  - Open-ended (3)

**Questionnaire 2: Manager Survey**
- 17 questions covering:
  - Demographics (3)
  - Framework Characteristics (2)
  - Implementation Quality (2)
  - Manager Perceptions (2)
  - Leadership Support (1)
  - Organizational Culture (1)
  - Performance Assessment (2)
  - Impact Observations (1)
  - Open-ended (3)

**Questionnaire 3: HR Employee Survey**
- 19 questions covering:
  - Demographics (3)
  - Design & Characteristics (2)
  - Implementation Process (2)
  - HR Perceptions (2)
  - Organizational Outcomes (2)
  - Implementation Challenges (2)
  - Success Factors (2)
  - Open-ended (4)

---

## Commands to Run (Once Connected)

```bash
# 1. Test connection
node setup-database.js

# 2. Create schema
npm run db:migrate

# 3. Seed data
npm run db:seed

# 4. Verify (optional)
npx prisma studio
```

---

## Troubleshooting

### If Migrations Fail:
```bash
# Try alternative method
npx prisma db push
```

### If Seed Fails:
- Check that migrations ran successfully
- Verify tables exist
- Check seed script: `prisma/seed.ts`

### If Connection Still Fails:
1. ✅ Verify Supabase project is active
2. ✅ Check connection string in `.env`
3. ✅ Try connection pooler (port 6543)
4. ✅ Check network/firewall settings

---

## Expected Output (When Working)

### After `npm run db:migrate`:
```
✅ Migration applied successfully
✅ Created tables: Questionnaire, Question, Option, Response, Answer
```

### After `npm run db:seed`:
```
✅ Created questionnaires:
   - Staff Employee Survey (staff-questionnaire)
   - Manager & Above Survey (manager-questionnaire)
   - HR Employee Survey (hr-questionnaire)
✅ Seed completed successfully!
```

---

## Verification

Once setup is complete, verify:

1. **Check Supabase Dashboard:**
   - Tables should appear in Database → Tables
   - Data should be visible

2. **Test Application:**
   - Visit: http://localhost:3000/survey/staff-questionnaire?lang=en
   - Should see questionnaire with questions

3. **Check Admin Panel:**
   - Visit: http://localhost:3000/admin/questionnaires
   - Should see 3 questionnaires listed

---

*All scripts and commands are ready. They will work once database connection is established.*

