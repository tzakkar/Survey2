// Test direct connection with different password formats
require('dotenv').config()

const passwords = [
  '6DLn.%26XkA9fgML8',  // As provided
  '6DLn.&XkA9fgML8',    // Decoded version
  '6DLn.%2526XkA9fgML8' // Double-encoded %
]

async function testPassword(password) {
  const { PrismaClient } = require('@prisma/client')
  const encodedPassword = encodeURIComponent(password.replace(/%26/g, '&'))
  
  const connectionString = `postgresql://postgres:${encodedPassword}@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require`
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    }
  })
  
  try {
    console.log(`\n🔍 Testing password format: ${password}`)
    await prisma.$connect()
    console.log(`✅ SUCCESS with: ${password}`)
    await prisma.$disconnect()
    return true
  } catch (error) {
    console.log(`❌ Failed: ${error.message.substring(0, 100)}`)
    await prisma.$disconnect().catch(() => {})
    return false
  }
}

async function testAll() {
  console.log('🔍 Testing different password formats...\n')
  
  for (const password of passwords) {
    const success = await testPassword(password)
    if (success) {
      console.log(`\n✅ Working password format: ${password}`)
      console.log(`\nUpdate your .env with:`)
      console.log(`DATABASE_URL="postgresql://postgres:${encodeURIComponent(password.replace(/%26/g, '&'))}@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"`)
      return
    }
  }
  
  console.log('\n❌ None of the password formats worked.')
  console.log('\n💡 Try:')
  console.log('1. Reset database password in Supabase Dashboard')
  console.log('2. Copy the NEW password')
  console.log('3. Update .env file')
}

testAll()

