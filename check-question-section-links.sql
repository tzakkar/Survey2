-- Check if questions are properly linked to sections
-- This is critical - questions MUST have sectionId set

-- 1. Check questions with sectionId
SELECT 
  'Questions WITH sectionId' as status,
  COUNT(*) as count
FROM "Question"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
  AND "sectionId" IS NOT NULL;

-- 2. Check questions WITHOUT sectionId (this is the problem!)
SELECT 
  'Questions WITHOUT sectionId' as status,
  COUNT(*) as count
FROM "Question"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
  AND "sectionId" IS NULL;

-- 3. Show all questions and their section links
SELECT 
  q."order" as question_order,
  q.type,
  q."sectionId",
  s."order" as section_order,
  s."titleEn" as section_title,
  CASE 
    WHEN q."sectionId" IS NULL THEN '❌ MISSING'
    WHEN q."sectionId" = s.id THEN '✅ LINKED'
    ELSE '⚠️ WRONG LINK'
  END as link_status
FROM "Question" q
LEFT JOIN "Section" s ON q."sectionId" = s.id
WHERE q."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
ORDER BY q."order";

