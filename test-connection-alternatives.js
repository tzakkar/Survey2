// Test different connection methods
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function testConnection(description, connectionString) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    },
    log: ['error']
  })
  
  try {
    console.log(`\n🔍 Testing: ${description}`)
    await prisma.$connect()
    const count = await prisma.questionnaire.count()
    console.log(`✅ SUCCESS! Found ${count} questionnaires`)
    await prisma.$disconnect()
    return true
  } catch (error) {
    console.log(`❌ Failed: ${error.message.substring(0, 80)}`)
    await prisma.$disconnect().catch(() => {})
    return false
  }
}

async function testAll() {
  console.log('🔍 Testing different connection methods...\n')
  
  const password = 'Morhaf%401985%21%21%21%21'
  const host = 'db.sjjzoxcmtgzbyunnmopo.supabase.co'
  
  const connections = [
    {
      desc: 'Direct connection (port 5432)',
      url: `postgresql://postgres:${password}@${host}:5432/postgres?sslmode=require`
    },
    {
      desc: 'Connection pooling (port 6543)',
      url: `postgresql://postgres:${password}@${host}:6543/postgres?sslmode=require&pgbouncer=true`
    },
    {
      desc: 'Direct connection without SSL',
      url: `postgresql://postgres:${password}@${host}:5432/postgres`
    }
  ]
  
  for (const conn of connections) {
    const success = await testConnection(conn.desc, conn.url)
    if (success) {
      console.log(`\n✅ Working connection string:`)
      console.log(conn.url)
      console.log(`\nUpdate your .env:`)
      console.log(`DATABASE_URL="${conn.url}"`)
      console.log(`DIRECT_URL="${conn.url}"`)
      return
    }
  }
  
  console.log('\n❌ All connection methods failed.')
  console.log('\n💡 Troubleshooting steps:')
  console.log('1. Check if project is paused in Supabase Dashboard')
  console.log('2. Try restarting the project (Settings → Restart project)')
  console.log('3. Verify password is correct')
  console.log('4. Check network/firewall settings')
  console.log('5. Try accessing Supabase Dashboard → SQL Editor')
}

testAll()

