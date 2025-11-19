import { notFound } from 'next/navigation'
import { getQuestionnaireResponses } from '@/app/actions/admin'
import { Language } from '@prisma/client'

interface ResponsesPageProps {
  params: { id: string }
}

export default async function ResponsesPage({ params }: ResponsesPageProps) {
  const result = await getQuestionnaireResponses(params.id)

  if (!result.success || !result.responses) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500">Error loading responses</p>
        </div>
      </div>
    )
  }

  const responses = result.responses

  const getLanguageLabel = (lang: Language) => {
    return lang === 'AR' ? 'Arabic' : 'English'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Survey Responses</h1>

        {responses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No responses yet</p>
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
                          View Answers ({response.answers.length})
                        </summary>
                        <div className="mt-2 pl-4 space-y-2">
                          {response.answers.map((answer) => (
                            <div key={answer.id} className="border-l-2 border-gray-300 pl-3">
                              <p className="font-medium text-gray-700">
                                {answer.question.textEn}
                              </p>
                              <p className="text-gray-600">
                                {answer.valueText ||
                                  (answer.option
                                    ? answer.option.labelEn
                                    : 'No answer')}
                              </p>
                            </div>
                          ))}
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

