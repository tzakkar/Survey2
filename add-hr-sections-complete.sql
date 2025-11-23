-- Complete: Add All Sections for HR Questionnaire
-- Run this AFTER running add-sections-migration.sql (if not already done)
-- This creates all 8 sections (A-H) based on the HR questionnaire document

-- Helper function to generate CUID-like IDs (if not already exists)
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

DO $$
DECLARE
    hr_q_id TEXT;
    section_id TEXT;
BEGIN
    -- Get HR questionnaire ID
    SELECT id INTO hr_q_id FROM "Questionnaire" WHERE slug = 'hr-questionnaire';
    
    IF hr_q_id IS NULL THEN
        RAISE EXCEPTION 'HR questionnaire not found. Please create it first.';
    END IF;

    -- Delete existing sections if re-running
    DELETE FROM "Section" WHERE "questionnaireId" = hr_q_id;

    -- SECTION A: DEMOGRAPHIC INFORMATION
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        hr_q_id,
        1,
        'SECTION A: DEMOGRAPHIC INFORMATION',
        'القسم أ: المعلومات الديموغرافية',
        NULL,
        NULL
    );
    -- Assign questions 1-10 to Section A
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = hr_q_id 
    AND "order" BETWEEN 1 AND 10;

    -- SECTION B: COMPETENCY FRAMEWORK DESIGN AND CHARACTERISTICS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        hr_q_id,
        2,
        'SECTION B: COMPETENCY FRAMEWORK DESIGN AND CHARACTERISTICS',
        'القسم ب: تصميم إطار الكفاءات وخصائصه',
        'Instructions: Please indicate your level of agreement with the following statements about your organization''s competency framework design. Scale: 1 = Strongly Disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5 = Strongly Agree',
        'التعليمات: يرجى الإشارة إلى مستوى موافقتك على العبارات التالية حول تصميم إطار الكفاءات في منظمتك. المقياس: 1 = أختلف بشدة | 2 = أختلف | 3 = محايد | 4 = أتفق | 5 = أتفق بشدة'
    );
    -- Assign questions 11-22 to Section B (12 questions: B1-B12)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = hr_q_id 
    AND "order" BETWEEN 11 AND 22;

    -- SECTION C: IMPLEMENTATION PROCESS AND QUALITY
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        hr_q_id,
        3,
        'SECTION C: IMPLEMENTATION PROCESS AND QUALITY',
        'القسم ج: عملية التطبيق والجودة',
        'Instructions: Please rate the quality and effectiveness of the competency framework implementation process.',
        'التعليمات: يرجى تقييم جودة وفعالية عملية تطبيق إطار الكفاءات.'
    );
    -- Assign questions 23-34 to Section C (12 questions: C1-C12)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = hr_q_id 
    AND "order" BETWEEN 23 AND 34;

    -- SECTION D: HR PROFESSIONAL PERCEPTIONS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        hr_q_id,
        4,
        'SECTION D: HR PROFESSIONAL PERCEPTIONS',
        'القسم د: تصورات متخصص الموارد البشرية',
        'Instructions: Please indicate your professional assessment of the competency framework.',
        'التعليمات: يرجى الإشارة إلى تقييمك المهني لإطار الكفاءات.'
    );
    -- Assign questions 35-44 to Section D (10 questions: D1-D10)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = hr_q_id 
    AND "order" BETWEEN 35 AND 44;

    -- SECTION E: ORGANIZATIONAL OUTCOMES
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        hr_q_id,
        5,
        'SECTION E: ORGANIZATIONAL OUTCOMES',
        'القسم هـ: النتائج التنظيمية',
        'Instructions: Please assess the impact of the competency framework on organizational outcomes.',
        'التعليمات: يرجى تقييم تأثير إطار الكفاءات على النتائج التنظيمية.'
    );
    -- Assign questions 45-54 to Section E (10 questions: E1-E10)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = hr_q_id 
    AND "order" BETWEEN 45 AND 54;

    -- SECTION F: IMPLEMENTATION CHALLENGES
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        hr_q_id,
        6,
        'SECTION F: IMPLEMENTATION CHALLENGES',
        'القسم و: تحديات التطبيق',
        'Instructions: Please rate the extent to which the following challenges were experienced during implementation. Scale: 1 = Not a Challenge | 2 = Minor Challenge | 3 = Moderate Challenge | 4 = Significant Challenge | 5 = Major Challenge',
        'التعليمات: يرجى تقييم مدى مواجهة التحديات التالية أثناء التطبيق. المقياس: 1 = ليس تحديًا | 2 = تحدي بسيط | 3 = تحدي متوسط | 4 = تحدي كبير | 5 = تحدي كبير جدًا'
    );
    -- Assign questions 55-64 to Section F (10 questions: F1-F10)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = hr_q_id 
    AND "order" BETWEEN 55 AND 64;

    -- SECTION G: SUCCESS FACTORS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        hr_q_id,
        7,
        'SECTION G: SUCCESS FACTORS',
        'القسم ز: عوامل النجاح',
        'Instructions: Please rate the importance of the following factors for successful competency framework implementation. Scale: 1 = Not Important | 2 = Slightly Important | 3 = Moderately Important | 4 = Very Important | 5 = Critically Important',
        'التعليمات: يرجى تقييم أهمية العوامل التالية للنجاح في تطبيق إطار الكفاءات. المقياس: 1 = غير مهم | 2 = مهم قليلاً | 3 = مهم بشكل متوسط | 4 = مهم جدًا | 5 = مهم بشكل حاسم'
    );
    -- Assign questions 65-74 to Section G (10 questions: G1-G10)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = hr_q_id 
    AND "order" BETWEEN 65 AND 74;

    -- SECTION H: OPEN-ENDED QUESTIONS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        hr_q_id,
        8,
        'SECTION H: OPEN-ENDED QUESTIONS',
        'القسم ح: الأسئلة المفتوحة',
        NULL,
        NULL
    );
    -- Assign questions 75-79 to Section H (5 open-ended questions)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = hr_q_id 
    AND "order" >= 75;

    RAISE NOTICE '✅ Successfully created 8 sections for HR questionnaire';
    RAISE NOTICE '📊 Section A: Questions 1-10 (Demographic Information)';
    RAISE NOTICE '📊 Section B: Questions 11-22 (Competency Framework Design and Characteristics)';
    RAISE NOTICE '📊 Section C: Questions 23-34 (Implementation Process and Quality)';
    RAISE NOTICE '📊 Section D: Questions 35-44 (HR Professional Perceptions)';
    RAISE NOTICE '📊 Section E: Questions 45-54 (Organizational Outcomes)';
    RAISE NOTICE '📊 Section F: Questions 55-64 (Implementation Challenges)';
    RAISE NOTICE '📊 Section G: Questions 65-74 (Success Factors)';
    RAISE NOTICE '📊 Section H: Questions 75+ (Open-ended Questions)';
    
END $$;

-- Verification: Check sections and question assignments
SELECT 
    s."order" as section_order,
    s."titleEn" as section_title,
    COUNT(q.id) as question_count,
    MIN(q."order") as first_question_order,
    MAX(q."order") as last_question_order
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'hr-questionnaire')
GROUP BY s.id, s."order", s."titleEn"
ORDER BY s."order";

