// Try both .env.local and .env
require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  require('dotenv').config({ path: '.env' });
}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials are not set in .env.local');
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

function generateCuid() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 11);
  return 'c' + timestamp + random;
}

async function createScaleOptions(questionId) {
  const options = [
    { order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
    { order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
    { order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
    { order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
    { order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
  ];

  const optionsToInsert = options.map(opt => ({
    id: generateCuid(),
    questionId: questionId,
    order: opt.order,
    value: opt.value,
    labelEn: opt.labelEn,
    labelAr: opt.labelAr,
  }));

  const { error } = await supabase
    .from('Option')
    .insert(optionsToInsert);

  if (error) {
    console.error('Error creating options:', error);
    throw error;
  }

  return optionsToInsert.length;
}

async function fixQuestion() {
  console.log('🔍 Finding question: "I meet all formal performance requirements of my job."\n');

  try {
    // Find the question
    const { data: questions, error: qError } = await supabase
      .from('Question')
      .select('id, "order", type, "textEn", "questionnaireId"')
      .or('textEn.ilike.%meet all formal performance requirements%,textEn.ilike.%formal performance requirements%');

    if (qError) {
      console.error('❌ Error fetching question:', qError);
      return;
    }

    if (!questions || questions.length === 0) {
      console.log('❌ Question not found in database');
      return;
    }

    for (const question of questions) {
      console.log(`\n📋 Found question:`);
      console.log(`   ID: ${question.id}`);
      console.log(`   Order: ${question.order}`);
      console.log(`   Type: ${question.type}`);
      console.log(`   Text: "${question.textEn}"`);

      // Check if it has options
      const { data: options, error: optError } = await supabase
        .from('Option')
        .select('id, "order", value, "labelEn"')
        .eq('questionId', question.id)
        .order('order', { ascending: true });

      if (optError) {
        console.error('❌ Error fetching options:', optError);
        continue;
      }

      const optionCount = options ? options.length : 0;
      console.log(`   Current options: ${optionCount}`);

      if (question.type === 'SCALE_1_5' && optionCount === 0) {
        console.log(`\n⚠️  Question is missing options! Creating them now...`);
        
        const created = await createScaleOptions(question.id);
        console.log(`✅ Created ${created} options for this question`);
        
        // Verify
        const { data: newOptions } = await supabase
          .from('Option')
          .select('id, "order", value, "labelEn"')
          .eq('questionId', question.id)
          .order('order', { ascending: true });

        console.log(`\n✅ Verification - Options now in database:`);
        newOptions?.forEach(opt => {
          console.log(`   ${opt.order}. ${opt.labelEn}`);
        });
      } else if (question.type === 'SCALE_1_5' && optionCount < 5) {
        console.log(`\n⚠️  Question has only ${optionCount} options (expected 5). Creating missing ones...`);
        
        const existingOrders = options.map(o => o.order);
        const allOrders = [1, 2, 3, 4, 5];
        const missingOrders = allOrders.filter(o => !existingOrders.includes(o));

        if (missingOrders.length > 0) {
          const optionsToAdd = missingOrders.map(order => {
            const labels = {
              1: { en: '1 - Strongly Disagree', ar: '١ - أختلف بشدة' },
              2: { en: '2 - Disagree', ar: '٢ - أختلف' },
              3: { en: '3 - Neutral', ar: '٣ - محايد' },
              4: { en: '4 - Agree', ar: '٤ - أتفق' },
              5: { en: '5 - Strongly Agree', ar: '٥ - أتفق بشدة' },
            };
            return {
              id: generateCuid(),
              questionId: question.id,
              order: order,
              value: order.toString(),
              labelEn: labels[order].en,
              labelAr: labels[order].ar,
            };
          });

          const { error: insertError } = await supabase
            .from('Option')
            .insert(optionsToAdd);

          if (insertError) {
            console.error('❌ Error creating missing options:', insertError);
          } else {
            console.log(`✅ Created ${optionsToAdd.length} missing options`);
          }
        }
      } else if (optionCount > 0) {
        console.log(`\n✅ Question already has ${optionCount} options:`);
        options.forEach(opt => {
          console.log(`   ${opt.order}. ${opt.labelEn}`);
        });
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Fix complete!');
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  }
}

fixQuestion();

