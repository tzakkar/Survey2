// Test different password encodings
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const password = 'Morhaf@1985!!!!'
const host = 'db.sjjzoxcmtgzbyunnmopo.supabase.co'

// Different encoding methods
const encodings = [
  {
    name: 'Current (manual encoding)',
    encoded: 'Morhaf%401985%21%21%21%21'
  },
  {
    name: 'encodeURIComponent (full)',
    encoded: encodeURIComponent(password)
  },
  {
    name: 'Only @ encoded',
    encoded: password.replace('@', '%40')
  },
  {
    name: 'Only ! encoded',
    encoded: password.replace(/!/g, '%21')
  },
  {
    name: 'Both @ and ! encoded',
    encoded: password.replace('@', '%40').replace(/!/g, '%21')
  },
  {
    name: 'No encoding (raw)',
    encoded: password
  }
]

async function testConnection(name, encodedPassword) {
  const connectionString = `postgresql://postgres:${encodedPassword}@${host}:5432/postgres?sslmode=require`
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    },
    log: ['error']
  })
  
  try {
    await prisma.$connect()
    const count = await prisma.questionnaire.count()
    console.log(`✅ SUCCESS with: ${name}`)
    console.log(`   Found ${count} questionnaires`)
    console.log(`   Connection string: postgresql://postgres:${encodedPassword}@${host}:5432/postgres?sslmode=require`)
    await prisma.$disconnect()
    return true
  } catch (error) {
    const errorMsg = error.message.substring(0, 100)
    if (errorMsg.includes("Can't reach")) {
      console.log(`❌ ${name}: Can't reach server`)
    } else if (errorMsg.includes("password authentication")) {
      console.log(`❌ ${name}: Wrong password`)
    } else {
      console.log(`❌ ${name}: ${errorMsg}`)
    }
    await prisma.$disconnect().catch(() => {})
    return false
  }
}

async function testAll() {
  console.log('🔍 Testing different password encodings...\n')
  console.log(`Original password: ${password}\n`)
  
  for (const encoding of encodings) {
    const success = await testConnection(encoding.name, encoding.encoded)
    if (success) {
      console.log(`\n✅ WORKING ENCODING FOUND!`)
      console.log(`\nUpdate your .env file:`)
      console.log(`DATABASE_URL="postgresql://postgres:${encoding.encoded}@${host}:5432/postgres?sslmode=require"`)
      console.log(`DIRECT_URL="postgresql://postgres:${encoding.encoded}@${host}:5432/postgres?sslmode=require"`)
      return
    }
  }
  
  console.log('\n❌ None of the encodings worked.')
  console.log('\n💡 Next steps:')
  console.log('1. Get the EXACT connection string from Supabase Dashboard')
  console.log('   Settings → Database → Connection string (URI)')
  console.log('2. Copy it exactly as shown (with [YOUR-PASSWORD] placeholder)')
  console.log('3. Replace [YOUR-PASSWORD] with: Morhaf@1985!!!!')
  console.log('4. Use that exact format in .env')
}

testAll()

