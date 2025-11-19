// Complete Seed Script using Supabase API
// This seeds all questionnaires with all questions

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://sjjzoxcmtgzbyunnmopo.supabase.co'
const SUPABASE_SERVICE_KEY = 'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'public' }
})

// Retry helper function
async function retryOperation(operation, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      const errorMsg = error.message || error.toString()
      if (errorMsg.includes('timeout') || errorMsg.includes('fetch failed') || errorMsg.includes('ECONNRESET')) {
        console.log(`   ⚠️  Network error, retrying in ${delay/1000}s... (${i + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }
}

function generateId() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function createScaleOptions(questionId) {
  return [
    { id: generateId(), questionId, order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
    { id: generateId(), questionId, order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
    { id: generateId(), questionId, order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
    { id: generateId(), questionId, order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
    { id: generateId(), questionId, order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
  ]
}

async function createQuestionWithOptions(questionnaireId, qData) {
  const qId = generateId()
  const now = new Date().toISOString()
  
  // Create question
  const { error: qError } = await supabase.from('Question').insert({
    id: qId,
    questionnaireId,
    order: qData.order,
    type: qData.type,
    textEn: qData.textEn,
    textAr: qData.textAr,
    isRequired: qData.isRequired
  })

  if (qError) throw qError

  // Create options
  if (qData.options) {
    const options = qData.options.map(opt => ({
      id: generateId(),
      questionId: qId,
      order: opt.order,
      value: opt.value,
      labelEn: opt.labelEn,
      labelAr: opt.labelAr
    }))
    const { error: optError } = await supabase.from('Option').insert(options)
    if (optError) throw optError
  } else if (qData.type === 'SCALE_1_5') {
    const scaleOptions = createScaleOptions(qId)
    const { error: optError } = await supabase.from('Option').insert(scaleOptions)
    if (optError) throw optError
  }

  return qId
}

async function seedDatabase() {
  console.log('='.repeat(70))
  console.log('COMPLETE DATABASE SEED')
  console.log('='.repeat(70))
  console.log('')

  const now = new Date().toISOString()
  const Questionnaire = supabase.from('Questionnaire')

  try {
    // Check existing and delete if needed
    const { data: existing, error: checkError } = await Questionnaire.select('id, slug')
    
    if (checkError) {
      console.log(`⚠️  Error checking existing: ${checkError.message}`)
      console.log('   Continuing...')
      console.log('')
    } else if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing questionnaire(s)`)
      console.log('   Slugs:', existing.map(q => q.slug).join(', '))
      console.log('   Deleting existing data to reseed...')
      console.log('   (This may take a moment...)')
      
      try {
        // Delete by specific IDs to ensure they're actually deleted
        for (const q of existing) {
          console.log(`   Deleting questionnaire: ${q.slug}...`)
          
          // Get questions for this questionnaire
          const { data: questions } = await supabase
            .from('Question')
            .select('id')
            .eq('questionnaireId', q.id)
          
          if (questions && questions.length > 0) {
            const questionIds = questions.map(q => q.id)
            
            // Delete options for these questions
            for (const qId of questionIds) {
              await supabase.from('Option').delete().eq('questionId', qId)
            }
            
            // Delete answers for these questions
            for (const qId of questionIds) {
              await supabase.from('Answer').delete().eq('questionId', qId)
            }
            
            // Delete questions
            await supabase.from('Question').delete().eq('questionnaireId', q.id)
          }
          
          // Delete responses
          await supabase.from('Response').delete().eq('questionnaireId', q.id)
          
          // Delete questionnaire
          const { error: delError, data: delData } = await Questionnaire.delete().eq('id', q.id).select()
          if (delError) {
            console.log(`   ⚠️  Error deleting ${q.slug}: ${delError.message}`)
            console.log(`   Code: ${delError.code}`)
            // Try deleting by slug as fallback
            const { error: slugError } = await Questionnaire.delete().eq('slug', q.slug)
            if (!slugError) {
              console.log(`   ✅ Deleted ${q.slug} (by slug)`)
            }
          } else {
            console.log(`   ✅ Deleted ${q.slug}`)
          }
        }
        
        // Wait a moment for database to sync
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verify deletion
        const { data: verify, error: verifyError } = await Questionnaire.select('id, slug')
        if (verifyError) {
          console.log(`   ⚠️  Could not verify deletion: ${verifyError.message}`)
        } else if (verify && verify.length > 0) {
          console.log(`   ⚠️  Warning: ${verify.length} questionnaire(s) still exist:`)
          verify.forEach(q => console.log(`      - ${q.slug} (${q.id})`))
          console.log('   Attempting to delete remaining questionnaires...')
          for (const q of verify) {
            await Questionnaire.delete().eq('id', q.id)
            await Questionnaire.delete().eq('slug', q.slug)
          }
          // Check again
          const { data: finalCheck } = await Questionnaire.select('id')
          if (finalCheck && finalCheck.length > 0) {
            console.log(`   ❌ Still ${finalCheck.length} questionnaire(s) exist. Manual deletion may be needed.`)
            throw new Error('Could not delete all existing questionnaires')
          } else {
            console.log('✅ All existing data deleted (after retry)')
          }
        } else {
          console.log('✅ All existing data deleted')
        }
        console.log('')
      } catch (error) {
        console.log(`⚠️  Error during deletion: ${error.message}`)
        console.log('   Trying to continue anyway...')
        console.log('')
      }
    }

    // Double-check no questionnaires exist before creating
    console.log('🔍 Verifying database is clean...')
    const { data: finalCheck } = await Questionnaire.select('slug')
    if (finalCheck && finalCheck.length > 0) {
      console.log(`   ⚠️  Found ${finalCheck.length} questionnaire(s) still exist: ${finalCheck.map(q => q.slug).join(', ')}`)
      console.log('   Please delete them manually in Supabase Dashboard or wait a moment and try again')
      throw new Error('Cannot proceed - questionnaires still exist')
    }
    console.log('✅ Database is clean, ready to seed')
    console.log('')

    // 1. STAFF QUESTIONNAIRE
    console.log('📝 Creating Staff Questionnaire...')
    const staffQId = generateId()
    const { data: staffQ, error: staffQError } = await retryOperation(async () => {
      return await Questionnaire.insert({
      id: staffQId,
      slug: 'staff-questionnaire',
      titleEn: 'Survey on Competency Frameworks and Employee Performance - Employee Perspective',
      titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الموظف',
      descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest feedback about your experience with the competency framework is essential for understanding its effectiveness. All responses are completely confidential and anonymous.',
      descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة حول تجربتك مع إطار الكفاءات ضرورية لفهم فعاليته. جميع الإجابات سرية تماماً وسرية.',
      audienceType: 'STAFF',
      isActive: true,
      createdAt: now,
      updatedAt: now
    }).select()
    })
    
    if (staffQError) {
      if (staffQError.code === '23505' && staffQError.message.includes('slug')) {
        console.log('   ⚠️  Questionnaire already exists, skipping creation')
        console.log('   (This is okay if you just want to add questions)')
        // Try to get existing questionnaire
        const { data: existing } = await Questionnaire.select('id').eq('slug', 'staff-questionnaire').single()
        if (existing) {
          console.log('   Using existing questionnaire')
          const staffQId = existing.id
          // Continue with questions...
          // But we need to handle this differently
          throw new Error('Questionnaire exists - please delete it first or modify script to update existing')
        }
      }
      throw staffQError
    }
    console.log('✅ Staff questionnaire created')

    // Staff questions
    const staffQuestions = [
      { order: 1, type: 'MULTIPLE_CHOICE', textEn: 'Gender', textAr: 'النوع', isRequired: true, options: [
        { order: 1, value: 'male', labelEn: 'Male', labelAr: 'ذكر' },
        { order: 2, value: 'female', labelEn: 'Female', labelAr: 'أنثى' },
        { order: 3, value: 'prefer-not-say', labelEn: 'Prefer not to say', labelAr: 'أفضل عدم الإفصاح' },
      ]},
      { order: 2, type: 'MULTIPLE_CHOICE', textEn: 'Age Group', textAr: 'الفئة العمرية', isRequired: true, options: [
        { order: 1, value: '20-29', labelEn: '20-29 years', labelAr: '20-29 سنة' },
        { order: 2, value: '30-39', labelEn: '30-39 years', labelAr: '30-39 سنة' },
        { order: 3, value: '40-49', labelEn: '40-49 years', labelAr: '40-49 سنة' },
        { order: 4, value: '50-plus', labelEn: '50 years and above', labelAr: '50 سنة فأكثر' },
      ]},
      { order: 3, type: 'MULTIPLE_CHOICE', textEn: 'Highest Educational Level', textAr: 'أعلى مستوى تعليمي', isRequired: true, options: [
        { order: 1, value: 'high-school', labelEn: 'High school diploma', labelAr: 'شهادة الثانوية العامة' },
        { order: 2, value: 'bachelors', labelEn: "Bachelor's degree", labelAr: 'درجة البكالوريوس' },
        { order: 3, value: 'masters', labelEn: "Master's degree", labelAr: 'درجة الماجستير' },
        { order: 4, value: 'doctoral', labelEn: 'Doctoral degree or higher', labelAr: 'درجة الدكتوراه أو أعلى' },
      ]},
      { order: 4, type: 'MULTIPLE_CHOICE', textEn: 'Current Position Level', textAr: 'مستوى الموضع الحالي', isRequired: true, options: [
        { order: 1, value: 'entry', labelEn: 'Entry-level/Junior', labelAr: 'مستوى مبتدئ/صغير' },
        { order: 2, value: 'intermediate', labelEn: 'Intermediate/Mid-level', labelAr: 'وسيط/متوسط المستوى' },
        { order: 3, value: 'senior', labelEn: 'Senior/Specialist', labelAr: 'رفيع/متخصص' },
        { order: 4, value: 'team-lead', labelEn: 'Team Lead/Supervisor', labelAr: 'قائد فريق/مشرف' },
      ]},
      { order: 5, type: 'MULTIPLE_CHOICE', textEn: 'How long have you been working under the competency framework system?', textAr: 'كم من الوقت تعمل تحت نظام إطار الكفاءات؟', isRequired: true, options: [
        { order: 1, value: 'less-than-1', labelEn: 'Less than 1 year', labelAr: 'أقل من سنة واحدة' },
        { order: 2, value: '1-2', labelEn: '1-2 years', labelAr: '1-2 سنة' },
        { order: 3, value: '3-4', labelEn: '3-4 years', labelAr: '3-4 سنوات' },
        { order: 4, value: 'more-than-4', labelEn: 'More than 4 years', labelAr: 'أكثر من 4 سنوات' },
      ]},
      { order: 6, type: 'SCALE_1_5', textEn: 'I have a clear understanding of what the competency framework means in my organization.', textAr: 'لدي فهم واضح لما يعنيه إطار الكفاءات في منظمتي.', isRequired: true },
      { order: 7, type: 'SCALE_1_5', textEn: 'I understand how my role relates to the competency framework.', textAr: 'أفهم كيف يرتبط دوري بإطار الكفاءات.', isRequired: true },
      { order: 8, type: 'SCALE_1_5', textEn: 'I am aware of the specific competencies required for my position.', textAr: 'أنا على علم بالكفاءات المحددة المطلوبة لمنصبي.', isRequired: true },
      { order: 9, type: 'SCALE_1_5', textEn: 'The competency framework was introduced clearly and effectively.', textAr: 'تم تقديم إطار الكفاءات بشكل واضح وفعال.', isRequired: true },
      { order: 10, type: 'SCALE_1_5', textEn: 'I received adequate training on how to use the competency framework.', textAr: 'تلقيت تدريباً كافياً حول كيفية استخدام إطار الكفاءات.', isRequired: true },
      { order: 11, type: 'SCALE_1_5', textEn: 'I believe the competency framework is fair and objective.', textAr: 'أعتقد أن إطار الكفاءات عادل وموضوعي.', isRequired: true },
      { order: 12, type: 'SCALE_1_5', textEn: 'I feel motivated to develop the competencies outlined in the framework.', textAr: 'أشعر بالتحفيز لتطوير الكفاءات المذكورة في الإطار.', isRequired: true },
      { order: 13, type: 'SCALE_1_5', textEn: 'I am fully engaged in my work.', textAr: 'أنا منخرط بالكامل في عملي.', isRequired: true },
      { order: 14, type: 'SCALE_1_5', textEn: 'I feel a strong connection to my organization.', textAr: 'أشعر بعلاقة قوية مع منظمتي.', isRequired: true },
      { order: 15, type: 'SCALE_1_5', textEn: 'I am highly motivated to perform well in my job.', textAr: 'أنا متحمس بشدة لأداء جيد في وظيفتي.', isRequired: true },
      { order: 16, type: 'SCALE_1_5', textEn: 'I am confident in my ability to perform my job tasks effectively.', textAr: 'أنا واثق من قدرتي على أداء مهام وظيفتي بفعالية.', isRequired: true },
      { order: 17, type: 'SCALE_1_5', textEn: 'I consistently meet or exceed my job performance expectations.', textAr: 'أنا ألتزم باستمرار بتوقعات أداء وظيفتي أو أتجاوزها.', isRequired: true },
      { order: 18, type: 'SCALE_1_5', textEn: 'I go beyond my job requirements to help colleagues and the organization.', textAr: 'أذهب إلى ما هو أبعد من متطلبات وظيفتي لمساعدة الزملاء والمنظمة.', isRequired: true },
      { order: 19, type: 'SCALE_1_5', textEn: 'The competency framework has helped me improve my performance.', textAr: 'ساعدني إطار الكفاءات على تحسين أدائي.', isRequired: true },
      { order: 20, type: 'SCALE_1_5', textEn: 'I receive adequate support from my supervisor to develop my competencies.', textAr: 'أتلقى دعماً كافياً من مشرفي لتطوير كفاءاتي.', isRequired: true },
      { order: 21, type: 'TEXT', textEn: 'What do you like most about the competency framework in your organization?', textAr: 'ما الذي تحب أكثر شيء حول إطار الكفاءات في منظمتك؟', isRequired: false },
      { order: 22, type: 'TEXT', textEn: 'What challenges or difficulties have you experienced with the competency framework?', textAr: 'ما التحديات أو الصعوبات التي واجهتها مع إطار الكفاءات؟', isRequired: false },
      { order: 23, type: 'TEXT', textEn: 'What suggestions do you have to improve the competency framework or its implementation?', textAr: 'ما الاقتراحات التي لديك لتحسين إطار الكفاءات أو تطبيقه؟', isRequired: false },
    ]

    console.log(`   Creating ${staffQuestions.length} questions...`)
    for (const q of staffQuestions) {
      await createQuestionWithOptions(staffQId, q)
    }
    console.log(`✅ Created ${staffQuestions.length} questions`)

    // 2. MANAGER QUESTIONNAIRE
    console.log('')
    console.log('📝 Creating Manager Questionnaire...')
    const managerQId = generateId()
    const { data: managerQ, error: managerQError } = await Questionnaire.insert({
      id: managerQId,
      slug: 'manager-questionnaire',
      titleEn: 'Survey on Competency Frameworks and Employee Performance - Manager Perspective',
      titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور الإدارة',
      descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your honest responses are valuable for understanding how competency frameworks affect organizational performance from a managerial perspective. All responses are confidential.',
      descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن ردودك الصريحة ذات قيمة كبيرة لفهم كيف تؤثر أطر الكفاءات على أداء المنظمة من منظور إداري. جميع الإجابات سرية.',
      audienceType: 'MANAGER',
      isActive: true,
      createdAt: now,
      updatedAt: now
    }).select()

    if (managerQError) throw managerQError
    console.log('✅ Manager questionnaire created')

    const managerQuestions = [
      { order: 1, type: 'MULTIPLE_CHOICE', textEn: 'Gender', textAr: 'النوع', isRequired: true, options: [
        { order: 1, value: 'male', labelEn: 'Male', labelAr: 'ذكر' },
        { order: 2, value: 'female', labelEn: 'Female', labelAr: 'أنثى' },
        { order: 3, value: 'prefer-not-say', labelEn: 'Prefer not to say', labelAr: 'أفضل عدم الإفصاح' },
      ]},
      { order: 2, type: 'MULTIPLE_CHOICE', textEn: 'Current Management Level', textAr: 'مستوى الإدارة الحالي', isRequired: true, options: [
        { order: 1, value: 'first-line', labelEn: 'First-line manager (supervising team leads/employees)', labelAr: 'مدير من الدرجة الأولى (يشرف على رؤساء الفريق/الموظفين)' },
        { order: 2, value: 'middle', labelEn: 'Middle manager (supervising other managers)', labelAr: 'مدير وسيط (يشرف على مديرين آخرين)' },
        { order: 3, value: 'senior', labelEn: 'Senior manager/Director', labelAr: 'مدير رفيع المستوى/مدير' },
        { order: 4, value: 'executive', labelEn: 'Executive level (C-suite)', labelAr: 'مستوى تنفيذي (C-suite)' },
      ]},
      { order: 3, type: 'MULTIPLE_CHOICE', textEn: 'Years Your Organization Has Used Competency Frameworks', textAr: 'عدد السنوات التي استخدمت فيها منظمتك أطر الكفاءات', isRequired: true, options: [
        { order: 1, value: '2-3', labelEn: '2-3 years', labelAr: '2-3 سنوات' },
        { order: 2, value: '4-5', labelEn: '4-5 years', labelAr: '4-5 سنوات' },
        { order: 3, value: '6-10', labelEn: '6-10 years', labelAr: '6-10 سنوات' },
        { order: 4, value: 'more-than-10', labelEn: 'More than 10 years', labelAr: 'أكثر من 10 سنوات' },
      ]},
      { order: 4, type: 'SCALE_1_5', textEn: 'The competency framework in our organization is well-designed and comprehensive.', textAr: 'إطار الكفاءات في منظمتنا مصمم بشكل جيد وشامل.', isRequired: true },
      { order: 5, type: 'SCALE_1_5', textEn: 'The competency framework clearly defines expectations for employee performance.', textAr: 'يحدد إطار الكفاءات بوضوح توقعات أداء الموظفين.', isRequired: true },
      { order: 6, type: 'SCALE_1_5', textEn: 'The competency framework has been implemented effectively in our organization.', textAr: 'تم تطبيق إطار الكفاءات بفعالية في منظمتنا.', isRequired: true },
      { order: 7, type: 'SCALE_1_5', textEn: 'Employees have been adequately trained on using the competency framework.', textAr: 'تم تدريب الموظفين بشكل كافٍ على استخدام إطار الكفاءات.', isRequired: true },
      { order: 8, type: 'SCALE_1_5', textEn: 'I believe the competency framework is a valuable tool for managing employee performance.', textAr: 'أعتقد أن إطار الكفاءات أداة قيمة لإدارة أداء الموظفين.', isRequired: true },
      { order: 9, type: 'SCALE_1_5', textEn: 'I am confident in using the competency framework to assess my team members.', textAr: 'أنا واثق من استخدام إطار الكفاءات لتقييم أعضاء فريقي.', isRequired: true },
      { order: 10, type: 'SCALE_1_5', textEn: 'Senior leadership strongly supports the competency framework initiative.', textAr: 'تدعم القيادة العليا بقوة مبادرة إطار الكفاءات.', isRequired: true },
      { order: 11, type: 'SCALE_1_5', textEn: 'Our organizational culture promotes continuous learning and development.', textAr: 'تعزز ثقافة منظمتنا التعلم والتطوير المستمرين.', isRequired: true },
      { order: 12, type: 'SCALE_1_5', textEn: 'Overall, employees in my team perform well according to the competency framework standards.', textAr: 'بشكل عام، يؤدي الموظفون في فريقي أداءً جيداً وفقاً لمعايير إطار الكفاءات.', isRequired: true },
      { order: 13, type: 'SCALE_1_5', textEn: 'The competency framework has helped improve employee performance in my team.', textAr: 'ساعد إطار الكفاءات على تحسين أداء الموظفين في فريقي.', isRequired: true },
      { order: 14, type: 'SCALE_1_5', textEn: 'I have observed positive changes in employee behavior since implementing the competency framework.', textAr: 'لاحظت تغييرات إيجابية في سلوك الموظفين منذ تطبيق إطار الكفاءات.', isRequired: true },
      { order: 15, type: 'TEXT', textEn: 'What do you consider the most significant benefits of using the competency framework in your role as a manager?', textAr: 'ما الذي تعتبره الفوائد الأكثر أهمية لاستخدام إطار الكفاءات في دورك كمدير؟', isRequired: false },
      { order: 16, type: 'TEXT', textEn: 'What challenges have you encountered in implementing or using the competency framework?', textAr: 'ما التحديات التي واجهتها في تطبيق أو استخدام إطار الكفاءات؟', isRequired: false },
      { order: 17, type: 'TEXT', textEn: 'What improvements would you suggest to make the competency framework more effective?', textAr: 'ما التحسينات التي تقترحها لجعل إطار الكفاءات أكثر فعالية؟', isRequired: false },
    ]

    console.log(`   Creating ${managerQuestions.length} questions...`)
    for (const q of managerQuestions) {
      await createQuestionWithOptions(managerQId, q)
    }
    console.log(`✅ Created ${managerQuestions.length} questions`)

    // 3. HR QUESTIONNAIRE
    console.log('')
    console.log('📝 Creating HR Questionnaire...')
    const hrQId = generateId()
    const { data: hrQ, error: hrQError } = await Questionnaire.insert({
      id: hrQId,
      slug: 'hr-questionnaire',
      titleEn: 'Survey on Competency Frameworks and Employee Performance - HR Professional Perspective',
      titleAr: 'استبيان عن أطر الكفاءات وأداء الموظفين - منظور متخصص الموارد البشرية',
      descriptionEn: 'This questionnaire is part of a research study examining "The Impact of Using Competency Frameworks on Enhancing Employee Performance." Your expertise as an HR professional is crucial for understanding how competency frameworks are designed, implemented, and impact organizational outcomes. All responses are confidential.',
      descriptionAr: 'هذا الاستبيان جزء من دراسة بحثية تفحص "تأثير استخدام أطر الكفاءات على تحسين أداء الموظفين". إن خبرتك كمتخصص في الموارد البشرية حاسمة لفهم كيف يتم تصميم أطر الكفاءات وتطبيقها والتأثير على نتائج المنظمة. جميع الإجابات سرية.',
      audienceType: 'HR',
      isActive: true,
      createdAt: now,
      updatedAt: now
    }).select()

    if (hrQError) throw hrQError
    console.log('✅ HR questionnaire created')

    const hrQuestions = [
      { order: 1, type: 'MULTIPLE_CHOICE', textEn: 'Current HR Role', textAr: 'دورك الحالي في الموارد البشرية', isRequired: true, options: [
        { order: 1, value: 'generalist', labelEn: 'HR Generalist', labelAr: 'متخصص عام في الموارد البشرية' },
        { order: 2, value: 'specialist', labelEn: 'HR Specialist (Recruitment/Training/Compensation)', labelAr: 'متخصص في الموارد البشرية (التوظيف/التدريب/التعويضات)' },
        { order: 3, value: 'manager', labelEn: 'HR Manager/Business Partner', labelAr: 'مدير موارد بشرية / شريك العمل' },
        { order: 4, value: 'director', labelEn: 'HR Director/Head of HR', labelAr: 'مدير / رئيس الموارد البشرية' },
      ]},
      { order: 2, type: 'MULTIPLE_CHOICE', textEn: 'Your Level of Involvement in Competency Framework Design/Implementation', textAr: 'مستوى مشاركتك في تصميم/تطبيق إطار الكفاءات', isRequired: true, options: [
        { order: 1, value: 'primary', labelEn: 'Primary designer/implementer', labelAr: 'المصمم/المطبق الرئيسي' },
        { order: 2, value: 'actively-involved', labelEn: 'Actively involved in the project team', labelAr: 'مشارك نشط في فريق المشروع' },
        { order: 3, value: 'moderate', labelEn: 'Moderate involvement', labelAr: 'مشاركة معتدلة' },
        { order: 4, value: 'limited', labelEn: 'Limited involvement (administrative support)', labelAr: 'مشاركة محدودة (دعم إداري)' },
      ]},
      { order: 3, type: 'MULTIPLE_CHOICE', textEn: 'Years Your Organization Has Used Competency Frameworks', textAr: 'عدد السنوات التي استخدمت فيها منظمتك أطر الكفاءات', isRequired: true, options: [
        { order: 1, value: '2-3', labelEn: '2-3 years', labelAr: '2-3 سنوات' },
        { order: 2, value: '4-5', labelEn: '4-5 years', labelAr: '4-5 سنوات' },
        { order: 3, value: '6-10', labelEn: '6-10 years', labelAr: '6-10 سنوات' },
        { order: 4, value: 'more-than-10', labelEn: 'More than 10 years', labelAr: 'أكثر من 10 سنوات' },
      ]},
      { order: 4, type: 'SCALE_1_5', textEn: 'The competency framework design aligns well with our organizational goals and strategy.', textAr: 'يتوافق تصميم إطار الكفاءات بشكل جيد مع أهدافنا التنظيمية واستراتيجيتنا.', isRequired: true },
      { order: 5, type: 'SCALE_1_5', textEn: 'The competency framework covers all essential competencies needed for our organization.', textAr: 'يغطي إطار الكفاءات جميع الكفاءات الأساسية المطلوبة لمنظمتنا.', isRequired: true },
      { order: 6, type: 'SCALE_1_5', textEn: 'The implementation process was well-planned and executed.', textAr: 'كانت عملية التطبيق مخططاً لها ومنفذة بشكل جيد.', isRequired: true },
      { order: 7, type: 'SCALE_1_5', textEn: 'Adequate resources were allocated for the competency framework implementation.', textAr: 'تم تخصيص موارد كافية لتطبيق إطار الكفاءات.', isRequired: true },
      { order: 8, type: 'SCALE_1_5', textEn: 'I believe the competency framework has been successful in our organization.', textAr: 'أعتقد أن إطار الكفاءات كان ناجحاً في منظمتنا.', isRequired: true },
      { order: 9, type: 'SCALE_1_5', textEn: 'The competency framework has improved our talent management processes.', textAr: 'حسّن إطار الكفاءات عمليات إدارة المواهب لدينا.', isRequired: true },
      { order: 10, type: 'SCALE_1_5', textEn: 'The competency framework has positively impacted overall employee performance.', textAr: 'أثر إطار الكفاءات بشكل إيجابي على أداء الموظفين بشكل عام.', isRequired: true },
      { order: 11, type: 'SCALE_1_5', textEn: 'The competency framework has contributed to better employee development outcomes.', textAr: 'ساهم إطار الكفاءات في نتائج أفضل لتطوير الموظفين.', isRequired: true },
      { order: 12, type: 'SCALE_1_5', textEn: 'Resistance to change was a significant challenge during implementation.', textAr: 'كانت مقاومة التغيير تحدياً كبيراً أثناء التطبيق.', isRequired: true },
      { order: 13, type: 'SCALE_1_5', textEn: 'Lack of adequate training resources was a challenge.', textAr: 'كان نقص موارد التدريب الكافية تحدياً.', isRequired: true },
      { order: 14, type: 'SCALE_1_5', textEn: 'Strong leadership support was critical for successful implementation.', textAr: 'كان دعم القيادة القوي حاسماً للتطبيق الناجح.', isRequired: true },
      { order: 15, type: 'SCALE_1_5', textEn: 'Clear communication about the framework was important for success.', textAr: 'كان التواصل الواضح حول الإطار مهماً للنجاح.', isRequired: true },
      { order: 16, type: 'TEXT', textEn: 'What do you consider the most significant achievements of your organization\'s competency framework?', textAr: 'ما الذي تعتبره أهم إنجاز لإطار الكفاءات في منظمتك؟', isRequired: false },
      { order: 17, type: 'TEXT', textEn: 'What were the main challenges encountered during framework design and implementation, and how were they addressed?', textAr: 'ما التحديات الرئيسية التي تمت مواجهتها أثناء تصميم وتطبيق الإطار، وكيف تم معالجتها؟', isRequired: false },
      { order: 18, type: 'TEXT', textEn: 'What improvements or enhancements would you recommend for the current competency framework?', textAr: 'ما التحسينات أو التحسينات التي توصي بها لإطار الكفاءات الحالي؟', isRequired: false },
      { order: 19, type: 'TEXT', textEn: 'Based on your experience, what advice would you give to other organizations planning to implement competency frameworks?', textAr: 'بناءً على خبرتك، ما النصح الذي تقدمه للمنظمات الأخرى التي تخطط لتطبيق أطر الكفاءات؟', isRequired: false },
    ]

    console.log(`   Creating ${hrQuestions.length} questions...`)
    for (const q of hrQuestions) {
      await createQuestionWithOptions(hrQId, q)
    }
    console.log(`✅ Created ${hrQuestions.length} questions`)

    console.log('')
    console.log('='.repeat(70))
    console.log('✅ COMPLETE SEED SUCCESSFUL!')
    console.log('='.repeat(70))
    console.log('')
    console.log('Created:')
    console.log(`  ✅ Staff Questionnaire (${staffQuestions.length} questions)`)
    console.log(`  ✅ Manager Questionnaire (${managerQuestions.length} questions)`)
    console.log(`  ✅ HR Questionnaire (${hrQuestions.length} questions)`)
    console.log('')
    console.log('Test your application:')
    console.log('  http://localhost:3000/survey/staff-questionnaire?lang=en')
    console.log('  http://localhost:3000/survey/manager-questionnaire?lang=en')
    console.log('  http://localhost:3000/survey/hr-questionnaire?lang=en')
    console.log('')

  } catch (error) {
    console.log('')
    console.log('='.repeat(70))
    console.log('❌ SEED FAILED')
    console.log('='.repeat(70))
    console.error('Error:', error.message)
    if (error.code) console.error('Code:', error.code)
    if (error.details) console.error('Details:', error.details)
    console.log('')
    process.exit(1)
  }
}

seedDatabase()

