-- Check Staff Questionnaire Status
-- Run this to diagnose why data isn't showing

-- 1. Check if questionnaire exists and is active
SELECT 
  id,
  slug,
  "titleEn",
  "isActive",
  "createdAt"
FROM "Questionnaire"
WHERE slug = 'staff-questionnaire';

-- 2. Count sections
SELECT 
  COUNT(*) as section_count,
  array_agg("order" ORDER BY "order") as section_orders
FROM "Section"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire');

-- 3. List all sections with details
SELECT 
  s.id,
  s."order",
  s."titleEn",
  COUNT(q.id) as question_count
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
GROUP BY s.id, s."order", s."titleEn"
ORDER BY s."order";

-- 4. Count total questions
SELECT 
  COUNT(*) as total_questions,
  COUNT(DISTINCT "sectionId") as sections_with_questions
FROM "Question"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire');

-- 5. Count total options
SELECT 
  COUNT(*) as total_options
FROM "Option"
WHERE "questionId" IN (
  SELECT id FROM "Question"
  WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
);

