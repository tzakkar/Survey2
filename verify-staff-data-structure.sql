-- Verify Staff Questionnaire Data Structure
-- Check if questions are properly linked to sections

-- 1. Check Section A structure
SELECT 
  'Section A' as section_name,
  s."order" as section_order,
  s."titleEn",
  COUNT(q.id) as question_count,
  array_agg(q."order" ORDER BY q."order") as question_orders
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
  AND s."order" = 1
GROUP BY s.id, s."order", s."titleEn";

-- 2. Check Section B structure
SELECT 
  'Section B' as section_name,
  s."order" as section_order,
  s."titleEn",
  COUNT(q.id) as question_count,
  array_agg(q."order" ORDER BY q."order") as question_orders
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
  AND s."order" = 2
GROUP BY s.id, s."order", s."titleEn";

-- 3. Check if any questions are missing sectionId
SELECT 
  COUNT(*) as questions_without_section
FROM "Question"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
  AND "sectionId" IS NULL;

-- 4. List all questions with their sections
SELECT 
  q."order" as question_order,
  q.type,
  q."textEn",
  s."order" as section_order,
  s."titleEn" as section_title
FROM "Question" q
LEFT JOIN "Section" s ON q."sectionId" = s.id
WHERE q."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
ORDER BY s."order", q."order"
LIMIT 20;

-- 5. Check options for Section A questions
SELECT 
  q."order" as question_order,
  q.type,
  COUNT(o.id) as option_count
FROM "Question" q
LEFT JOIN "Option" o ON o."questionId" = q.id
WHERE q."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
  AND q."sectionId" = (SELECT id FROM "Section" WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire') AND "order" = 1)
GROUP BY q.id, q."order", q.type
ORDER BY q."order";

