'use client'

import { useState } from 'react'
// QuestionType enum values
type QuestionTypeValue = 'TEXT' | 'MULTIPLE_CHOICE' | 'SCALE_1_5'
import * as XLSX from 'xlsx'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

interface AnswerWithDetails {
  id: string
  questionId: string
  valueText: string | null
  valueOptionId: string | null
  question: {
    id: string
    textEn: string
    textAr: string
    type: QuestionTypeValue | string
    order: number
  } | null
  option: {
    id: string
    labelEn: string
    labelAr: string
    value: string
  } | null
}

interface QuestionWithOptions {
  id: string
  textEn: string
  textAr: string
  type: QuestionType | string
  order: number
  options?: Array<{
    id: string
    labelEn: string
    labelAr: string
    value: string
  }>
}

interface ResponseWithAnswers {
  id: string
  submittedAt: Date | string
  language: string
  answers: AnswerWithDetails[]
}

interface SurveyAnalyticsProps {
  responses: ResponseWithAnswers[]
  questions: QuestionWithOptions[]
  language?: 'en' | 'ar'
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function SurveyAnalytics({ responses, questions, language = 'en' }: SurveyAnalyticsProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Calculate overall statistics
  const totalResponses = responses.length
  const totalQuestions = questions.length
  
  // Group responses by date
  const responsesByDate = responses.reduce((acc: Record<string, number>, response) => {
    const date = new Date(response.submittedAt).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const responseTimeline = Object.entries(responsesByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Language distribution
  const languageDistribution = responses.reduce((acc: Record<string, number>, response) => {
    const lang = response.language === 'AR' ? 'Arabic' : 'English'
    acc[lang] = (acc[lang] || 0) + 1
    return acc
  }, {})

  const languageData = Object.entries(languageDistribution).map(([name, value]) => ({
    name,
    value,
  }))

  // Calculate statistics for each question
  const questionStats = questions.map((question) => {
    const questionAnswers = responses
      .flatMap((r) => r.answers)
      .filter((a) => a.questionId === question.id)

    const totalAnswers = questionAnswers.length
    const responseRate = totalResponses > 0 ? ((totalAnswers / totalResponses) * 100).toFixed(1) : '0'

    if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === 'MULTIPLE_CHOICE') {
      // Count option selections
      const optionCounts: Record<string, number> = {}
      let otherCount = 0

      questionAnswers.forEach((answer) => {
        if (answer.valueOptionId && answer.option) {
          const optionId = answer.option.id
          optionCounts[optionId] = (optionCounts[optionId] || 0) + 1
        } else if (answer.valueText && answer.valueOptionId) {
          // "Other" option with text
          otherCount++
        }
      })

      // Get option labels
      const optionData = question.options
        ? question.options.map((opt) => ({
            name: language === 'ar' ? opt.labelAr : opt.labelEn,
            value: optionCounts[opt.id] || 0,
            id: opt.id,
          }))
        : []

      // Add "Other" count if exists
      if (otherCount > 0) {
        optionData.push({
          name: language === 'ar' ? 'أخرى' : 'Other',
          value: otherCount,
          id: 'other',
        })
      }

      return {
        question,
        type: 'multiple_choice',
        totalAnswers,
        responseRate,
        optionData,
      }
    } else if (question.type === QuestionType.SCALE_1_5 || question.type === 'SCALE_1_5') {
      // Calculate scale statistics
      const scaleValues: number[] = []
      const scaleCounts: Record<string, number> = {}

      questionAnswers.forEach((answer) => {
        if (answer.valueOptionId && answer.option) {
          const value = parseInt(answer.option.value) || 0
          if (value >= 1 && value <= 5) {
            scaleValues.push(value)
            scaleCounts[value.toString()] = (scaleCounts[value.toString()] || 0) + 1
          }
        }
      })

      const mean = scaleValues.length > 0
        ? (scaleValues.reduce((a, b) => a + b, 0) / scaleValues.length).toFixed(2)
        : '0'
      const median =
        scaleValues.length > 0
          ? scaleValues.sort((a, b) => a - b)[Math.floor(scaleValues.length / 2)]
          : 0

      const scaleData = [1, 2, 3, 4, 5].map((val) => ({
        name: val.toString(),
        value: scaleCounts[val.toString()] || 0,
      }))

      return {
        question,
        type: 'scale',
        totalAnswers,
        responseRate,
        mean,
        median,
        scaleData,
      }
    } else {
      // TEXT questions
      const textAnswers = questionAnswers
        .filter((a) => a.valueText && !a.valueOptionId) // Only pure text answers, not "Other" specs
        .map((a) => a.valueText || '')
        .filter((text) => text.trim().length > 0)

      // Simple word frequency analysis (top 10 words)
      const wordFrequency: Record<string, number> = {}
      textAnswers.forEach((text) => {
        const words = text
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter((w) => w.length > 3) // Only words longer than 3 characters

        words.forEach((word) => {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1
        })
      })

      const topWords = Object.entries(wordFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([word, count]) => ({ name: word, value: count }))

      return {
        question,
        type: 'text',
        totalAnswers,
        responseRate,
        textAnswers,
        topWords,
      }
    }
  })

  // Export to Excel function
  const exportToExcel = () => {
    setIsExporting(true)
    
    try {
      const workbook = XLSX.utils.book_new()
      
      // Sheet 1: Overall Statistics
      const overallStats = [
        ['Metric', 'Value'],
        ['Total Responses', totalResponses],
        ['Total Questions', totalQuestions],
        ['Average Response Rate', questionStats.length > 0
          ? `${(questionStats.reduce((sum, stat) => sum + parseFloat(stat.responseRate), 0) / questionStats.length).toFixed(1)}%`
          : '0%'],
      ]
      const ws1 = XLSX.utils.aoa_to_sheet(overallStats)
      XLSX.utils.book_append_sheet(workbook, ws1, 'Overall Statistics')
      
      // Sheet 2: Response Timeline
      if (responseTimeline.length > 0) {
        const timelineData = [
          ['Date', 'Response Count'],
          ...responseTimeline.map(item => [item.date, item.count])
        ]
        const ws2 = XLSX.utils.aoa_to_sheet(timelineData)
        XLSX.utils.book_append_sheet(workbook, ws2, 'Response Timeline')
      }
      
      // Sheet 3: Language Distribution
      if (languageData.length > 0) {
        const langData = [
          ['Language', 'Count', 'Percentage'],
          ...languageData.map(item => [
            item.name,
            item.value,
            `${((item.value / totalResponses) * 100).toFixed(1)}%`
          ])
        ]
        const ws3 = XLSX.utils.aoa_to_sheet(langData)
        XLSX.utils.book_append_sheet(workbook, ws3, 'Language Distribution')
      }
      
      // Sheet 4: Question Analysis
      const questionAnalysis: any[] = []
      
      questionStats.forEach((stat) => {
        const questionText = language === 'ar' ? stat.question.textAr : stat.question.textEn
        
        questionAnalysis.push([`Question ${stat.question.order}: ${questionText}`])
        questionAnalysis.push(['Type', stat.type])
        questionAnalysis.push(['Response Rate', `${stat.responseRate}%`])
        questionAnalysis.push(['Total Answers', stat.totalAnswers])
        
        if (stat.type === 'multiple_choice' && stat.optionData) {
          questionAnalysis.push([])
          questionAnalysis.push(['Option', 'Count', 'Percentage'])
          stat.optionData.forEach((option: any) => {
            questionAnalysis.push([
              option.name,
              option.value,
              totalResponses > 0 ? `${((option.value / totalResponses) * 100).toFixed(1)}%` : '0%'
            ])
          })
        } else if (stat.type === 'scale' && stat.scaleData) {
          questionAnalysis.push([])
          questionAnalysis.push(['Scale Value', 'Count', 'Percentage'])
          stat.scaleData.forEach((scale: any) => {
            questionAnalysis.push([
              scale.name,
              scale.value,
              totalResponses > 0 ? `${((scale.value / totalResponses) * 100).toFixed(1)}%` : '0%'
            ])
          })
          questionAnalysis.push([])
          questionAnalysis.push(['Mean', stat.mean])
          questionAnalysis.push(['Median', stat.median])
        } else if (stat.type === 'text' && stat.textAnswers && stat.textAnswers.length > 0) {
          questionAnalysis.push([])
          questionAnalysis.push(['Top Words', 'Frequency'])
          if (stat.topWords) {
            stat.topWords.forEach((word: any) => {
              questionAnalysis.push([word.name, word.value])
            })
          }
          questionAnalysis.push([])
          questionAnalysis.push(['Sample Answers'])
          stat.textAnswers.slice(0, 10).forEach((answer: string, idx: number) => {
            questionAnalysis.push([`Answer ${idx + 1}`, answer])
          })
        }
        
        questionAnalysis.push([])
        questionAnalysis.push([])
      })
      
      const ws4 = XLSX.utils.aoa_to_sheet(questionAnalysis)
      XLSX.utils.book_append_sheet(workbook, ws4, 'Question Analysis')
      
      // Sheet 5: Raw Data
      const rawData: any[] = [
        ['Response ID', 'Submitted At', 'Language', 'Question', 'Answer']
      ]
      
      responses.forEach((response) => {
        response.answers.forEach((answer) => {
          const questionText = answer.question
            ? (language === 'ar' ? answer.question.textAr : answer.question.textEn)
            : `Question ID: ${answer.questionId}`
          
          let answerText = 'No answer'
          if (answer.valueText) {
            if (answer.valueOptionId && answer.option) {
              answerText = `${answer.option.labelEn}: ${answer.valueText}`
            } else {
              answerText = answer.valueText
            }
          } else if (answer.option) {
            answerText = answer.option.labelEn
          } else if (answer.valueOptionId) {
            answerText = `Option ID: ${answer.valueOptionId}`
          }
          
          rawData.push([
            response.id.slice(0, 8),
            new Date(response.submittedAt).toLocaleString(),
            response.language === 'AR' ? 'Arabic' : 'English',
            questionText,
            answerText
          ])
        })
      })
      
      const ws5 = XLSX.utils.aoa_to_sheet(rawData)
      XLSX.utils.book_append_sheet(workbook, ws5, 'Raw Data')
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `survey-analytics-${timestamp}.xlsx`
      
      // Write and download
      XLSX.writeFile(workbook, filename)
      
      setIsExporting(false)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      setIsExporting(false)
      alert(language === 'ar' ? 'حدث خطأ أثناء التصدير' : 'Error exporting to Excel')
    }
  }

  return (
    <div className="space-y-8">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportToExcel}
          disabled={isExporting}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {language === 'ar' ? 'جاري التصدير...' : 'Exporting...'}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {language === 'ar' ? 'تصدير إلى Excel' : 'Export to Excel'}
            </>
          )}
        </button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {language === 'ar' ? 'إجمالي الردود' : 'Total Responses'}
          </h3>
          <p className="text-3xl font-bold text-gray-900">{totalResponses}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {language === 'ar' ? 'إجمالي الأسئلة' : 'Total Questions'}
          </h3>
          <p className="text-3xl font-bold text-gray-900">{totalQuestions}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {language === 'ar' ? 'متوسط معدل الاستجابة' : 'Avg. Response Rate'}
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {questionStats.length > 0
              ? (
                  questionStats.reduce((sum, stat) => sum + parseFloat(stat.responseRate), 0) /
                  questionStats.length
                ).toFixed(1)
              : '0'}
            %
          </p>
        </div>
      </div>

      {/* Response Timeline */}
      {responseTimeline.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'الردود حسب التاريخ' : 'Responses Over Time'}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name={language === 'ar' ? 'عدد الردود' : 'Responses'} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Language Distribution */}
      {languageData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'توزيع اللغات' : 'Language Distribution'}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Question-by-Question Analytics */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'تحليل الأسئلة' : 'Question Analysis'}
        </h2>

        {questionStats.map((stat) => {
          const questionText = language === 'ar' ? stat.question.textAr : stat.question.textEn

          if (stat.type === 'multiple_choice' && stat.optionData && stat.optionData.length > 0) {
            return (
              <div key={stat.question.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Q{stat.question.order}: {questionText}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'معدل الاستجابة' : 'Response Rate'}: {stat.responseRate}% (
                    {stat.totalAnswers} / {totalResponses})
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stat.optionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stat.optionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stat.optionData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          } else if (stat.type === 'scale' && stat.scaleData) {
            return (
              <div key={stat.question.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Q{stat.question.order}: {questionText}
                  </h3>
                  <div className="flex gap-6 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">{language === 'ar' ? 'معدل الاستجابة' : 'Response Rate'}:</span>{' '}
                      {stat.responseRate}% ({stat.totalAnswers} / {totalResponses})
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">{language === 'ar' ? 'المتوسط' : 'Mean'}:</span> {stat.mean}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">{language === 'ar' ? 'الوسيط' : 'Median'}:</span> {stat.median}
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stat.scaleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          } else if (stat.type === 'text') {
            return (
              <div key={stat.question.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Q{stat.question.order}: {questionText}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'معدل الاستجابة' : 'Response Rate'}: {stat.responseRate}% (
                    {stat.totalAnswers} / {totalResponses})
                  </p>
                </div>
                {stat.topWords && stat.topWords.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'أكثر الكلمات تكراراً' : 'Most Frequent Words'}
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={stat.topWords} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {stat.textAnswers && stat.textAnswers.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'عينة من الإجابات' : 'Sample Answers'} ({stat.textAnswers.length}{' '}
                      {language === 'ar' ? 'إجابة' : 'answers'})
                    </h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {stat.textAnswers.slice(0, 5).map((answer, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                          <p className="text-sm text-gray-700">{answer}</p>
                        </div>
                      ))}
                      {stat.textAnswers.length > 5 && (
                        <p className="text-sm text-gray-500 italic">
                          {language === 'ar'
                            ? `و ${stat.textAnswers.length - 5} إجابة أخرى...`
                            : `and ${stat.textAnswers.length - 5} more answers...`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

