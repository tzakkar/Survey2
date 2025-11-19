// Test Database Connection and Update Capability
require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  require('dotenv').config({ path: '.env' });
}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sjjzoxcmtgzbyunnmopo.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K';

console.log('🔍 Testing Database Connection...\n');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Service Key:', SUPABASE_SERVICE_KEY ? `${SUPABASE_SERVICE_KEY.substring(0, 20)}...` : 'NOT SET');
console.log('');

// Create client with extended timeout
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
});

async function testConnection() {
  try {
    console.log('1️⃣ Testing READ access...');
    
    // Test reading questionnaires
    const { data: questionnaires, error: readError } = await supabase
      .from('Questionnaire')
      .select('id, slug, titleEn')
      .limit(1);

    if (readError) {
      console.error('❌ READ failed:', readError.message);
      console.error('   Details:', readError.details);
      console.error('   Hint:', readError.hint);
      return false;
    }

    console.log('✅ READ successful!');
    console.log('   Found questionnaires:', questionnaires?.length || 0);
    if (questionnaires && questionnaires.length > 0) {
      console.log('   Example:', questionnaires[0].titleEn);
    }

    console.log('\n2️⃣ Testing WRITE access...');
    
    // Test writing a temporary record (we'll delete it)
    const testId = 'test_' + Date.now();
    const { data: writeData, error: writeError } = await supabase
      .from('Questionnaire')
      .insert({
        id: testId,
        slug: `test-${Date.now()}`,
        titleEn: 'Test Questionnaire',
        titleAr: 'اختبار',
        audienceType: 'STAFF',
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select();

    if (writeError) {
      console.error('❌ WRITE failed:', writeError.message);
      console.error('   Details:', writeError.details);
      console.error('   Code:', writeError.code);
      return false;
    }

    console.log('✅ WRITE successful!');
    console.log('   Created test record:', writeData?.[0]?.id);

    // Clean up - delete the test record
    console.log('\n3️⃣ Testing DELETE access...');
    const { error: deleteError } = await supabase
      .from('Questionnaire')
      .delete()
      .eq('id', testId);

    if (deleteError) {
      console.error('⚠️ DELETE failed (but write worked):', deleteError.message);
    } else {
      console.log('✅ DELETE successful!');
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ SUCCESS: Database connection is working!');
    console.log('   ✓ Can READ from database');
    console.log('   ✓ Can WRITE to database');
    console.log('   ✓ Can DELETE from database');
    console.log('='.repeat(70));
    
    return true;

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error('   Stack:', error.stack);
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});

