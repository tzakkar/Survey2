-- Add Missing Questions to Staff Questionnaire
-- This script adds questions 6, 7, 14, 15, 64-76 that are missing from the database

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

-- Helper function to create scale options (1-5)
CREATE OR REPLACE FUNCTION create_scale_options(question_id TEXT) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), question_id, 1, '1', '1 - Strongly Disagree', '١ - أختلف بشدة'),
        (generate_cuid(), question_id, 2, '2', '2 - Disagree', '٢ - أختلف'),
        (generate_cuid(), question_id, 3, '3', '3 - Neutral', '٣ - محايد'),
        (generate_cuid(), question_id, 4, '4', '4 - Agree', '٤ - أتفق'),
        (generate_cuid(), question_id, 5, '5', '5 - Strongly Agree', '٥ - أتفق بشدة');
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    staff_q_id TEXT;
    q_id TEXT;
    section_a_id TEXT;
    section_b_id TEXT;
    section_i_id TEXT;
    section_j_id TEXT;
    section_k_id TEXT;
BEGIN
    -- Get staff questionnaire ID
    SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';
    
    IF staff_q_id IS NULL THEN
        RAISE EXCEPTION 'Staff questionnaire not found. Please create it first.';
    END IF;

    -- Get section IDs
    SELECT id INTO section_a_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 1;
    
    SELECT id INTO section_b_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 2;
    
    SELECT id INTO section_i_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 9;
    
    SELECT id INTO section_j_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 10;
    
    SELECT id INTO section_k_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 11;

    -- =====================================================
    -- SECTION A: Missing Questions 6 and 7
    -- =====================================================
    
    -- Question 6: Total years of work experience
    -- Check if question already exists
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 6) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_a_id, 6, 'MULTIPLE_CHOICE', 'Total years of work experience', 'إجمالي سنوات الخبرة في العمل', true);
        INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
        VALUES
            (generate_cuid(), q_id, 1, 'less-than-3', 'Less than 3 years', 'أقل من 3 سنوات'),
            (generate_cuid(), q_id, 2, '3-7', '3-7 years', '3-7 سنوات'),
            (generate_cuid(), q_id, 3, '8-15', '8-15 years', '8-15 سنة'),
            (generate_cuid(), q_id, 4, 'more-than-15', 'More than 15 years', 'أكثر من 15 سنة');
        RAISE NOTICE '✅ Added Question 6: Total years of work experience';
    END IF;

    -- Question 7: Department/Function
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 7) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_a_id, 7, 'MULTIPLE_CHOICE', 'Department/Function', 'الإدارة/الوظيفة', true);
        INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
        VALUES
            (generate_cuid(), q_id, 1, 'operations', 'Operations/Production', 'العمليات/الإنتاج'),
            (generate_cuid(), q_id, 2, 'sales', 'Sales/Marketing', 'المبيعات/التسويق'),
            (generate_cuid(), q_id, 3, 'finance', 'Finance/Accounting', 'المالية/المحاسبة'),
            (generate_cuid(), q_id, 4, 'it', 'IT/Technology', 'تكنولوجيا المعلومات'),
            (generate_cuid(), q_id, 5, 'hr', 'HR/Administration', 'الموارد البشرية/الإدارة'),
            (generate_cuid(), q_id, 6, 'customer-service', 'Customer Service', 'خدمة العملاء'),
            (generate_cuid(), q_id, 7, 'other', 'Other (please specify)', 'أخرى (يرجى التحديد)');
        RAISE NOTICE '✅ Added Question 7: Department/Function';
    END IF;

    -- =====================================================
    -- SECTION B: Missing Questions 14 and 15
    -- =====================================================
    
    -- Question 14 (B4): The competency descriptions are easy to understand
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 14) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_b_id, 14, 'SCALE_1_5', 'The competency descriptions are easy to understand and relate to my daily work.', 'وصف الكفاءات سهل الفهم ومرتبط بعملي اليومي.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 14: The competency descriptions are easy to understand';
    END IF;

    -- Question 15 (B5): I know what competency level I need to achieve
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 15) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_b_id, 15, 'SCALE_1_5', 'I know what competency level I need to achieve for my current role.', 'أعرف ما هو مستوى الكفاءة الذي أحتاج لتحقيقه لدوري الحالي.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 15: I know what competency level I need to achieve';
    END IF;

    -- =====================================================
    -- SECTION I: Missing Questions 64, 65, 66, 67
    -- =====================================================
    
    -- Question 64 (I3): The competency framework has motivated me to develop new skills
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 64) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_i_id, 64, 'SCALE_1_5', 'The competency framework has motivated me to develop new skills.', 'حفزني إطار الكفاءات على تطوير مهارات جديدة.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 64: The competency framework has motivated me to develop new skills';
    END IF;

    -- Question 65 (I4): My work quality has improved
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 65) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_i_id, 65, 'SCALE_1_5', 'My work quality has improved as a result of the competency framework.', 'تحسنت جودة عملي نتيجة لإطار الكفاءات.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 65: My work quality has improved';
    END IF;

    -- Question 66 (I5): The framework has increased my confidence
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 66) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_i_id, 66, 'SCALE_1_5', 'The framework has increased my confidence in performing my job.', 'زاد الإطار ثقتي في أداء وظيفتي.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 66: The framework has increased my confidence';
    END IF;

    -- Question 67 (I6): I am more engaged in my work
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 67) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_i_id, 67, 'SCALE_1_5', 'I am more engaged in my work because of the competency framework.', 'أنا أكثر انخراطاً في عملي بسبب إطار الكفاءات.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 67: I am more engaged in my work';
    END IF;

    -- =====================================================
    -- SECTION J: Missing Questions 68, 69, 70, 71, 72
    -- =====================================================
    
    -- Question 68 (J1): My immediate supervisor actively supports my competency development
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 68) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_j_id, 68, 'SCALE_1_5', 'My immediate supervisor actively supports my competency development.', 'مشرفي المباشر يدعم بنشاط تطور كفاءاتي.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 68: My immediate supervisor actively supports my competency development';
    END IF;

    -- Question 69 (J2): Senior management demonstrates commitment
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 69) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_j_id, 69, 'SCALE_1_5', 'Senior management demonstrates commitment to the competency framework.', 'تظهر الإدارة العليا التزاماً بإطار الكفاءات.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 69: Senior management demonstrates commitment';
    END IF;

    -- Question 70 (J3): The organization values continuous learning
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 70) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_j_id, 70, 'SCALE_1_5', 'The organization values continuous learning and development.', 'المنظمة تقدر التعلم والتطوير المستمر.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 70: The organization values continuous learning';
    END IF;

    -- Question 71 (J4): Good performance is recognized and rewarded
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 71) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_j_id, 71, 'SCALE_1_5', 'Good performance is recognized and rewarded in this organization.', 'الأداء الجيد معترف به ومكافأ في هذه المنظمة.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 71: Good performance is recognized and rewarded';
    END IF;

    -- Question 72 (J5): There is a culture of open feedback
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 72) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_j_id, 72, 'SCALE_1_5', 'There is a culture of open feedback and performance improvement.', 'هناك ثقافة الملاحظات المفتوحة وتحسين الأداء.', true);
        PERFORM create_scale_options(q_id);
        RAISE NOTICE '✅ Added Question 72: There is a culture of open feedback';
    END IF;

    -- =====================================================
    -- SECTION K: Missing Questions 73, 74, 75, 76 (Open-ended)
    -- =====================================================
    
    -- Question 73: What do you like most about the competency framework?
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 73) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_k_id, 73, 'TEXT', 'What do you like most about the competency framework in your organization?', 'ما الذي تحب أكثر شيء حول إطار الكفاءات في منظمتك؟', false);
        RAISE NOTICE '✅ Added Question 73: What do you like most about the competency framework?';
    END IF;

    -- Question 74: What challenges or difficulties have you experienced?
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 74) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_k_id, 74, 'TEXT', 'What challenges or difficulties have you experienced with the competency framework?', 'ما التحديات أو الصعوبات التي واجهتها مع إطار الكفاءات؟', false);
        RAISE NOTICE '✅ Added Question 74: What challenges or difficulties have you experienced?';
    END IF;

    -- Question 75: How has the competency framework helped (or not helped)?
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 75) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_k_id, 75, 'TEXT', 'How has the competency framework helped (or not helped) your performance and development?', 'كيف ساعدك (أو لم يساعدك) إطار الكفاءات في أدائك والتطور؟', false);
        RAISE NOTICE '✅ Added Question 75: How has the competency framework helped (or not helped)?';
    END IF;

    -- Question 76: What suggestions do you have to improve?
    IF NOT EXISTS (SELECT 1 FROM "Question" WHERE "questionnaireId" = staff_q_id AND "order" = 76) THEN
        q_id := generate_cuid();
        INSERT INTO "Question" (id, "questionnaireId", "sectionId", "order", type, "textEn", "textAr", "isRequired")
        VALUES (q_id, staff_q_id, section_k_id, 76, 'TEXT', 'What suggestions do you have to improve the competency framework or its implementation?', 'ما الاقتراحات التي لديك لتحسين إطار الكفاءات أو تطبيقه؟', false);
        RAISE NOTICE '✅ Added Question 76: What suggestions do you have to improve?';
    END IF;

    RAISE NOTICE '✅ Completed adding missing questions';
    
END $$;

-- Verification: Check all questions and their sections
SELECT 
    s."order" as section_order,
    s."titleEn" as section_title,
    COUNT(q.id) as question_count,
    MIN(q."order") as first_question,
    MAX(q."order") as last_question,
    STRING_AGG(q."order"::TEXT, ', ' ORDER BY q."order") as question_orders
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
GROUP BY s.id, s."order", s."titleEn"
ORDER BY s."order";

