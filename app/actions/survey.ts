'use server'

import { prisma } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { Language } from '@prisma/client'

export async function submitSurvey(
  questionnaireId: string,
  language: Language,
  answers: Array<{
    questionId: string
    valueText?: string | null
    valueOptionId?: string | null
  }>
) {
  // Try Prisma first
  try {
    // Validate questionnaire exists and is active
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      include: {
        questions: {
          where: { isRequired: true },
        },
      },
    })

    if (!questionnaire) {
      return { error: 'Questionnaire not found' }
    }

    if (!questionnaire.isActive) {
      return { error: 'Questionnaire is not active' }
    }

    // Validate required questions
    const requiredQuestionIds = questionnaire.questions.map((q) => q.id)
    const answeredQuestionIds = answers.map((a) => a.questionId)
    const missingRequired = requiredQuestionIds.filter(
      (id) => !answeredQuestionIds.includes(id)
    )

    if (missingRequired.length > 0) {
      return { error: 'Missing required questions' }
    }

    // Create response - Each submission creates a NEW response (supports multiple people)
    const response = await prisma.response.create({
      data: {
        questionnaireId,
        language,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            valueText: answer.valueText,
            valueOptionId: answer.valueOptionId,
          })),
        },
      },
    })

    return { success: true, responseId: response.id }
  } catch (error: any) {
    // If Prisma fails, try Supabase API
    console.log('Prisma submission failed, trying Supabase API...', error.message)
    
    try {
      // Validate questionnaire via API
      const { data: questionnaire, error: qError } = await supabase
        .from('Questionnaire')
        .select('*')
        .eq('id', questionnaireId)
        .eq('isActive', true)
        .single()

      if (qError || !questionnaire) {
        return { error: 'Questionnaire not found or not active' }
      }

      // Get required questions
      const { data: requiredQuestions } = await supabase
        .from('Question')
        .select('id')
        .eq('questionnaireId', questionnaireId)
        .eq('isRequired', true)

      // Validate required questions
      const requiredQuestionIds = (requiredQuestions || []).map((q: any) => q.id)
      const answeredQuestionIds = answers.map((a) => a.questionId)
      const missingRequired = requiredQuestionIds.filter(
        (id) => !answeredQuestionIds.includes(id)
      )

      if (missingRequired.length > 0) {
        return { error: 'Missing required questions' }
      }

      // Generate response ID
      const responseId = 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)

      // Create response via API
      const { data: response, error: responseError } = await supabase
        .from('Response')
        .insert({
          id: responseId,
          questionnaireId,
          language,
          submittedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (responseError) {
        console.error('Error creating response:', responseError)
        return { error: 'Failed to create response' }
      }

      // Create answers via API
      const answersToInsert = answers.map((answer) => ({
        id: 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
        responseId: response.id,
        questionId: answer.questionId,
        valueText: answer.valueText || null,
        valueOptionId: answer.valueOptionId || null
      }))

      const { error: answersError } = await supabase
        .from('Answer')
        .insert(answersToInsert)

      if (answersError) {
        console.error('Error creating answers:', answersError)
        // Response was created but answers failed - this is a problem
        // Try to clean up the response
        await supabase.from('Response').delete().eq('id', response.id)
        return { error: 'Failed to save answers' }
      }

      return { success: true, responseId: response.id }
    } catch (apiError: any) {
      console.error('Error submitting survey via API:', apiError)
      return { error: 'Failed to submit survey' }
    }
  }
}

export async function getQuestionnaireBySlug(slug: string) {
  // Skip database queries during build time - always return safely
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                      (process.env.NODE_ENV === 'production' && typeof process.env.VERCEL === 'undefined')
  
  if (isBuildTime) {
    return null
  }

  // Try Prisma first
  try {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
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

    if (questionnaire) {
      return questionnaire
    }
  } catch (error: any) {
    console.log('Prisma connection failed, trying Supabase API...')
  }

  // Fallback to Supabase REST API
  try {
    // Get questionnaire
    const { data: questionnaire, error: qError } = await supabase
      .from('Questionnaire')
      .select('*')
      .eq('slug', slug)
      .eq('isActive', true)
      .single()

    if (qError || !questionnaire) {
      console.error('Questionnaire not found via API:', qError?.message)
      console.error('API Error details:', {
        message: qError?.message,
        details: qError?.details,
        hint: qError?.hint,
        code: qError?.code
      })
      return null
    }

    // Get sections
    const { data: sections, error: sectionsError } = await supabase
      .from('Section')
      .select('*')
      .eq('questionnaireId', questionnaire.id)
      .order('order', { ascending: true })

    if (sectionsError) {
      console.error('Error fetching sections:', sectionsError.message)
      console.error('Sections error details:', {
        message: sectionsError.message,
        details: sectionsError.details,
        hint: sectionsError.hint,
        code: sectionsError.code
      })
    } else {
      console.log(`✅ Fetched ${sections?.length || 0} sections for questionnaire`)
    }

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from('Question')
      .select('*')
      .eq('questionnaireId', questionnaire.id)
      .order('order', { ascending: true })

    if (questionsError) {
      console.error('Error fetching questions:', questionsError.message)
    }

    // Get options for each question
    const questionsWithOptions = await Promise.all(
      (questions || []).map(async (question) => {
        const { data: options, error: optionsError } = await supabase
          .from('Option')
          .select('*')
          .eq('questionId', question.id)
          .order('order', { ascending: true })

        if (optionsError) {
          console.error(`Error fetching options for question ${question.id} (order ${question.order}):`, optionsError)
        }

        // Debug logging for questions that should have options
        if ((question.type === 'SCALE_1_5' || question.type === 'MULTIPLE_CHOICE') && (!options || options.length === 0)) {
          console.warn(`⚠️ Question "${question.textEn}" (ID: ${question.id}, Order: ${question.order}, Type: ${question.type}) has no options!`)
        }

        return {
          ...question,
          options: options || []
        }
      })
    )

    // Transform to match Prisma format
    const result = {
      ...questionnaire,
      sections: sections || [],
      questions: questionsWithOptions
    }
    
    // Debug: Log section and question counts
    console.log('📊 Questionnaire data:', {
      sectionsCount: result.sections?.length || 0,
      questionsCount: result.questions?.length || 0,
      questionsWithSections: result.questions?.filter((q: any) => q.sectionId).length || 0
    })
    
    return result
  } catch (error: any) {
    console.error('Error fetching questionnaire via API:', error)
    console.error('Error details:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    })
    return null
  }
}

