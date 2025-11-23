-- Assign All Questions to Sections
-- This script will assign questions based on what actually exists in your database

DO $$
DECLARE
    staff_q_id TEXT;
    section_ids TEXT[];
    i INTEGER;
BEGIN
    -- Get staff questionnaire ID
    SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';
    
    IF staff_q_id IS NULL THEN
        RAISE EXCEPTION 'Staff questionnaire not found.';
    END IF;

    -- Get all section IDs in order
    SELECT ARRAY_AGG(id ORDER BY "order") INTO section_ids
    FROM "Section"
    WHERE "questionnaireId" = staff_q_id;

    -- Section A (order 1): Questions 1-10
    UPDATE "Question" 
    SET "sectionId" = section_ids[1]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 1 AND 10;

    -- Section B (order 2): Questions 11-16
    UPDATE "Question" 
    SET "sectionId" = section_ids[2]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 11 AND 16;

    -- Section C (order 3): Questions 17-24
    UPDATE "Question" 
    SET "sectionId" = section_ids[3]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 17 AND 24;

    -- Section D (order 4): Questions 25-34
    UPDATE "Question" 
    SET "sectionId" = section_ids[4]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 25 AND 34;

    -- Section E (order 5): Questions 35-40
    UPDATE "Question" 
    SET "sectionId" = section_ids[5]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 35 AND 40;

    -- Section F (order 6): Questions 41-45
    UPDATE "Question" 
    SET "sectionId" = section_ids[6]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 41 AND 45;

    -- Section G (order 7): Questions 46-49
    UPDATE "Question" 
    SET "sectionId" = section_ids[7]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 46 AND 49;

    -- Section H (order 8): Questions 50-61
    UPDATE "Question" 
    SET "sectionId" = section_ids[8]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 50 AND 61;

    -- Section I (order 9): Questions 62-67
    UPDATE "Question" 
    SET "sectionId" = section_ids[9]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 62 AND 67;

    -- Section J (order 10): Questions 68-72
    UPDATE "Question" 
    SET "sectionId" = section_ids[10]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 68 AND 72;

    -- Section K (order 11): Questions 73 and above
    UPDATE "Question" 
    SET "sectionId" = section_ids[11]
    WHERE "questionnaireId" = staff_q_id 
    AND "order" >= 73;

    RAISE NOTICE '✅ Assigned all questions to sections';
    
END $$;

-- Show final verification
SELECT 
    s."order" as section_order,
    s."titleEn" as section_title,
    COUNT(q.id) as question_count,
    MIN(q."order") as first_question,
    MAX(q."order") as last_question,
    STRING_AGG(q."order"::TEXT, ', ' ORDER BY q."order") as question_orders
FROM "Section" s
LEFT JOIN "Question" q ON q."sectionId" = s.id
WHERE s."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
GROUP BY s.id, s."order", s."titleEn"
ORDER BY s."order";

-- Show unassigned questions (if any)
SELECT 
    q."order",
    LEFT(q."textEn", 80) as question_text
FROM "Question" q
WHERE q."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
AND q."sectionId" IS NULL
ORDER BY q."order";

