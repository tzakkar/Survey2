-- Fix Staff Questionnaire: Ensure it's active and properly configured
DO $$
DECLARE
  staff_q_id TEXT;
BEGIN
  -- Get the staff questionnaire ID
  SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';

  IF staff_q_id IS NULL THEN
    RAISE EXCEPTION 'Staff questionnaire not found! Please create it first.';
  END IF;

  -- Ensure the questionnaire is active
  UPDATE "Questionnaire"
  SET "isActive" = TRUE
  WHERE id = staff_q_id;

  RAISE NOTICE '✅ Staff questionnaire activated (ID: %)', staff_q_id;

  -- Verify sections exist
  IF NOT EXISTS (
    SELECT 1 FROM "Section" 
    WHERE "questionnaireId" = staff_q_id
  ) THEN
    RAISE WARNING '⚠️ No sections found for staff questionnaire!';
  ELSE
    RAISE NOTICE '✅ Found % sections', (
      SELECT COUNT(*) FROM "Section" WHERE "questionnaireId" = staff_q_id
    );
  END IF;

  -- Verify questions exist
  IF NOT EXISTS (
    SELECT 1 FROM "Question" 
    WHERE "questionnaireId" = staff_q_id
  ) THEN
    RAISE WARNING '⚠️ No questions found for staff questionnaire!';
  ELSE
    RAISE NOTICE '✅ Found % questions', (
      SELECT COUNT(*) FROM "Question" WHERE "questionnaireId" = staff_q_id
    );
  END IF;

END $$;

-- Show final status
SELECT 
  'Questionnaire Status' as check_type,
  slug,
  "isActive",
  (SELECT COUNT(*) FROM "Section" WHERE "questionnaireId" = q.id) as sections,
  (SELECT COUNT(*) FROM "Question" WHERE "questionnaireId" = q.id) as questions
FROM "Questionnaire" q
WHERE slug = 'staff-questionnaire';

