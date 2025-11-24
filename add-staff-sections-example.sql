-- Example: Add Sections for Staff Questionnaire
-- Run this AFTER running add-sections-migration.sql
-- This creates sections for the staff questionnaire based on the questionnaire structure

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

    -- SECTION I: INDIVIDUAL/DEMOGRAPHIC INFORMATION
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        1,
        'SECTION I: INDIVIDUAL/DEMOGRAPHIC INFORMATION',
        'القسم الأول: المعلومات الفردية/الديموغرافية',
        'Please provide the following demographic information about yourself.',
        'يرجى تقديم المعلومات الديموغرافية التالية عن نفسك.'
    );

    -- Update questions 1-20 to belong to Section I (adjust question order range as needed)
    -- Note: You'll need to update the actual question IDs based on your database
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 1 AND 20;

    -- SECTION II: COMPETENCY ASSESSMENT
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        2,
        'SECTION II: COMPETENCY ASSESSMENT',
        'القسم الثاني: تقييم الكفاءة',
        'Please rate your level of agreement with the following statements regarding your competencies.',
        'يرجى تقييم مستوى موافقتك على العبارات التالية المتعلقة بكفاءاتك.'
    );

    -- Update questions 21-25 to belong to Section II (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 21 AND 25;

    -- SECTION III: PERFORMANCE EVALUATION
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        3,
        'SECTION III: PERFORMANCE EVALUATION',
        'القسم الثالث: تقييم الأداء',
        'Please rate your performance in the following areas.',
        'يرجى تقييم أدائك في المجالات التالية.'
    );

    -- Update questions 26-30 to belong to Section III (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 26 AND 30;

    -- SECTION IV: EMPLOYEE DEVELOPMENT AND TRAINING
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        4,
        'SECTION IV: EMPLOYEE DEVELOPMENT AND TRAINING',
        'القسم الرابع: تطوير الموظفين والتدريب',
        'Please rate your agreement with the following statements regarding employee development and training.',
        'يرجى تقييم موافقتك على العبارات التالية المتعلقة بتطوير الموظفين والتدريب.'
    );

    -- Update questions 31-35 to belong to Section IV (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 31 AND 35;

    -- SECTION V: WORK ENVIRONMENT AND CULTURE
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        5,
        'SECTION V: WORK ENVIRONMENT AND CULTURE',
        'القسم الخامس: بيئة العمل والثقافة',
        'Please rate your agreement with the following statements regarding the work environment and culture.',
        'يرجى تقييم موافقتك على العبارات التالية المتعلقة ببيئة العمل والثقافة.'
    );

    -- Update questions 36-40 to belong to Section V (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 36 AND 40;

    -- SECTION VI: LEADERSHIP AND MANAGEMENT
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        6,
        'SECTION VI: LEADERSHIP AND MANAGEMENT',
        'القسم السادس: القيادة والإدارة',
        'Please rate your agreement with the following statements regarding leadership and management.',
        'يرجى تقييم موافقتك على العبارات التالية المتعلقة بالقيادة والإدارة.'
    );

    -- Update questions 41-45 to belong to Section VI (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 41 AND 45;

    -- SECTION VII: JOB SATISFACTION AND ENGAGEMENT
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        7,
        'SECTION VII: JOB SATISFACTION AND ENGAGEMENT',
        'القسم السابع: الرضا الوظيفي والمشاركة',
        'Please rate your agreement with the following statements regarding your job satisfaction and engagement.',
        'يرجى تقييم موافقتك على العبارات التالية المتعلقة برضاك الوظيفي ومشاركتك.'
    );

    -- Update questions 46-50 to belong to Section VII (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 46 AND 50;

    -- SECTION VIII: COMPENSATION AND BENEFITS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        8,
        'SECTION VIII: COMPENSATION AND BENEFITS',
        'القسم الثامن: التعويضات والمزايا',
        'Please rate your agreement with the following statements regarding compensation and benefits.',
        'يرجى تقييم موافقتك على العبارات التالية المتعلقة بالتعويضات والمزايا.'
    );

    -- Update questions 51-55 to belong to Section VIII (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 51 AND 55;

    -- SECTION IX: OVERALL SATISFACTION
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        9,
        'SECTION IX: OVERALL SATISFACTION',
        'القسم التاسع: الرضا العام',
        'Please rate your overall satisfaction with the following aspects.',
        'يرجى تقييم رضاك العام عن الجوانب التالية.'
    );

    -- Update questions 56-60 to belong to Section IX (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 56 AND 60;

    -- SECTION X: OPEN-ENDED QUESTIONS
    section_id := generate_cuid();
    INSERT INTO "Section" (id, "questionnaireId", "order", "titleEn", "titleAr", "instructionsEn", "instructionsAr")
    VALUES (
        section_id,
        staff_q_id,
        10,
        'SECTION X: OPEN-ENDED QUESTIONS',
        'القسم العاشر: الأسئلة المفتوحة',
        'Please provide detailed answers to the following open-ended questions.',
        'يرجى تقديم إجابات مفصلة على الأسئلة المفتوحة التالية.'
    );

    -- Update questions 61-65 to belong to Section X (adjust as needed)
    UPDATE "Question" 
    SET "sectionId" = section_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 61 AND 65;

    RAISE NOTICE '✅ Successfully created 10 sections for staff questionnaire';
    RAISE NOTICE '⚠️  Please verify the question order ranges (1-20, 21-25, etc.) match your actual question orders';
    
END $$;

