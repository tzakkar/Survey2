// Simple database connection test
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  console.log('🔍 Testing database connection...\n')
  
  // Check environment variables
  console.log('📋 Environment Variables:')
  console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('  DIRECT_URL:', process.env.DIRECT_URL ? '✅ Set' : '❌ Missing')
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('  SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing')
  console.log('')
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file')
    process.exit(1)
  }
  
  try {
    console.log('🔌 Attempting to connect to database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Successfully connected to database!\n')
    
    // Test query
    console.log('📊 Testing query...')
    const count = await prisma.questionnaire.count()
    console.log(`✅ Query successful! Found ${count} questionnaires in database.\n`)
    
    // List tables
    console.log('📋 Database tables:')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `
    tables.forEach((table) => {
      console.log(`  ✅ ${table.table_name}`)
    })
    
    console.log('\n🎉 Database connection is working correctly!')
    
  } catch (error) {
    console.error('\n❌ Connection failed!')
    console.error('Error:', error.message)
    
    if (error.message.includes("Can't reach database server")) {
      console.error('\n💡 Possible issues:')
      console.error('  1. Supabase project may be paused - check dashboard')
      console.error('  2. Connection string may be incorrect')
      console.error('  3. Network/firewall blocking port 5432')
      console.error('  4. Password may need URL encoding')
    }
    
    if (error.message.includes("Invalid credentials")) {
      console.error('\n💡 Possible issues:')
      console.error('  1. Database password is incorrect')
      console.error('  2. Password needs URL encoding (e.g., & → %26)')
      console.error('  3. Connection string format is wrong')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

