-- Fix missing options for: "I meet all formal performance requirements of my job."
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Find the question
DO $$
DECLARE
    question_record RECORD;
    option_count INTEGER;
BEGIN
    -- Find the question
    SELECT id, "questionnaireId", "order", type, "textEn"
    INTO question_record
    FROM "Question"
    WHERE "textEn" ILIKE '%meet all formal performance requirements%'
       OR "textEn" ILIKE '%formal performance requirements%'
    LIMIT 1;

    IF question_record.id IS NULL THEN
        RAISE NOTICE '❌ Question not found';
        RETURN;
    END IF;

    RAISE NOTICE '📋 Found question:';
    RAISE NOTICE '   ID: %', question_record.id;
    RAISE NOTICE '   Order: %', question_record."order";
    RAISE NOTICE '   Type: %', question_record.type;
    RAISE NOTICE '   Text: "%"', question_record."textEn";

    -- Count existing options
    SELECT COUNT(*) INTO option_count
    FROM "Option"
    WHERE "questionId" = question_record.id;

    RAISE NOTICE '   Current options: %', option_count;

    -- If SCALE_1_5 and no options, create them
    IF question_record.type = 'SCALE_1_5' AND option_count = 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  Question is missing options! Creating them now...';

        INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
        VALUES
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 1, '1', '1 - Strongly Disagree', '١ - أختلف بشدة'),
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 2, '2', '2 - Disagree', '٢ - أختلف'),
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 3, '3', '3 - Neutral', '٣ - محايد'),
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 4, '4', '4 - Agree', '٤ - أتفق'),
            ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 5, '5', '5 - Strongly Agree', '٥ - أتفق بشدة');

        RAISE NOTICE '✅ Created 5 options for this question';
    ELSIF question_record.type = 'SCALE_1_5' AND option_count < 5 THEN
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  Question has only % options (expected 5). Creating missing ones...', option_count;
        
        -- Create missing options (check which ones exist)
        IF NOT EXISTS (SELECT 1 FROM "Option" WHERE "questionId" = question_record.id AND "order" = 1) THEN
            INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
            VALUES ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 1, '1', '1 - Strongly Disagree', '١ - أختلف بشدة');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM "Option" WHERE "questionId" = question_record.id AND "order" = 2) THEN
            INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
            VALUES ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 2, '2', '2 - Disagree', '٢ - أختلف');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM "Option" WHERE "questionId" = question_record.id AND "order" = 3) THEN
            INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
            VALUES ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 3, '3', '3 - Neutral', '٣ - محايد');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM "Option" WHERE "questionId" = question_record.id AND "order" = 4) THEN
            INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
            VALUES ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 4, '4', '4 - Agree', '٤ - أتفق');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM "Option" WHERE "questionId" = question_record.id AND "order" = 5) THEN
            INSERT INTO "Option" (id, "questionId", "order", value, "labelEn", "labelAr")
            VALUES ('c' || to_hex(extract(epoch from now())::bigint) || substr(md5(random()::text), 1, 9), question_record.id, 5, '5', '5 - Strongly Agree', '٥ - أتفق بشدة');
        END IF;
        
        RAISE NOTICE '✅ Created missing options';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '✅ Question already has % options', option_count;
    END IF;

    -- Verify final state
    SELECT COUNT(*) INTO option_count
    FROM "Option"
    WHERE "questionId" = question_record.id;

    RAISE NOTICE '';
    RAISE NOTICE '📊 Final verification:';
    RAISE NOTICE '   Question ID: %', question_record.id;
    RAISE NOTICE '   Total options: %', option_count;

    IF option_count = 5 THEN
        RAISE NOTICE '✅ SUCCESS: Question now has all 5 scale options!';
    END IF;
END $$;

-- Step 2: Verify the fix worked
SELECT 
    q."order",
    q."textEn",
    q.type,
    COUNT(o.id) AS option_count,
    STRING_AGG(o."labelEn", ' | ' ORDER BY o."order") AS options
FROM "Question" q
LEFT JOIN "Option" o ON o."questionId" = q.id
WHERE q."textEn" ILIKE '%meet all formal performance requirements%'
   OR q."textEn" ILIKE '%formal performance requirements%'
GROUP BY q.id, q."order", q."textEn", q.type;

