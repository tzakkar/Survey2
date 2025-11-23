-- =====================================================
-- COMPLETE SETUP: Sections for Staff Questionnaire
-- =====================================================
-- Run this ENTIRE file in Supabase Dashboard → SQL Editor
-- This will:
-- 1. Create the Section table (if not exists)
-- 2. Add sectionId to Question table
-- 3. Create all 11 sections for staff questionnaire
-- 4. Assign questions to sections
-- =====================================================

-- =====================================================
-- PART 1: Create Section Table and Update Question Table
-- =====================================================

-- Create Section Table
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

-- Add sectionId column to Question table (nullable for backward compatibility)
ALTER TABLE "Question" 
ADD COLUMN IF NOT EXISTS "sectionId" TEXT;

-- Add foreign key constraint for sectionId
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Section_questionnaireId_order_idx" ON "Section"("questionnaireId", "order");
CREATE INDEX IF NOT EXISTS "Question_sectionId_idx" ON "Question"("sectionId");

-- =====================================================
-- PART 2: Helper Function
-- =====================================================

-- Helper function to generate CUID-like IDs
CREATE OR REPLACE FUNCTION generate_cuid() RETURNS TEXT AS $$
DECLARE
    timestamp_part TEXT;
    random_part TEXT;
BEGIN
    timestamp_part := to_hex(extract(epoch from now())::bigint);
    random_part := substr(md5(random()::text), 1, 9);
    RETURN 'c' || timestamp_part || random_part;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 3: Create Sections and Assign Questions
-- =====================================================

DO $$
DECLARE
    staff_q_id TEXT;
    section_id TEXT;
BEGIN
    -- Get staff questionnaire ID
    SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';
    
    IF staff_q_id IS NULL THEN
        RAISE EXCEPTION 'Staff questionnaire not found. Please create it first.';
    END IF;

    -- Delete existing sections if re-running
    DELETE FROM "Section" WHERE "questionnaireId" = staff_q_id;

    -- SECTION A: DEMOGRAPHIC INFORMATION
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        1,
        'SECTION A: DEMOGRAPHIC INFORMATION',
        'القسم أ: المعلومات الديموغرافية',
        NULL,
        NULL
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 1 AND 10;

    -- SECTION B: UNDERSTANDING OF COMPETENCY FRAMEWORK
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        2,
        'SECTION B: UNDERSTANDING OF COMPETENCY FRAMEWORK',
        'القسم ب: فهم إطار الكفاءات',
        'Instructions: Please indicate your level of agreement with the following statements about your understanding of the competency framework. Scale: 1 = Strongly Disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5 = Strongly Agree',
        'التعليمات: يرجى الإشارة إلى مستوى موافقتك على العبارات التالية حول فهمك لإطار الكفاءات. المقياس: 1 = أختلف بشدة | 2 = أختلف | 3 = محايد | 4 = أتفق | 5 = أتفق بشدة'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 11 AND 16;

    -- SECTION C: QUALITY OF FRAMEWORK IMPLEMENTATION
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        3,
        'SECTION C: QUALITY OF FRAMEWORK IMPLEMENTATION',
        'القسم ج: جودة تنفيذ الإطار',
        'Instructions: Please rate your experience with how the competency framework was introduced and implemented.',
        'التعليمات: يرجى تقييم تجربتك مع كيفية تقديم وتنفيذ إطار الكفاءات.'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 17 AND 24;

    -- SECTION D: EMPLOYEE PERCEPTIONS AND ATTITUDES
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        4,
        'SECTION D: EMPLOYEE PERCEPTIONS AND ATTITUDES',
        'القسم د: تصورات الموظفين والمواقف',
        'Instructions: Please indicate your personal views about the competency framework.',
        'التعليمات: يرجى الإشارة إلى آرائك الشخصية حول إطار الكفاءات.'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 25 AND 34;

    -- SECTION E: EMPLOYEE ENGAGEMENT (MEDIATING VARIABLE)
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        5,
        'SECTION E: EMPLOYEE ENGAGEMENT (MEDIATING VARIABLE)',
        'القسم هـ: مشاركة الموظفين (متغير وسيط)',
        'Instructions: Please rate your level of engagement at work.',
        'التعليمات: يرجى تقييم مستوى مشاركتك في العمل.'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 35 AND 40;

    -- SECTION F: WORK MOTIVATION (MEDIATING VARIABLE)
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        6,
        'SECTION F: WORK MOTIVATION (MEDIATING VARIABLE)',
        'القسم و: الدافع للعمل (متغير وسيط)',
        'Instructions: Please indicate your level of motivation at work.',
        'التعليمات: يرجى الإشارة إلى مستوى دوافعك في العمل.'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 41 AND 45;

    -- SECTION G: SELF-EFFICACY (MEDIATING VARIABLE)
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        7,
        'SECTION G: SELF-EFFICACY (MEDIATING VARIABLE)',
        'القسم ز: الكفاءة الذاتية (متغير وسيط)',
        'Instructions: Please rate your confidence in your ability to perform your job.',
        'التعليمات: يرجى تقييم ثقتك في قدرتك على أداء وظيفتك.'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 46 AND 49;

    -- SECTION H: EMPLOYEE PERFORMANCE (SELF-ASSESSMENT)
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        8,
        'SECTION H: EMPLOYEE PERFORMANCE (SELF-ASSESSMENT)',
        'القسم ح: أداء الموظف (التقييم الذاتي)',
        'Instructions: Please honestly rate your own performance at work over the past 6 months.',
        'التعليمات: يرجى تقييم أدائك في العمل بصدق على مدى الأشهر الستة الماضية.'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 50 AND 61;

    -- SECTION I: IMPACT OF COMPETENCY FRAMEWORK ON PERFORMANCE
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        9,
        'SECTION I: IMPACT OF COMPETENCY FRAMEWORK ON PERFORMANCE',
        'القسم ط: تأثير إطار الكفاءات على الأداء',
        'Instructions: Please rate how the competency framework has affected your performance.',
        'التعليمات: يرجى تقييم كيفية تأثير إطار الكفاءات على أدائك.'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 62 AND 67;

    -- SECTION J: ORGANIZATIONAL SUPPORT
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        10,
        'SECTION J: ORGANIZATIONAL SUPPORT',
        'القسم ي: الدعم التنظيمي',
        'Instructions: Please rate the level of organizational support you receive.',
        'التعليمات: يرجى تقييم مستوى الدعم التنظيمي الذي تتلقاه.'
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 68 AND 72;

    -- SECTION K: OPEN-ENDED QUESTIONS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        11,
        'SECTION K: OPEN-ENDED QUESTIONS',
        'القسم ك: الأسئلة المفتوحة',
        NULL,
        NULL
    );
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" >= 73;

    RAISE NOTICE '✅ Successfully created 11 sections for staff questionnaire';
    RAISE NOTICE '📊 Section A: Questions 1-10 (Demographic Information)';
    RAISE NOTICE '📊 Section B: Questions 11-16 (Understanding of Competency Framework)';
    RAISE NOTICE '📊 Section C: Questions 17-24 (Quality of Framework Implementation)';
    RAISE NOTICE '📊 Section D: Questions 25-34 (Employee Perceptions and Attitudes)';
    RAISE NOTICE '📊 Section E: Questions 35-40 (Employee Engagement)';
    RAISE NOTICE '📊 Section F: Questions 41-45 (Work Motivation)';
    RAISE NOTICE '📊 Section G: Questions 46-49 (Self-Efficacy)';
    RAISE NOTICE '📊 Section H: Questions 50-61 (Employee Performance)';
    RAISE NOTICE '📊 Section I: Questions 62-67 (Impact of Competency Framework)';
    RAISE NOTICE '📊 Section J: Questions 68-72 (Organizational Support)';
    RAISE NOTICE '📊 Section K: Questions 73+ (Open-ended Questions)';
    
END $$;

-- =====================================================
-- VERIFICATION: Check sections and question assignments
-- =====================================================

SELECT 
    s."order" as section_order,
    s."titleEn" as section_title,
    COUNT(q.id) as question_count,
    MIN(q."order") as first_question_order,
    MAX(q."order") as last_question_order
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
GROUP BY s.id, s."order", s."titleEn"
ORDER BY s."order";

