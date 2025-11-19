// Try both .env.local and .env
require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  require('dotenv').config({ path: '.env' });
}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials are not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
});

async function verifyQuestion() {
  console.log('🔍 Verifying question via API (same way the app fetches it)...\n');

  try {
    // Step 1: Get questionnaire
    const { data: questionnaire, error: qError } = await supabase
      .from('Questionnaire')
      .select('*')
      .eq('slug', 'staff-questionnaire')
      .eq('isActive', true)
      .single();

    if (qError || !questionnaire) {
      console.error('❌ Error fetching questionnaire:', qError);
      return;
    }

    console.log(`✅ Found questionnaire: ${questionnaire.titleEn}`);
    console.log(`   ID: ${questionnaire.id}\n`);

    // Step 2: Get questions
    const { data: questions, error: questionsError } = await supabase
      .from('Question')
      .select('*')
      .eq('questionnaireId', questionnaire.id)
      .order('order', { ascending: true });

    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError);
      return;
    }

    console.log(`✅ Found ${questions.length} questions\n`);

    // Step 3: Find the specific question
    const targetQuestion = questions.find(q => 
      q.textEn.includes('meet all formal performance requirements') ||
      q.order === 51
    );

    if (!targetQuestion) {
      console.error('❌ Question not found');
      return;
    }

    console.log(`📋 Target Question:`);
    console.log(`   ID: ${targetQuestion.id}`);
    console.log(`   Order: ${targetQuestion.order}`);
    console.log(`   Type: ${targetQuestion.type}`);
    console.log(`   Text: "${targetQuestion.textEn}"\n`);

    // Step 4: Get options for this question (same way the app does it)
    const { data: options, error: optionsError } = await supabase
      .from('Option')
      .select('*')
      .eq('questionId', targetQuestion.id)
      .order('order', { ascending: true });

    if (optionsError) {
      console.error('❌ Error fetching options:', optionsError);
      return;
    }

    console.log(`📊 Options found: ${options ? options.length : 0}`);
    
    if (options && options.length > 0) {
      console.log(`\n✅ Options:`);
      options.forEach(opt => {
        console.log(`   ${opt.order}. ${opt.labelEn} (ID: ${opt.id})`);
      });
      
      // Step 5: Simulate what the app does - combine question + options
      const questionWithOptions = {
        ...targetQuestion,
        options: options || []
      };
      
      console.log(`\n📦 Combined object structure:`);
      console.log(`   question.id: ${questionWithOptions.id}`);
      console.log(`   question.type: ${questionWithOptions.type}`);
      console.log(`   question.options.length: ${questionWithOptions.options.length}`);
      console.log(`   question.options[0]:`, questionWithOptions.options[0] ? {
        id: questionWithOptions.options[0].id,
        order: questionWithOptions.options[0].order,
        labelEn: questionWithOptions.options[0].labelEn
      } : 'null');
      
      console.log(`\n✅ SUCCESS: Question has ${questionWithOptions.options.length} options`);
      console.log(`   The API should return this data correctly.`);
      console.log(`   If the form still shows "No options", it might be a caching issue.`);
      console.log(`   Try: 1) Hard refresh (Ctrl+Shift+R), 2) Restart dev server, 3) Clear .next folder`);
    } else {
      console.log(`\n❌ PROBLEM: No options found for this question!`);
      console.log(`   Question ID: ${targetQuestion.id}`);
      console.log(`   This means the options are linked to a different question ID.`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  }
}

verifyQuestion();

