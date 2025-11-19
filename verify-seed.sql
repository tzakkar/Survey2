-- Verify Seed Data
-- Run this in Supabase Dashboard → SQL Editor to check what was created

-- Check Questionnaires
SELECT 
    slug,
    "titleEn",
    "audienceType",
    "isActive",
    "createdAt"
FROM "Questionnaire"
ORDER BY "createdAt";

-- Count Questions per Questionnaire
SELECT 
    q.slug,
    COUNT(qu.id) as question_count
FROM "Questionnaire" q
LEFT JOIN "Question" qu ON qu."questionnaireId" = q.id
GROUP BY q.slug
ORDER BY q.slug;

-- Check Sample Questions
SELECT 
    q.slug as questionnaire,
    qu."order",
    qu.type,
    qu."textEn",
    qu."isRequired",
    COUNT(opt.id) as option_count
FROM "Questionnaire" q
JOIN "Question" qu ON qu."questionnaireId" = q.id
LEFT JOIN "Option" opt ON opt."questionId" = qu.id
GROUP BY q.slug, qu.id, qu."order", qu.type, qu."textEn", qu."isRequired"
ORDER BY q.slug, qu."order"
LIMIT 10;

