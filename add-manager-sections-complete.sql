-- Complete: Add All Sections for Manager Questionnaire
-- Run this AFTER running add-sections-migration.sql (if not already done)
-- This creates all 9 sections (A-I) based on the Manager questionnaire document

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
    manager_q_id TEXT;
    section_id TEXT;
BEGIN
    -- Get Manager questionnaire ID
    SELECT id INTO manager_q_id FROM "Questionnaire" WHERE slug = 'manager-questionnaire';
    
    IF manager_q_id IS NULL THEN
        RAISE EXCEPTION 'Manager questionnaire not found. Please create it first.';
    END IF;

    -- Delete existing sections if re-running
    DELETE FROM "Section" WHERE "questionnaireId" = manager_q_id;

    -- SECTION A: DEMOGRAPHIC INFORMATION
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        1,
        'SECTION A: DEMOGRAPHIC INFORMATION',
        'القسم أ: المعلومات الديموغرافية',
        NULL,
        NULL
    );
    -- Assign questions 1-10 to Section A
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" BETWEEN 1 AND 10;

    -- SECTION B: COMPETENCY FRAMEWORK CHARACTERISTICS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        2,
        'SECTION B: COMPETENCY FRAMEWORK CHARACTERISTICS',
        'القسم ب: خصائص إطار الكفاءات',
        'Instructions: Please indicate your level of agreement with the following statements about your organization''s competency framework. Scale: 1 = Strongly Disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5 = Strongly Agree',
        'التعليمات: يرجى الإشارة إلى مستوى موافقتك على العبارات التالية حول إطار الكفاءات في منظمتك. المقياس: 1 = أختلف بشدة | 2 = أختلف | 3 = محايد | 4 = أتفق | 5 = أتفق بشدة'
    );
    -- Assign questions 11-20 to Section B (10 questions: B1-B10)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" BETWEEN 11 AND 20;

    -- SECTION C: IMPLEMENTATION QUALITY
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        3,
        'SECTION C: IMPLEMENTATION QUALITY',
        'القسم ج: جودة التطبيق',
        'Instructions: Please rate the quality of competency framework implementation in your organization.',
        'التعليمات: يرجى تقييم جودة تطبيق إطار الكفاءات في منظمتك.'
    );
    -- Assign questions 21-30 to Section C (10 questions: C1-C10)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" BETWEEN 21 AND 30;

    -- SECTION D: MANAGER PERCEPTIONS AND ATTITUDES
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        4,
        'SECTION D: MANAGER PERCEPTIONS AND ATTITUDES',
        'القسم د: تصورات المدير والمواقف',
        'Instructions: Please indicate your personal views about the competency framework.',
        'التعليمات: يرجى الإشارة إلى آرائك الشخصية حول إطار الكفاءات.'
    );
    -- Assign questions 31-40 to Section D (10 questions: D1-D10)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" BETWEEN 31 AND 40;

    -- SECTION E: LEADERSHIP SUPPORT (MODERATING VARIABLE)
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        5,
        'SECTION E: LEADERSHIP SUPPORT (MODERATING VARIABLE)',
        'القسم هـ: الدعم القيادي (متغير وسيط)',
        'Instructions: Please assess the level of leadership support for the competency framework.',
        'التعليمات: يرجى تقييم مستوى الدعم القيادي لإطار الكفاءات.'
    );
    -- Assign questions 41-45 to Section E (5 questions: E1-E5)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" BETWEEN 41 AND 45;

    -- SECTION F: ORGANIZATIONAL CULTURE (MODERATING VARIABLE)
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        6,
        'SECTION F: ORGANIZATIONAL CULTURE (MODERATING VARIABLE)',
        'القسم و: الثقافة التنظيمية (متغير وسيط)',
        'Instructions: Please rate your organization''s culture regarding performance and development.',
        'التعليمات: يرجى تقييم ثقافة منظمتك فيما يتعلق بالأداء والتطوير.'
    );
    -- Assign questions 46-50 to Section F (5 questions: F1-F5)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" BETWEEN 46 AND 50;

    -- SECTION G: EMPLOYEE PERFORMANCE ASSESSMENT
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        7,
        'SECTION G: EMPLOYEE PERFORMANCE ASSESSMENT',
        'القسم ز: تقييم أداء الموظفين',
        'Instructions: Based on your observations, please rate the OVERALL performance of employees in your team who have been assessed using the competency framework.',
        'التعليمات: بناءً على ملاحظاتك، يرجى تقييم الأداء العام للموظفين في فريقك الذين تم تقييمهم باستخدام إطار الكفاءات.'
    );
    -- Assign questions 51-60 to Section G (10 questions: G1-G10)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" BETWEEN 51 AND 60;

    -- SECTION H: IMPACT OBSERVATIONS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        8,
        'SECTION H: IMPACT OBSERVATIONS',
        'القسم ح: ملاحظات التأثير',
        'Instructions: Please share your observations about the impact of the competency framework.',
        'التعليمات: يرجى مشاركة ملاحظاتك حول تأثير إطار الكفاءات.'
    );
    -- Assign questions 61-66 to Section H (6 questions: H1-H6)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" BETWEEN 61 AND 66;

    -- SECTION I: OPEN-ENDED QUESTIONS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        manager_q_id,
        9,
        'SECTION I: OPEN-ENDED QUESTIONS',
        'القسم ط: الأسئلة المفتوحة',
        NULL,
        NULL
    );
    -- Assign questions 67-70 to Section I (4 open-ended questions)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = manager_q_id 
    AND "order" >= 67;

    RAISE NOTICE '✅ Successfully created 9 sections for Manager questionnaire';
    RAISE NOTICE '📊 Section A: Questions 1-10 (Demographic Information)';
    RAISE NOTICE '📊 Section B: Questions 11-20 (Competency Framework Characteristics)';
    RAISE NOTICE '📊 Section C: Questions 21-30 (Implementation Quality)';
    RAISE NOTICE '📊 Section D: Questions 31-40 (Manager Perceptions and Attitudes)';
    RAISE NOTICE '📊 Section E: Questions 41-45 (Leadership Support)';
    RAISE NOTICE '📊 Section F: Questions 46-50 (Organizational Culture)';
    RAISE NOTICE '📊 Section G: Questions 51-60 (Employee Performance Assessment)';
    RAISE NOTICE '📊 Section H: Questions 61-66 (Impact Observations)';
    RAISE NOTICE '📊 Section I: Questions 67+ (Open-ended Questions)';
    
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
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'manager-questionnaire')
GROUP BY s.id, s."order", s."titleEn"
ORDER BY s."order";

