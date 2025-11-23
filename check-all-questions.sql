-- Check All Questions and Their Assignments
-- This will show you exactly which questions exist and which sections they're in

SELECT 
    q."order",
    LEFT(q."textEn", 60) as question_text,
    s."order" as section_order,
    s."titleEn" as section_title,
    CASE 
        WHEN q."sectionId" IS NULL THEN '❌ UNASSIGNED'
        ELSE '✅'
    END as status
FROM "Question" q
LEFT JOIN "Section" s ON s.id = q."sectionId"
WHERE q."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
ORDER BY q."order";

-- Count questions per section
SELECT 
    COALESCE(s."titleEn", '❌ UNASSIGNED') as section,
    COUNT(q.id) as question_count,
    STRING_AGG(q."order"::TEXT, ', ' ORDER BY q."order") as question_orders
FROM "Question" q
LEFT JOIN "Section" s ON s.id = q."sectionId"
WHERE q."questionnaireId" = (SELECT id FROM "Questionnaire" WHERE slug = 'staff-questionnaire')
GROUP BY s.id, s."titleEn"
ORDER BY 
    CASE WHEN s."order" IS NULL THEN 999 ELSE s."order" END;

