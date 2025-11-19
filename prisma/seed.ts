import { PrismaClient, AudienceType, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.answer.deleteMany()
  await prisma.response.deleteMany()
  await prisma.option.deleteMany()
  await prisma.question.deleteMany()
  await prisma.questionnaire.deleteMany()

  // Helper function to create scale options
  const createScaleOptions = () => [
    { order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
    { order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
    { order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
    { order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
    { order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
  ]

  // 1. STAFF QUESTIONNAIRE
  const staffQuestionnaire = await prisma.questionnaire.create({
    data: {
      slug: 'staff-questionnaire',
      titleEn: 'Survey on Competency Frameworks and Employee Performance - Employee Perspective',
      titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الموظف',
      descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest feedback about your experience with the competency framework is essential for understanding its effectiveness. All responses are completely confidential and anonymous.',
      descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة حول تجربتك مع إطار الكفاءات ضرورية لفهم فعاليته. جميع الإجابات سرية تماماً وسرية.',
      audienceType: AudienceType.STAFF,
      isActive: true,
      questions: {
        create: [
          // SECTION A: DEMOGRAPHIC INFORMATION
          {
            order: 1,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Gender',
            textAr: 'النوع',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: 'male', labelEn: 'Male', labelAr: 'ذكر' },
                { order: 2, value: 'female', labelEn: 'Female', labelAr: 'أنثى' },
                { order: 3, value: 'prefer-not-say', labelEn: 'Prefer not to say', labelAr: 'أفضل عدم الإفصاح' },
              ],
            },
          },
          {
            order: 2,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Age Group',
            textAr: 'الفئة العمرية',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: '20-29', labelEn: '20-29 years', labelAr: '20-29 سنة' },
                { order: 2, value: '30-39', labelEn: '30-39 years', labelAr: '30-39 سنة' },
                { order: 3, value: '40-49', labelEn: '40-49 years', labelAr: '40-49 سنة' },
                { order: 4, value: '50-plus', labelEn: '50 years and above', labelAr: '50 سنة فأكثر' },
              ],
            },
          },
          {
            order: 3,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Highest Educational Level',
            textAr: 'أعلى مستوى تعليمي',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: 'high-school', labelEn: 'High school diploma', labelAr: 'شهادة الثانوية العامة' },
                { order: 2, value: 'bachelors', labelEn: "Bachelor's degree", labelAr: 'درجة البكالوريوس' },
                { order: 3, value: 'masters', labelEn: "Master's degree", labelAr: 'درجة الماجستير' },
                { order: 4, value: 'doctoral', labelEn: 'Doctoral degree or higher', labelAr: 'درجة الدكتوراه أو أعلى' },
              ],
            },
          },
          {
            order: 4,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Current Position Level',
            textAr: 'مستوى الموضع الحالي',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: 'entry', labelEn: 'Entry-level/Junior', labelAr: 'مستوى مبتدئ/صغير' },
                { order: 2, value: 'intermediate', labelEn: 'Intermediate/Mid-level', labelAr: 'وسيط/متوسط المستوى' },
                { order: 3, value: 'senior', labelEn: 'Senior/Specialist', labelAr: 'رفيع/متخصص' },
                { order: 4, value: 'team-lead', labelEn: 'Team Lead/Supervisor', labelAr: 'قائد فريق/مشرف' },
              ],
            },
          },
          {
            order: 5,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'How long have you been working under the competency framework system?',
            textAr: 'كم من الوقت تعمل تحت نظام إطار الكفاءات؟',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: 'less-than-1', labelEn: 'Less than 1 year', labelAr: 'أقل من سنة واحدة' },
                { order: 2, value: '1-2', labelEn: '1-2 years', labelAr: '1-2 سنة' },
                { order: 3, value: '3-4', labelEn: '3-4 years', labelAr: '3-4 سنوات' },
                { order: 4, value: 'more-than-4', labelEn: 'More than 4 years', labelAr: 'أكثر من 4 سنوات' },
              ],
            },
          },
          // SECTION B: UNDERSTANDING OF COMPETENCY FRAMEWORK
          {
            order: 6,
            type: QuestionType.SCALE_1_5,
            textEn: 'I have a clear understanding of what the competency framework means in my organization.',
            textAr: 'لدي فهم واضح لما يعنيه إطار الكفاءات في منظمتي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 7,
            type: QuestionType.SCALE_1_5,
            textEn: 'I understand how my role relates to the competency framework.',
            textAr: 'أفهم كيف يرتبط دوري بإطار الكفاءات.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 8,
            type: QuestionType.SCALE_1_5,
            textEn: 'I am aware of the specific competencies required for my position.',
            textAr: 'أنا على علم بالكفاءات المحددة المطلوبة لمنصبي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION C: QUALITY OF FRAMEWORK IMPLEMENTATION
          {
            order: 9,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework was introduced clearly and effectively.',
            textAr: 'تم تقديم إطار الكفاءات بشكل واضح وفعال.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 10,
            type: QuestionType.SCALE_1_5,
            textEn: 'I received adequate training on how to use the competency framework.',
            textAr: 'تلقيت تدريباً كافياً حول كيفية استخدام إطار الكفاءات.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION D: EMPLOYEE PERCEPTIONS AND ATTITUDES
          {
            order: 11,
            type: QuestionType.SCALE_1_5,
            textEn: 'I believe the competency framework is fair and objective.',
            textAr: 'أعتقد أن إطار الكفاءات عادل وموضوعي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 12,
            type: QuestionType.SCALE_1_5,
            textEn: 'I feel motivated to develop the competencies outlined in the framework.',
            textAr: 'أشعر بالتحفيز لتطوير الكفاءات المذكورة في الإطار.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION E: EMPLOYEE ENGAGEMENT
          {
            order: 13,
            type: QuestionType.SCALE_1_5,
            textEn: 'I am fully engaged in my work.',
            textAr: 'أنا منخرط بالكامل في عملي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 14,
            type: QuestionType.SCALE_1_5,
            textEn: 'I feel a strong connection to my organization.',
            textAr: 'أشعر بعلاقة قوية مع منظمتي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION F: WORK MOTIVATION
          {
            order: 15,
            type: QuestionType.SCALE_1_5,
            textEn: 'I am highly motivated to perform well in my job.',
            textAr: 'أنا متحمس بشدة لأداء جيد في وظيفتي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION G: SELF-EFFICACY
          {
            order: 16,
            type: QuestionType.SCALE_1_5,
            textEn: 'I am confident in my ability to perform my job tasks effectively.',
            textAr: 'أنا واثق من قدرتي على أداء مهام وظيفتي بفعالية.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION H: EMPLOYEE PERFORMANCE (SELF-ASSESSMENT)
          {
            order: 17,
            type: QuestionType.SCALE_1_5,
            textEn: 'I consistently meet or exceed my job performance expectations.',
            textAr: 'أنا ألتزم باستمرار بتوقعات أداء وظيفتي أو أتجاوزها.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 18,
            type: QuestionType.SCALE_1_5,
            textEn: 'I go beyond my job requirements to help colleagues and the organization.',
            textAr: 'أذهب إلى ما هو أبعد من متطلبات وظيفتي لمساعدة الزملاء والمنظمة.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION I: IMPACT OF COMPETENCY FRAMEWORK ON PERFORMANCE
          {
            order: 19,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework has helped me improve my performance.',
            textAr: 'ساعدني إطار الكفاءات على تحسين أدائي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION J: ORGANIZATIONAL SUPPORT
          {
            order: 20,
            type: QuestionType.SCALE_1_5,
            textEn: 'I receive adequate support from my supervisor to develop my competencies.',
            textAr: 'أتلقى دعماً كافياً من مشرفي لتطوير كفاءاتي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION K: OPEN-ENDED QUESTIONS
          {
            order: 21,
            type: QuestionType.TEXT,
            textEn: 'What do you like most about the competency framework in your organization?',
            textAr: 'ما الذي تحب أكثر شيء حول إطار الكفاءات في منظمتك؟',
            isRequired: false,
          },
          {
            order: 22,
            type: QuestionType.TEXT,
            textEn: 'What challenges or difficulties have you experienced with the competency framework?',
            textAr: 'ما التحديات أو الصعوبات التي واجهتها مع إطار الكفاءات؟',
            isRequired: false,
          },
          {
            order: 23,
            type: QuestionType.TEXT,
            textEn: 'What suggestions do you have to improve the competency framework or its implementation?',
            textAr: 'ما الاقتراحات التي لديك لتحسين إطار الكفاءات أو تطبيقه؟',
            isRequired: false,
          },
        ],
      },
    },
  })

  // 2. MANAGER QUESTIONNAIRE
  const managerQuestionnaire = await prisma.questionnaire.create({
    data: {
      slug: 'manager-questionnaire',
      titleEn: 'Survey on Competency Frameworks and Employee Performance - Manager Perspective',
      titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الإدارة',
      descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest responses are valuable for understanding how competency frameworks affect organizational performance from a managerial perspective. All responses are confidential.',
      descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة ذات قيمة كبيرة لفهم كيف تؤثر أطر الكفاءات على أداء المنظمة من منظور إداري. جميع الإجابات سرية.',
      audienceType: AudienceType.MANAGER,
      isActive: true,
      questions: {
        create: [
          // SECTION A: DEMOGRAPHIC INFORMATION
          {
            order: 1,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Gender',
            textAr: 'النوع',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: 'male', labelEn: 'Male', labelAr: 'ذكر' },
                { order: 2, value: 'female', labelEn: 'Female', labelAr: 'أنثى' },
                { order: 3, value: 'prefer-not-say', labelEn: 'Prefer not to say', labelAr: 'أفضل عدم الإفصاح' },
              ],
            },
          },
          {
            order: 2,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Current Management Level',
            textAr: 'مستوى الإدارة الحالي',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: 'first-line', labelEn: 'First-line manager (supervising team leads/employees)', labelAr: 'مدير من الدرجة الأولى (يشرف على رؤساء الفريق/الموظفين)' },
                { order: 2, value: 'middle', labelEn: 'Middle manager (supervising other managers)', labelAr: 'مدير وسيط (يشرف على مديرين آخرين)' },
                { order: 3, value: 'senior', labelEn: 'Senior manager/Director', labelAr: 'مدير رفيع المستوى/مدير' },
                { order: 4, value: 'executive', labelEn: 'Executive level (C-suite)', labelAr: 'مستوى تنفيذي (C-suite)' },
              ],
            },
          },
          {
            order: 3,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Years Your Organization Has Used Competency Frameworks',
            textAr: 'عدد السنوات التي استخدمت فيها منظمتك أطر الكفاءات',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: '2-3', labelEn: '2-3 years', labelAr: '2-3 سنوات' },
                { order: 2, value: '4-5', labelEn: '4-5 years', labelAr: '4-5 سنوات' },
                { order: 3, value: '6-10', labelEn: '6-10 years', labelAr: '6-10 سنوات' },
                { order: 4, value: 'more-than-10', labelEn: 'More than 10 years', labelAr: 'أكثر من 10 سنوات' },
              ],
            },
          },
          // SECTION B: COMPETENCY FRAMEWORK CHARACTERISTICS
          {
            order: 4,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework in our organization is well-designed and comprehensive.',
            textAr: 'إطار الكفاءات في منظمتنا مصمم بشكل جيد وشامل.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 5,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework clearly defines expectations for employee performance.',
            textAr: 'يحدد إطار الكفاءات بوضوح توقعات أداء الموظفين.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION C: IMPLEMENTATION QUALITY
          {
            order: 6,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework has been implemented effectively in our organization.',
            textAr: 'تم تطبيق إطار الكفاءات بفعالية في منظمتنا.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 7,
            type: QuestionType.SCALE_1_5,
            textEn: 'Employees have been adequately trained on using the competency framework.',
            textAr: 'تم تدريب الموظفين بشكل كافٍ على استخدام إطار الكفاءات.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION D: MANAGER PERCEPTIONS AND ATTITUDES
          {
            order: 8,
            type: QuestionType.SCALE_1_5,
            textEn: 'I believe the competency framework is a valuable tool for managing employee performance.',
            textAr: 'أعتقد أن إطار الكفاءات أداة قيمة لإدارة أداء الموظفين.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 9,
            type: QuestionType.SCALE_1_5,
            textEn: 'I am confident in using the competency framework to assess my team members.',
            textAr: 'أنا واثق من استخدام إطار الكفاءات لتقييم أعضاء فريقي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION E: LEADERSHIP SUPPORT
          {
            order: 10,
            type: QuestionType.SCALE_1_5,
            textEn: 'Senior leadership strongly supports the competency framework initiative.',
            textAr: 'تدعم القيادة العليا بقوة مبادرة إطار الكفاءات.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION F: ORGANIZATIONAL CULTURE
          {
            order: 11,
            type: QuestionType.SCALE_1_5,
            textEn: 'Our organizational culture promotes continuous learning and development.',
            textAr: 'تعزز ثقافة منظمتنا التعلم والتطوير المستمرين.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION G: EMPLOYEE PERFORMANCE ASSESSMENT
          {
            order: 12,
            type: QuestionType.SCALE_1_5,
            textEn: 'Overall, employees in my team perform well according to the competency framework standards.',
            textAr: 'بشكل عام، يؤدي الموظفون في فريقي أداءً جيداً وفقاً لمعايير إطار الكفاءات.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 13,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework has helped improve employee performance in my team.',
            textAr: 'ساعد إطار الكفاءات على تحسين أداء الموظفين في فريقي.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION H: IMPACT OBSERVATIONS
          {
            order: 14,
            type: QuestionType.SCALE_1_5,
            textEn: 'I have observed positive changes in employee behavior since implementing the competency framework.',
            textAr: 'لاحظت تغييرات إيجابية في سلوك الموظفين منذ تطبيق إطار الكفاءات.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION I: OPEN-ENDED QUESTIONS
          {
            order: 15,
            type: QuestionType.TEXT,
            textEn: 'What do you consider the most significant benefits of using the competency framework in your role as a manager?',
            textAr: 'ما الذي تعتبره الفوائد الأكثر أهمية لاستخدام إطار الكفاءات في دورك كمدير؟',
            isRequired: false,
          },
          {
            order: 16,
            type: QuestionType.TEXT,
            textEn: 'What challenges have you encountered in implementing or using the competency framework?',
            textAr: 'ما التحديات التي واجهتها في تطبيق أو استخدام إطار الكفاءات؟',
            isRequired: false,
          },
          {
            order: 17,
            type: QuestionType.TEXT,
            textEn: 'What improvements would you suggest to make the competency framework more effective?',
            textAr: 'ما التحسينات التي تقترحها لجعل إطار الكفاءات أكثر فعالية؟',
            isRequired: false,
          },
        ],
      },
    },
  })

  // 3. HR EMPLOYEE QUESTIONNAIRE
  const hrQuestionnaire = await prisma.questionnaire.create({
    data: {
      slug: 'hr-questionnaire',
      titleEn: 'Survey on Competency Frameworks and Employee Performance - HR Professional Perspective',
      titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور متخصص الموارد البشرية',
      descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your expertise as an HR professional is crucial for understanding how competency frameworks are designed, implemented, and impact organizational outcomes. All responses are confidential.',
      descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن خبرتك كمتخصص في الموارد البشرية حاسمة لفهم كيف يتم تصميم أطر الكفاءات وتطبيقها والتأثير على نتائج المنظمة. جميع الإجابات سرية.',
      audienceType: AudienceType.HR,
      isActive: true,
      questions: {
        create: [
          // SECTION A: DEMOGRAPHIC INFORMATION
          {
            order: 1,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Current HR Role',
            textAr: 'دورك الحالي في الموارد البشرية',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: 'generalist', labelEn: 'HR Generalist', labelAr: 'متخصص عام في الموارد البشرية' },
                { order: 2, value: 'specialist', labelEn: 'HR Specialist (Recruitment/Training/Compensation)', labelAr: 'متخصص في الموارد البشرية (التوظيف/التدريب/التعويضات)' },
                { order: 3, value: 'manager', labelEn: 'HR Manager/Business Partner', labelAr: 'مدير موارد بشرية / شريك العمل' },
                { order: 4, value: 'director', labelEn: 'HR Director/Head of HR', labelAr: 'مدير / رئيس الموارد البشرية' },
              ],
            },
          },
          {
            order: 2,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Your Level of Involvement in Competency Framework Design/Implementation',
            textAr: 'مستوى مشاركتك في تصميم/تطبيق إطار الكفاءات',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: 'primary', labelEn: 'Primary designer/implementer', labelAr: 'المصمم/المطبق الرئيسي' },
                { order: 2, value: 'actively-involved', labelEn: 'Actively involved in the project team', labelAr: 'مشارك نشط في فريق المشروع' },
                { order: 3, value: 'moderate', labelEn: 'Moderate involvement', labelAr: 'مشاركة معتدلة' },
                { order: 4, value: 'limited', labelEn: 'Limited involvement (administrative support)', labelAr: 'مشاركة محدودة (دعم إداري)' },
              ],
            },
          },
          {
            order: 3,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: 'Years Your Organization Has Used Competency Frameworks',
            textAr: 'عدد السنوات التي استخدمت فيها منظمتك أطر الكفاءات',
            isRequired: true,
            options: {
              create: [
                { order: 1, value: '2-3', labelEn: '2-3 years', labelAr: '2-3 سنوات' },
                { order: 2, value: '4-5', labelEn: '4-5 years', labelAr: '4-5 سنوات' },
                { order: 3, value: '6-10', labelEn: '6-10 years', labelAr: '6-10 سنوات' },
                { order: 4, value: 'more-than-10', labelEn: 'More than 10 years', labelAr: 'أكثر من 10 سنوات' },
              ],
            },
          },
          // SECTION B: COMPETENCY FRAMEWORK DESIGN AND CHARACTERISTICS
          {
            order: 4,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework design aligns well with our organizational goals and strategy.',
            textAr: 'يتوافق تصميم إطار الكفاءات بشكل جيد مع أهدافنا التنظيمية واستراتيجيتنا.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 5,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework covers all essential competencies needed for our organization.',
            textAr: 'يغطي إطار الكفاءات جميع الكفاءات الأساسية المطلوبة لمنظمتنا.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION C: IMPLEMENTATION PROCESS AND QUALITY
          {
            order: 6,
            type: QuestionType.SCALE_1_5,
            textEn: 'The implementation process was well-planned and executed.',
            textAr: 'كانت عملية التطبيق مخططاً لها ومنفذة بشكل جيد.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 7,
            type: QuestionType.SCALE_1_5,
            textEn: 'Adequate resources were allocated for the competency framework implementation.',
            textAr: 'تم تخصيص موارد كافية لتطبيق إطار الكفاءات.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION D: HR PROFESSIONAL PERCEPTIONS
          {
            order: 8,
            type: QuestionType.SCALE_1_5,
            textEn: 'I believe the competency framework has been successful in our organization.',
            textAr: 'أعتقد أن إطار الكفاءات كان ناجحاً في منظمتنا.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 9,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework has improved our talent management processes.',
            textAr: 'حسّن إطار الكفاءات عمليات إدارة المواهب لدينا.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION E: ORGANIZATIONAL OUTCOMES
          {
            order: 10,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework has positively impacted overall employee performance.',
            textAr: 'أثر إطار الكفاءات بشكل إيجابي على أداء الموظفين بشكل عام.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 11,
            type: QuestionType.SCALE_1_5,
            textEn: 'The competency framework has contributed to better employee development outcomes.',
            textAr: 'ساهم إطار الكفاءات في نتائج أفضل لتطوير الموظفين.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION F: IMPLEMENTATION CHALLENGES
          {
            order: 12,
            type: QuestionType.SCALE_1_5,
            textEn: 'Resistance to change was a significant challenge during implementation.',
            textAr: 'كانت مقاومة التغيير تحدياً كبيراً أثناء التطبيق.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 13,
            type: QuestionType.SCALE_1_5,
            textEn: 'Lack of adequate training resources was a challenge.',
            textAr: 'كان نقص موارد التدريب الكافية تحدياً.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION G: SUCCESS FACTORS
          {
            order: 14,
            type: QuestionType.SCALE_1_5,
            textEn: 'Strong leadership support was critical for successful implementation.',
            textAr: 'كان دعم القيادة القوي حاسماً للتطبيق الناجح.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          {
            order: 15,
            type: QuestionType.SCALE_1_5,
            textEn: 'Clear communication about the framework was important for success.',
            textAr: 'كان التواصل الواضح حول الإطار مهماً للنجاح.',
            isRequired: true,
            options: { create: createScaleOptions() },
          },
          // SECTION H: OPEN-ENDED QUESTIONS
          {
            order: 16,
            type: QuestionType.TEXT,
            textEn: 'What do you consider the most significant achievements of your organization\'s competency framework?',
            textAr: 'ما الذي تعتبره أهم إنجاز لإطار الكفاءات في منظمتك؟',
            isRequired: false,
          },
          {
            order: 17,
            type: QuestionType.TEXT,
            textEn: 'What were the main challenges encountered during framework design and implementation, and how were they addressed?',
            textAr: 'ما التحديات الرئيسية التي تمت مواجهتها أثناء تصميم وتطبيق الإطار، وكيف تم معالجتها؟',
            isRequired: false,
          },
          {
            order: 18,
            type: QuestionType.TEXT,
            textEn: 'What improvements or enhancements would you recommend for the current competency framework?',
            textAr: 'ما التحسينات أو التحسينات التي توصي بها لإطار الكفاءات الحالي؟',
            isRequired: false,
          },
          {
            order: 19,
            type: QuestionType.TEXT,
            textEn: 'Based on your experience, what advice would you give to other organizations planning to implement competency frameworks?',
            textAr: 'بناءً على خبرتك، ما النصح الذي تقدمه للمنظمات الأخرى التي تخطط لتطبيق أطر الكفاءات؟',
            isRequired: false,
          },
        ],
      },
    },
  })

  console.log('Created questionnaires:')
  console.log(`- ${staffQuestionnaire.titleEn} (${staffQuestionnaire.slug})`)
  console.log(`- ${managerQuestionnaire.titleEn} (${managerQuestionnaire.slug})`)
  console.log(`- ${hrQuestionnaire.titleEn} (${hrQuestionnaire.slug})`)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
