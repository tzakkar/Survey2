-- Supabase Migration SQL Script
-- Run this in Supabase Dashboard → SQL Editor
-- This creates all tables and enums needed for the survey system

-- Step 1: Create Enums (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE "AudienceType" AS ENUM ('STAFF', 'MANAGER', 'HR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'MULTIPLE_CHOICE', 'SCALE_1_5');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "Language" AS ENUM ('EN', 'AR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create Questionnaire Table
CREATE TABLE IF NOT EXISTS "Questionnaire" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "titleEn" TEXT NOT NULL,
  "titleAr" TEXT NOT NULL,
  "descriptionEn" TEXT,
  "descriptionAr" TEXT,
  "audienceType" "AudienceType" NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Step 3: Create Question Table
CREATE TABLE IF NOT EXISTS "Question" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "questionnaireId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "type" "QuestionType" NOT NULL,
  "textEn" TEXT NOT NULL,
  "textAr" TEXT NOT NULL,
  "isRequired" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "Question_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 4: Create Option Table
CREATE TABLE IF NOT EXISTS "Option" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "questionId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "value" TEXT NOT NULL,
  "labelEn" TEXT NOT NULL,
  "labelAr" TEXT NOT NULL,
  CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 5: Create Response Table
CREATE TABLE IF NOT EXISTS "Response" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "questionnaireId" TEXT NOT NULL,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "language" "Language" NOT NULL,
  "metadata" JSONB,
  CONSTRAINT "Response_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 6: Create Answer Table
CREATE TABLE IF NOT EXISTS "Answer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "responseId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "valueText" TEXT,
  "valueOptionId" TEXT,
  CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Answer_valueOptionId_fkey" FOREIGN KEY ("valueOptionId") REFERENCES "Option"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Step 7: Create Indexes
CREATE INDEX IF NOT EXISTS "Questionnaire_slug_idx" ON "Questionnaire"("slug");
CREATE INDEX IF NOT EXISTS "Questionnaire_audienceType_idx" ON "Questionnaire"("audienceType");
CREATE INDEX IF NOT EXISTS "Question_questionnaireId_order_idx" ON "Question"("questionnaireId", "order");
CREATE INDEX IF NOT EXISTS "Option_questionId_order_idx" ON "Option"("questionId", "order");
CREATE INDEX IF NOT EXISTS "Response_questionnaireId_idx" ON "Response"("questionnaireId");
CREATE INDEX IF NOT EXISTS "Response_submittedAt_idx" ON "Response"("submittedAt");
CREATE INDEX IF NOT EXISTS "Answer_responseId_idx" ON "Answer"("responseId");
CREATE INDEX IF NOT EXISTS "Answer_questionId_idx" ON "Answer"("questionId");

-- Step 8: Enable Row Level Security (RLS) - Optional
-- Uncomment if you want to enable RLS policies
-- ALTER TABLE "Questionnaire" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Option" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Response" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Answer" ENABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE 'All tables and indexes have been created.';
  RAISE NOTICE 'Next: Run the seed script or use Supabase API to populate data.';
END $$;

