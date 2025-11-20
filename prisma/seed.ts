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
      titleEn: "Survey on Competency Frameworks and Employee Performance - Employee Perspective",
      titleAr: "استبيان عن أطر الكفاءات وأداء الموظفين - منظور الموظف",
      descriptionEn: "This questionnaire is part of a research study examining \"The Impact of Using Competency Frameworks on Enhancing Employee Performance.\" Your honest feedback about your experience with the competency framework is essential for understanding its effectiveness. All responses are completely confidential and anonymous.",
      descriptionAr: "هذا الاستبيان جزء من دراسة بحثية تفحص \"تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين\". إن ردودك الصريحة حول تجربتك مع إطار الكفاءات ضرورية لفهم فعاليته. جميع الإجابات سرية تماماً وسرية.",
      audienceType: AudienceType.STAFF,
      isActive: true,
      questions: {
        create: [
          // SECTION A: DEMOGRAPHIC INFORMATION
          {
            order: 1,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: "Gender:",
            textAr: "النوع",
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
            textEn: "Age Group:",
            textAr: "الفئة العمرية",
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
            type: QuestionType.TEXT,
            textEn: "Highest Educational Level:",
            textAr: "Highest Educational Level:",
            isRequired: true,
            
          },
          {
            order: 4,
            type: QuestionType.TEXT,
            textEn: "Current Position Level:",
            textAr: "Current Position Level:",
            isRequired: true,
            
          },
          {
            order: 5,
            type: QuestionType.TEXT,
            textEn: "Years with Current Organization:",
            textAr: "Years with Current Organization:",
            isRequired: true,
            
          },
          {
            order: 8,
            type: QuestionType.TEXT,
            textEn: "Total Years of Work Experience:",
            textAr: "Total Years of Work Experience:",
            isRequired: true,
            
          },
          {
            order: 9,
            type: QuestionType.TEXT,
            textEn: "Department/Function:",
            textAr: "Department/Function:",
            isRequired: true,
            
          },
          {
            order: 11,
            type: QuestionType.TEXT,
            textEn: "Industry Sector:",
            textAr: "Industry Sector:",
            isRequired: true,
            
          },
          {
            order: 12,
            type: QuestionType.TEXT,
            textEn: "Organization Size (number of employees):",
            textAr: "Organization Size (number of employees):",
            isRequired: true,
            
          },
          {
            order: 13,
            type: QuestionType.TEXT,
            textEn: "How long have you been working under the competency framework system?",
            textAr: "How long have you been working under the competency framework system?",
            isRequired: true,
            
          },

          // SECTION C: QUALITY OF FRAMEWORK IMPLEMENTATION
          {
            order: 16,
            type: QuestionType.SCALE_1_5,
            textEn: "The purpose and benefits of the competency framework were clearly explained to me",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 17,
            type: QuestionType.SCALE_1_5,
            textEn: "I received adequate training and orientation on the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 18,
            type: QuestionType.SCALE_1_5,
            textEn: "My manager effectively explains how to apply the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 19,
            type: QuestionType.SCALE_1_5,
            textEn: "Support and resources are available to help me develop required competencies",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 20,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency assessment process is fair and transparent",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 21,
            type: QuestionType.SCALE_1_5,
            textEn: "I receive regular feedback on my competency development",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 22,
            type: QuestionType.SCALE_1_5,
            textEn: "There are clear opportunities to develop and improve my competencies",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 23,
            type: QuestionType.SCALE_1_5,
            textEn: "The organization provides training aligned with competency requirements",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION D: EMPLOYEE PERCEPTIONS AND ATTITUDES
          {
            order: 24,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency framework is relevant and useful for my job",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 25,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework helps me understand what I need to do to perform well",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 26,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency framework is fair in evaluating my performance",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 27,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework helps me identify areas where I need to improve",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 28,
            type: QuestionType.SCALE_1_5,
            textEn: "Using the competency framework has helped my professional development",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 29,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework provides a clear path for career advancement",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 30,
            type: QuestionType.SCALE_1_5,
            textEn: "Performance discussions with my manager are more constructive because of the framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 31,
            type: QuestionType.SCALE_1_5,
            textEn: "I accept and support the use of the competency framework in our organization",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 32,
            type: QuestionType.SCALE_1_5,
            textEn: "Overall, I am satisfied with the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 33,
            type: QuestionType.SCALE_1_5,
            textEn: "I believe the competency framework has improved my work experience",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION E: EMPLOYEE ENGAGEMENT (MEDIATING VARIABLE)
          {
            order: 34,
            type: QuestionType.SCALE_1_5,
            textEn: "I feel energized and enthusiastic when I work",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 35,
            type: QuestionType.SCALE_1_5,
            textEn: "My work inspires and motivates me",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 36,
            type: QuestionType.SCALE_1_5,
            textEn: "I am fully absorbed and focused when performing my job",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 37,
            type: QuestionType.SCALE_1_5,
            textEn: "I feel proud of the work that I do",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 38,
            type: QuestionType.SCALE_1_5,
            textEn: "Time passes quickly when I am working",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 39,
            type: QuestionType.SCALE_1_5,
            textEn: "I am deeply involved and committed to my work",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION F: WORK MOTIVATION (MEDIATING VARIABLE)
          {
            order: 40,
            type: QuestionType.SCALE_1_5,
            textEn: "I am highly motivated to perform well in my job",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 41,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency framework encourages me to improve my performance",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 42,
            type: QuestionType.SCALE_1_5,
            textEn: "I put in extra effort to achieve my performance goals",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 43,
            type: QuestionType.SCALE_1_5,
            textEn: "I am motivated to develop new competencies and skills",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 44,
            type: QuestionType.SCALE_1_5,
            textEn: "I persistently work toward achieving excellence in my role",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION G: SELF-EFFICACY (MEDIATING VARIABLE)
          {
            order: 45,
            type: QuestionType.SCALE_1_5,
            textEn: "I am confident in my ability to meet performance expectations",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 46,
            type: QuestionType.SCALE_1_5,
            textEn: "I believe I can accomplish challenging tasks in my job",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 47,
            type: QuestionType.SCALE_1_5,
            textEn: "I have the necessary competencies to perform my job successfully",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 48,
            type: QuestionType.SCALE_1_5,
            textEn: "I can handle most problems that arise in my work",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION I: IMPACT OF COMPETENCY FRAMEWORK ON PERFORMANCE
          {
            order: 49,
            type: QuestionType.SCALE_1_5,
            textEn: "Since working under the competency framework, my job performance has improved",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 50,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has helped me better understand what excellent performance looks like",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 51,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency framework has motivated me to develop new skills",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 52,
            type: QuestionType.SCALE_1_5,
            textEn: "My work quality has improved as a result of the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 53,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has increased my confidence in performing my job",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 54,
            type: QuestionType.SCALE_1_5,
            textEn: "I am more engaged in my work because of the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION J: ORGANIZATIONAL SUPPORT
          {
            order: 55,
            type: QuestionType.SCALE_1_5,
            textEn: "My immediate supervisor actively supports my competency development",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 56,
            type: QuestionType.SCALE_1_5,
            textEn: "Senior management demonstrates commitment to the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 57,
            type: QuestionType.SCALE_1_5,
            textEn: "The organization values continuous learning and development",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 58,
            type: QuestionType.SCALE_1_5,
            textEn: "Good performance is recognized and rewarded in this organization",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 59,
            type: QuestionType.SCALE_1_5,
            textEn: "There is a culture of open feedback and performance improvement",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION K: OPEN-ENDED QUESTIONS
          {
            order: 60,
            type: QuestionType.TEXT,
            textEn: "What do you like most about the competency framework in your organization?",
            textAr: "What do you like most about the competency framework in your organization?",
            isRequired: true,
            
          },
          {
            order: 61,
            type: QuestionType.TEXT,
            textEn: "What challenges or difficulties have you experienced with the competency framework?",
            textAr: "What challenges or difficulties have you experienced with the competency framework?",
            isRequired: true,
            
          },
          {
            order: 62,
            type: QuestionType.TEXT,
            textEn: "How has the competency framework helped (or not helped) your performance and development?",
            textAr: "How has the competency framework helped (or not helped) your performance and development?",
            isRequired: true,
            
          },
          {
            order: 63,
            type: QuestionType.TEXT,
            textEn: "What suggestions do you have to improve the competency framework or its implementation?",
            textAr: "What suggestions do you have to improve the competency framework or its implementation?",
            isRequired: true,
            
          }
        ],
      },
    },
  })

  // 2. MANAGER QUESTIONNAIRE
  const managerQuestionnaire = await prisma.questionnaire.create({
    data: {
      slug: 'manager-questionnaire',
      titleEn: "Survey on Competency Frameworks and Employee Performance - Manager Perspective",
      titleAr: "استبيان عن أطر الكفاءات وأداء الموظفين - منظور الإدارة",
      descriptionEn: "This questionnaire is part of a research study examining \"The Impact of Using Competency Frameworks on Enhancing Employee Performance.\" Your honest responses are valuable for understanding how competency frameworks affect organizational performance from a managerial perspective. All responses are confidential.",
      descriptionAr: "هذا الاستبيان جزء من دراسة بحثية تفحص \"تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين\". إن ردودك الصريحة ذات قيمة كبيرة لفهم كيف تؤثر أطر الكفاءات على أداء المنظمة من منظور إداري. جميع الإجابات سرية.",
      audienceType: AudienceType.MANAGER,
      isActive: true,
      questions: {
        create: [
          // SECTION A: DEMOGRAPHIC INFORMATION
          {
            order: 1,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: "Gender:",
            textAr: "النوع",
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
            textEn: "Age Group:",
            textAr: "الفئة العمرية",
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
            type: QuestionType.TEXT,
            textEn: "Highest Educational Level:",
            textAr: "Highest Educational Level:",
            isRequired: true,
            
          },
          {
            order: 4,
            type: QuestionType.TEXT,
            textEn: "Current Management Level:",
            textAr: "Current Management Level:",
            isRequired: true,
            
          },
          {
            order: 5,
            type: QuestionType.TEXT,
            textEn: "Years in Current Management Position:",
            textAr: "Years in Current Management Position:",
            isRequired: true,
            
          },
          { order: 7,
            type: QuestionType.TEXT,
            textEn: "Total Years of Management Experience:",
            textAr: "Total Years of Management Experience:",
            isRequired: true,
            
          },
          { order: 9,
            type: QuestionType.TEXT,
            textEn: "Industry Sector:",
            textAr: "Industry Sector:",
            isRequired: true,
            
          },
          {
            order: 10,
            type: QuestionType.TEXT,
            textEn: "Organization Size (number of employees):",
            textAr: "Organization Size (number of employees):",
            isRequired: true,
            
          },
          {
            order: 11,
            type: QuestionType.TEXT,
            textEn: "Number of Direct Reports:",
            textAr: "Number of Direct Reports:",
            isRequired: true,
            
          },
          { order: 13,
            type: QuestionType.TEXT,
            textEn: "Years Your Organization Has Used Competency Frameworks:",
            textAr: "Years Your Organization Has Used Competency Frameworks:",
            isRequired: true,
            
          },
          // SECTION C: IMPLEMENTATION QUALITY
          {
            order: 16,
            type: QuestionType.SCALE_1_5,
            textEn: "The purpose and benefits of the competency framework were clearly communicated to all managers",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 17,
            type: QuestionType.SCALE_1_5,
            textEn: "I received adequate training on how to use the competency framework for performance management",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 18,
            type: QuestionType.SCALE_1_5,
            textEn: "Senior leadership actively supports and endorses the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 19,
            type: QuestionType.SCALE_1_5,
            textEn: "Sufficient resources (time, tools, support) are provided for implementing the framework effectively",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 20,
            type: QuestionType.SCALE_1_5,
            textEn: "The assessment process using the framework is fair and objective",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 21,
            type: QuestionType.SCALE_1_5,
            textEn: "Managers receive ongoing support and guidance in using the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 22,
            type: QuestionType.SCALE_1_5,
            textEn: "The implementation process involved input and feedback from managers at various levels",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 23,
            type: QuestionType.SCALE_1_5,
            textEn: "There are clear procedures and guidelines for conducting competency-based assessments",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 24,
            type: QuestionType.SCALE_1_5,
            textEn: "Technology and systems are available to facilitate competency assessment and tracking",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 25,
            type: QuestionType.SCALE_1_5,
            textEn: "Regular feedback is collected to improve the framework and its implementation",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION D: MANAGER PERCEPTIONS AND ATTITUDES
          {
            order: 26,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency framework is a useful tool for managing and developing my team",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 27,
            type: QuestionType.SCALE_1_5,
            textEn: "I have confidence in the validity and reliability of the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 28,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework helps me identify skill gaps and development needs in my team",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 29,
            type: QuestionType.SCALE_1_5,
            textEn: "Using the competency framework improves the quality of performance discussions with employees",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 30,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework provides a fair basis for evaluating employee performance",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 31,
            type: QuestionType.SCALE_1_5,
            textEn: "I actively use the competency framework when making promotion and development decisions",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 32,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency framework has improved the quality of talent management in my department",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 33,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework facilitates more objective and consistent performance evaluations",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 34,
            type: QuestionType.SCALE_1_5,
            textEn: "Overall, I am satisfied with the competency framework in our organization",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 35,
            type: QuestionType.SCALE_1_5,
            textEn: "I would recommend competency frameworks to other organizations",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION E: LEADERSHIP SUPPORT (MODERATING VARIABLE)
          {
            order: 36,
            type: QuestionType.SCALE_1_5,
            textEn: "Senior management demonstrates visible commitment to the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 37,
            type: QuestionType.SCALE_1_5,
            textEn: "Leaders in this organization role-model the competencies defined in the framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 38,
            type: QuestionType.SCALE_1_5,
            textEn: "Management allocates adequate budget and resources for competency framework implementation",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 39,
            type: QuestionType.SCALE_1_5,
            textEn: "My immediate supervisor actively uses the competency framework in team management",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 40,
            type: QuestionType.SCALE_1_5,
            textEn: "Leadership regularly communicates the importance of competency development",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION F: ORGANIZATIONAL CULTURE (MODERATING VARIABLE)
          {
            order: 41,
            type: QuestionType.SCALE_1_5,
            textEn: "Our organization highly values continuous learning and professional development",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 42,
            type: QuestionType.SCALE_1_5,
            textEn: "Performance excellence is consistently recognized and rewarded in this organization",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 43,
            type: QuestionType.SCALE_1_5,
            textEn: "There is a culture of open feedback and constructive performance discussions",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 44,
            type: QuestionType.SCALE_1_5,
            textEn: "Employees are encouraged to take ownership of their competency development",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 45,
            type: QuestionType.SCALE_1_5,
            textEn: "Innovation and trying new approaches are encouraged and supported",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION G: EMPLOYEE PERFORMANCE ASSESSMENT
          {
            order: 46,
            type: QuestionType.SCALE_1_5,
            textEn: "My team members consistently meet or exceed their assigned work objectives",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 47,
            type: QuestionType.SCALE_1_5,
            textEn: "Employees in my team demonstrate high quality in their work outputs",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 48,
            type: QuestionType.SCALE_1_5,
            textEn: "Team members effectively manage their work responsibilities and priorities",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 49,
            type: QuestionType.SCALE_1_5,
            textEn: "Employees complete their tasks within expected timeframes",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 50,
            type: QuestionType.SCALE_1_5,
            textEn: "My team members possess the necessary skills and knowledge to perform their jobs effectively",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 51,
            type: QuestionType.SCALE_1_5,
            textEn: "Employees actively help colleagues who are having work-related problems",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 52,
            type: QuestionType.SCALE_1_5,
            textEn: "Team members demonstrate initiative and go beyond minimum requirements",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 53,
            type: QuestionType.SCALE_1_5,
            textEn: "Employees contribute positively to team collaboration and morale",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 54,
            type: QuestionType.SCALE_1_5,
            textEn: "My team members adapt well to changing work demands and priorities",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 55,
            type: QuestionType.SCALE_1_5,
            textEn: "Overall, employee performance in my team has improved since implementing the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION H: IMPACT OBSERVATIONS
          {
            order: 56,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency framework has helped employees better understand performance expectations",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 57,
            type: QuestionType.SCALE_1_5,
            textEn: "Employees are more engaged in their development since the framework was introduced",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 58,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has improved the alignment between employee capabilities and job requirements",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 59,
            type: QuestionType.SCALE_1_5,
            textEn: "There has been a noticeable increase in employee motivation and effort",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 60,
            type: QuestionType.SCALE_1_5,
            textEn: "Performance discussions with employees are now more structured and productive",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 61,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has facilitated better identification of high-potential employees",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION I: OPEN-ENDED QUESTIONS
          {
            order: 62,
            type: QuestionType.TEXT,
            textEn: "What do you consider the most significant benefits of using the competency framework in your role as a manager?",
            textAr: "What do you consider the most significant benefits of using the competency framework in your role as a manager?",
            isRequired: true,
            
          },
          {
            order: 63,
            type: QuestionType.TEXT,
            textEn: "What challenges have you encountered in implementing or using the competency framework?",
            textAr: "What challenges have you encountered in implementing or using the competency framework?",
            isRequired: true,
            
          },
          {
            order: 64,
            type: QuestionType.TEXT,
            textEn: "What improvements would you suggest to make the competency framework more effective?",
            textAr: "What improvements would you suggest to make the competency framework more effective?",
            isRequired: true,
            
          },
          {
            order: 65,
            type: QuestionType.TEXT,
            textEn: "In your opinion, what factors most contribute to the success of competency frameworks in improving employee performance?",
            textAr: "In your opinion, what factors most contribute to the success of competency frameworks in improving employee performance?",
            isRequired: true,
            
          }
        ],
      },
    },
  })

  // 3. HR QUESTIONNAIRE
  const hrQuestionnaire = await prisma.questionnaire.create({
    data: {
      slug: 'hr-questionnaire',
      titleEn: "Survey on Competency Frameworks and Employee Performance - HR Professional Perspective",
      titleAr: "استبيان عن أطر الكفاءات وأداء الموظفين - منظور متخصص الموارد البشرية",
      descriptionEn: "This questionnaire is part of a research study examining \"The Impact of Using Competency Frameworks on Enhancing Employee Performance.\" Your expertise as an HR professional is crucial for understanding how competency frameworks are designed, implemented, and impact organizational outcomes. All responses are confidential.",
      descriptionAr: "هذا الاستبيان جزء من دراسة بحثية تفحص \"تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين\". إن خبرتك كمتخصص في الموارد البشرية حاسمة لفهم كيف يتم تصميم أطر الكفاءات وتطبيقها والتأثير على نتائج المنظمة. جميع الإجابات سرية.",
      audienceType: AudienceType.HR,
      isActive: true,
      questions: {
        create: [
          // SECTION A: DEMOGRAPHIC INFORMATION
          {
            order: 1,
            type: QuestionType.MULTIPLE_CHOICE,
            textEn: "Gender:",
            textAr: "النوع",
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
            textEn: "Age Group:",
            textAr: "الفئة العمرية",
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
            type: QuestionType.TEXT,
            textEn: "Highest Educational Level:",
            textAr: "Highest Educational Level:",
            isRequired: true,
            
          },
          {
            order: 4,
            type: QuestionType.TEXT,
            textEn: "Current HR Role:",
            textAr: "Current HR Role:",
            isRequired: true,
            
          },
          {
            order: 5,
            type: QuestionType.TEXT,
            textEn: "Years of HR Experience:",
            textAr: "Years of HR Experience:",
            isRequired: true,
            
          },
          { order: 7,
            type: QuestionType.TEXT,
            textEn: "Years in Current HR Role:",
            textAr: "Years in Current HR Role:",
            isRequired: true,
            
          },
          { order: 9,
            type: QuestionType.TEXT,
            textEn: "Industry Sector:",
            textAr: "Industry Sector:",
            isRequired: true,
            
          },
          {
            order: 10,
            type: QuestionType.TEXT,
            textEn: "Organization Size (number of employees):",
            textAr: "Organization Size (number of employees):",
            isRequired: true,
            
          },
          {
            order: 11,
            type: QuestionType.TEXT,
            textEn: "Your Level of Involvement in Competency Framework Design/Implementation:",
            textAr: "Your Level of Involvement in Competency Framework Design/Implementation:",
            isRequired: true,
            
          },
          {
            order: 12,
            type: QuestionType.TEXT,
            textEn: "Years Your Organization Has Used Competency Frameworks:",
            textAr: "Years Your Organization Has Used Competency Frameworks:",
            isRequired: true,
            
          },
          // SECTION C: IMPLEMENTATION PROCESS AND QUALITY
          {
            order: 15,
            type: QuestionType.SCALE_1_5,
            textEn: "A comprehensive communication strategy was executed to introduce the framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 16,
            type: QuestionType.SCALE_1_5,
            textEn: "All managers received adequate training on how to use the competency framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 17,
            type: QuestionType.SCALE_1_5,
            textEn: "Employees received sufficient information and training about the framework and their role competencies",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 18,
            type: QuestionType.SCALE_1_5,
            textEn: "Senior leadership actively championed the competency framework initiative",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 19,
            type: QuestionType.SCALE_1_5,
            textEn: "Adequate budget and resources were allocated for framework development and implementation",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 20,
            type: QuestionType.SCALE_1_5,
            textEn: "A phased or pilot implementation approach was used to test and refine the framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 21,
            type: QuestionType.SCALE_1_5,
            textEn: "Clear policies, procedures, and guidelines were established for using the framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 22,
            type: QuestionType.SCALE_1_5,
            textEn: "Technology platforms/HRIS systems support competency assessment and tracking",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 23,
            type: QuestionType.SCALE_1_5,
            textEn: "Ongoing support and helpdesk services are available for framework users",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 24,
            type: QuestionType.SCALE_1_5,
            textEn: "Regular feedback is collected from managers and employees to improve the framework",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 25,
            type: QuestionType.SCALE_1_5,
            textEn: "Quality controls are in place to ensure consistent application of the framework across the organization",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 26,
            type: QuestionType.SCALE_1_5,
            textEn: "The implementation timeline was realistic and well-managed",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION D: HR PROFESSIONAL PERCEPTIONS
          {
            order: 27,
            type: QuestionType.SCALE_1_5,
            textEn: "The competency framework is a strategically important HR tool in our organization",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 28,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has improved the quality and consistency of HR processes",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 29,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework provides a strong foundation for talent management and development",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 30,
            type: QuestionType.SCALE_1_5,
            textEn: "Implementation of the framework was worth the investment of time and resources",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 31,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has enhanced the credibility and strategic role of the HR function",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 32,
            type: QuestionType.SCALE_1_5,
            textEn: "Managers find the framework useful and actively use it in people management",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 33,
            type: QuestionType.SCALE_1_5,
            textEn: "Employees have accepted the framework and understand its purpose",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 34,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has facilitated more objective and fair HR decisions",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 35,
            type: QuestionType.SCALE_1_5,
            textEn: "Overall, the competency framework has met its intended objectives",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 36,
            type: QuestionType.SCALE_1_5,
            textEn: "I would recommend this competency framework approach to other organizations",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION E: ORGANIZATIONAL OUTCOMES
          {
            order: 37,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has improved the quality of recruitment and selection decisions",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 38,
            type: QuestionType.SCALE_1_5,
            textEn: "Training and development programs are now more targeted and effective",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 39,
            type: QuestionType.SCALE_1_5,
            textEn: "Performance management discussions are more structured and meaningful",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 40,
            type: QuestionType.SCALE_1_5,
            textEn: "Employee engagement and motivation have increased since framework implementation",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 41,
            type: QuestionType.SCALE_1_5,
            textEn: "Overall employee performance levels have improved",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 42,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has enhanced succession planning and internal mobility",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 43,
            type: QuestionType.SCALE_1_5,
            textEn: "Employee retention has improved due to better development opportunities",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 44,
            type: QuestionType.SCALE_1_5,
            textEn: "The organization's talent pool quality has strengthened",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 45,
            type: QuestionType.SCALE_1_5,
            textEn: "The framework has contributed to a stronger performance-oriented culture",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },
          {
            order: 46,
            type: QuestionType.SCALE_1_5,
            textEn: "There is measurable ROI from the competency framework investment",
            textAr: "☐",
            isRequired: true,
            options: { create: [
          {
                    order: 1,
                    value: '1',
                    labelEn: '1 - Strongly Disagree',
                    labelAr: '١ - أختلف بشدة'},
          {
                    order: 2,
                    value: '2',
                    labelEn: '2 - Disagree',
                    labelAr: '٢ - أختلف'},
          {
                    order: 3,
                    value: '3',
                    labelEn: '3 - Neutral',
                    labelAr: '٣ - محايد'},
          {
                    order: 4,
                    value: '4',
                    labelEn: '4 - Agree',
                    labelAr: '٤ - أتفق'},
          {
                    order: 5,
                    value: '5',
                    labelEn: '5 - Strongly Agree',
                    labelAr: '٥ - أتفق بشدة'}
] },
          },

          // SECTION H: OPEN-ENDED QUESTIONS
          {
            order: 47,
            type: QuestionType.TEXT,
            textEn: "What do you consider the most significant achievements of your organization's competency framework?",
            textAr: "What do you consider the most significant achievements of your organization's competency framework?",
            isRequired: true,
            
          },
          {
            order: 48,
            type: QuestionType.TEXT,
            textEn: "What were the main challenges encountered during framework design and implementation, and how were they addressed?",
            textAr: "What were the main challenges encountered during framework design and implementation, and how were they addressed?",
            isRequired: true,
            
          },
          {
            order: 49,
            type: QuestionType.TEXT,
            textEn: "What improvements or enhancements would you recommend for the current competency framework?",
            textAr: "What improvements or enhancements would you recommend for the current competency framework?",
            isRequired: true,
            
          },
          {
            order: 50,
            type: QuestionType.TEXT,
            textEn: "Based on your experience, what advice would you give to other organizations planning to implement competency frameworks?",
            textAr: "Based on your experience, what advice would you give to other organizations planning to implement competency frameworks?",
            isRequired: true,
            
          },
          {
            order: 51,
            type: QuestionType.TEXT,
            textEn: "How do you measure the effectiveness and ROI of the competency framework in your organization?",
            textAr: "How do you measure the effectiveness and ROI of the competency framework in your organization?",
            isRequired: true,
            
          }
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
