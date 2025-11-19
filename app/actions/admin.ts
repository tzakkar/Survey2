'use server'

import { prisma } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { AudienceType, QuestionType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Questionnaire actions
export async function createQuestionnaire(data: {
  slug: string
  titleEn: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
  audienceType: AudienceType
  isActive?: boolean
}) {
  try {
    const questionnaire = await prisma.questionnaire.create({
      data: {
        slug: data.slug,
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr,
        audienceType: data.audienceType,
        isActive: data.isActive ?? true,
      },
    })

    revalidatePath('/admin/questionnaires')
    return { success: true, questionnaire }
  } catch (error: any) {
    console.error('Error creating questionnaire:', error)
    return { error: error.message || 'Failed to create questionnaire' }
  }
}

export async function updateQuestionnaire(
  id: string,
  data: {
    slug?: string
    titleEn?: string
    titleAr?: string
    descriptionEn?: string
    descriptionAr?: string
    audienceType?: AudienceType
    isActive?: boolean
  }
) {
  try {
    const questionnaire = await prisma.questionnaire.update({
      where: { id },
      data,
    })

    revalidatePath('/admin/questionnaires')
    revalidatePath(`/admin/questionnaires/${id}`)
    return { success: true, questionnaire }
  } catch (error: any) {
    console.error('Error updating questionnaire:', error)
    return { error: error.message || 'Failed to update questionnaire' }
  }
}

export async function deleteQuestionnaire(id: string) {
  try {
    await prisma.questionnaire.delete({
      where: { id },
    })

    revalidatePath('/admin/questionnaires')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting questionnaire:', error)
    return { error: error.message || 'Failed to delete questionnaire' }
  }
}

export async function getAllQuestionnaires() {
  // Try Prisma first
  try {
    const questionnaires = await prisma.questionnaire.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, questionnaires }
  } catch (error: any) {
    console.log('Prisma connection failed, trying Supabase API...', error.message)
    
    // Fallback to Supabase API
    try {
      console.log('Attempting to fetch questionnaires via Supabase API...')
      const { data: questionnaires, error: apiError } = await supabase
        .from('Questionnaire')
        .select('*')
        .order('createdAt', { ascending: false })

      if (apiError) {
        console.error('Error fetching questionnaires via API:', apiError)
        console.error('API Error details:', {
          message: apiError.message,
          details: apiError.details,
          hint: apiError.hint,
          code: apiError.code
        })
        return { error: apiError.message || 'Failed to fetch questionnaires' }
      }

      console.log(`✅ Successfully fetched ${questionnaires?.length || 0} questionnaires via API`)
      return { success: true, questionnaires: questionnaires || [] }
    } catch (apiError: any) {
      console.error('Error fetching questionnaires via API:', apiError)
      return { error: apiError.message || 'Failed to fetch questionnaires' }
    }
  }
}

export async function getQuestionnaire(id: string) {
  // Try Prisma first
  try {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })
    return { success: true, questionnaire }
  } catch (error: any) {
    console.log('Prisma connection failed, trying Supabase API...', error.message)
    
    // Fallback to Supabase API
    try {
      const { data: questionnaire, error: qError } = await supabase
        .from('Questionnaire')
        .select('*')
        .eq('id', id)
        .single()

      if (qError || !questionnaire) {
        return { error: qError?.message || 'Questionnaire not found' }
      }

      // Get questions
      const { data: questions } = await supabase
        .from('Question')
        .select('*')
        .eq('questionnaireId', id)
        .order('order', { ascending: true })

      // Get options for each question
      const questionsWithOptions = await Promise.all(
        (questions || []).map(async (question) => {
          const { data: options } = await supabase
            .from('Option')
            .select('*')
            .eq('questionId', question.id)
            .order('order', { ascending: true })

          return {
            ...question,
            options: options || []
          }
        })
      )

      return {
        success: true,
        questionnaire: {
          ...questionnaire,
          questions: questionsWithOptions
        }
      }
    } catch (apiError: any) {
      console.error('Error fetching questionnaire via API:', apiError)
      return { error: apiError.message || 'Failed to fetch questionnaire' }
    }
  }
}

// Question actions
export async function createQuestion(data: {
  questionnaireId: string
  order: number
  type: QuestionType
  textEn: string
  textAr: string
  isRequired?: boolean
}) {
  try {
    const question = await prisma.question.create({
      data: {
        questionnaireId: data.questionnaireId,
        order: data.order,
        type: data.type,
        textEn: data.textEn,
        textAr: data.textAr,
        isRequired: data.isRequired ?? false,
      },
    })

    revalidatePath(`/admin/questionnaires/${data.questionnaireId}`)
    return { success: true, question }
  } catch (error: any) {
    console.error('Error creating question:', error)
    return { error: error.message || 'Failed to create question' }
  }
}

export async function updateQuestion(
  id: string,
  data: {
    order?: number
    type?: QuestionType
    textEn?: string
    textAr?: string
    isRequired?: boolean
  }
) {
  try {
    const question = await prisma.question.update({
      where: { id },
      data,
    })

    revalidatePath(`/admin/questionnaires/${question.questionnaireId}`)
    return { success: true, question }
  } catch (error: any) {
    console.error('Error updating question:', error)
    return { error: error.message || 'Failed to update question' }
  }
}

export async function deleteQuestion(id: string) {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
      select: { questionnaireId: true },
    })

    await prisma.question.delete({
      where: { id },
    })

    if (question) {
      revalidatePath(`/admin/questionnaires/${question.questionnaireId}`)
    }
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting question:', error)
    return { error: error.message || 'Failed to delete question' }
  }
}

export async function reorderQuestions(questionIds: string[]) {
  try {
    await Promise.all(
      questionIds.map((id, index) =>
        prisma.question.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    )

    return { success: true }
  } catch (error: any) {
    console.error('Error reordering questions:', error)
    return { error: error.message || 'Failed to reorder questions' }
  }
}

// Option actions
export async function createOption(data: {
  questionId: string
  order: number
  value: string
  labelEn: string
  labelAr: string
}) {
  try {
    const option = await prisma.option.create({
      data,
    })

    const question = await prisma.question.findUnique({
      where: { id: data.questionId },
      select: { questionnaireId: true },
    })

    if (question) {
      revalidatePath(`/admin/questionnaires/${question.questionnaireId}`)
    }
    return { success: true, option }
  } catch (error: any) {
    console.error('Error creating option:', error)
    return { error: error.message || 'Failed to create option' }
  }
}

export async function updateOption(
  id: string,
  data: {
    order?: number
    value?: string
    labelEn?: string
    labelAr?: string
  }
) {
  try {
    const option = await prisma.option.update({
      where: { id },
      data,
    })

    const question = await prisma.question.findUnique({
      where: { id: option.questionId },
      select: { questionnaireId: true },
    })

    if (question) {
      revalidatePath(`/admin/questionnaires/${question.questionnaireId}`)
    }
    return { success: true, option }
  } catch (error: any) {
    console.error('Error updating option:', error)
    return { error: error.message || 'Failed to update option' }
  }
}

export async function deleteOption(id: string) {
  try {
    const option = await prisma.option.findUnique({
      where: { id },
      select: { questionId: true },
    })

    await prisma.option.delete({
      where: { id },
    })

    if (option) {
      const question = await prisma.question.findUnique({
        where: { id: option.questionId },
        select: { questionnaireId: true },
      })

      if (question) {
        revalidatePath(`/admin/questionnaires/${question.questionnaireId}`)
      }
    }
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting option:', error)
    return { error: error.message || 'Failed to delete option' }
  }
}

// Response actions
export async function getQuestionnaireResponses(questionnaireId: string) {
  // Try Prisma first
  try {
    const responses = await prisma.response.findMany({
      where: { questionnaireId },
      orderBy: { submittedAt: 'desc' },
      include: {
        answers: {
          include: {
            question: true,
            option: true,
          },
        },
      },
    })
    return { success: true, responses }
  } catch (error: any) {
    console.log('Prisma connection failed, trying Supabase API...', error.message)
    
    // Fallback to Supabase API
    try {
      console.log(`Attempting to fetch responses for questionnaire ${questionnaireId} via Supabase API...`)
      const { data: responses, error: rError } = await supabase
        .from('Response')
        .select('*')
        .eq('questionnaireId', questionnaireId)
        .order('submittedAt', { ascending: false })

      if (rError) {
        console.error('Error fetching responses via API:', rError)
        console.error('API Error details:', {
          message: rError.message,
          details: rError.details,
          hint: rError.hint,
          code: rError.code
        })
        return { error: rError.message || 'Failed to fetch responses' }
      }

      console.log(`✅ Found ${responses?.length || 0} responses via API`)

      // Get answers for each response
      const responsesWithAnswers = await Promise.all(
        (responses || []).map(async (response) => {
          const { data: answers } = await supabase
            .from('Answer')
            .select('*')
            .eq('responseId', response.id)

          // Get question and option details for each answer
          const answersWithDetails = await Promise.all(
            (answers || []).map(async (answer) => {
              const { data: question } = await supabase
                .from('Question')
                .select('*')
                .eq('id', answer.questionId)
                .single()

              let option = null
              if (answer.valueOptionId) {
                const { data: opt } = await supabase
                  .from('Option')
                  .select('*')
                  .eq('id', answer.valueOptionId)
                  .single()
                option = opt
              }

              return {
                ...answer,
                question: question || null,
                option: option || null,
              }
            })
          )

          return {
            ...response,
            answers: answersWithDetails,
          }
        })
      )

      console.log(`✅ Successfully loaded ${responsesWithAnswers.length} responses with answers via API`)
      return { success: true, responses: responsesWithAnswers }
    } catch (apiError: any) {
      console.error('Error fetching responses via API:', apiError)
      console.error('API Error details:', {
        message: apiError.message,
        stack: apiError.stack
      })
      return { error: apiError.message || 'Failed to fetch responses' }
    }
  }
}

// Database maintenance actions (using Supabase API fallback)
export async function fixMissingOptionsForQuestion(questionId: string) {
  try {
    // Try Prisma first
    try {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: { options: true },
      })

      if (!question) {
        return { error: 'Question not found' }
      }

      if (question.type === 'SCALE_1_5' && question.options.length === 0) {
        // Create scale options via Prisma
        await prisma.option.createMany({
          data: [
            { questionId, order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
            { questionId, order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
            { questionId, order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
            { questionId, order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
            { questionId, order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
          ],
        })
        revalidatePath('/admin')
        return { success: true, message: 'Options created successfully' }
      }

      return { success: true, message: 'Question already has options' }
    } catch (prismaError: any) {
      console.log('Prisma failed, trying Supabase API...', prismaError.message)
      
      // Fallback to Supabase API
      const { data: question } = await supabase
        .from('Question')
        .select('id, type')
        .eq('id', questionId)
        .single()

      if (!question) {
        return { error: 'Question not found' }
      }

      if (question.type === 'SCALE_1_5') {
        // Check existing options
        const { data: existingOptions } = await supabase
          .from('Option')
          .select('id')
          .eq('questionId', questionId)

        if (existingOptions && existingOptions.length > 0) {
          return { success: true, message: 'Question already has options' }
        }

        // Create scale options
        const optionsToInsert = [
          { id: `c${Date.now()}1`, questionId, order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
          { id: `c${Date.now()}2`, questionId, order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
          { id: `c${Date.now()}3`, questionId, order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
          { id: `c${Date.now()}4`, questionId, order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
          { id: `c${Date.now()}5`, questionId, order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
        ]

        const { error: insertError } = await supabase
          .from('Option')
          .insert(optionsToInsert)

        if (insertError) {
          return { error: `Failed to create options: ${insertError.message}` }
        }

        revalidatePath('/admin')
        return { success: true, message: 'Options created successfully via API' }
      }

      return { error: 'Question type does not require options' }
    }
  } catch (error: any) {
    console.error('Error fixing options:', error)
    return { error: error.message || 'Failed to fix options' }
  }
}

export async function fixAllMissingOptions() {
  try {
    // Try Prisma first
    try {
      const questions = await prisma.question.findMany({
        where: { type: 'SCALE_1_5' },
        include: { options: true },
      })

      let fixed = 0
      for (const question of questions) {
        if (question.options.length === 0) {
          await prisma.option.createMany({
            data: [
              { questionId: question.id, order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
              { questionId: question.id, order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
              { questionId: question.id, order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
              { questionId: question.id, order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
              { questionId: question.id, order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
            ],
          })
          fixed++
        }
      }

      revalidatePath('/admin')
      return { success: true, fixed, total: questions.length }
    } catch (prismaError: any) {
      console.log('Prisma failed, trying Supabase API...', prismaError.message)
      
      // Fallback to Supabase API
      const { data: questions } = await supabase
        .from('Question')
        .select('id, order, textEn')
        .eq('type', 'SCALE_1_5')

      if (!questions || questions.length === 0) {
        return { success: true, fixed: 0, total: 0 }
      }

      let fixed = 0
      for (const question of questions) {
        const { data: options } = await supabase
          .from('Option')
          .select('id')
          .eq('questionId', question.id)
          .limit(1)

        if (!options || options.length === 0) {
          const optionsToInsert = [
            { id: `c${Date.now()}${question.id}1`, questionId: question.id, order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
            { id: `c${Date.now()}${question.id}2`, questionId: question.id, order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
            { id: `c${Date.now()}${question.id}3`, questionId: question.id, order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
            { id: `c${Date.now()}${question.id}4`, questionId: question.id, order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
            { id: `c${Date.now()}${question.id}5`, questionId: question.id, order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
          ]

          const { error } = await supabase.from('Option').insert(optionsToInsert)
          if (!error) {
            fixed++
          }
        }
      }

      revalidatePath('/admin')
      return { success: true, fixed, total: questions.length }
    }
  } catch (error: any) {
    console.error('Error fixing all options:', error)
    return { error: error.message || 'Failed to fix options' }
  }
}

