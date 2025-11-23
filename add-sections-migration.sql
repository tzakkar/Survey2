-- Migration: Add Sections Support
-- Run this in Supabase Dashboard → SQL Editor
-- This adds Section table and updates Question table to support sections

-- Step 1: Create Section Table
CREATE TABLE IF NOT EXISTS "Section" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "questionnaireId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "titleEn" TEXT NOT NULL,
  "titleAr" TEXT NOT NULL,
  "instructionsEn" TEXT,
  "instructionsAr" TEXT,
  CONSTRAINT "Section_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 2: Add sectionId column to Question table (nullable for backward compatibility)
ALTER TABLE "Question" 
ADD COLUMN IF NOT EXISTS "sectionId" TEXT;

-- Step 3: Add foreign key constraint for sectionId
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'Question_sectionId_fkey'
  ) THEN
    ALTER TABLE "Question"
    ADD CONSTRAINT "Question_sectionId_fkey" 
    FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Section_questionnaireId_order_idx" ON "Section"("questionnaireId", "order");
CREATE INDEX IF NOT EXISTS "Question_sectionId_idx" ON "Question"("sectionId");

-- Step 5: Add comments for documentation
COMMENT ON TABLE "Section" IS 'Sections organize questions within a questionnaire with titles and instructions';
COMMENT ON COLUMN "Section"."order" IS 'Order of the section within the questionnaire';
COMMENT ON COLUMN "Section"."instructionsEn" IS 'Instructions for the section in English';
COMMENT ON COLUMN "Section"."instructionsAr" IS 'Instructions for the section in Arabic';
COMMENT ON COLUMN "Question"."sectionId" IS 'Optional reference to the section this question belongs to';

