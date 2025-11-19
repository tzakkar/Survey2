// Diagnostic script to check for questions without options
// Run: node diagnose-missing-options.js

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

async function diagnose() {
  console.log('🔍 Diagnosing questions without options...\n')

  try {
    // Get all questionnaires
    const { data: questionnaires } = await supabase
      .from('Questionnaire')
      .select('id, slug, "titleEn"')

    if (!questionnaires || questionnaires.length === 0) {
      console.log('❌ No questionnaires found in database')
      return
    }

    for (const q of questionnaires) {
      console.log(`\n📋 ${q.titleEn} (${q.slug})`)
      console.log('='.repeat(70))

      // Get all questions for this questionnaire
      const { data: questions } = await supabase
        .from('Question')
        .select('id, "order", type, "textEn", "isRequired"')
        .eq('questionnaireId', q.id)
        .order('order', { ascending: true })

      if (!questions || questions.length === 0) {
        console.log('  ⚠️  No questions found')
        continue
      }

      let missingOptionsCount = 0

      for (const question of questions) {
        // Get options for this question
        const { data: options } = await supabase
          .from('Option')
          .select('id, "order", value, "labelEn"')
          .eq('questionId', question.id)
          .order('order', { ascending: true })

        const optionCount = options ? options.length : 0

        if (question.type === 'SCALE_1_5' && optionCount !== 5) {
          console.log(`  ❌ Q${question.order} (${question.type}): Missing options! Expected 5, found ${optionCount}`)
          console.log(`     "${question.textEn.substring(0, 60)}..."`)
          missingOptionsCount++
        } else if (question.type === 'MULTIPLE_CHOICE' && optionCount === 0) {
          console.log(`  ❌ Q${question.order} (${question.type}): Missing options! Expected at least 2, found ${optionCount}`)
          console.log(`     "${question.textEn.substring(0, 60)}..."`)
          missingOptionsCount++
        } else if (question.type === 'TEXT' && optionCount > 0) {
          console.log(`  ⚠️  Q${question.order} (${question.type}): Has ${optionCount} options (TEXT questions shouldn't have options)`)
        } else {
          console.log(`  ✅ Q${question.order} (${question.type}): ${optionCount} option(s)`)
        }
      }

      if (missingOptionsCount === 0) {
        console.log(`\n  ✅ All questions have proper options!`)
      } else {
        console.log(`\n  ⚠️  Found ${missingOptionsCount} question(s) missing options`)
        console.log(`  💡 Solution: Run supabase-seed-complete.sql in Supabase Dashboard SQL Editor`)
      }
    }

    console.log('\n' + '='.repeat(70))
    console.log('✅ Diagnosis complete!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

diagnose()

