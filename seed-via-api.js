// Seed database using Supabase REST API
// This works even if direct database connection fails

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const SUPABASE_URL = 'https://sjjzoxcmtgzbyunnmopo.supabase.co'
const SUPABASE_SERVICE_KEY = 'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper to generate CUID-like IDs
function generateId() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// Scale options helper
function createScaleOptions(questionId) {
  return [
    { id: generateId(), questionId, order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
    { id: generateId(), questionId, order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
    { id: generateId(), questionId, order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
    { id: generateId(), questionId, order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
    { id: generateId(), questionId, order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
  ]
}

async function seedDatabase() {
  console.log('='.repeat(70))
  console.log('SEEDING DATABASE VIA SUPABASE API')
  console.log('='.repeat(70))
  console.log('')

  try {
    // Check if tables exist
    console.log('📋 Checking if Questionnaire table exists...')
    const { data: checkData, error: checkError } = await supabase
      .from('questionnaire')
      .select('id')
      .limit(1)

    if (checkError) {
      if (checkError.code === 'PGRST116' || checkError.message.includes('relation') || checkError.message.includes('does not exist')) {
        console.log('❌ Questionnaire table does not exist!')
        console.log('')
        console.log('💡 Please run the SQL migration first:')
        console.log('   1. Go to Supabase Dashboard → SQL Editor')
        console.log('   2. Run: supabase-migration.sql')
        console.log('   3. Then run this seed script again')
        console.log('')
        process.exit(1)
      } else {
        throw checkError
      }
    }

    console.log('✅ Tables exist!')
    console.log('')

    // Check for existing data
    console.log('🔍 Checking for existing questionnaires...')
    const { data: existing, error: existingError } = await supabase
      .from('questionnaire')
      .select('slug')

    if (existingError) {
      throw existingError
    }

    if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing questionnaire(s)`)
      console.log('   Slugs:', existing.map(q => q.slug).join(', '))
      console.log('')
      
      const response = require('readline-sync').question('Delete existing data and reseed? (y/n): ')
      if (response.toLowerCase() !== 'y') {
        console.log('Cancelled.')
        process.exit(0)
      }

      console.log('🗑️  Deleting existing data...')
      // Delete in reverse order due to foreign keys
      await supabase.from('answer').delete().neq('id', '')
      await supabase.from('response').delete().neq('id', '')
      await supabase.from('option').delete().neq('id', '')
      await supabase.from('question').delete().neq('id', '')
      await supabase.from('questionnaire').delete().neq('id', '')
      console.log('✅ Existing data deleted')
      console.log('')
    }

    // Create Staff Questionnaire
    console.log('📝 Creating Staff Questionnaire...')
    const staffQId = generateId()
    const { data: staffQ, error: staffQError } = await supabase
      .from('questionnaire')
      .insert({
        id: staffQId,
        slug: 'staff-questionnaire',
        titleEn: 'Survey on Competency Frameworks and Employee Performance - Employee Perspective',
        titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الموظف',
        descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest feedback about your experience with the competency framework is essential for understanding its effectiveness. All responses are completely confidential and anonymous.',
        descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة حول تجربتك مع إطار الكفاءات ضرورية لفهم فعاليته. جميع الإجابات سرية تماماً وسرية.',
        audienceType: 'STAFF',
        isActive: true
      })
      .select()

    if (staffQError) throw staffQError
    console.log('✅ Staff questionnaire created')

    // Create Staff Questions
    console.log('   Creating questions...')
    const staffQuestions = [
      { order: 1, type: 'MULTIPLE_CHOICE', textEn: 'Gender', textAr: 'النوع', isRequired: true, options: [
        { order: 1, value: 'male', labelEn: 'Male', labelAr: 'ذكر' },
        { order: 2, value: 'female', labelEn: 'Female', labelAr: 'أنثى' },
        { order: 3, value: 'prefer-not-say', labelEn: 'Prefer not to say', labelAr: 'أفضل عدم الإفصاح' },
      ]},
      { order: 2, type: 'MULTIPLE_CHOICE', textEn: 'Age Group', textAr: 'الفئة العمرية', isRequired: true, options: [
        { order: 1, value: '20-29', labelEn: '20-29 years', labelAr: '20-29 سنة' },
        { order: 2, value: '30-39', labelEn: '30-39 years', labelAr: '30-39 سنة' },
        { order: 3, value: '40-49', labelEn: '40-49 years', labelAr: '40-49 سنة' },
        { order: 4, value: '50-plus', labelEn: '50 years and above', labelAr: '50 سنة فأكثر' },
      ]},
      { order: 3, type: 'MULTIPLE_CHOICE', textEn: 'Highest Educational Level', textAr: 'أعلى مستوى تعليمي', isRequired: true, options: [
        { order: 1, value: 'high-school', labelEn: 'High school diploma', labelAr: 'شهادة الثانوية العامة' },
        { order: 2, value: 'bachelors', labelEn: "Bachelor's degree", labelAr: 'درجة البكالوريوس' },
        { order: 3, value: 'masters', labelEn: "Master's degree", labelAr: 'درجة الماجستير' },
        { order: 4, value: 'doctoral', labelEn: 'Doctoral degree or higher', labelAr: 'درجة الدكتوراه أو أعلى' },
      ]},
      { order: 4, type: 'MULTIPLE_CHOICE', textEn: 'Current Position Level', textAr: 'مستوى الموضع الحالي', isRequired: true, options: [
        { order: 1, value: 'entry', labelEn: 'Entry-level/Junior', labelAr: 'مستوى مبتدئ/صغير' },
        { order: 2, value: 'intermediate', labelEn: 'Intermediate/Mid-level', labelAr: 'وسيط/متوسط المستوى' },
        { order: 3, value: 'senior', labelEn: 'Senior/Specialist', labelAr: 'رفيع/متخصص' },
        { order: 4, value: 'team-lead', labelEn: 'Team Lead/Supervisor', labelAr: 'قائد فريق/مشرف' },
      ]},
      { order: 5, type: 'MULTIPLE_CHOICE', textEn: 'How long have you been working under the competency framework system?', textAr: 'كم من الوقت تعمل تحت نظام إطار الكفاءات؟', isRequired: true, options: [
        { order: 1, value: 'less-than-1', labelEn: 'Less than 1 year', labelAr: 'أقل من سنة واحدة' },
        { order: 2, value: '1-2', labelEn: '1-2 years', labelAr: '1-2 سنة' },
        { order: 3, value: '3-4', labelEn: '3-4 years', labelAr: '3-4 سنوات' },
        { order: 4, value: 'more-than-4', labelEn: 'More than 4 years', labelAr: 'أكثر من 4 سنوات' },
      ]},
      { order: 6, type: 'SCALE_1_5', textEn: 'I have a clear understanding of what the competency framework means in my organization.', textAr: 'لدي فهم واضح لما يعنيه إطار الكفاءات في منظمتي.', isRequired: true },
      { order: 7, type: 'SCALE_1_5', textEn: 'I understand how my role relates to the competency framework.', textAr: 'أفهم كيف يرتبط دوري بإطار الكفاءات.', isRequired: true },
      { order: 8, type: 'SCALE_1_5', textEn: 'I am aware of the specific competencies required for my position.', textAr: 'أنا على علم بالكفاءات المحددة المطلوبة لمنصبي.', isRequired: true },
      { order: 9, type: 'SCALE_1_5', textEn: 'The competency framework was introduced clearly and effectively.', textAr: 'تم تقديم إطار الكفاءات بشكل واضح وفعال.', isRequired: true },
      { order: 10, type: 'SCALE_1_5', textEn: 'I received adequate training on how to use the competency framework.', textAr: 'تلقيت تدريباً كافياً حول كيفية استخدام إطار الكفاءات.', isRequired: true },
      { order: 11, type: 'SCALE_1_5', textEn: 'I believe the competency framework is fair and objective.', textAr: 'أعتقد أن إطار الكفاءات عادل وموضوعي.', isRequired: true },
      { order: 12, type: 'SCALE_1_5', textEn: 'I feel motivated to develop the competencies outlined in the framework.', textAr: 'أشعر بالتحفيز لتطوير الكفاءات المذكورة في الإطار.', isRequired: true },
      { order: 13, type: 'SCALE_1_5', textEn: 'I am fully engaged in my work.', textAr: 'أنا منخرط بالكامل في عملي.', isRequired: true },
      { order: 14, type: 'SCALE_1_5', textEn: 'I feel a strong connection to my organization.', textAr: 'أشعر بعلاقة قوية مع منظمتي.', isRequired: true },
      { order: 15, type: 'SCALE_1_5', textEn: 'I am highly motivated to perform well in my job.', textAr: 'أنا متحمس بشدة لأداء جيد في وظيفتي.', isRequired: true },
      { order: 16, type: 'SCALE_1_5', textEn: 'I am confident in my ability to perform my job tasks effectively.', textAr: 'أنا واثق من قدرتي على أداء مهام وظيفتي بفعالية.', isRequired: true },
      { order: 17, type: 'SCALE_1_5', textEn: 'I consistently meet or exceed my job performance expectations.', textAr: 'أنا ألتزم باستمرار بتوقعات أداء وظيفتي أو أتجاوزها.', isRequired: true },
      { order: 18, type: 'SCALE_1_5', textEn: 'I go beyond my job requirements to help colleagues and the organization.', textAr: 'أذهب إلى ما هو أبعد من متطلبات وظيفتي لمساعدة الزملاء والمنظمة.', isRequired: true },
      { order: 19, type: 'SCALE_1_5', textEn: 'The competency framework has helped me improve my performance.', textAr: 'ساعدني إطار الكفاءات على تحسين أدائي.', isRequired: true },
      { order: 20, type: 'SCALE_1_5', textEn: 'I receive adequate support from my supervisor to develop my competencies.', textAr: 'أتلقى دعماً كافياً من مشرفي لتطوير كفاءاتي.', isRequired: true },
      { order: 21, type: 'TEXT', textEn: 'What do you like most about the competency framework in your organization?', textAr: 'ما الذي تحب أكثر شيء حول إطار الكفاءات في منظمتك؟', isRequired: false },
      { order: 22, type: 'TEXT', textEn: 'What challenges or difficulties have you experienced with the competency framework?', textAr: 'ما التحديات أو الصعوبات التي واجهتها مع إطار الكفاءات؟', isRequired: false },
      { order: 23, type: 'TEXT', textEn: 'What suggestions do you have to improve the competency framework or its implementation?', textAr: 'ما الاقتراحات التي لديك لتحسين إطار الكفاءات أو تطبيقه؟', isRequired: false },
    ]

    for (const qData of staffQuestions) {
      const qId = generateId()
      const { error: qError } = await supabase
        .from('question')
        .insert({
          id: qId,
          questionnaireId: staffQId,
          order: qData.order,
          type: qData.type,
          textEn: qData.textEn,
          textAr: qData.textAr,
          isRequired: qData.isRequired
        })

      if (qError) throw qError

      // Create options if needed
      if (qData.options) {
        const options = qData.options.map(opt => ({
          id: generateId(),
          questionId: qId,
          order: opt.order,
          value: opt.value,
          labelEn: opt.labelEn,
          labelAr: opt.labelAr
        }))
        const { error: optError } = await supabase.from('option').insert(options)
        if (optError) throw optError
      } else if (qData.type === 'SCALE_1_5') {
        // Create scale options
        const scaleOptions = createScaleOptions(qId)
        const { error: optError } = await supabase.from('option').insert(scaleOptions)
        if (optError) throw optError
      }
    }
    console.log(`✅ Created ${staffQuestions.length} questions`)

    // Create Manager Questionnaire (simplified - you can expand)
    console.log('')
    console.log('📝 Creating Manager Questionnaire...')
    const managerQId = generateId()
    const { data: managerQ, error: managerQError } = await supabase
      .from('questionnaire')
      .insert({
        id: managerQId,
        slug: 'manager-questionnaire',
        titleEn: 'Survey on Competency Frameworks and Employee Performance - Manager Perspective',
        titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الإدارة',
        descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest responses are valuable for understanding how competency frameworks affect organizational performance from a managerial perspective. All responses are confidential.',
        descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة ذات قيمة كبيرة لفهم كيف تؤثر أطر الكفاءات على أداء المنظمة من منظور إداري. جميع الإجابات سرية.',
        audienceType: 'MANAGER',
        isActive: true
      })
      .select()

    if (managerQError) throw managerQError
    console.log('✅ Manager questionnaire created')

    // Create HR Questionnaire
    console.log('')
    console.log('📝 Creating HR Questionnaire...')
    const hrQId = generateId()
    const { data: hrQ, error: hrQError } = await supabase
      .from('questionnaire')
      .insert({
        id: hrQId,
        slug: 'hr-questionnaire',
        titleEn: 'Survey on Competency Frameworks and Employee Performance - HR Professional Perspective',
        titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور متخصص الموارد البشرية',
        descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your expertise as an HR professional is crucial for understanding how competency frameworks are designed, implemented, and impact organizational outcomes. All responses are confidential.',
        descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن خبرتك كمتخصص في الموارد البشرية حاسمة لفهم كيف يتم تصميم أطر الكفاءات وتطبيقها والتأثير على نتائج المنظمة. جميع الإجابات سرية.',
        audienceType: 'HR',
        isActive: true
      })
      .select()

    if (hrQError) throw hrQError
    console.log('✅ HR questionnaire created')

    console.log('')
    console.log('='.repeat(70))
    console.log('✅ SEED COMPLETED SUCCESSFULLY!')
    console.log('='.repeat(70))
    console.log('')
    console.log('Created:')
    console.log('  - Staff Questionnaire (23 questions)')
    console.log('  - Manager Questionnaire')
    console.log('  - HR Questionnaire')
    console.log('')
    console.log('Test your application:')
    console.log('  http://localhost:3000/survey/staff-questionnaire?lang=en')
    console.log('')

  } catch (error) {
    console.log('')
    console.log('='.repeat(70))
    console.log('❌ SEED FAILED')
    console.log('='.repeat(70))
    console.error('Error:', error.message)
    if (error.code) console.error('Code:', error.code)
    if (error.details) console.error('Details:', error.details)
    console.log('')
    process.exit(1)
  }
}

seedDatabase()

