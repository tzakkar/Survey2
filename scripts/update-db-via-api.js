// Update Database via Supabase API
// This script can update the database when network connectivity allows

require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  require('dotenv').config({ path: '.env' });
}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sjjzoxcmtgzbyunnmopo.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K';

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
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
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
    questionId,
    order: opt.order,
    value: opt.value,
    labelEn: opt.labelEn,
    labelAr: opt.labelAr,
  }));

  const { error } = await supabase
    .from('Option')
    .insert(optionsToInsert);

  if (error) throw error;
  return optionsToInsert.length;
}

async function fixAllMissingOptions() {
  console.log('🔍 Finding questions without options...\n');

  try {
    // Get all SCALE_1_5 questions
    const { data: questions, error: qError } = await supabase
      .from('Question')
      .select('id, order, textEn, type')
      .eq('type', 'SCALE_1_5');

    if (qError) {
      throw qError;
    }

    if (!questions || questions.length === 0) {
      console.log('No SCALE_1_5 questions found');
      return;
    }

    console.log(`Found ${questions.length} SCALE_1_5 questions\n`);

    let fixed = 0;
    let skipped = 0;

    for (const question of questions) {
      // Check if question has options
      const { data: options } = await supabase
        .from('Option')
        .select('id')
        .eq('questionId', question.id)
        .limit(1);

      if (!options || options.length === 0) {
        try {
          // Delete any existing options first
          await supabase
            .from('Option')
            .delete()
            .eq('questionId', question.id);

          // Create new options
          await createScaleOptions(question.id);
          fixed++;
          console.log(`✅ Fixed Q${question.order}: "${question.textEn.substring(0, 60)}..."`);
        } catch (error) {
          console.error(`❌ Failed Q${question.order}:`, error.message);
        }
      } else {
        skipped++;
      }
    }

    console.log(`\n✅ Summary:`);
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Already had options: ${skipped}`);
    console.log(`   Total: ${questions.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  fixAllMissingOptions().then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  });
}

module.exports = { fixAllMissingOptions, createScaleOptions };

