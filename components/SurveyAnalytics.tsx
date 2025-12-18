'use client'

import { useState, useRef } from 'react'
// QuestionType enum values
type QuestionTypeValue = 'TEXT' | 'MULTIPLE_CHOICE' | 'SCALE_1_5'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import html2canvas from 'html2canvas'
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
  type: QuestionTypeValue | string
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
  const [isExportingWithCharts, setIsExportingWithCharts] = useState(false)

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

    if (question.type === 'MULTIPLE_CHOICE') {
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
    } else if (question.type === 'SCALE_1_5') {
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

      // Sheet 5: Raw Data - One column per responder
      // Sort questions by order to maintain consistency
      const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)

      // Build header row: Question column + one column per response
      const rawDataHeaders: any[] = ['Question']
      responses.forEach((response, idx) => {
        rawDataHeaders.push(`Response ${idx + 1} (${response.id.slice(0, 8)})`)
      })

      const rawData: any[] = [rawDataHeaders]

      // For each question, create a row with question text and answers from each responder
      sortedQuestions.forEach((question) => {
        const questionText = language === 'ar' ? question.textAr : question.textEn
        const row: any[] = [questionText]

        // Get answer for this question from each response
        responses.forEach((response) => {
          const answer = response.answers.find((a) => a.questionId === question.id)

          if (!answer) {
            row.push('')
          } else {
            let answerText = 'No answer'
            if (answer.valueText) {
              if (answer.valueOptionId && answer.option) {
                const optionLabel = language === 'ar' ? answer.option.labelAr : answer.option.labelEn
                answerText = `${optionLabel}: ${answer.valueText}`
              } else {
                answerText = answer.valueText
              }
            } else if (answer.option) {
              answerText = language === 'ar' ? answer.option.labelAr : answer.option.labelEn
            } else if (answer.valueOptionId) {
              answerText = `Option ID: ${answer.valueOptionId}`
            }
            row.push(answerText)
          }
        })

        rawData.push(row)
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

  // Export to Excel with Charts function - captures charts as images
  const exportToExcelWithCharts = async () => {
    setIsExportingWithCharts(true)

    try {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'Survey Analytics'
      workbook.created = new Date()

      // Helper function to capture chart as image
      const captureChartAsImage = async (selector: string): Promise<string | null> => {
        const element = document.querySelector(selector)
        if (!element) return null

        try {
          const canvas = await html2canvas(element as HTMLElement, {
            backgroundColor: '#ffffff',
            scale: 2
          })
          return canvas.toDataURL('image/png').split(',')[1] // Get base64 without prefix
        } catch (err) {
          console.error('Error capturing chart:', err)
          return null
        }
      }

      // Sheet 1: Overall Statistics
      const statsSheet = workbook.addWorksheet('Overall Statistics')
      statsSheet.columns = [
        { header: 'Metric', key: 'metric', width: 30 },
        { header: 'Value', key: 'value', width: 20 }
      ]

      statsSheet.addRows([
        { metric: 'Total Responses', value: totalResponses },
        { metric: 'Total Questions', value: totalQuestions },
        {
          metric: 'Average Response Rate',
          value: questionStats.length > 0
            ? `${(questionStats.reduce((sum, stat) => sum + parseFloat(stat.responseRate), 0) / questionStats.length).toFixed(1)}%`
            : '0%'
        }
      ])

      // Style the header row
      statsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      statsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3B82F6' }
      }

      // Sheet 2: Response Timeline with Chart
      if (responseTimeline.length > 0) {
        const timelineSheet = workbook.addWorksheet('Response Timeline')
        timelineSheet.columns = [
          { header: 'Date', key: 'date', width: 20 },
          { header: 'Response Count', key: 'count', width: 20 }
        ]

        responseTimeline.forEach(item => {
          timelineSheet.addRow({ date: item.date, count: item.count })
        })

        // Style header
        timelineSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
        timelineSheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF3B82F6' }
        }

        // Capture timeline chart
        const timelineChartImage = await captureChartAsImage('.recharts-wrapper')
        if (timelineChartImage) {
          const imageId = workbook.addImage({
            base64: timelineChartImage,
            extension: 'png',
          })

          timelineSheet.addImage(imageId, {
            tl: { col: 0, row: responseTimeline.length + 2 },
            ext: { width: 600, height: 300 }
          })
        }
      }

      // Sheet 3: Language Distribution
      if (languageData.length > 0) {
        const langSheet = workbook.addWorksheet('Language Distribution')
        langSheet.columns = [
          { header: 'Language', key: 'language', width: 20 },
          { header: 'Count', key: 'count', width: 15 },
          { header: 'Percentage', key: 'percentage', width: 15 }
        ]

        languageData.forEach(item => {
          langSheet.addRow({
            language: item.name,
            count: item.value,
            percentage: `${((item.value / totalResponses) * 100).toFixed(1)}%`
          })
        })

        // Style header
        langSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
        langSheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF3B82F6' }
        }
      }

      // Sheet 4-N: Question Analysis
      for (let i = 0; i < questionStats.length; i++) {
        const stat = questionStats[i]
        const questionText = language === 'ar' ? stat.question.textAr : stat.question.textEn
        // Use index to ensure unique sheet names even if question orders are duplicated
        const sheetName = `Q${stat.question.order}-${i + 1} Analysis`.substring(0, 31)

        const qSheet = workbook.addWorksheet(sheetName)

        // Add question header
        qSheet.mergeCells('A1:C1')
        qSheet.getCell('A1').value = `Question ${stat.question.order}: ${questionText}`
        qSheet.getCell('A1').font = { bold: true, size: 14 }
        qSheet.getCell('A1').alignment = { wrapText: true, vertical: 'middle' }
        qSheet.getRow(1).height = 30

        // Add metadata
        qSheet.addRow([])
        qSheet.addRow(['Type:', stat.type])
        qSheet.addRow(['Response Rate:', `${stat.responseRate}%`])
        qSheet.addRow(['Total Answers:', stat.totalAnswers])
        qSheet.addRow([])

        if (stat.type === 'multiple_choice' && stat.optionData) {
          // Add data table
          qSheet.addRow(['Option', 'Count', 'Percentage'])
          qSheet.getRow(qSheet.lastRow!.number).font = { bold: true, color: { argb: 'FFFFFFFF' } }
          qSheet.getRow(qSheet.lastRow!.number).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF10B981' }
          }

          stat.optionData.forEach((option: any) => {
            qSheet.addRow([
              option.name,
              option.value,
              totalResponses > 0 ? `${((option.value / totalResponses) * 100).toFixed(1)}%` : '0%'
            ])
          })

          // Set column widths
          qSheet.getColumn(1).width = 30
          qSheet.getColumn(2).width = 15
          qSheet.getColumn(3).width = 15

        } else if (stat.type === 'scale' && stat.scaleData) {
          // Add statistics
          qSheet.addRow(['Mean:', stat.mean])
          qSheet.addRow(['Median:', stat.median])
          qSheet.addRow([])

          // Add data table
          qSheet.addRow(['Scale Value', 'Count', 'Percentage'])
          qSheet.getRow(qSheet.lastRow!.number).font = { bold: true, color: { argb: 'FFFFFFFF' } }
          qSheet.getRow(qSheet.lastRow!.number).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF10B981' }
          }

          stat.scaleData.forEach((scale: any) => {
            qSheet.addRow([
              scale.name,
              scale.value,
              totalResponses > 0 ? `${((scale.value / totalResponses) * 100).toFixed(1)}%` : '0%'
            ])
          })

          // Set column widths
          qSheet.getColumn(1).width = 20
          qSheet.getColumn(2).width = 15
          qSheet.getColumn(3).width = 15

        } else if (stat.type === 'text' && stat.topWords && stat.topWords.length > 0) {
          // Add top words table
          qSheet.addRow(['Top Words', 'Frequency'])
          qSheet.getRow(qSheet.lastRow!.number).font = { bold: true, color: { argb: 'FFFFFFFF' } }
          qSheet.getRow(qSheet.lastRow!.number).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF59E0B' }
          }

          stat.topWords.forEach((word: any) => {
            qSheet.addRow([word.name, word.value])
          })

          // Set column widths
          qSheet.getColumn(1).width = 25
          qSheet.getColumn(2).width = 15

          // Add sample answers
          if (stat.textAnswers && stat.textAnswers.length > 0) {
            qSheet.addRow([])
            qSheet.addRow([])
            qSheet.addRow(['Sample Answers'])
            qSheet.getRow(qSheet.lastRow!.number).font = { bold: true }

            stat.textAnswers.slice(0, 10).forEach((answer: string, idx: number) => {
              qSheet.addRow([`Answer ${idx + 1}`, answer])
              qSheet.getRow(qSheet.lastRow!.number).getCell(2).alignment = { wrapText: true }
            })

            qSheet.getColumn(2).width = 60
          }
        }
      }

      // Sheet: Raw Data
      const rawDataSheet = workbook.addWorksheet('Raw Data')
      const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)

      // Build headers
      const headers = ['Question']
      responses.forEach((response, idx) => {
        headers.push(`Response ${idx + 1} (${response.id.slice(0, 8)})`)
      })

      rawDataSheet.addRow(headers)
      rawDataSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      rawDataSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3B82F6' }
      }

      // Add data rows
      sortedQuestions.forEach((question) => {
        const questionText = language === 'ar' ? question.textAr : question.textEn
        const row: any[] = [questionText]

        responses.forEach((response) => {
          const answer = response.answers.find((a) => a.questionId === question.id)

          if (!answer) {
            row.push('')
          } else {
            let answerText = 'No answer'
            if (answer.valueText) {
              if (answer.valueOptionId && answer.option) {
                const optionLabel = language === 'ar' ? answer.option.labelAr : answer.option.labelEn
                answerText = `${optionLabel}: ${answer.valueText}`
              } else {
                answerText = answer.valueText
              }
            } else if (answer.option) {
              answerText = language === 'ar' ? answer.option.labelAr : answer.option.labelEn
            } else if (answer.valueOptionId) {
              answerText = `Option ID: ${answer.valueOptionId}`
            }
            row.push(answerText)
          }
        })

        rawDataSheet.addRow(row)
      })

      // Set column widths
      rawDataSheet.getColumn(1).width = 40
      for (let i = 2; i <= responses.length + 1; i++) {
        rawDataSheet.getColumn(i).width = 25
      }

      // Generate and download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `survey-analytics-with-charts-${timestamp}.xlsx`
      link.click()

      window.URL.revokeObjectURL(url)
      setIsExportingWithCharts(false)
    } catch (error) {
      console.error('Error exporting to Excel with charts:', error)
      setIsExportingWithCharts(false)
      alert(language === 'ar' ? 'حدث خطأ أثناء التصدير مع الرسوم البيانية' : 'Error exporting to Excel with charts')
    }
  }

  return (
    <div className="space-y-8">
      {/* Export Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={exportToExcel}
          disabled={isExporting || isExportingWithCharts}
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

        <button
          onClick={exportToExcelWithCharts}
          disabled={isExporting || isExportingWithCharts}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center gap-2"
        >
          {isExportingWithCharts ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {language === 'ar' ? 'جاري التصدير مع الرسوم...' : 'Exporting with Charts...'}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {language === 'ar' ? 'تصدير إلى Excel مع الرسوم البيانية' : 'Export to Excel with Charts'}
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

