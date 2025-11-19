-- Supabase Seed SQL Script
-- Run this in Supabase Dashboard → SQL Editor
-- This creates all questionnaires and questions

-- Clear existing data (optional - uncomment if you want to reseed)
-- DELETE FROM "Answer";
-- DELETE FROM "Response";
-- DELETE FROM "Option";
-- DELETE FROM "Question";
-- DELETE FROM "Questionnaire";

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

-- 1. STAFF QUESTIONNAIRE
DO $$
DECLARE
    staff_q_id TEXT;
    q_id TEXT;
    opt_id TEXT;
BEGIN
    -- Insert or get staff questionnaire ID
    INSERT INTO "Questionnaire" (id, slug, "titleEn", "titleAr", "descriptionEn", "descriptionAr", "audienceType", "isActive", "createdAt", "updatedAt")
    VALUES (
        generate_cuid(),
        'staff-questionnaire',
        'Survey on Competency Frameworks and Employee Performance - Employee Perspective',
        'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الموظف',
        'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest feedback about your experience with the competency framework is essential for understanding its effectiveness. All responses are completely confidential and anonymous.',
        'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة حول تجربتك مع إطار الكفاءات ضرورية لفهم فعاليته. جميع الإجابات سرية تماماً وسرية.',
        'STAFF',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        "titleEn" = EXCLUDED."titleEn",
        "titleAr" = EXCLUDED."titleAr",
        "updatedAt" = NOW();
    
    -- Get staff questionnaire ID
    SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';
    
    -- Staff Questions (Sample - you can expand this)
    -- Question 1: Gender
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 1, 'MULTIPLE_CHOICE', 'Gender', 'النوع', true);
    
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'male', 'Male', 'ذكر'),
        (generate_cuid(), q_id, 2, 'female', 'Female', 'أنثى'),
        (generate_cuid(), q_id, 3, 'prefer-not-say', 'Prefer not to say', 'أفضل عدم الإفصاح');
    
    -- Question 2: Age Group
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 2, 'MULTIPLE_CHOICE', 'Age Group', 'الفئة العمرية', true);
    
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, '20-29', '20-29 years', '20-29 سنة'),
        (generate_cuid(), q_id, 2, '30-39', '30-39 years', '30-39 سنة'),
        (generate_cuid(), q_id, 3, '40-49', '40-49 years', '40-49 سنة'),
        (generate_cuid(), q_id, 4, '50-plus', '50 years and above', '50 سنة فأكثر');
    
    -- Question 3: Scale question
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 3, 'SCALE_1_5', 
        'I have a clear understanding of what the competency framework means in my organization.',
        'لدي فهم واضح لما يعنيه إطار الكفاءات في منظمتي.',
        true);
    
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, '1', '1 - Strongly Disagree', '١ - أختلف بشدة'),
        (generate_cuid(), q_id, 2, '2', '2 - Disagree', '٢ - أختلف'),
        (generate_cuid(), q_id, 3, '3', '3 - Neutral', '٣ - محايد'),
        (generate_cuid(), q_id, 4, '4', '4 - Agree', '٤ - أتفق'),
        (generate_cuid(), q_id, 5, '5', '5 - Strongly Agree', '٥ - أتفق بشدة');
    
    RAISE NOTICE '✅ Staff questionnaire seeded with sample questions';
END $$;

-- 2. MANAGER QUESTIONNAIRE
INSERT INTO "Questionnaire" (id, slug, "titleEn", "titleAr", "descriptionEn", "descriptionAr", "audienceType", "isActive", "createdAt", "updatedAt")
VALUES (
    generate_cuid(),
    'manager-questionnaire',
    'Survey on Competency Frameworks and Employee Performance - Manager Perspective',
    'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الإدارة',
    'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest responses are valuable for understanding how competency frameworks affect organizational performance from a managerial perspective. All responses are confidential.',
    'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة ذات قيمة كبيرة لفهم كيف تؤثر أطر الكفاءات على أداء المنظمة من منظور إداري. جميع الإجابات سرية.',
    'MANAGER',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    "titleEn" = EXCLUDED."titleEn",
    "titleAr" = EXCLUDED."titleAr",
    "updatedAt" = NOW();

-- 3. HR QUESTIONNAIRE
INSERT INTO "Questionnaire" (id, slug, "titleEn", "titleAr", "descriptionEn", "descriptionAr", "audienceType", "isActive", "createdAt", "updatedAt")
VALUES (
    generate_cuid(),
    'hr-questionnaire',
    'Survey on Competency Frameworks and Employee Performance - HR Professional Perspective',
    'استبيان عن أطر الكفاءات وأداء الموظفين - منظور متخصص الموارد البشرية',
    'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your expertise as an HR professional is crucial for understanding how competency frameworks are designed, implemented, and impact organizational outcomes. All responses are confidential.',
    'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن خبرتك كمتخصص في الموارد البشرية حاسمة لفهم كيف يتم تصميم أطر الكفاءات وتطبيقها والتأثير على نتائج المنظمة. جميع الإجابات سرية.',
    'HR',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    "titleEn" = EXCLUDED."titleEn",
    "titleAr" = EXCLUDED."titleAr",
    "updatedAt" = NOW();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Seed completed successfully!';
    RAISE NOTICE 'Created 3 questionnaires';
    RAISE NOTICE 'Note: This is a sample seed. Run seed-complete.js for full data.';
END $$;

