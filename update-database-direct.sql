-- Direct Database Update Script
-- Run this in Supabase Dashboard → SQL Editor to update the database directly
-- This bypasses network connectivity issues

-- ============================================
-- 1. Fix Missing Options for SCALE_1_5 Questions
-- ============================================

DO $$
DECLARE
    question_record RECORD;
    option_count INTEGER;
    fixed_count INTEGER := 0;
BEGIN
    RAISE NOTICE '🔍 Finding SCALE_1_5 questions without options...';
    
    -- Loop through all SCALE_1_5 questions
    FOR question_record IN 
        SELECT id, "order", "textEn", type
        FROM "Question"
        WHERE type = 'SCALE_1_5'
        ORDER BY "order"
    LOOP
        -- Check if question has options
        SELECT COUNT(*) INTO option_count
        FROM "Option"
        WHERE "questionId" = question_record.id;
        
        -- If no options, create them
        IF option_count = 0 THEN
            RAISE NOTICE '   Fixing question %: "%"', question_record."order", LEFT(question_record."textEn", 50);
            
            INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
            VALUES
                ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '1', question_record.id, 1, '1', '1 - Strongly Disagree', '١ - أختلف بشدة'),
                ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '2', question_record.id, 2, '2', '2 - Disagree', '٢ - أختلف'),
                ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '3', question_record.id, 3, '3', '3 - Neutral', '٣ - محايد'),
                ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '4', question_record.id, 4, '4', 'Agree', '٤ - أتفق'),
                ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9) || '5', question_record.id, 5, '5', '5 - Strongly Agree', '٥ - أتفق بشدة');
            
            fixed_count := fixed_count + 1;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Fixed % questions', fixed_count;
END $$;

-- ============================================
-- 2. Verify All Questions Have Options
-- ============================================

SELECT 
    q.type,
    COUNT(*) AS total_questions,
    COUNT(CASE WHEN opt.id IS NOT NULL THEN 1 END) AS questions_with_options,
    COUNT(CASE WHEN opt.id IS NULL THEN 1 END) AS questions_without_options
FROM "Question" q
LEFT JOIN "Option" opt ON q.id = opt."questionId"
WHERE q.type IN ('SCALE_1_5', 'MULTIPLE_CHOICE')
GROUP BY q.type;

-- ============================================
-- 3. List Questions Missing Options (for verification)
-- ============================================

SELECT 
    qn.slug AS questionnaire_slug,
    q."order",
    q.type,
    q."textEn"
FROM "Question" q
JOIN "Questionnaire" qn ON q."questionnaireId" = qn.id
LEFT JOIN "Option" o ON q.id = o."questionId"
WHERE q.type IN ('SCALE_1_5', 'MULTIPLE_CHOICE')
GROUP BY qn.slug, q.id, q."order", q.type, q."textEn"
HAVING COUNT(o.id) = 0
ORDER BY qn.slug, q."order";

