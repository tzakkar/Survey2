-- Staff Questionnaire: Arabic Translations for Sections B-K (Questions and Section Titles)
DO $$
DECLARE
  staff_q_id TEXT;
  instructions_ar TEXT := 'يرجى الإشارة إلى مستوى موافقتك على العبارات التالية المتعلقة بإطار الكفاءات في منظمتك.';
BEGIN
  SELECT id INTO staff_q_id FROM "Questionnaire" WHERE slug = 'staff-questionnaire';

  IF staff_q_id IS NULL THEN
    RAISE EXCEPTION 'Staff questionnaire not found!';
  END IF;

  -- Section B: Understanding of Competency Framework
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم ب: فهم إطار الكفاءات',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 2;

  UPDATE "Question" SET "textAr" = 'لدي فهم واضح لما هو إطار الكفاءات والغرض منه'
  WHERE "questionnaireId" = staff_q_id AND "order" = 11;

  UPDATE "Question" SET "textAr" = 'الكفاءات المطلوبة لدوري محددة بوضوح ومعلنة'
  WHERE "questionnaireId" = staff_q_id AND "order" = 12;

  UPDATE "Question" SET "textAr" = 'أفهم كيف يتم تقييم أدائي باستخدام إطار الكفاءات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 13;

  UPDATE "Question" SET "textAr" = 'أوصاف الكفاءات سهلة الفهم ومرتبطة بعملي اليومي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 14;

  UPDATE "Question" SET "textAr" = 'أعرف مستوى الكفاءة الذي أحتاج لتحقيقه لدوري الحالي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 15;

  UPDATE "Question" SET "textAr" = 'يوفر إطار الكفاءات إرشادات واضحة حول ما هو متوقع مني'
  WHERE "questionnaireId" = staff_q_id AND "order" = 16;

  -- Section C: Quality of Framework Implementation
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم ج: جودة تنفيذ الإطار',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 3;

  UPDATE "Question" SET "textAr" = 'تم شرح الغرض والفوائد من إطار الكفاءات لي بوضوح'
  WHERE "questionnaireId" = staff_q_id AND "order" = 17;

  UPDATE "Question" SET "textAr" = 'تلقيت تدريباً كافياً وتوجيهاً حول إطار الكفاءات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 18;

  UPDATE "Question" SET "textAr" = 'مديري يشرح بشكل فعال كيفية تطبيق إطار الكفاءات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 19;

  UPDATE "Question" SET "textAr" = 'الدعم والموارد متاحة لمساعدتي في تطوير الكفاءات المطلوبة'
  WHERE "questionnaireId" = staff_q_id AND "order" = 20;

  UPDATE "Question" SET "textAr" = 'عملية تقييم الكفاءات عادلة وشفافة'
  WHERE "questionnaireId" = staff_q_id AND "order" = 21;

  UPDATE "Question" SET "textAr" = 'أتلقى ملاحظات منتظمة حول تطور كفاءاتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 22;

  UPDATE "Question" SET "textAr" = 'هناك فرص واضحة لتطوير وتحسين كفاءاتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 23;

  UPDATE "Question" SET "textAr" = 'توفر المنظمة تدريباً متوافقاً مع متطلبات الكفاءات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 24;

  -- Section D: Employee Perceptions and Attitudes
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم د: تصورات ومواقف الموظفين',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 4;

  UPDATE "Question" SET "textAr" = 'إطار الكفاءات ذو صلة ومفيد لعملي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 25;

  UPDATE "Question" SET "textAr" = 'يساعدني الإطار على فهم ما أحتاج لفعله لأؤدي بشكل جيد'
  WHERE "questionnaireId" = staff_q_id AND "order" = 26;

  UPDATE "Question" SET "textAr" = 'إطار الكفاءات عادل في تقييم أدائي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 27;

  UPDATE "Question" SET "textAr" = 'يساعدني الإطار على تحديد المجالات التي أحتاج للتحسين فيها'
  WHERE "questionnaireId" = staff_q_id AND "order" = 28;

  UPDATE "Question" SET "textAr" = 'استخدام إطار الكفاءات ساعد في تطوري المهني'
  WHERE "questionnaireId" = staff_q_id AND "order" = 29;

  UPDATE "Question" SET "textAr" = 'يوفر الإطار مساراً واضحاً للتقدم الوظيفي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 30;

  UPDATE "Question" SET "textAr" = 'مناقشات الأداء مع مديري أصبحت أكثر بناءة بسبب الإطار'
  WHERE "questionnaireId" = staff_q_id AND "order" = 31;

  UPDATE "Question" SET "textAr" = 'أقبل وأدعم استخدام إطار الكفاءات في منظمتنا'
  WHERE "questionnaireId" = staff_q_id AND "order" = 32;

  UPDATE "Question" SET "textAr" = 'بشكل عام، أنا راضٍ عن إطار الكفاءات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 33;

  UPDATE "Question" SET "textAr" = 'أعتقد أن إطار الكفاءات قد حسّن تجربتي في العمل'
  WHERE "questionnaireId" = staff_q_id AND "order" = 34;

  -- Section E: Employee Engagement
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم هـ: مشاركة الموظفين (متغير وسيط)',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 5;

  UPDATE "Question" SET "textAr" = 'أشعر بالنشاط والحماس عندما أعمل'
  WHERE "questionnaireId" = staff_q_id AND "order" = 35;

  UPDATE "Question" SET "textAr" = 'عملي يلهمني ويحفزني'
  WHERE "questionnaireId" = staff_q_id AND "order" = 36;

  UPDATE "Question" SET "textAr" = 'أكون منغمساً بالكامل ومركزاً عند أداء وظيفتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 37;

  UPDATE "Question" SET "textAr" = 'أشعر بالفخر بالعمل الذي أقوم به'
  WHERE "questionnaireId" = staff_q_id AND "order" = 38;

  UPDATE "Question" SET "textAr" = 'الوقت يمر بسرعة عندما أعمل'
  WHERE "questionnaireId" = staff_q_id AND "order" = 39;

  UPDATE "Question" SET "textAr" = 'أنا منخرط بعمق وملتزم بعملي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 40;

  -- Section F: Work Motivation
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم و: الدافع للعمل (متغير وسيط)',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 6;

  UPDATE "Question" SET "textAr" = 'أنا متحفز بشدة لأؤدي بشكل جيد في وظيفتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 41;

  UPDATE "Question" SET "textAr" = 'يشجعني إطار الكفاءات على تحسين أدائي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 42;

  UPDATE "Question" SET "textAr" = 'أبذل جهداً إضافياً لتحقيق أهداف أدائي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 43;

  UPDATE "Question" SET "textAr" = 'أنا متحفز لتطوير كفاءات ومهارات جديدة'
  WHERE "questionnaireId" = staff_q_id AND "order" = 44;

  UPDATE "Question" SET "textAr" = 'أعمل باستمرار لتحقيق التميز في دوري'
  WHERE "questionnaireId" = staff_q_id AND "order" = 45;

  -- Section G: Self-Efficacy
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم ز: الكفاءة الذاتية (متغير وسيط)',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 7;

  UPDATE "Question" SET "textAr" = 'أنا واثق من قدرتي على تلبية توقعات الأداء'
  WHERE "questionnaireId" = staff_q_id AND "order" = 46;

  UPDATE "Question" SET "textAr" = 'أعتقد أنني أستطيع إنجاز المهام الصعبة في وظيفتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 47;

  UPDATE "Question" SET "textAr" = 'لدي الكفاءات اللازمة لأؤدي وظيفتي بنجاح'
  WHERE "questionnaireId" = staff_q_id AND "order" = 48;

  UPDATE "Question" SET "textAr" = 'أستطيع التعامل مع معظم المشاكل التي تنشأ في عملي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 49;

  -- Section H: Employee Performance
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم ح: أداء الموظف (التقييم الذاتي)',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 8;

  UPDATE "Question" SET "textAr" = 'أنجز واجبات عملي المخصصة بشكل فعال باستمرار'
  WHERE "questionnaireId" = staff_q_id AND "order" = 50;

  UPDATE "Question" SET "textAr" = 'ألبي جميع متطلبات الأداء الرسمية لوظيفتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 51;

  UPDATE "Question" SET "textAr" = 'أنتج مخرجات عمل عالية الجودة'
  WHERE "questionnaireId" = staff_q_id AND "order" = 52;

  UPDATE "Question" SET "textAr" = 'أكمل مهامي في الإطار الزمني المتوقع'
  WHERE "questionnaireId" = staff_q_id AND "order" = 53;

  UPDATE "Question" SET "textAr" = 'أؤدي بفعالية جميع المسؤوليات المطلوبة لوظيفتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 54;

  UPDATE "Question" SET "textAr" = 'أدائي يلبي أو يتجاوز المعايير المحددة لدوري'
  WHERE "questionnaireId" = staff_q_id AND "order" = 55;

  UPDATE "Question" SET "textAr" = 'أساعد الزملاء الذين لديهم أعباء عمل ثقيلة أو يواجهون تحديات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 56;

  UPDATE "Question" SET "textAr" = 'أشارك بكل رغبة معرفتي وخبرتي مع أعضاء الفريق'
  WHERE "questionnaireId" = staff_q_id AND "order" = 57;

  UPDATE "Question" SET "textAr" = 'أتحمل مسؤوليات إضافية تتجاوز وصف وظيفتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 58;

  UPDATE "Question" SET "textAr" = 'أساهم بنشاط في اجتماعات الفريق والمشاريع التعاونية'
  WHERE "questionnaireId" = staff_q_id AND "order" = 59;

  UPDATE "Question" SET "textAr" = 'أظهر المبادرة وأحدد بشكل استباقي فرص التحسين'
  WHERE "questionnaireId" = staff_q_id AND "order" = 60;

  UPDATE "Question" SET "textAr" = 'أمثل المنظمة بشكل إيجابي لأصحاب المصلحة الخارجيين'
  WHERE "questionnaireId" = staff_q_id AND "order" = 61;

  -- Section I: Impact of Competency Framework on Performance
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم ط: تأثير إطار الكفاءات على الأداء',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 9;

  UPDATE "Question" SET "textAr" = 'منذ العمل تحت إطار الكفاءات، تحسّن أدائي الوظيفي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 62;

  UPDATE "Question" SET "textAr" = 'ساعدني الإطار على فهم أفضل لما يبدو عليه الأداء الممتاز'
  WHERE "questionnaireId" = staff_q_id AND "order" = 63;

  UPDATE "Question" SET "textAr" = 'حفزني إطار الكفاءات على تطوير مهارات جديدة'
  WHERE "questionnaireId" = staff_q_id AND "order" = 64;

  UPDATE "Question" SET "textAr" = 'تحسّنت جودة عملي نتيجة لإطار الكفاءات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 65;

  UPDATE "Question" SET "textAr" = 'زاد الإطار من ثقتي في أداء وظيفتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 66;

  UPDATE "Question" SET "textAr" = 'أنا أكثر انخراطاً في عملي بسبب إطار الكفاءات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 67;

  -- Section J: Organizational Support
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم ي: الدعم التنظيمي',
    "instructionsAr" = instructions_ar
  WHERE "questionnaireId" = staff_q_id AND "order" = 10;

  UPDATE "Question" SET "textAr" = 'مشرفي المباشر يدعم بنشاط تطور كفاءاتي'
  WHERE "questionnaireId" = staff_q_id AND "order" = 68;

  UPDATE "Question" SET "textAr" = 'الإدارة العليا تظهر التزاماً بإطار الكفاءات'
  WHERE "questionnaireId" = staff_q_id AND "order" = 69;

  UPDATE "Question" SET "textAr" = 'المنظمة تقدر التعلم والتطوير المستمر'
  WHERE "questionnaireId" = staff_q_id AND "order" = 70;

  UPDATE "Question" SET "textAr" = 'الأداء الجيد معترف به ومكافأ في هذه المنظمة'
  WHERE "questionnaireId" = staff_q_id AND "order" = 71;

  UPDATE "Question" SET "textAr" = 'هناك ثقافة من الملاحظات المفتوحة وتحسين الأداء'
  WHERE "questionnaireId" = staff_q_id AND "order" = 72;

  -- Section K: Open-Ended Questions
  UPDATE "Section"
  SET 
    "titleAr" = 'القسم ك: أسئلة مفتوحة',
    "instructionsAr" = NULL
  WHERE "questionnaireId" = staff_q_id AND "order" = 11;

  UPDATE "Question" SET "textAr" = 'ما الذي يعجبك أكثر في إطار الكفاءات في منظمتك؟'
  WHERE "questionnaireId" = staff_q_id AND "order" = 73;

  UPDATE "Question" SET "textAr" = 'ما التحديات أو الصعوبات التي واجهتها مع إطار الكفاءات؟'
  WHERE "questionnaireId" = staff_q_id AND "order" = 74;

  UPDATE "Question" SET "textAr" = 'كيف ساعدك إطار الكفاءات (أو لم يساعدك) في أدائك وتطورك؟'
  WHERE "questionnaireId" = staff_q_id AND "order" = 75;

  UPDATE "Question" SET "textAr" = 'ما الاقتراحات التي لديك لتحسين إطار الكفاءات أو تنفيذه؟'
  WHERE "questionnaireId" = staff_q_id AND "order" = 76;

  RAISE NOTICE '✅ Sections B-K Arabic translations completed!';
END $$;

