'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitSurvey } from '@/app/actions/survey'
import { getTranslation, Language as LangType } from '@/lib/helpers/i18n'
import { Questionnaire, Question, QuestionType, Language } from '@prisma/client'

type Section = {
  id: string
  order: number
  titleEn: string
  titleAr: string
  instructionsEn?: string | null
  instructionsAr?: string | null
}

type QuestionnaireWithQuestions = Questionnaire & {
  sections?: Section[]
  questions: (Question & {
    sectionId?: string | null
    options: Array<{
      id: string
      value: string
      labelEn: string
      labelAr: string
    }>
  })[]
}

interface SurveyFormProps {
  questionnaire: QuestionnaireWithQuestions
  language: LangType
}

export default function SurveyForm({ questionnaire, language }: SurveyFormProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const lang = language === 'ar' ? 'ar' : 'en'
  const t = (key: string) => getTranslation(lang, key)

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    // Clear error for this question
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    questionnaire.questions.forEach((question) => {
      if (question.isRequired && !answers[question.id]) {
        newErrors[question.id] = t('survey.required')
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const answerData = questionnaire.questions.map((question) => {
        const answerValue = answers[question.id]
        
        if (question.type === QuestionType.TEXT) {
          return {
            questionId: question.id,
            valueText: answerValue || null,
            valueOptionId: null,
          }
        } else {
          // MULTIPLE_CHOICE or SCALE_1_5
          return {
            questionId: question.id,
            valueText: null,
            valueOptionId: answerValue || null,
          }
        }
      })

      const result = await submitSurvey(
        questionnaire.id,
        language === 'ar' ? Language.AR : Language.EN,
        answerData
      )

      if (result.error) {
        alert(result.error)
        setIsSubmitting(false)
        return
      }

      router.push(`/survey/${questionnaire.slug}/thank-you?lang=${lang}`)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit survey. Please try again.')
      setIsSubmitting(false)
    }
  }

  const getQuestionText = (question: Question) => {
    return lang === 'ar' ? question.textAr : question.textEn
  }

  const getOptionLabel = (option: { labelEn: string; labelAr: string }) => {
    return lang === 'ar' ? option.labelAr : option.labelEn
  }

  // Group questions by sections
  const sections = questionnaire.sections || []
  const questionsBySection = new Map<string, typeof questionnaire.questions>()
  const questionsWithoutSection: typeof questionnaire.questions = []

  // Debug: Log sections and questions
  console.log('📊 SurveyForm Debug:', {
    sectionsCount: sections.length,
    sections: sections.map(s => ({ id: s.id, order: s.order, title: s.titleEn })),
    questionsCount: questionnaire.questions.length,
    questionsWithSectionId: questionnaire.questions.filter(q => q.sectionId).length
  })

  questionnaire.questions.forEach((question) => {
    if (question.sectionId) {
      if (!questionsBySection.has(question.sectionId)) {
        questionsBySection.set(question.sectionId, [])
      }
      questionsBySection.get(question.sectionId)!.push(question)
    } else {
      questionsWithoutSection.push(question)
    }
  })

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order)
  
  // Debug: Log grouped questions
  console.log('📊 Grouped Questions:', {
    sectionsWithQuestions: sortedSections.map(s => ({
      section: s.titleEn,
      questionCount: questionsBySection.get(s.id)?.length || 0
    })),
    questionsWithoutSection: questionsWithoutSection.length
  })

  const renderQuestion = (question: typeof questionnaire.questions[0]) => {
    // Debug: Log questions with missing options
    if ((question.type === QuestionType.SCALE_1_5 || question.type === QuestionType.MULTIPLE_CHOICE) && (!question.options || question.options.length === 0)) {
      console.warn(`⚠️ Question "${question.textEn}" (Order: ${question.order}, Type: ${question.type}) has no options in component`)
    }
    
    return (
      <div key={question.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-blue-300 transition-all duration-200">
        <label className="block text-base font-semibold text-gray-800 mb-3 leading-relaxed">
          {getQuestionText(question)}
          {question.isRequired && (
            <span className="text-red-500 mr-1" aria-label="required">*</span>
          )}
        </label>

            {question.type === QuestionType.TEXT && (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleChange(question.id, e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors[question.id] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                rows={5}
                placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            )}

            {question.type === QuestionType.MULTIPLE_CHOICE && (
              <div className="space-y-2">
                {question.options && question.options.length > 0 ? (
                  question.options.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                        answers[question.id] === option.id
                          ? 'bg-blue-50 border-blue-400 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={answers[question.id] === option.id}
                        onChange={(e) => handleChange(question.id, e.target.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                      />
                      <span className="text-gray-800 font-medium flex-1">{getOptionLabel(option)}</span>
                    </label>
                  ))
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800 font-medium">
                      {lang === 'ar' ? '⚠️ تحذير: لا توجد خيارات متاحة لهذا السؤال' : '⚠️ Warning: No options available for this question'}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {lang === 'ar' 
                        ? 'يرجى التحقق من قاعدة البيانات أو الاتصال بالمسؤول.' 
                        : 'Please check the database or contact administrator.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {question.type === QuestionType.SCALE_1_5 && (
              <div className="space-y-3">
                {question.options && question.options.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {question.options.map((option) => (
                      <label
                        key={option.id}
                        className={`px-4 py-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center ${
                          answers[question.id] === option.id
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg transform scale-105'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={answers[question.id] === option.id}
                          onChange={(e) => handleChange(question.id, e.target.value)}
                          className="sr-only"
                        />
                        <span className="font-semibold text-sm block">{getOptionLabel(option)}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800 font-medium">
                      {lang === 'ar' ? '⚠️ تحذير: لا توجد خيارات متاحة لهذا السؤال' : '⚠️ Warning: No options available for this question'}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {lang === 'ar' 
                        ? 'يرجى التحقق من قاعدة البيانات أو الاتصال بالمسؤول.' 
                        : 'Please check the database or contact administrator.'}
                    </p>
                  </div>
                )}
              </div>
            )}

        {errors[question.id] && (
          <p className="text-sm text-red-600 font-medium mt-2 flex items-center gap-1">
            <span>⚠️</span>
            <span>{errors[question.id]}</span>
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Render questions grouped by sections */}
      {sortedSections.map((section) => {
        const sectionQuestions = questionsBySection.get(section.id) || []
        if (sectionQuestions.length === 0) return null

        const sectionTitle = lang === 'ar' ? section.titleAr : section.titleEn
        const sectionInstructions = lang === 'ar' ? section.instructionsAr : section.instructionsEn

        return (
          <div key={section.id} className="space-y-6">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-2">{sectionTitle}</h2>
              {sectionInstructions && (
                <p className="text-blue-50 text-sm leading-relaxed mt-3 bg-blue-800/30 rounded-lg p-3 border border-blue-500/30">
                  {sectionInstructions}
                </p>
              )}
            </div>

            {/* Section Questions */}
            <div className="space-y-5">
              {sectionQuestions
                .sort((a, b) => a.order - b.order)
                .map((question) => renderQuestion(question))}
            </div>
          </div>
        )
      })}

      {/* Render questions without sections (for backward compatibility) */}
      {questionsWithoutSection.length > 0 && (
        <div className="space-y-5">
          {questionsWithoutSection
            .sort((a, b) => a.order - b.order)
            .map((question) => renderQuestion(question))}
        </div>
      )}

      <div className="flex justify-end pt-6 border-t-2 border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none min-w-[150px]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
            </span>
          ) : (
            t('survey.submit')
          )}
        </button>
      </div>
    </form>
  )
}

