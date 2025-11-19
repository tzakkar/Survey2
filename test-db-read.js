// Test reading data from database using Prisma
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function testRead() {
  console.log('Testing database read access...')
  console.log('')

  try {
    await prisma.$connect()
    console.log('✅ Connected to database')

    // Try to read questionnaires
    console.log('📋 Reading questionnaires...')
    const questionnaires = await prisma.questionnaire.findMany({
      select: {
        id: true,
        slug: true,
        titleEn: true,
        audienceType: true,
        isActive: true,
        _count: {
          select: { questions: true }
        }
      }
    })

    if (questionnaires.length === 0) {
      console.log('⚠️  No questionnaires found in database')
      console.log('   Data may have been created via SQL but Prisma can\'t read it')
      console.log('   This could be a schema mismatch or connection issue')
    } else {
      console.log(`✅ Found ${questionnaires.length} questionnaire(s):`)
      questionnaires.forEach(q => {
        console.log(`   - ${q.slug}: ${q.titleEn}`)
        console.log(`     Questions: ${q._count.questions}, Active: ${q.isActive}`)
      })
    }

    // Try to read a specific questionnaire
    console.log('')
    console.log('🔍 Testing getQuestionnaireBySlug...')
    const staffQ = await prisma.questionnaire.findUnique({
      where: { slug: 'staff-questionnaire' },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    if (staffQ) {
      console.log('✅ Found staff-questionnaire!')
      console.log(`   Title: ${staffQ.titleEn}`)
      console.log(`   Questions: ${staffQ.questions.length}`)
      if (staffQ.questions.length > 0) {
        console.log(`   First question: ${staffQ.questions[0].textEn}`)
        console.log(`   Options: ${staffQ.questions[0].options.length}`)
      }
    } else {
      console.log('❌ staff-questionnaire not found')
    }

  } catch (error) {
    console.log('')
    console.log('❌ Error reading from database:')
    console.error('   Message:', error.message)
    if (error.code) console.error('   Code:', error.code)
    console.log('')
    console.log('💡 This confirms Prisma cannot connect to the database')
    console.log('   The data exists in Supabase but Prisma can\'t read it')
  } finally {
    await prisma.$disconnect()
  }
}

testRead()

