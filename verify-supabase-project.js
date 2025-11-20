// Verify Supabase project and connection
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sjjzoxcmtgzbyunnmopo.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

async function verifyProject() {
  console.log('🔍 Verifying Supabase Project...\n')
  
  console.log('📋 Configuration:')
  console.log('  Project URL:', SUPABASE_URL)
  console.log('  Service Key:', SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing')
  console.log('')
  
  if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_KEY is not set in .env file')
    console.error('   Get it from: Supabase Dashboard → Settings → API → service_role key')
    process.exit(1)
  }
  
  try {
    console.log('🔌 Testing Supabase API connection...')
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    // Test API connection by querying a table
    console.log('📊 Testing API query...')
    const { data, error } = await supabase
      .from('Questionnaire')
      .select('id')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Tables may not exist yet. This is OK if you haven\'t run migrations.')
        console.log('   Run: npm run db:push')
      } else {
        console.error('❌ API Error:', error.message)
        console.error('   Code:', error.code)
        
        if (error.message.includes('JWT')) {
          console.error('\n💡 Service key may be invalid or expired')
          console.error('   Get a fresh key from: Supabase Dashboard → Settings → API')
        }
      }
    } else {
      console.log('✅ API connection successful!')
      console.log('   Found', data?.length || 0, 'questionnaires')
    }
    
    // Test database connection string format
    console.log('\n📋 Database Connection String Check:')
    const dbUrl = process.env.DATABASE_URL
    if (dbUrl) {
      const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
      if (urlMatch) {
        const [, user, password, host, port, database] = urlMatch
        console.log('  Format: ✅ Valid PostgreSQL connection string')
        console.log('  Host:', host)
        console.log('  Port:', port)
        console.log('  Database:', database)
        console.log('  User:', user)
        console.log('  Password:', password ? '✅ Set' : '❌ Missing')
        
        if (host.includes('sjjzoxcmtgzbyunnmopo')) {
          console.log('  Project Reference: ✅ Matches')
        } else {
          console.log('  Project Reference: ⚠️  Does not match project URL')
        }
      } else {
        console.log('  Format: ❌ Invalid connection string format')
      }
    } else {
      console.log('  DATABASE_URL: ❌ Not set')
    }
    
    console.log('\n📝 Next Steps:')
    console.log('  1. Check Supabase Dashboard: https://supabase.com/dashboard/project/sjjzoxcmtgzbyunnmopo')
    console.log('  2. Verify project is ACTIVE (not paused)')
    console.log('  3. Get fresh connection string from: Settings → Database → Connection string (URI)')
    console.log('  4. Update .env file with correct DATABASE_URL')
    console.log('  5. Run: npm run db:test-simple')
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

verifyProject()

