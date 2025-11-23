-- Diagnostic Query: Check Sections Status
-- Run this to verify sections are created and questions are assigned

-- 1. Check if Section table exists and has data
SELECT 
    'Section Table Check' as check_type,
    COUNT(*) as count,
    CASE WHEN COUNT(*) > 0 THEN '✅ Sections exist' ELSE '❌ No sections found' END as status
FROM "Section"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire');

-- 2. List all sections for staff questionnaire
SELECT 
    s."order",
    s."titleEn",
    s."titleAr",
    s."instructionsEn",
    s."instructionsAr",
    COUNT(q.id) as question_count
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
GROUP BY s.id, s."order", s."titleEn", s."titleAr", s."instructionsEn", s."instructionsAr"
ORDER BY s."order";

-- 3. Check questions with and without sections
SELECT 
    'Questions with sections' as category,
    COUNT(*) as count
FROM "Question"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
AND "sectionId" IS NOT NULL

UNION ALL

SELECT 
    'Questions without sections' as category,
    COUNT(*) as count
FROM "Question"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
AND "sectionId" IS NULL;

-- 4. Show sample questions with their sections
SELECT 
    q."order",
    q."textEn",
    s."titleEn" as section_title,
    CASE WHEN q."sectionId" IS NULL THEN '❌ No section' ELSE '✅ Assigned' END as assignment_status
FROM "Question" q
LEFT JOIN "Section" s ON s.id = q."sectionId"
WHERE q."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
ORDER BY q."order"
LIMIT 20;

