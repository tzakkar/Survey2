-- Complete Supabase Seed SQL Script
-- Run this in Supabase Dashboard → SQL Editor
-- This creates ALL questionnaires with ALL questions (59 total)

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

-- 1. STAFF QUESTIONNAIRE (76 questions)
DO $$
DECLARE
    staff_q_id TEXT;
    q_id TEXT;
BEGIN
    -- Insert or get staff questionnaire
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
    
    SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';
    
    -- Delete existing questions if reseeding
    DELETE FROM "Option" WHERE "questionId" IN (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id);
    DELETE FROM "Question" WHERE "questionnaireId" = staff_q_id;
    
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
    
    -- Question 3: Highest Educational Level
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 3, 'MULTIPLE_CHOICE', 'Highest Educational Level', 'أعلى مستوى تعليمي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'high-school', 'High school diploma', 'شهادة الثانوية العامة'),
        (generate_cuid(), q_id, 2, 'bachelors', 'Bachelor''s degree', 'درجة البكالوريوس'),
        (generate_cuid(), q_id, 3, 'masters', 'Master''s degree', 'درجة الماجستير'),
        (generate_cuid(), q_id, 4, 'doctoral', 'Doctoral degree or higher', 'درجة الدكتوراه أو أعلى');
    
    -- Question 4: Current Position Level
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 4, 'MULTIPLE_CHOICE', 'Current Position Level', 'مستوى الموضع الحالي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'entry', 'Entry-level/Junior', 'مستوى مبتدئ/صغير'),
        (generate_cuid(), q_id, 2, 'intermediate', 'Intermediate/Mid-level', 'وسيط/متوسط المستوى'),
        (generate_cuid(), q_id, 3, 'senior', 'Senior/Specialist', 'رفيع/متخصص'),
        (generate_cuid(), q_id, 4, 'team-lead', 'Team Lead/Supervisor', 'قائد فريق/مشرف');
    
    -- Question 5: Years with current organization
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 5, 'MULTIPLE_CHOICE', 'Years with current organization', 'سنوات مع المنظمة الحالية', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'less-than-1', 'Less than 1 year', 'أقل من سنة واحدة'),
        (generate_cuid(), q_id, 2, '1-3', '1-3 years', '1-3 سنوات'),
        (generate_cuid(), q_id, 3, '4-7', '4-7 years', '4-7 سنوات'),
        (generate_cuid(), q_id, 4, '8-15', '8-15 years', '8-15 سنة'),
        (generate_cuid(), q_id, 5, 'more-than-15', 'More than 15 years', 'أكثر من 15 سنة');
    
    -- Question 6: Total years of work experience
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 6, 'MULTIPLE_CHOICE', 'Total years of work experience', 'إجمالي سنوات الخبرة في العمل', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'less-than-3', 'Less than 3 years', 'أقل من 3 سنوات'),
        (generate_cuid(), q_id, 2, '3-7', '3-7 years', '3-7 سنوات'),
        (generate_cuid(), q_id, 3, '8-15', '8-15 years', '8-15 سنة'),
        (generate_cuid(), q_id, 4, 'more-than-15', 'More than 15 years', 'أكثر من 15 سنة');
    
    -- Question 7: Department/Function
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 7, 'MULTIPLE_CHOICE', 'Department/Function', 'الإدارة/الوظيفة', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'operations', 'Operations/Production', 'العمليات/الإنتاج'),
        (generate_cuid(), q_id, 2, 'sales', 'Sales/Marketing', 'المبيعات/التسويق'),
        (generate_cuid(), q_id, 3, 'finance', 'Finance/Accounting', 'المالية/المحاسبة'),
        (generate_cuid(), q_id, 4, 'it', 'IT', 'تكنولوجيا المعلومات'),
        (generate_cuid(), q_id, 5, 'hr', 'HR/Admin', 'الموارد البشرية/الإدارة'),
        (generate_cuid(), q_id, 6, 'customer-service', 'Customer Service', 'خدمة العملاء'),
        (generate_cuid(), q_id, 7, 'other', 'Other (please specify)', 'أخرى (يرجى التحديد)');
    
    -- Question 8: Industry sector
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 8, 'MULTIPLE_CHOICE', 'Industry sector', 'القطاع الصناعي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'financial', 'Financial Services/Banking', 'الخدمات المالية/البنوك'),
        (generate_cuid(), q_id, 2, 'manufacturing', 'Manufacturing', 'التصنيع'),
        (generate_cuid(), q_id, 3, 'technology', 'Technology/IT', 'التكنولوجيا/تكنولوجيا المعلومات'),
        (generate_cuid(), q_id, 4, 'consulting', 'Consulting', 'الاستشارات'),
        (generate_cuid(), q_id, 5, 'retail', 'Retail/Consumer Goods', 'البيع بالتجزئة/السلع الاستهلاكية'),
        (generate_cuid(), q_id, 6, 'other', 'Other (please specify)', 'أخرى (يرجى التحديد)');
    
    -- Question 9: Organization size
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 9, 'MULTIPLE_CHOICE', 'Organization size (number of employees)', 'حجم المنظمة (عدد الموظفين)', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'small', '50-250 employees (Small)', '50-250 موظف (صغيرة)'),
        (generate_cuid(), q_id, 2, 'medium', '251-1000 employees (Medium)', '251-1000 موظف (متوسطة)'),
        (generate_cuid(), q_id, 3, 'large', 'More than 1000 employees (Large)', 'أكثر من 1000 موظف (كبيرة)');
    
    -- Question 10: How long working under competency framework
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 10, 'MULTIPLE_CHOICE', 'How long have you been working under the competency framework system?', 'كم من الوقت تعمل تحت نظام إطار الكفاءات؟', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'less-than-1', 'Less than 1 year', 'أقل من سنة واحدة'),
        (generate_cuid(), q_id, 2, '1-2', '1-2 years', '1-2 سنة'),
        (generate_cuid(), q_id, 3, '3-4', '3-4 years', '3-4 سنوات'),
        (generate_cuid(), q_id, 4, 'more-than-4', 'More than 4 years', 'أكثر من 4 سنوات');
    
    -- SECTION B: UNDERSTANDING OF COMPETENCY FRAMEWORK (Questions 11-16)
    -- Question 11 (B1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 11, 'SCALE_1_5', 'I have a clear understanding of what the competency framework is and its purpose.', 'لدي فهم واضح لما هو إطار الكفاءات والغرض منه.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 12 (B2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 12, 'SCALE_1_5', 'The competencies required for my role are clearly defined and communicated.', 'الكفاءات المطلوبة لدوري محددة بوضوح ومعلنة.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 13 (B3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 13, 'SCALE_1_5', 'I understand how my performance is assessed using the competency framework.', 'أفهم كيف يتم تقييم أدائي باستخدام إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 14 (B4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 14, 'SCALE_1_5', 'The competency descriptions are easy to understand and relate to my daily work.', 'وصف الكفاءات سهل الفهم ومرتبط بعملي اليومي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 15 (B5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 15, 'SCALE_1_5', 'I know what competency level I need to achieve for my current role.', 'أعرف ما هو مستوى الكفاءة الذي أحتاج لتحقيقه لدوري الحالي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 16 (B6)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 16, 'SCALE_1_5', 'The competency framework provides clear guidance on what is expected of me.', 'يوفر إطار الكفاءات إرشادات واضحة حول ما هو متوقع مني.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION C: QUALITY OF FRAMEWORK IMPLEMENTATION (Questions 17-24)
    -- Question 17 (C1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 17, 'SCALE_1_5', 'The purpose and benefits of the competency framework were clearly explained to me.', 'تم شرح الغرض والفوائد من إطار الكفاءات لي بوضوح.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 18 (C2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 18, 'SCALE_1_5', 'I received adequate training and orientation on the competency framework.', 'تلقيت تدريباً وتوجيهاً كافياً حول إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 19 (C3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 19, 'SCALE_1_5', 'My manager effectively explains how to apply the competency framework.', 'مديري يشرح بشكل فعال كيفية تطبيق إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 20 (C4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 20, 'SCALE_1_5', 'Support and resources are available to help me develop required competencies.', 'الدعم والموارد متاحة لمساعدتي في تطوير الكفاءات المطلوبة.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 21 (C5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 21, 'SCALE_1_5', 'The competency assessment process is fair and transparent.', 'عملية تقييم الكفاءات عادلة وشفافة.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 22 (C6)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 22, 'SCALE_1_5', 'I receive regular feedback on my competency development.', 'أتلقى ملاحظات منتظمة حول تطور كفاءاتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 23 (C7)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 23, 'SCALE_1_5', 'There are clear opportunities to develop and improve my competencies.', 'هناك فرص واضحة لتطوير وتحسين كفاءاتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 24 (C8)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 24, 'SCALE_1_5', 'The organization provides training aligned with competency requirements.', 'توفر المنظمة تدريباً متوافقاً مع متطلبات الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION D: EMPLOYEE PERCEPTIONS AND ATTITUDES (Questions 25-34)
    -- Question 25 (D1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 25, 'SCALE_1_5', 'The competency framework is relevant and useful for my job.', 'إطار الكفاءات ذو صلة ومفيد لوظيفتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 26 (D2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 26, 'SCALE_1_5', 'The framework helps me understand what I need to do to perform well.', 'يساعدني الإطار على فهم ما أحتاج فعله لأداء جيد.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 27 (D3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 27, 'SCALE_1_5', 'The competency framework is fair in evaluating my performance.', 'إطار الكفاءات عادل في تقييم أدائي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 28 (D4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 28, 'SCALE_1_5', 'The framework helps me identify areas where I need to improve.', 'يساعدني الإطار على تحديد المجالات التي أحتاج للتحسين فيها.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 29 (D5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 29, 'SCALE_1_5', 'Using the competency framework has helped my professional development.', 'استخدام إطار الكفاءات ساعد في تطوري المهني.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 30 (D6)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 30, 'SCALE_1_5', 'The framework provides a clear path for career advancement.', 'يوفر الإطار مساراً واضحاً للتقدم الوظيفي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 31 (D7)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 31, 'SCALE_1_5', 'Performance discussions with my manager are more constructive because of the framework.', 'مناقشات الأداء مع مديري أكثر بناءة بسبب الإطار.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 32 (D8)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 32, 'SCALE_1_5', 'I accept and support the use of the competency framework in our organization.', 'أقبل وأدعم استخدام إطار الكفاءات في منظمتنا.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 33 (D9)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 33, 'SCALE_1_5', 'Overall, I am satisfied with the competency framework.', 'بشكل عام، أنا راضٍ عن إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 34 (D10)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 34, 'SCALE_1_5', 'I believe the competency framework has improved my work experience.', 'أعتقد أن إطار الكفاءات حسّن تجربتي في العمل.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION E: EMPLOYEE ENGAGEMENT (Questions 35-40)
    -- Question 35 (E1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 35, 'SCALE_1_5', 'I feel energized and enthusiastic when I work.', 'أشعر بالنشاط والحماس عندما أعمل.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 36 (E2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 36, 'SCALE_1_5', 'My work inspires and motivates me.', 'عملي يلهمني ويحفزني.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 37 (E3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 37, 'SCALE_1_5', 'I am fully absorbed and focused when performing my job.', 'أنا منغمس بالكامل ومركز عند أداء وظيفتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 38 (E4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 38, 'SCALE_1_5', 'I feel proud of the work that I do.', 'أشعر بالفخر بالعمل الذي أقوم به.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 39 (E5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 39, 'SCALE_1_5', 'Time passes quickly when I am working.', 'الوقت يمر بسرعة عندما أعمل.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 40 (E6)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 40, 'SCALE_1_5', 'I am deeply involved and committed to my work.', 'أنا منخرط بعمق وملتزم بعملي.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION F: WORK MOTIVATION (Questions 41-45)
    -- Question 41 (F1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 41, 'SCALE_1_5', 'I am highly motivated to perform well in my job.', 'أنا متحمس بشدة لأداء جيد في وظيفتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 42 (F2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 42, 'SCALE_1_5', 'The competency framework encourages me to improve my performance.', 'يشجعني إطار الكفاءات على تحسين أدائي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 43 (F3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 43, 'SCALE_1_5', 'I put in extra effort to achieve my performance goals.', 'أبذل جهداً إضافياً لتحقيق أهداف أدائي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 44 (F4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 44, 'SCALE_1_5', 'I am motivated to develop new competencies and skills.', 'أنا متحمس لتطوير كفاءات ومهارات جديدة.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 45 (F5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 45, 'SCALE_1_5', 'I persistently work toward achieving excellence in my role.', 'أعمل باستمرار لتحقيق التميز في دوري.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION G: SELF-EFFICACY (Questions 46-49)
    -- Question 46 (G1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 46, 'SCALE_1_5', 'I am confident in my ability to meet performance expectations.', 'أنا واثق من قدرتي على تلبية توقعات الأداء.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 47 (G2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 47, 'SCALE_1_5', 'I believe I can accomplish challenging tasks in my job.', 'أعتقد أنني أستطيع إنجاز المهام الصعبة في وظيفتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 48 (G3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 48, 'SCALE_1_5', 'I have the necessary competencies to perform my job successfully.', 'لدي الكفاءات اللازمة لأداء وظيفتي بنجاح.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 49 (G4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 49, 'SCALE_1_5', 'I can handle most problems that arise in my work.', 'أستطيع التعامل مع معظم المشاكل التي تنشأ في عملي.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION H: EMPLOYEE PERFORMANCE - Task Performance (Questions 50-55)
    -- Question 50 (H1.1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 50, 'SCALE_1_5', 'I consistently accomplish my assigned work duties effectively.', 'أنجز باستمرار واجبات عملي المكلف بها بفعالية.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 51 (H1.2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 51, 'SCALE_1_5', 'I meet all formal performance requirements of my job.', 'ألبي جميع متطلبات الأداء الرسمية لوظيفتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 52 (H1.3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 52, 'SCALE_1_5', 'I produce high-quality work outputs.', 'أنتج مخرجات عمل عالية الجودة.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 53 (H1.4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 53, 'SCALE_1_5', 'I complete my tasks within expected timeframes.', 'أكمل مهامي في الإطارات الزمنية المتوقعة.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 54 (H1.5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 54, 'SCALE_1_5', 'I effectively fulfill all responsibilities required by my job.', 'أفي بفعالية بجميع المسؤوليات المطلوبة من وظيفتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 55 (H1.6)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 55, 'SCALE_1_5', 'My performance meets or exceeds the standards set for my role.', 'أدائي يلبي أو يتجاوز المعايير المحددة لدوري.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION H: EMPLOYEE PERFORMANCE - Contextual Performance (Questions 56-61)
    -- Question 56 (H2.1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 56, 'SCALE_1_5', 'I help colleagues who have heavy workloads or are facing challenges.', 'أساعد الزملاء الذين لديهم أعباء عمل ثقيلة أو يواجهون تحديات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 57 (H2.2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 57, 'SCALE_1_5', 'I willingly share my knowledge and expertise with team members.', 'أشارك بكل رغبة معرفتي وخبرتي مع أعضاء الفريق.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 58 (H2.3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 58, 'SCALE_1_5', 'I take on additional responsibilities beyond my job description.', 'أتحمل مسؤوليات إضافية تتجاوز وصف وظيفتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 59 (H2.4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 59, 'SCALE_1_5', 'I actively contribute to team meetings and collaborative projects.', 'أساهم بنشاط في اجتماعات الفريق والمشاريع التعاونية.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 60 (H2.5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 60, 'SCALE_1_5', 'I demonstrate initiative and proactively identify opportunities for improvement.', 'أظهر المبادرة وأحدد بشكل استباقي فرص التحسين.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 61 (H2.6)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 61, 'SCALE_1_5', 'I represent the organization positively to external stakeholders.', 'أمثل المنظمة بشكل إيجابي أمام أصحاب المصلحة الخارجيين.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION I: IMPACT OF COMPETENCY FRAMEWORK ON PERFORMANCE (Questions 62-67)
    -- Question 62 (I1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 62, 'SCALE_1_5', 'Since working under the competency framework, my job performance has improved.', 'منذ العمل تحت إطار الكفاءات، تحسن أدائي الوظيفي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 63 (I2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 63, 'SCALE_1_5', 'The framework has helped me better understand what excellent performance looks like.', 'ساعدني الإطار على فهم أفضل لما يبدو عليه الأداء الممتاز.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 64 (I3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 64, 'SCALE_1_5', 'The competency framework has motivated me to develop new skills.', 'حفزني إطار الكفاءات على تطوير مهارات جديدة.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 65 (I4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 65, 'SCALE_1_5', 'My work quality has improved as a result of the competency framework.', 'تحسنت جودة عملي نتيجة لإطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 66 (I5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 66, 'SCALE_1_5', 'The framework has increased my confidence in performing my job.', 'زاد الإطار ثقتي في أداء وظيفتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 67 (I6)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 67, 'SCALE_1_5', 'I am more engaged in my work because of the competency framework.', 'أنا أكثر انخراطاً في عملي بسبب إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- SECTION J: ORGANIZATIONAL SUPPORT (Questions 68-72)
    -- Question 68 (J1)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 68, 'SCALE_1_5', 'My immediate supervisor actively supports my competency development.', 'مشرفي المباشر يدعم بنشاط تطور كفاءاتي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 69 (J2)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 69, 'SCALE_1_5', 'Senior management demonstrates commitment to the competency framework.', 'تظهر الإدارة العليا التزاماً بإطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 70 (J3)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 70, 'SCALE_1_5', 'The organization values continuous learning and development.', 'المنظمة تقدر التعلم والتطوير المستمر.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 71 (J4)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 71, 'SCALE_1_5', 'Good performance is recognized and rewarded in this organization.', 'الأداء الجيد معترف به ومكافأ في هذه المنظمة.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 72 (J5)
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 72, 'SCALE_1_5', 'There is a culture of open feedback and performance improvement.', 'هناك ثقافة الملاحظات المفتوحة وتحسين الأداء.', true);
    PERFORM create_scale_options(q_id);
    
    -- Questions 73-76: Text questions (TEXT)
    -- Question 73
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 73, 'TEXT', 'What do you like most about the competency framework in your organization?', 'ما الذي تحب أكثر شيء حول إطار الكفاءات في منظمتك؟', false);
    
    -- Question 74
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 74, 'TEXT', 'What challenges or difficulties have you experienced with the competency framework?', 'ما التحديات أو الصعوبات التي واجهتها مع إطار الكفاءات؟', false);
    
    -- Question 75
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 75, 'TEXT', 'How has the competency framework helped (or not helped) your performance and development?', 'كيف ساعدك (أو لم يساعدك) إطار الكفاءات في أدائك والتطور؟', false);
    
    -- Question 76
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, staff_q_id, 76, 'TEXT', 'What suggestions do you have to improve the competency framework or its implementation?', 'ما الاقتراحات التي لديك لتحسين إطار الكفاءات أو تطبيقه؟', false);
    
    RAISE NOTICE '✅ Staff questionnaire seeded with 76 questions';
END $$;

-- 2. MANAGER QUESTIONNAIRE (25 questions)
DO $$
DECLARE
    manager_q_id TEXT;
    q_id TEXT;
BEGIN
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
    
    SELECT id INTO manager_q_id FROM "Questionnaire" WHERE slug = 'manager-questionnaire';
    
    -- Delete existing questions if reseeding
    DELETE FROM "Option" WHERE "questionId" IN (SELECT id FROM "Question" WHERE "questionnaireId" = manager_q_id);
    DELETE FROM "Question" WHERE "questionnaireId" = manager_q_id;
    
    -- Question 1: Gender
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 1, 'MULTIPLE_CHOICE', 'Gender', 'النوع', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'male', 'Male', 'ذكر'),
        (generate_cuid(), q_id, 2, 'female', 'Female', 'أنثى'),
        (generate_cuid(), q_id, 3, 'prefer-not-say', 'Prefer not to say', 'أفضل عدم الإفصاح');
    
    -- Question 2: Age Group
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 2, 'MULTIPLE_CHOICE', 'Age Group', 'الفئة العمرية', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, '25-34', '25-34 years', '25-34 سنة'),
        (generate_cuid(), q_id, 2, '35-44', '35-44 years', '35-44 سنة'),
        (generate_cuid(), q_id, 3, '45-54', '45-54 years', '45-54 سنة'),
        (generate_cuid(), q_id, 4, '55-plus', '55 years and above', '55 سنة فأكثر');
    
    -- Question 3: Highest Educational Level
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 3, 'MULTIPLE_CHOICE', 'Highest Educational Level', 'أعلى مستوى تعليمي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'bachelors', 'Bachelor''s degree', 'درجة البكالوريوس'),
        (generate_cuid(), q_id, 2, 'masters', 'Master''s degree', 'درجة الماجستير'),
        (generate_cuid(), q_id, 3, 'doctoral', 'Doctoral degree', 'درجة الدكتوراه'),
        (generate_cuid(), q_id, 4, 'professional', 'Professional certificate', 'شهادة مهنية');
    
    -- Question 4: Current Management Level
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 4, 'MULTIPLE_CHOICE', 'Current Management Level', 'مستوى الإدارة الحالي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'first-line', 'First-line manager (supervising team leads/employees)', 'مدير من الدرجة الأولى (يشرف على رؤساء الفريق/الموظفين)'),
        (generate_cuid(), q_id, 2, 'middle', 'Middle manager (supervising other managers)', 'مدير وسيط (يشرف على مديرين آخرين)'),
        (generate_cuid(), q_id, 3, 'senior', 'Senior manager/Director', 'مدير رفيع المستوى/مدير'),
        (generate_cuid(), q_id, 4, 'executive', 'Executive level (C-suite)', 'مستوى تنفيذي (C-suite)');
    
    -- Question 5: Years in current management position
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 5, 'MULTIPLE_CHOICE', 'Years in current management position', 'سنوات في منصب الإدارة الحالي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'less-than-2', 'Less than 2 years', 'أقل من سنتين'),
        (generate_cuid(), q_id, 2, '2-5', '2-5 years', '2-5 سنوات'),
        (generate_cuid(), q_id, 3, '6-10', '6-10 years', '6-10 سنوات'),
        (generate_cuid(), q_id, 4, 'more-than-10', 'More than 10 years', 'أكثر من 10 سنوات');
    
    -- Question 6: Total years of management experience
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 6, 'MULTIPLE_CHOICE', 'Total years of management experience', 'إجمالي سنوات الخبرة الإدارية', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'less-than-3', 'Less than 3 years', 'أقل من 3 سنوات'),
        (generate_cuid(), q_id, 2, '3-7', '3-7 years', '3-7 سنوات'),
        (generate_cuid(), q_id, 3, '8-15', '8-15 years', '8-15 سنة'),
        (generate_cuid(), q_id, 4, 'more-than-15', 'More than 15 years', 'أكثر من 15 سنة');
    
    -- Question 7: Industry sector
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 7, 'MULTIPLE_CHOICE', 'Industry sector', 'القطاع الصناعي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'financial', 'Financial Services/Banking', 'الخدمات المالية/البنوك'),
        (generate_cuid(), q_id, 2, 'manufacturing', 'Manufacturing', 'التصنيع'),
        (generate_cuid(), q_id, 3, 'technology', 'Technology/IT', 'التكنولوجيا/تكنولوجيا المعلومات'),
        (generate_cuid(), q_id, 4, 'consulting', 'Consulting', 'الاستشارات'),
        (generate_cuid(), q_id, 5, 'retail', 'Retail/Consumer Goods', 'البيع بالتجزئة/السلع الاستهلاكية'),
        (generate_cuid(), q_id, 6, 'other', 'Other (please specify)', 'أخرى (يرجى التحديد)');
    
    -- Question 8: Organization size
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 8, 'MULTIPLE_CHOICE', 'Organization size (number of employees)', 'حجم المنظمة (عدد الموظفين)', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'small', '50-250 employees (Small)', '50-250 موظف (صغيرة)'),
        (generate_cuid(), q_id, 2, 'medium', '251-1000 employees (Medium)', '251-1000 موظف (متوسطة)'),
        (generate_cuid(), q_id, 3, 'large', 'More than 1000 employees (Large)', 'أكثر من 1000 موظف (كبيرة)');
    
    -- Question 9: Number of direct reports
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 9, 'MULTIPLE_CHOICE', 'Number of direct reports under your supervision', 'عدد الموظفين المباشرين تحت إشرافك', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, '1-5', '1-5 employees', '1-5 موظفين'),
        (generate_cuid(), q_id, 2, '6-15', '6-15 employees', '6-15 موظف'),
        (generate_cuid(), q_id, 3, '16-30', '16-30 employees', '16-30 موظف'),
        (generate_cuid(), q_id, 4, 'more-than-30', 'More than 30 employees', 'أكثر من 30 موظف');
    
    -- Question 10: Years organization has used competency frameworks
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 10, 'MULTIPLE_CHOICE', 'Years Your Organization Has Used Competency Frameworks', 'عدد السنوات التي استخدمت فيها منظمتك أطر الكفاءات', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, '2-3', '2-3 years', '2-3 سنوات'),
        (generate_cuid(), q_id, 2, '4-5', '4-5 years', '4-5 سنوات'),
        (generate_cuid(), q_id, 3, '6-10', '6-10 years', '6-10 سنوات'),
        (generate_cuid(), q_id, 4, 'more-than-10', 'More than 10 years', 'أكثر من 10 سنوات');
    
    -- Questions 11-21: Scale questions
    -- Question 11
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 11, 'SCALE_1_5', 'The competency framework in our organization is well-designed and comprehensive.', 'إطار الكفاءات في منظمتنا مصمم بشكل جيد وشامل.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 12
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 12, 'SCALE_1_5', 'The competency framework clearly defines expectations for employee performance.', 'يحدد إطار الكفاءات بوضوح توقعات أداء الموظفين.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 13
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 13, 'SCALE_1_5', 'The competency framework has been implemented effectively in our organization.', 'تم تطبيق إطار الكفاءات بفعالية في منظمتنا.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 14
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 14, 'SCALE_1_5', 'Employees have been adequately trained on using the competency framework.', 'تم تدريب الموظفين بشكل كافٍ على استخدام إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 15
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 15, 'SCALE_1_5', 'I believe the competency framework is a valuable tool for managing employee performance.', 'أعتقد أن إطار الكفاءات أداة قيمة لإدارة أداء الموظفين.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 16
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 16, 'SCALE_1_5', 'I am confident in using the competency framework to assess my team members.', 'أنا واثق من استخدام إطار الكفاءات لتقييم أعضاء فريقي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 17
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 17, 'SCALE_1_5', 'Senior leadership strongly supports the competency framework initiative.', 'تدعم القيادة العليا بقوة مبادرة إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 18
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 18, 'SCALE_1_5', 'Our organizational culture promotes continuous learning and development.', 'تعزز ثقافة منظمتنا التعلم والتطوير المستمرين.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 19
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 19, 'SCALE_1_5', 'Overall, employees in my team perform well according to the competency framework standards.', 'بشكل عام، يؤدي الموظفون في فريقي أداءً جيداً وفقاً لمعايير إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 20
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 20, 'SCALE_1_5', 'The competency framework has helped improve employee performance in my team.', 'ساعد إطار الكفاءات على تحسين أداء الموظفين في فريقي.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 21
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 21, 'SCALE_1_5', 'I have observed positive changes in employee behavior since implementing the competency framework.', 'لاحظت تغييرات إيجابية في سلوك الموظفين منذ تطبيق إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Questions 22-25: Text questions
    -- Question 22
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 22, 'TEXT', 'What do you consider the most significant benefits of using the competency framework in your role as a manager?', 'ما الذي تعتبره الفوائد الأكثر أهمية لاستخدام إطار الكفاءات في دورك كمدير؟', false);
    
    -- Question 23
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 23, 'TEXT', 'What challenges have you encountered in implementing or using the competency framework?', 'ما التحديات التي واجهتها في تطبيق أو استخدام إطار الكفاءات؟', false);
    
    -- Question 24
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 24, 'TEXT', 'What improvements would you suggest to make the competency framework more effective?', 'ما التحسينات التي تقترحها لجعل إطار الكفاءات أكثر فعالية؟', false);
    
    -- Question 25
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, manager_q_id, 25, 'TEXT', 'In your opinion, what factors most contribute to the success of competency frameworks in improving employee performance?', 'في رأيك، ما العوامل التي تساهم أكثر في نجاح أطر الكفاءات في تحسين أداء الموظفين؟', false);
    
    RAISE NOTICE '✅ Manager questionnaire seeded with 25 questions';
END $$;

-- 3. HR QUESTIONNAIRE (26 questions)
DO $$
DECLARE
    hr_q_id TEXT;
    q_id TEXT;
BEGIN
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
    
    SELECT id INTO hr_q_id FROM "Questionnaire" WHERE slug = 'hr-questionnaire';
    
    -- Delete existing questions if reseeding
    DELETE FROM "Option" WHERE "questionId" IN (SELECT id FROM "Question" WHERE "questionnaireId" = hr_q_id);
    DELETE FROM "Question" WHERE "questionnaireId" = hr_q_id;
    
    -- Question 1: Age Group
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 1, 'MULTIPLE_CHOICE', 'Age Group', 'الفئة العمرية', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, '22-29', '22-29 years', '22-29 سنة'),
        (generate_cuid(), q_id, 2, '30-39', '30-39 years', '30-39 سنة'),
        (generate_cuid(), q_id, 3, '40-49', '40-49 years', '40-49 سنة'),
        (generate_cuid(), q_id, 4, '50-plus', '50 years and above', '50 سنة فأكثر');
    
    -- Question 2: Highest Educational Level
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 2, 'MULTIPLE_CHOICE', 'Highest Educational Level', 'أعلى مستوى تعليمي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'bachelors', 'Bachelor''s degree', 'درجة البكالوريوس'),
        (generate_cuid(), q_id, 2, 'masters', 'Master''s degree', 'درجة الماجستير'),
        (generate_cuid(), q_id, 3, 'doctoral', 'Doctoral degree', 'درجة الدكتوراه'),
        (generate_cuid(), q_id, 4, 'professional', 'Professional HR certificate', 'شهادة مهنية في الموارد البشرية');
    
    -- Question 3: Current HR Role
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 3, 'MULTIPLE_CHOICE', 'Current HR Role', 'دورك الحالي في الموارد البشرية', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'generalist', 'HR Generalist', 'متخصص عام في الموارد البشرية'),
        (generate_cuid(), q_id, 2, 'specialist', 'HR Specialist (Recruitment/Training/Compensation)', 'متخصص في الموارد البشرية (التوظيف/التدريب/التعويضات)'),
        (generate_cuid(), q_id, 3, 'manager', 'HR Manager/Business Partner', 'مدير موارد بشرية / شريك العمل'),
        (generate_cuid(), q_id, 4, 'director', 'HR Director/Head of HR', 'مدير / رئيس الموارد البشرية');
    
    -- Question 4: Years of HR experience
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 4, 'MULTIPLE_CHOICE', 'Years of HR experience', 'سنوات الخبرة في الموارد البشرية', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'less-than-3', 'Less than 3 years', 'أقل من 3 سنوات'),
        (generate_cuid(), q_id, 2, '3-7', '3-7 years', '3-7 سنوات'),
        (generate_cuid(), q_id, 3, '8-15', '8-15 years', '8-15 سنة'),
        (generate_cuid(), q_id, 4, 'more-than-15', 'More than 15 years', 'أكثر من 15 سنة');
    
    -- Question 5: Years in current role
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 5, 'MULTIPLE_CHOICE', 'Years in current role', 'سنوات في دورك الحالي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'less-than-2', 'Less than 2 years', 'أقل من سنتين'),
        (generate_cuid(), q_id, 2, '2-5', '2-5 years', '2-5 سنوات'),
        (generate_cuid(), q_id, 3, '6-10', '6-10 years', '6-10 سنوات'),
        (generate_cuid(), q_id, 4, 'more-than-10', 'More than 10 years', 'أكثر من 10 سنوات');
    
    -- Question 6: Industry sector
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 6, 'MULTIPLE_CHOICE', 'Industry sector', 'القطاع الصناعي', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'financial', 'Financial Services/Banking', 'الخدمات المالية/البنوك'),
        (generate_cuid(), q_id, 2, 'manufacturing', 'Manufacturing', 'التصنيع'),
        (generate_cuid(), q_id, 3, 'technology', 'Technology/IT', 'التكنولوجيا/تكنولوجيا المعلومات'),
        (generate_cuid(), q_id, 4, 'consulting', 'Consulting', 'الاستشارات'),
        (generate_cuid(), q_id, 5, 'retail', 'Retail/Consumer Goods', 'البيع بالتجزئة/السلع الاستهلاكية'),
        (generate_cuid(), q_id, 6, 'other', 'Other (please specify)', 'أخرى (يرجى التحديد)');
    
    -- Question 7: Organization size
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 7, 'MULTIPLE_CHOICE', 'Organization size (number of employees)', 'حجم المنظمة (عدد الموظفين)', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'small', '50-250 employees (Small)', '50-250 موظف (صغيرة)'),
        (generate_cuid(), q_id, 2, 'medium', '251-1000 employees (Medium)', '251-1000 موظف (متوسطة)'),
        (generate_cuid(), q_id, 3, 'large', 'More than 1000 employees (Large)', 'أكثر من 1000 موظف (كبيرة)');
    
    -- Question 8: Level of Involvement
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 8, 'MULTIPLE_CHOICE', 'Your Level of Involvement in Competency Framework Design/Implementation', 'مستوى مشاركتك في تصميم/تطبيق إطار الكفاءات', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, 'primary', 'Primary designer/implementer', 'المصمم/المطبق الرئيسي'),
        (generate_cuid(), q_id, 2, 'actively-involved', 'Actively involved in the project team', 'مشارك نشط في فريق المشروع'),
        (generate_cuid(), q_id, 3, 'moderate', 'Moderate involvement', 'مشاركة معتدلة'),
        (generate_cuid(), q_id, 4, 'limited', 'Limited involvement (administrative support)', 'مشاركة محدودة (دعم إداري)');
    
    -- Question 9: Years organization has used competency frameworks
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 9, 'MULTIPLE_CHOICE', 'Years Your Organization Has Used Competency Frameworks', 'عدد السنوات التي استخدمت فيها منظمتك أطر الكفاءات', true);
    INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
    VALUES
        (generate_cuid(), q_id, 1, '2-3', '2-3 years', '2-3 سنوات'),
        (generate_cuid(), q_id, 2, '4-5', '4-5 years', '4-5 سنوات'),
        (generate_cuid(), q_id, 3, '6-10', '6-10 years', '6-10 سنوات'),
        (generate_cuid(), q_id, 4, 'more-than-10', 'More than 10 years', 'أكثر من 10 سنوات');
    
    -- Questions 10-21: Scale questions
    -- Question 10
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 10, 'SCALE_1_5', 'The competency framework design aligns well with our organizational goals and strategy.', 'يتوافق تصميم إطار الكفاءات بشكل جيد مع أهدافنا التنظيمية واستراتيجيتنا.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 11
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 11, 'SCALE_1_5', 'The competency framework covers all essential competencies needed for our organization.', 'يغطي إطار الكفاءات جميع الكفاءات الأساسية المطلوبة لمنظمتنا.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 12
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 12, 'SCALE_1_5', 'The implementation process was well-planned and executed.', 'كانت عملية التطبيق مخططاً لها ومنفذة بشكل جيد.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 13
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 13, 'SCALE_1_5', 'Adequate resources were allocated for the competency framework implementation.', 'تم تخصيص موارد كافية لتطبيق إطار الكفاءات.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 14
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 14, 'SCALE_1_5', 'I believe the competency framework has been successful in our organization.', 'أعتقد أن إطار الكفاءات كان ناجحاً في منظمتنا.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 15
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 15, 'SCALE_1_5', 'The competency framework has improved our talent management processes.', 'حسّن إطار الكفاءات عمليات إدارة المواهب لدينا.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 16
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 16, 'SCALE_1_5', 'The competency framework has positively impacted overall employee performance.', 'أثر إطار الكفاءات بشكل إيجابي على أداء الموظفين بشكل عام.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 17
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 17, 'SCALE_1_5', 'The competency framework has contributed to better employee development outcomes.', 'ساهم إطار الكفاءات في نتائج أفضل لتطوير الموظفين.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 18
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 18, 'SCALE_1_5', 'Resistance to change was a significant challenge during implementation.', 'كانت مقاومة التغيير تحدياً كبيراً أثناء التطبيق.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 19
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 19, 'SCALE_1_5', 'Lack of adequate training resources was a challenge.', 'كان نقص موارد التدريب الكافية تحدياً.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 20
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 20, 'SCALE_1_5', 'Strong leadership support was critical for successful implementation.', 'كان دعم القيادة القوي حاسماً للتطبيق الناجح.', true);
    PERFORM create_scale_options(q_id);
    
    -- Question 21
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 21, 'SCALE_1_5', 'Clear communication about the framework was important for success.', 'كان التواصل الواضح حول الإطار مهماً للنجاح.', true);
    PERFORM create_scale_options(q_id);
    
    -- Questions 22-26: Text questions
    -- Question 22
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 22, 'TEXT', 'What do you consider the most significant achievements of your organization''s competency framework?', 'ما الذي تعتبره أهم إنجاز لإطار الكفاءات في منظمتك؟', false);
    
    -- Question 23
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 23, 'TEXT', 'What were the main challenges encountered during framework design and implementation, and how were they addressed?', 'ما التحديات الرئيسية التي تمت مواجهتها أثناء تصميم وتطبيق الإطار، وكيف تم معالجتها؟', false);
    
    -- Question 24
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 24, 'TEXT', 'What improvements or enhancements would you recommend for the current competency framework?', 'ما التحسينات أو التحسينات التي توصي بها لإطار الكفاءات الحالي؟', false);
    
    -- Question 25
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 25, 'TEXT', 'Based on your experience, what advice would you give to other organizations planning to implement competency frameworks?', 'بناءً على خبرتك، ما النصح الذي تقدمه للمنظمات الأخرى التي تخطط لتطبيق أطر الكفاءات؟', false);
    
    -- Question 26
    q_id := generate_cuid();
    INSERT INTO "Question" (id, "questionnaireId", "order", type, "textEn", "textAr", "isRequired")
    VALUES (q_id, hr_q_id, 26, 'TEXT', 'How do you measure the effectiveness and ROI of the competency framework in your organization?', 'كيف تقيس فعالية وعائد الاستثمار لإطار الكفاءات في منظمتك؟', false);
    
    RAISE NOTICE '✅ HR questionnaire seeded with 26 questions';
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅✅✅ COMPLETE SEED SUCCESSFUL! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE 'Created:';
    RAISE NOTICE '  ✅ Staff Questionnaire: 76 questions';
    RAISE NOTICE '  ✅ Manager Questionnaire: 25 questions';
    RAISE NOTICE '  ✅ HR Questionnaire: 26 questions';
    RAISE NOTICE '';
    RAISE NOTICE 'Total: 127 questions across 3 questionnaires';
    RAISE NOTICE '';
END $$;

