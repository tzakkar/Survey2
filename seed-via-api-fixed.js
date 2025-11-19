// Seed database using Supabase REST API (Fixed version)
// Handles case sensitivity and schema cache issues

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://sjjzoxcmtgzbyunnmopo.supabase.co'
const SUPABASE_SERVICE_KEY = 'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
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

async function checkTables() {
  console.log('🔍 Checking table names...')
  
  // Try different table name variations
  const tableNames = ['Questionnaire', 'questionnaire', '"Questionnaire"']
  
  for (const tableName of tableNames) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1)
      
      if (!error) {
        console.log(`✅ Found table: ${tableName}`)
        return tableName
      }
    } catch (e) {
      // Continue to next variation
    }
  }
  
  return null
}

async function seedDatabase() {
  console.log('='.repeat(70))
  console.log('SEEDING DATABASE VIA SUPABASE API')
  console.log('='.repeat(70))
  console.log('')

  try {
    // Check which table name works
    const tableName = await checkTables()
    
    if (!tableName) {
      console.log('❌ Could not find Questionnaire table!')
      console.log('')
      console.log('💡 Please ensure:')
      console.log('   1. You ran supabase-migration.sql in Supabase Dashboard')
      console.log('   2. Tables were created successfully')
      console.log('   3. Check Table Editor in Supabase Dashboard')
      console.log('')
      console.log('📋 Table names to check:')
      console.log('   - Questionnaire (capital Q)')
      console.log('   - questionnaire (lowercase)')
      console.log('')
      console.log('If tables exist but this fails, try:')
      console.log('   1. Wait a few minutes for schema cache to refresh')
      console.log('   2. Or use Supabase Dashboard → Table Editor to add data manually')
      console.log('')
      process.exit(1)
    }

    console.log(`✅ Using table: ${tableName}`)
    console.log('')

    // Use the correct table name
    const Questionnaire = supabase.from(tableName)
    const Question = supabase.from('Question')
    const Option = supabase.from('Option')

    // Check for existing data
    const { data: existing } = await Questionnaire.select('slug').limit(10)
    
    if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing questionnaire(s)`)
      console.log('   Slugs:', existing.map(q => q.slug).join(', '))
      console.log('')
      console.log('💡 To reseed, delete existing data first in Supabase Dashboard')
      console.log('   Or modify this script to handle deletion')
      console.log('')
      return
    }

    console.log('📝 Creating questionnaires and questions...')
    console.log('   (This may take a moment...)')
    console.log('')

    // Create Staff Questionnaire
    const staffQId = generateId()
    const now = new Date().toISOString()
    const { data: staffQ, error: staffQError } = await Questionnaire
      .insert({
        id: staffQId,
        slug: 'staff-questionnaire',
        titleEn: 'Survey on Competency Frameworks and Employee Performance - Employee Perspective',
        titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الموظف',
        descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest feedback about your experience with the competency framework is essential for understanding its effectiveness. All responses are completely confidential and anonymous.',
        descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة حول تجربتك مع إطار الكفاءات ضرورية لفهم فعاليته. جميع الإجابات سرية تماماً وسرية.',
        audienceType: 'STAFF',
        isActive: true,
        createdAt: now,
        updatedAt: now
      })
      .select()

    if (staffQError) {
      console.error('Error creating staff questionnaire:', staffQError)
      throw staffQError
    }
    console.log('✅ Staff questionnaire created')

    // Create a few sample questions (you can expand this)
    const sampleQuestions = [
      { order: 1, type: 'MULTIPLE_CHOICE', textEn: 'Gender', textAr: 'النوع', isRequired: true, options: [
        { order: 1, value: 'male', labelEn: 'Male', labelAr: 'ذكر' },
        { order: 2, value: 'female', labelEn: 'Female', labelAr: 'أنثى' },
        { order: 3, value: 'prefer-not-say', labelEn: 'Prefer not to say', labelAr: 'أفضل عدم الإفصاح' },
      ]},
      { order: 2, type: 'SCALE_1_5', textEn: 'I have a clear understanding of what the competency framework means in my organization.', textAr: 'لدي فهم واضح لما يعنيه إطار الكفاءات في منظمتي.', isRequired: true },
      { order: 3, type: 'TEXT', textEn: 'What do you like most about the competency framework?', textAr: 'ما الذي تحب أكثر شيء حول إطار الكفاءات؟', isRequired: false },
    ]

    for (const qData of sampleQuestions) {
      const qId = generateId()
      const { error: qError } = await Question.insert({
        id: qId,
        questionnaireId: staffQId,
        order: qData.order,
        type: qData.type,
        textEn: qData.textEn,
        textAr: qData.textAr,
        isRequired: qData.isRequired
      })

      if (qError) {
        console.error('Error creating question:', qError)
        throw qError
      }

      // Create options
      if (qData.options) {
        const options = qData.options.map(opt => ({
          id: generateId(),
          questionId: qId,
          order: opt.order,
          value: opt.value,
          labelEn: opt.labelEn,
          labelAr: opt.labelAr
        }))
        const { error: optError } = await Option.insert(options)
        if (optError) throw optError
      } else if (qData.type === 'SCALE_1_5') {
        const scaleOptions = createScaleOptions(qId)
        const { error: optError } = await Option.insert(scaleOptions)
        if (optError) throw optError
      }
    }
    console.log(`✅ Created ${sampleQuestions.length} sample questions`)
    console.log('')

    console.log('='.repeat(70))
    console.log('✅ SEED COMPLETED!')
    console.log('='.repeat(70))
    console.log('')
    console.log('Test: http://localhost:3000/survey/staff-questionnaire?lang=en')
    console.log('')
    console.log('💡 Note: This created sample data.')
    console.log('   For full seed, use Supabase Dashboard or fix database connection.')
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
    console.log('💡 Troubleshooting:')
    console.log('   1. Verify tables exist in Supabase Dashboard → Table Editor')
    console.log('   2. Check table names (case-sensitive)')
    console.log('   3. Wait a few minutes for schema cache to refresh')
    console.log('   4. Try adding data manually via Supabase Dashboard')
    console.log('')
    process.exit(1)
  }
}

seedDatabase()

