-- Fix Missing Question Assignments
-- Run this to assign remaining questions to their correct sections

DO $$
DECLARE
    staff_q_id TEXT;
    section_a_id TEXT;
    section_b_id TEXT;
    section_i_id TEXT;
    section_j_id TEXT;
    section_k_id TEXT;
BEGIN
    -- Get staff questionnaire ID
    SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';
    
    IF staff_q_id IS NULL THEN
        RAISE EXCEPTION 'Staff questionnaire not found.';
    END IF;

    -- Get section IDs
    SELECT id INTO section_a_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 1;
    
    SELECT id INTO section_b_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 2;
    
    SELECT id INTO section_i_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 9;
    
    SELECT id INTO section_j_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 10;
    
    SELECT id INTO section_k_id FROM "Section" 
    WHERE "questionnaireId" = staff_q_id AND "order" = 11;

    -- Fix Section A: Assign questions 1-10 (some might be missing)
    UPDATE "Question" 
    SET "sectionId" = section_a_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 1 AND 10
    AND "sectionId" IS NULL;

    -- Fix Section B: Assign questions 11-16 (some might be missing)
    UPDATE "Question" 
    SET "sectionId" = section_b_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 11 AND 16
    AND "sectionId" IS NULL;

    -- Fix Section I: Assign questions 62-67 (currently only 62-63 are assigned)
    UPDATE "Question" 
    SET "sectionId" = section_i_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 62 AND 67
    AND ("sectionId" IS NULL OR "sectionId" != section_i_id);

    -- Fix Section J: Assign questions 68-72 (currently none assigned)
    UPDATE "Question" 
    SET "sectionId" = section_j_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" BETWEEN 68 AND 72
    AND "sectionId" IS NULL;

    -- Fix Section K: Assign questions 73 and above (currently none assigned)
    UPDATE "Question" 
    SET "sectionId" = section_k_id 
    WHERE "questionnaireId" = staff_q_id 
    AND "order" >= 73
    AND "sectionId" IS NULL;

    RAISE NOTICE '✅ Updated question assignments';
    
END $$;

-- Check what questions exist and their current assignments
SELECT 
    q."order",
    q."textEn",
    s."titleEn" as section_title,
    CASE 
        WHEN q."sectionId" IS NULL THEN '❌ No section'
        ELSE '✅ Assigned'
    END as status
FROM "Question" q
LEFT JOIN "Section" s ON s.id = q."sectionId"
WHERE q."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
ORDER BY q."order";

-- Summary of unassigned questions
SELECT 
    COUNT(*) as unassigned_count,
    MIN("order") as min_order,
    MAX("order") as max_order
FROM "Question"
WHERE "questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
AND "sectionId" IS NULL;

