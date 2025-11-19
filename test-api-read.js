// Test reading questionnaire via Supabase API
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const SUPABASE_URL = 'https://sjjzoxcmtgzbyunnmopo.supabase.co'
const SUPABASE_SERVICE_KEY = 'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'public' }
})

async function testRead() {
  console.log('Testing Supabase API read access...')
  console.log('')

  try {
    // Get questionnaire
    const { data: questionnaire, error: qError } = await supabase
      .from('Questionnaire')
      .select('*')
      .eq('slug', 'staff-questionnaire')
      .eq('isActive', true)
      .single()

    if (qError) {
      console.error('❌ Error:', qError.message)
      console.error('   Code:', qError.code)
      return
    }

    if (!questionnaire) {
      console.log('❌ Questionnaire not found')
      return
    }

    console.log('✅ Found questionnaire:')
    console.log(`   Slug: ${questionnaire.slug}`)
    console.log(`   Title: ${questionnaire.titleEn}`)
    console.log(`   Active: ${questionnaire.isActive}`)
    console.log('')

    // Get questions
    console.log('📋 Fetching questions...')
    const { data: questions, error: questionsError } = await supabase
      .from('Question')
      .select('*')
      .eq('questionnaireId', questionnaire.id)
      .order('order', { ascending: true })

    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError.message)
      return
    }

    console.log(`✅ Found ${questions.length} question(s)`)
    console.log('')

    // Get options for first question
    if (questions.length > 0) {
      const firstQuestion = questions[0]
      console.log(`📝 First question: ${firstQuestion.textEn}`)
      console.log(`   Type: ${firstQuestion.type}`)
      console.log('')

      const { data: options, error: optionsError } = await supabase
        .from('Option')
        .select('*')
        .eq('questionId', firstQuestion.id)
        .order('order', { ascending: true })

      if (optionsError) {
        console.error('❌ Error fetching options:', optionsError.message)
      } else {
        console.log(`✅ Found ${options.length} option(s) for first question:`)
        options.forEach(opt => {
          console.log(`   - ${opt.labelEn} (${opt.value})`)
        })
      }
    }

    console.log('')
    console.log('✅ API read test successful!')
    console.log('   The application can use Supabase API to read data')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testRead()

