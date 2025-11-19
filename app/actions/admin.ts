'use server'

import { prisma } from '@/lib/db'
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
  try {
    const questionnaires = await prisma.questionnaire.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, questionnaires }
  } catch (error: any) {
    console.error('Error fetching questionnaires:', error)
    return { error: error.message || 'Failed to fetch questionnaires' }
  }
}

export async function getQuestionnaire(id: string) {
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
    console.error('Error fetching questionnaire:', error)
    return { error: error.message || 'Failed to fetch questionnaire' }
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
    console.error('Error fetching responses:', error)
    return { error: error.message || 'Failed to fetch responses' }
  }
}

