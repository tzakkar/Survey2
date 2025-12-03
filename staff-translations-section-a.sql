-- Staff Questionnaire: Arabic Translations for Section A (Demographics)
DO $$
DECLARE
  staff_q_id TEXT;
  sec_a_id   TEXT;
BEGIN
  SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';
  SELECT id INTO sec_a_id FROM "Section" WHERE "questionnaireId" = staff_q_id AND "order" = 1;

  IF sec_a_id IS NULL THEN
    RAISE EXCEPTION 'Section A not found!';
  END IF;

  -- Update Section A title
  UPDATE "Section"
  SET "titleAr" = 'القسم أ: المعلومات الديموغرافية'
  WHERE id = sec_a_id;

  -- Q1: Gender
  UPDATE "Question"
  SET "textAr" = 'الجنس'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 1;

  UPDATE "Option"
  SET "labelAr" = 'ذكر'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 1)
    AND value = 'male';

  UPDATE "Option"
  SET "labelAr" = 'أنثى'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 1)
    AND value = 'female';

  UPDATE "Option"
  SET "labelAr" = 'أفضل عدم الإفصاح'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 1)
    AND value = 'prefer-not-say';

  -- Q2: Age Group
  UPDATE "Question"
  SET "textAr" = 'الفئة العمرية'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 2;

  UPDATE "Option"
  SET "labelAr" = '20-29 سنة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 2)
    AND value = '20-29';

  UPDATE "Option"
  SET "labelAr" = '30-39 سنة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 2)
    AND value = '30-39';

  UPDATE "Option"
  SET "labelAr" = '40-49 سنة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 2)
    AND value = '40-49';

  UPDATE "Option"
  SET "labelAr" = '50 سنة فما فوق'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 2)
    AND value = '50-plus';

  -- Q3: Highest Educational Level
  UPDATE "Question"
  SET "textAr" = 'أعلى مستوى تعليمي'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 3;

  UPDATE "Option"
  SET "labelAr" = 'شهادة الثانوية العامة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 3)
    AND value = 'high-school';

  UPDATE "Option"
  SET "labelAr" = 'درجة البكالوريوس'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 3)
    AND value = 'bachelors';

  UPDATE "Option"
  SET "labelAr" = 'درجة الماجستير'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 3)
    AND value = 'masters';

  UPDATE "Option"
  SET "labelAr" = 'درجة الدكتوراه أو أعلى'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 3)
    AND value = 'doctoral';

  -- Q4: Current Position Level
  UPDATE "Question"
  SET "textAr" = 'مستوى المنصب الحالي'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 4;

  UPDATE "Option"
  SET "labelAr" = 'مبتدئ/صغير'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 4)
    AND value = 'entry';

  UPDATE "Option"
  SET "labelAr" = 'متوسط/منتصف المستوى'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 4)
    AND value = 'intermediate';

  UPDATE "Option"
  SET "labelAr" = 'كبير/أخصائي'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 4)
    AND value = 'senior';

  UPDATE "Option"
  SET "labelAr" = 'قائد فريق/مشرف'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 4)
    AND value = 'team-lead';

  -- Q5: Years with Current Organization
  UPDATE "Question"
  SET "textAr" = 'سنوات العمل في المنظمة الحالية'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 5;

  UPDATE "Option"
  SET "labelAr" = 'أقل من سنة واحدة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 5)
    AND value = 'less-than-1';

  UPDATE "Option"
  SET "labelAr" = '1-3 سنوات'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 5)
    AND value = '1-3';

  UPDATE "Option"
  SET "labelAr" = '4-7 سنوات'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 5)
    AND value = '4-7';

  UPDATE "Option"
  SET "labelAr" = '8-15 سنة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 5)
    AND value = '8-15';

  UPDATE "Option"
  SET "labelAr" = 'أكثر من 15 سنة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 5)
    AND value = 'more-than-15';

  -- Q6: Total Years of Work Experience
  UPDATE "Question"
  SET "textAr" = 'إجمالي سنوات الخبرة العملية'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 6;

  UPDATE "Option"
  SET "labelAr" = 'أقل من 3 سنوات'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 6)
    AND value = 'less-than-3';

  UPDATE "Option"
  SET "labelAr" = '3-7 سنوات'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 6)
    AND value = '3-7';

  UPDATE "Option"
  SET "labelAr" = '8-15 سنة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 6)
    AND value = '8-15';

  UPDATE "Option"
  SET "labelAr" = 'أكثر من 15 سنة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 6)
    AND value = 'more-than-15';

  -- Q7: Department/Function
  UPDATE "Question"
  SET "textAr" = 'القسم/الوظيفة'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 7;

  UPDATE "Option"
  SET "labelAr" = 'العمليات/الإنتاج'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 7)
    AND value = 'operations';

  UPDATE "Option"
  SET "labelAr" = 'المبيعات/التسويق'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 7)
    AND value = 'sales';

  UPDATE "Option"
  SET "labelAr" = 'المالية/المحاسبة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 7)
    AND value = 'finance';

  UPDATE "Option"
  SET "labelAr" = 'تقنية المعلومات/التكنولوجيا'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 7)
    AND value = 'it';

  UPDATE "Option"
  SET "labelAr" = 'الموارد البشرية/الإدارة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 7)
    AND value = 'hr';

  UPDATE "Option"
  SET "labelAr" = 'خدمة العملاء'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 7)
    AND value = 'customer-service';

  UPDATE "Option"
  SET "labelAr" = 'أخرى (يرجى التحديد)'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 7)
    AND value = 'other';

  -- Q8: Industry Sector
  UPDATE "Question"
  SET "textAr" = 'قطاع الصناعة'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 8;

  UPDATE "Option"
  SET "labelAr" = 'الخدمات المالية/المصرفية'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 8)
    AND value = 'financial';

  UPDATE "Option"
  SET "labelAr" = 'التصنيع'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 8)
    AND value = 'manufacturing';

  UPDATE "Option"
  SET "labelAr" = 'التكنولوجيا/تقنية المعلومات'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 8)
    AND value = 'technology';

  UPDATE "Option"
  SET "labelAr" = 'الاستشارات'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 8)
    AND value = 'consulting';

  UPDATE "Option"
  SET "labelAr" = 'التجزئة/السلع الاستهلاكية'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 8)
    AND value = 'retail';

  UPDATE "Option"
  SET "labelAr" = 'أخرى (يرجى التحديد)'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 8)
    AND value = 'other';

  -- Q9: Organization Size
  UPDATE "Question"
  SET "textAr" = 'حجم المنظمة (عدد الموظفين)'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 9;

  UPDATE "Option"
  SET "labelAr" = '50-250 موظف (صغيرة)'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 9)
    AND value = 'small';

  UPDATE "Option"
  SET "labelAr" = '251-1000 موظف (متوسطة)'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 9)
    AND value = 'medium';

  UPDATE "Option"
  SET "labelAr" = 'أكثر من 1000 موظف (كبيرة)'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 9)
    AND value = 'large';

  -- Q10: How long under competency framework
  UPDATE "Question"
  SET "textAr" = 'كم من الوقت تعمل تحت نظام إطار الكفاءات؟'
  WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 10;

  UPDATE "Option"
  SET "labelAr" = 'أقل من سنة واحدة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 10)
    AND value = 'less-than-1';

  UPDATE "Option"
  SET "labelAr" = '1-2 سنة'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 10)
    AND value = '1-2';

  UPDATE "Option"
  SET "labelAr" = '3-4 سنوات'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 10)
    AND value = '3-4';

  UPDATE "Option"
  SET "labelAr" = 'أكثر من 4 سنوات'
  WHERE "questionId" = (SELECT id FROM "Question" WHERE "questionnaireId" = staff_q_id AND "sectionId" = sec_a_id AND "order" = 10)
    AND value = 'more-than-4';

  RAISE NOTICE '✅ Section A Arabic translations completed!';
END $$;

