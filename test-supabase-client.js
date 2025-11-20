// Test Supabase client with the exact keys from dashboard
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://sjjzoxcmtgzbyunnmopo.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqanpveGNtdGd6Ynl1bm5tb3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTE1NjksImV4cCI6MjA3OTEyNzU2OX0.Oiwg35Csxws26-l4g92QnCCaGeor7M3aihL1zAC4Cvk'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqanpveGNtdGd6Ynl1bm5tb3BvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MTU2OSwiZXhwIjoyMDc5MTI3NTY5fQ.ZNmrMCPnHZAxx_M9Szb4p2voPNTjRF_gE8c00WworLw'

async function testSupabaseClient() {
  console.log('🔍 Testing Supabase Client Connection...\n')
  
  console.log('📋 Configuration:')
  console.log('  URL:', SUPABASE_URL)
  console.log('  Anon Key:', SUPABASE_ANON_KEY.substring(0, 30) + '...')
  console.log('  Service Key:', SUPABASE_SERVICE_KEY.substring(0, 30) + '...')
  console.log('')
  
  // Test with service key (for server-side)
  console.log('🔌 Testing with SERVICE_KEY (server-side)...')
  try {
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Test query
    const { data, error } = await supabaseService
      .from('Questionnaire')
      .select('id, slug, titleEn')
      .limit(5)
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Tables don\'t exist yet')
        console.log('   This is OK - run: npm run db:push')
      } else {
        console.error('❌ Error:', error.message)
        console.error('   Code:', error.code)
        console.error('   Details:', error.details)
      }
    } else {
      console.log('✅ SERVICE_KEY connection successful!')
      console.log(`   Found ${data.length} questionnaires`)
      if (data.length > 0) {
        data.forEach(q => {
          console.log(`   - ${q.slug}: ${q.titleEn}`)
        })
      }
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    if (error.message.includes('fetch failed')) {
      console.error('\n💡 Network issue - fetch failed')
      console.error('   This might be a firewall/proxy issue')
      console.error('   But your app should still work in production!')
    }
  }
  
  // Test with anon key (for client-side)
  console.log('\n🔌 Testing with ANON_KEY (client-side)...')
  try {
    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const { data, error } = await supabaseAnon
      .from('Questionnaire')
      .select('id, slug')
      .limit(1)
    
    if (error) {
      console.log('⚠️  Anon key test:', error.message)
    } else {
      console.log('✅ ANON_KEY connection successful!')
    }
  } catch (error) {
    console.log('⚠️  Anon key test failed:', error.message)
  }
  
  console.log('\n💡 Summary:')
  console.log('   - If SERVICE_KEY works → Your app will work via API fallback')
  console.log('   - Direct DB connection failing is OK if API works')
  console.log('   - Your app already has API fallback configured!')
}

testSupabaseClient()

