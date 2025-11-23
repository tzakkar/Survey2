-- Complete: Add All Sections for Staff Questionnaire
-- Run this AFTER running add-sections-migration.sql
-- This creates all 11 sections (A-K) based on the actual questionnaire document

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
    -- Assign questions 1-10 to Section A
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
    -- Assign questions 11-16 to Section B (6 questions: B1-B6)
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
    -- Assign questions 17-24 to Section C (8 questions: C1-C8)
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
    -- Assign questions 25-34 to Section D (10 questions: D1-D10)
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
    -- Assign questions 35-40 to Section E (6 questions: E1-E6)
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
    -- Assign questions 41-45 to Section F (5 questions: F1-F5)
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
    -- Assign questions 46-49 to Section G (4 questions: G1-G4)
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
    -- Assign questions 50-61 to Section H (12 questions: H1.1-H1.6 and H2.1-H2.6)
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
    -- Assign questions 62-67 to Section I (6 questions: I1-I6)
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
    -- Assign questions 68-72 to Section J (5 questions: J1-J5)
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
    -- Assign questions 73-76 to Section K (4 open-ended questions)
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

-- Verification Query: Check sections and question assignments
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

