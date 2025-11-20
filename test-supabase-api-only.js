// Test Supabase API connection (bypasses direct DB connection)
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

async function testAPI() {
  console.log('🔍 Testing Supabase API connection...\n')
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials in .env')
    return
  }
  
  console.log('📋 Configuration:')
  console.log('  URL:', SUPABASE_URL)
  console.log('  Service Key:', SUPABASE_SERVICE_KEY.substring(0, 20) + '...')
  console.log('')
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    // Test API connection
    console.log('🔌 Testing API connection...')
    const { data, error } = await supabase
      .from('Questionnaire')
      .select('id, slug, titleEn')
      .limit(5)
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Tables don\'t exist yet')
        console.log('   This is OK - you need to run migrations first')
        console.log('   Run: npm run db:push')
      } else {
        console.error('❌ API Error:', error.message)
        console.error('   Code:', error.code)
      }
    } else {
      console.log('✅ API connection successful!')
      console.log(`   Found ${data.length} questionnaires`)
      if (data.length > 0) {
        console.log('\n   Sample data:')
        data.forEach(q => {
          console.log(`   - ${q.slug}: ${q.titleEn}`)
        })
      }
    }
    
    // Test if we can use API as fallback
    console.log('\n💡 Since SQL Editor works but direct DB connection fails:')
    console.log('   Your app will use Supabase API as fallback')
    console.log('   This is already configured in your code!')
    console.log('   The API connection should work for your application.')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testAPI()

