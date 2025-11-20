import { notFound } from 'next/navigation'
import { getQuestionnaireResponses } from '@/app/actions/admin'
import { Language } from '@prisma/client'

export const dynamic = 'force-dynamic'

interface ResponsesPageProps {
  params: { id: string }
}

interface AnswerWithDetails {
  id: string
  questionId: string
  valueText: string | null
  valueOptionId: string | null
  question: {
    textEn: string
    textAr: string
  } | null
  option: {
    labelEn: string
    labelAr: string
  } | null
}

interface ResponseWithAnswers {
  id: string
  submittedAt: Date | string
  language: Language
  answers: AnswerWithDetails[]
}

export default async function ResponsesPage({ params }: ResponsesPageProps) {
  const result = await getQuestionnaireResponses(params.id)

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Survey Responses</h1>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 font-medium mb-2">Error loading responses</p>
              <p className="text-red-600 text-sm">{result.error || 'Unknown error occurred'}</p>
              <p className="text-gray-600 text-xs mt-2">
                Check the server logs for more details. The database connection might be failing.
              </p>
            </div>
            <a
              href="/admin/questionnaires"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Questionnaires
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!result.responses) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Survey Responses</h1>
            <p className="text-gray-500">No responses data returned from server</p>
            <a
              href="/admin/questionnaires"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Questionnaires
            </a>
          </div>
        </div>
      </div>
    )
  }

  const responses = (result.responses || []) as ResponseWithAnswers[]

  const getLanguageLabel = (lang: Language) => {
    return lang === 'AR' ? 'Arabic' : 'English'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Survey Responses</h1>
          <a
            href="/admin/questionnaires"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Questionnaires
          </a>
        </div>

        {responses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-2">No responses yet</p>
            <p className="text-gray-400 text-sm">
              Responses will appear here once users submit the survey.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Answers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response) => (
                  <tr key={response.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {response.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getLanguageLabel(response.language)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:text-blue-800">
                          View Answers ({response.answers?.length || 0})
                        </summary>
                        <div className="mt-2 pl-4 space-y-2">
                          {response.answers && response.answers.length > 0 ? (
                            response.answers.map((answer: AnswerWithDetails) => (
                              <div key={answer.id} className="border-l-2 border-gray-300 pl-3">
                                <p className="font-medium text-gray-700">
                                  {answer.question?.textEn || `Question ID: ${answer.questionId}`}
                                </p>
                                <p className="text-gray-600">
                                  {answer.valueText ||
                                    (answer.option
                                      ? answer.option.labelEn
                                      : answer.valueOptionId
                                      ? `Option ID: ${answer.valueOptionId}`
                                      : 'No answer')}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 italic">No answers found for this response</p>
                          )}
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

