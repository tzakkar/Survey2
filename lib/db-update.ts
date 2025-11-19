// Database Update Utilities
// These functions can update the database via Supabase API when connection is available

import { supabase } from './supabase'

export interface UpdateQuestionOptionsParams {
  questionId: string
  options: Array<{
    order: number
    value: string
    labelEn: string
    labelAr: string
  }>
}

/**
 * Update options for a question
 * Deletes existing options and creates new ones
 */
export async function updateQuestionOptions({ questionId, options }: UpdateQuestionOptionsParams) {
  try {
    // First, delete existing options
    const { error: deleteError } = await supabase
      .from('Option')
      .delete()
      .eq('questionId', questionId)

    if (deleteError) {
      console.error('Error deleting existing options:', deleteError)
      // Continue anyway - might not exist
    }

    // Generate IDs for new options
    const optionsToInsert = options.map((opt, index) => ({
      id: `c${Date.now()}${Math.random().toString(36).substr(2, 9)}${index}`,
      questionId,
      order: opt.order,
      value: opt.value,
      labelEn: opt.labelEn,
      labelAr: opt.labelAr,
    }))

    // Insert new options
    const { data, error } = await supabase
      .from('Option')
      .insert(optionsToInsert)
      .select()

    if (error) {
      console.error('Error inserting options:', error)
      throw error
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('updateQuestionOptions failed:', error)
    throw error
  }
}

/**
 * Create scale options (1-5) for a question
 */
export async function createScaleOptionsForQuestion(questionId: string) {
  return updateQuestionOptions({
    questionId,
    options: [
      { order: 1, value: '1', labelEn: '1 - Strongly Disagree', labelAr: '١ - أختلف بشدة' },
      { order: 2, value: '2', labelEn: '2 - Disagree', labelAr: '٢ - أختلف' },
      { order: 3, value: '3', labelEn: '3 - Neutral', labelAr: '٣ - محايد' },
      { order: 4, value: '4', labelEn: '4 - Agree', labelAr: '٤ - أتفق' },
      { order: 5, value: '5', labelEn: '5 - Strongly Agree', labelAr: '٥ - أتفق بشدة' },
    ],
  })
}

/**
 * Fix missing options for all SCALE_1_5 questions
 */
export async function fixAllMissingScaleOptions() {
  try {
    // Get all SCALE_1_5 questions
    const { data: questions, error: qError } = await supabase
      .from('Question')
      .select('id, order, textEn, type')
      .eq('type', 'SCALE_1_5')

    if (qError) {
      throw qError
    }

    if (!questions || questions.length === 0) {
      return { success: true, fixed: 0, message: 'No SCALE_1_5 questions found' }
    }

    let fixed = 0
    const errors: string[] = []

    for (const question of questions) {
      // Check if question has options
      const { data: options } = await supabase
        .from('Option')
        .select('id')
        .eq('questionId', question.id)
        .limit(1)

      if (!options || options.length === 0) {
        try {
          await createScaleOptionsForQuestion(question.id)
          fixed++
          console.log(`✅ Fixed options for question ${question.order}: "${question.textEn.substring(0, 50)}..."`)
        } catch (error: any) {
          errors.push(`Question ${question.order}: ${error.message}`)
        }
      }
    }

    return {
      success: errors.length === 0,
      fixed,
      total: questions.length,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error: any) {
    console.error('fixAllMissingScaleOptions failed:', error)
    throw error
  }
}

