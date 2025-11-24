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
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({}) // For "Other (please specify)" text inputs
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const lang = language === 'ar' ? 'ar' : 'en'
  const t = (key: string) => getTranslation(lang, key)

  // Check if an option is "Other"
  const isOtherOption = (option: { value: string; labelEn: string; labelAr: string }) => {
    return option.value.toLowerCase() === 'other' || 
           option.value.toLowerCase().includes('other') ||
           option.labelEn.toLowerCase().includes('other') ||
           option.labelAr.includes('أخرى')
  }

  // Calculate completion percentage
  const totalQuestions = questionnaire.questions.length
  const answeredQuestions = Object.keys(answers).filter(key => {
    const answer = answers[key]
    if (!answer || answer.trim() === '') return false
    // Check if "Other" is selected and has text
    const question = questionnaire.questions.find((q: any) => q.id === key)
    if (question && question.type === QuestionType.MULTIPLE_CHOICE) {
      const selectedOption = question.options.find((opt: any) => opt.id === answer)
      if (selectedOption && isOtherOption(selectedOption)) {
        return otherTexts[key] && otherTexts[key].trim() !== ''
      }
    }
    return true
  }).length
  const completionPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    // Clear "Other" text if a different option is selected
    const question = questionnaire.questions.find((q: any) => q.id === questionId)
    if (question && question.type === QuestionType.MULTIPLE_CHOICE) {
      const selectedOption = question.options.find((opt: any) => opt.id === value)
      if (!selectedOption || !isOtherOption(selectedOption)) {
        setOtherTexts((prev) => {
          const newTexts = { ...prev }
          delete newTexts[questionId]
          return newTexts
        })
      }
    }
    // Clear error for this question
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleOtherTextChange = (questionId: string, value: string) => {
    setOtherTexts((prev) => ({ ...prev, [questionId]: value }))
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
    
    questionnaire.questions.forEach((question: any) => {
      if (question.isRequired && !answers[question.id]) {
        newErrors[question.id] = t('survey.required')
      }
      // Validate "Other" text input if "Other" option is selected
      if (question.type === QuestionType.MULTIPLE_CHOICE && answers[question.id]) {
        const selectedOption = question.options.find((opt: any) => opt.id === answers[question.id])
        if (selectedOption && isOtherOption(selectedOption)) {
          if (!otherTexts[question.id] || otherTexts[question.id].trim() === '') {
            newErrors[question.id] = lang === 'ar' 
              ? 'يرجى تحديد الإجابة' 
              : 'Please specify your answer'
          }
        }
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
      const answerData = questionnaire.questions.map((question: any) => {
        const answerValue = answers[question.id]
        
        if (question.type === QuestionType.TEXT) {
          return {
            questionId: question.id,
            valueText: answerValue || null,
            valueOptionId: null,
          }
        } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
          // Check if "Other" option is selected
          const selectedOption = question.options.find((opt: any) => opt.id === answerValue)
          if (selectedOption && isOtherOption(selectedOption) && otherTexts[question.id]) {
            // Store both the option ID and the "Other" text
            // We'll store the text in valueText and keep the option ID
            return {
              questionId: question.id,
              valueText: otherTexts[question.id] || null,
              valueOptionId: answerValue || null,
            }
          } else {
            // Regular option selection
            return {
              questionId: question.id,
              valueText: null,
              valueOptionId: answerValue || null,
            }
          }
        } else {
          // SCALE_1_5
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
  
  // Identify demographics section (typically the first section)
  const demographicsSection = sortedSections.find(section => 
    section.titleEn.toLowerCase().includes('demographic') || 
    section.titleAr.includes('ديموغرافي') ||
    section.order === 1
  ) || sortedSections[0] // Fallback to first section if no demographics found
  
  // Separate demographics from other sections
  const demographicsSectionId = demographicsSection?.id
  const otherSections = sortedSections.filter(section => section.id !== demographicsSectionId)
  
  // Find the first scale 1-5 question (with 5 options) across all questions
  const allQuestionsSorted = [...questionnaire.questions].sort((a, b) => a.order - b.order)
  const firstScaleQuestion = allQuestionsSorted.find((question: any) => {
    return question.type === QuestionType.SCALE_1_5 && 
           question.options && 
           question.options.length === 5
  })
  
  // Debug: Log grouped questions
  console.log('📊 Grouped Questions:', {
    sectionsWithQuestions: sortedSections.map(s => ({
      section: s.titleEn,
      questionCount: questionsBySection.get(s.id)?.length || 0
    })),
    questionsWithoutSection: questionsWithoutSection.length,
    demographicsSection: demographicsSection?.titleEn
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
                  <>
                    {question.options.map((option) => {
                      const isOther = isOtherOption(option)
                      const isSelected = answers[question.id] === option.id
                      const showOtherInput = isOther && isSelected
                      
                      return (
                        <div key={option.id} className="space-y-2">
                          <label
                            className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              isSelected
                                ? 'bg-blue-50 border-blue-400 shadow-sm'
                                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.id}
                              checked={isSelected}
                              onChange={(e) => handleChange(question.id, e.target.value)}
                              className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                            />
                            <span className="text-gray-800 font-medium flex-1">{getOptionLabel(option)}</span>
                          </label>
                          
                          {/* Show text input when "Other" is selected */}
                          {showOtherInput && (
                            <div className="ml-8 mt-2 animate-fadeIn">
                              <input
                                type="text"
                                value={otherTexts[question.id] || ''}
                                onChange={(e) => handleOtherTextChange(question.id, e.target.value)}
                                placeholder={lang === 'ar' ? 'يرجى تحديد إجابتك...' : 'Please specify your answer...'}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                  errors[question.id] ? 'border-red-400 bg-red-50' : 'border-blue-300 bg-white'
                                }`}
                                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                              />
                              {errors[question.id] && (
                                <p className="text-sm text-red-600 font-medium mt-1 ml-1">
                                  {errors[question.id]}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </>
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
      {/* Completion Progress Bar */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-md -mx-6 sm:-mx-8 lg:-mx-10 px-6 sm:px-8 lg:px-10 py-4 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                <span>{lang === 'ar' ? 'إتمام الاستبيان' : 'Survey Completion'}</span>
                <span className="text-blue-600 font-bold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="h-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium whitespace-nowrap">
              {answeredQuestions} / {totalQuestions} {lang === 'ar' ? 'أسئلة' : 'questions'}
            </div>
          </div>
        </div>
      </div>

      {/* Render demographics section first */}
      {demographicsSection && (() => {
        const sectionQuestions = questionsBySection.get(demographicsSection.id) || []
        if (sectionQuestions.length === 0) return null

        const sectionTitle = lang === 'ar' ? demographicsSection.titleAr : demographicsSection.titleEn
        const sectionInstructions = lang === 'ar' ? demographicsSection.instructionsAr : demographicsSection.instructionsEn

        return (
          <div key={demographicsSection.id} className="space-y-6">
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
                .sort((a: any, b: any) => a.order - b.order)
                .map((question: any, index: number) => {
                  // Show scale instructions before the first scale 1-5 question
                  const isFirstScaleQuestion = firstScaleQuestion && 
                                              question.id === firstScaleQuestion.id &&
                                              index === sectionQuestions.findIndex((q: any) => q.id === firstScaleQuestion.id)
                  
                  return (
                    <div key={question.id}>
                      {/* Scale Instructions before first scale question */}
                      {isFirstScaleQuestion && (
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6 shadow-md mb-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            {lang === 'ar' ? 'التعليمات' : 'Instructions'}
                          </h3>
                          <p className="text-gray-800 mb-3 leading-relaxed">
                            {lang === 'ar' 
                              ? 'يرجى الإشارة إلى مستوى موافقتك على العبارات التالية المتعلقة بفهمك لإطار الكفاءات.'
                              : 'Please indicate your level of agreement with the following statements about your understanding of the competency framework.'}
                          </p>
                          <div className="bg-white rounded-lg p-4 border border-indigo-300">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              {lang === 'ar' ? 'المقياس:' : 'Scale:'}
                            </p>
                            <div className="space-y-2 text-sm text-gray-800">
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">1 = {lang === 'ar' ? 'أختلف بشدة' : 'Strongly Disagree'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">2 = {lang === 'ar' ? 'أختلف' : 'Disagree'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">3 = {lang === 'ar' ? 'محايد' : 'Neutral'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">4 = {lang === 'ar' ? 'أتفق' : 'Agree'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">5 = {lang === 'ar' ? 'أتفق بشدة' : 'Strongly Agree'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {renderQuestion(question)}
                    </div>
                  )
                })}
            </div>
          </div>
        )
      })()}

      {/* Render remaining sections */}
      {otherSections.map((section) => {
        const sectionQuestions = questionsBySection.get(section.id) || []
        if (sectionQuestions.length === 0) return null

        const sectionTitle = lang === 'ar' ? section.titleAr : section.titleEn
        const sectionInstructions = lang === 'ar' ? section.instructionsAr : section.instructionsEn
        const sortedSectionQuestions = sectionQuestions.sort((a: any, b: any) => a.order - b.order)

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
              {sortedSectionQuestions.map((question: any, index: number) => {
                // Show scale instructions before the first scale 1-5 question
                const isFirstScaleQuestion = firstScaleQuestion && 
                                            question.id === firstScaleQuestion.id &&
                                            index === sortedSectionQuestions.findIndex((q: any) => q.id === firstScaleQuestion.id)
                
                return (
                  <div key={question.id}>
                    {/* Scale Instructions before first scale question */}
                    {isFirstScaleQuestion && (
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6 shadow-md mb-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          {lang === 'ar' ? 'التعليمات' : 'Instructions'}
                        </h3>
                        <p className="text-gray-800 mb-3 leading-relaxed">
                          {lang === 'ar' 
                            ? 'يرجى الإشارة إلى مستوى موافقتك على العبارات التالية المتعلقة بفهمك لإطار الكفاءات.'
                            : 'Please indicate your level of agreement with the following statements about your understanding of the competency framework.'}
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-indigo-300">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            {lang === 'ar' ? 'المقياس:' : 'Scale:'}
                          </p>
                          <div className="space-y-2 text-sm text-gray-800">
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">1 = {lang === 'ar' ? 'أختلف بشدة' : 'Strongly Disagree'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">2 = {lang === 'ar' ? 'أختلف' : 'Disagree'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">3 = {lang === 'ar' ? 'محايد' : 'Neutral'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">4 = {lang === 'ar' ? 'أتفق' : 'Agree'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 px-3 py-1 rounded font-medium min-w-[120px]">5 = {lang === 'ar' ? 'أتفق بشدة' : 'Strongly Agree'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {renderQuestion(question)}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Render questions without sections (for backward compatibility) */}
      {questionsWithoutSection.length > 0 && (
        <div className="space-y-5">
          {questionsWithoutSection
            .sort((a: any, b: any) => a.order - b.order)
            .map((question: any) => renderQuestion(question))}
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

