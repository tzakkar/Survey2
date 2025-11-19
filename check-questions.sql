-- Check Questions in Database
-- Run this in Supabase Dashboard → SQL Editor

-- Count questions per questionnaire
SELECT 
    q.slug,
    q."titleEn",
    COUNT(qu.id) as question_count
FROM "Questionnaire" q
LEFT JOIN "Question" qu ON qu."questionnaireId" = q.id
GROUP BY q.id, q.slug, q."titleEn"
ORDER BY q.slug;

-- Expected counts:
-- Staff: 23 questions
-- Manager: 17 questions  
-- HR: 19 questions

-- Show all questions for Staff questionnaire
SELECT 
    qu."order",
    qu.type,
    qu."textEn",
    qu."isRequired",
    COUNT(opt.id) as option_count
FROM "Questionnaire" q
JOIN "Question" qu ON qu."questionnaireId" = q.id
LEFT JOIN "Option" opt ON opt."questionId" = qu.id
WHERE q.slug = 'staff-questionnaire'
GROUP BY qu.id, qu."order", qu.type, qu."textEn", qu."isRequired"
ORDER BY qu."order";

-- Show all questions for Manager questionnaire
SELECT 
    qu."order",
    qu.type,
    qu."textEn",
    qu."isRequired",
    COUNT(opt.id) as option_count
FROM "Questionnaire" q
JOIN "Question" qu ON qu."questionnaireId" = q.id
LEFT JOIN "Option" opt ON opt."questionId" = qu.id
WHERE q.slug = 'manager-questionnaire'
GROUP BY qu.id, qu."order", qu.type, qu."textEn", qu."isRequired"
ORDER BY qu."order";

-- Show all questions for HR questionnaire
SELECT 
    qu."order",
    qu.type,
    qu."textEn",
    qu."isRequired",
    COUNT(opt.id) as option_count
FROM "Questionnaire" q
JOIN "Question" qu ON qu."questionnaireId" = q.id
LEFT JOIN "Option" opt ON opt."questionId" = qu.id
WHERE q.slug = 'hr-questionnaire'
GROUP BY qu.id, qu."order", qu.type, qu."textEn", qu."isRequired"
ORDER BY qu."order";

