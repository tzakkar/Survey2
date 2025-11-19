-- Check specific question: "I meet all formal performance requirements of my job."
-- Run this in Supabase Dashboard → SQL Editor

-- Find the question
SELECT 
    q.id AS question_id,
    q."order",
    q.type,
    q."textEn",
    q."textAr",
    q."isRequired",
    qn.slug AS questionnaire_slug
FROM "Question" q
JOIN "Questionnaire" qn ON q."questionnaireId" = qn.id
WHERE q."textEn" LIKE '%meet all formal performance requirements%'
   OR q."textEn" LIKE '%formal performance requirements%';

-- Check if this question has options
SELECT 
    q."textEn" AS question_text,
    q.type AS question_type,
    COUNT(o.id) AS option_count,
    STRING_AGG(o."labelEn", ', ' ORDER BY o."order") AS option_labels
FROM "Question" q
JOIN "Questionnaire" qn ON q."questionnaireId" = qn.id
LEFT JOIN "Option" o ON o."questionId" = q.id
WHERE q."textEn" LIKE '%meet all formal performance requirements%'
   OR q."textEn" LIKE '%formal performance requirements%'
GROUP BY q.id, q."textEn", q.type, qn.slug;

-- If no options found, this will show the question without options
SELECT 
    q.id,
    q."order",
    q."textEn",
    q.type,
    'MISSING OPTIONS' AS status
FROM "Question" q
JOIN "Questionnaire" qn ON q."questionnaireId" = qn.id
LEFT JOIN "Option" o ON o."questionId" = q.id
WHERE (q."textEn" LIKE '%meet all formal performance requirements%'
   OR q."textEn" LIKE '%formal performance requirements%')
  AND q.type IN ('SCALE_1_5', 'MULTIPLE_CHOICE')
  AND o.id IS NULL;

