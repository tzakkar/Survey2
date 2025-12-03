-- Staff Questionnaire: Arabic Translations for 1-5 Scale Options
-- This updates the scale option labels for all SCALE_1_5 questions

DO $$
DECLARE
  staff_q_id TEXT;
BEGIN
  SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';

  IF staff_q_id IS NULL THEN
    RAISE EXCEPTION 'Staff questionnaire not found!';
  END IF;

  -- Update all 1-5 scale options for all SCALE_1_5 questions
  -- Option value '1' = Strongly Disagree
  UPDATE "Option"
  SET "labelAr" = 'لا أوافق بشدة'
  WHERE "questionId" IN (
    SELECT id FROM "Question"
    WHERE "questionnaireId" = staff_q_id
      AND type = 'SCALE_1_5'
  )
  AND value = '1';

  -- Option value '2' = Disagree
  UPDATE "Option"
  SET "labelAr" = 'لا أوافق'
  WHERE "questionId" IN (
    SELECT id FROM "Question"
    WHERE "questionnaireId" = staff_q_id
      AND type = 'SCALE_1_5'
  )
  AND value = '2';

  -- Option value '3' = Neutral
  UPDATE "Option"
  SET "labelAr" = 'محايد'
  WHERE "questionId" IN (
    SELECT id FROM "Question"
    WHERE "questionnaireId" = staff_q_id
      AND type = 'SCALE_1_5'
  )
  AND value = '3';

  -- Option value '4' = Agree
  UPDATE "Option"
  SET "labelAr" = 'أوافق'
  WHERE "questionId" IN (
    SELECT id FROM "Question"
    WHERE "questionnaireId" = staff_q_id
      AND type = 'SCALE_1_5'
  )
  AND value = '4';

  -- Option value '5' = Strongly Agree
  UPDATE "Option"
  SET "labelAr" = 'أوافق بشدة'
  WHERE "questionId" IN (
    SELECT id FROM "Question"
    WHERE "questionnaireId" = staff_q_id
      AND type = 'SCALE_1_5'
  )
  AND value = '5';

  RAISE NOTICE '✅ 1-5 Scale option Arabic translations completed!';
  
  -- Verify
  RAISE NOTICE '📊 Updated scale options for % SCALE_1_5 questions', (
    SELECT COUNT(DISTINCT "questionId") FROM "Option"
    WHERE "questionId" IN (
      SELECT id FROM "Question"
      WHERE "questionnaireId" = staff_q_id
        AND type = 'SCALE_1_5'
    )
  );
END $$;

