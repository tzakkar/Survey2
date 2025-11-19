-- Verify Options for All Questions
-- Run this in Supabase Dashboard → SQL Editor
-- This checks if all SCALE_1_5 and MULTIPLE_CHOICE questions have options

-- Check questions missing options
SELECT 
    q.slug as questionnaire_slug,
    qu."order",
    qu.type,
    qu."textEn",
    COUNT(opt.id) as option_count
FROM "Questionnaire" q
JOIN "Question" qu ON qu."questionnaireId" = q.id
LEFT JOIN "Option" opt ON opt."questionId" = qu.id
WHERE qu.type IN ('SCALE_1_5', 'MULTIPLE_CHOICE')
GROUP BY q.slug, qu.id, qu."order", qu.type, qu."textEn"
HAVING COUNT(opt.id) = 0
ORDER BY q.slug, qu."order";

-- Summary: Count questions by type and option status
SELECT 
    q.slug,
    qu.type,
    COUNT(DISTINCT qu.id) as total_questions,
    COUNT(DISTINCT CASE WHEN opt.id IS NOT NULL THEN qu.id END) as questions_with_options,
    COUNT(DISTINCT CASE WHEN opt.id IS NULL THEN qu.id END) as questions_without_options
FROM "Questionnaire" q
JOIN "Question" qu ON qu."questionnaireId" = q.id
LEFT JOIN "Option" opt ON opt."questionId" = qu.id
WHERE qu.type IN ('SCALE_1_5', 'MULTIPLE_CHOICE')
GROUP BY q.slug, qu.type
ORDER BY q.slug, qu.type;

-- Expected: All SCALE_1_5 questions should have 5 options
-- Expected: All MULTIPLE_CHOICE questions should have at least 2 options

