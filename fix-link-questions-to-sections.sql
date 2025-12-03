-- Fix: Link all questions to their correct sections
-- This ensures questions are properly grouped and displayed

DO $$
DECLARE
  staff_q_id TEXT;
  sec_a_id   TEXT;
  sec_b_id   TEXT;
BEGIN
  -- Get questionnaire ID
  SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';
  
  IF staff_q_id IS NULL THEN
    RAISE EXCEPTION 'Staff questionnaire not found!';
  END IF;

  -- Get Section A ID (order = 1)
  SELECT id INTO sec_a_id FROM "Section"
  WHERE "questionnaireId" = staff_q_id AND "order" = 1;
  
  -- Get Section B ID (order = 2)
  SELECT id INTO sec_b_id FROM "Section"
  WHERE "questionnaireId" = staff_q_id AND "order" = 2;

  -- Link Section A questions (order 1-10)
  IF sec_a_id IS NOT NULL THEN
    UPDATE "Question"
    SET "sectionId" = sec_a_id
    WHERE "questionnaireId" = staff_q_id
      AND "order" BETWEEN 1 AND 10
      AND ("sectionId" IS NULL OR "sectionId" != sec_a_id);
    
    RAISE NOTICE '✅ Linked Section A questions (order 1-10) to section ID: %', sec_a_id;
  ELSE
    RAISE WARNING '⚠️ Section A not found!';
  END IF;

  -- Link Section B questions (order 11-16)
  IF sec_b_id IS NOT NULL THEN
    UPDATE "Question"
    SET "sectionId" = sec_b_id
    WHERE "questionnaireId" = staff_q_id
      AND "order" BETWEEN 11 AND 16
      AND ("sectionId" IS NULL OR "sectionId" != sec_b_id);
    
    RAISE NOTICE '✅ Linked Section B questions (order 11-16) to section ID: %', sec_b_id;
  ELSE
    RAISE WARNING '⚠️ Section B not found!';
  END IF;

  -- Show summary
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '  - Questions with sectionId: %', (
    SELECT COUNT(*) FROM "Question" 
    WHERE "questionnaireId" = staff_q_id AND "sectionId" IS NOT NULL
  );
  RAISE NOTICE '  - Questions without sectionId: %', (
    SELECT COUNT(*) FROM "Question" 
    WHERE "questionnaireId" = staff_q_id AND "sectionId" IS NULL
  );

END $$;

-- Verify the fix
SELECT 
  s."order" as section_order,
  s."titleEn" as section_title,
  COUNT(q.id) as question_count,
  array_agg(q."order" ORDER BY q."order") as question_orders
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
GROUP BY s.id, s."order", s."titleEn"
ORDER BY s."order";

