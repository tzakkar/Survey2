import Link from 'next/link'
import { getAllQuestionnaires } from '@/app/actions/admin'
import { AudienceType } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function QuestionnairesPage() {
  let result
  try {
    result = await getAllQuestionnaires()
  } catch (error: any) {
    console.error('Error loading questionnaires:', error?.message || String(error))
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Connection Error</h2>
              <p className="text-gray-600 mb-4">Unable to connect to the database.</p>
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded mb-4">
                Error: {error?.message || 'Unknown error'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!result.success || !result.questionnaires) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Connection Error</h2>
              <p className="text-gray-600 mb-4">
                Unable to connect to the database. Please check:
              </p>
              <ul className="text-left max-w-md mx-auto text-gray-600 mb-6 space-y-2">
                <li>• Database server is running</li>
                <li>• Network connectivity</li>
                <li>• Environment variables in .env file</li>
                <li>• Database credentials are correct</li>
              </ul>
              {result.error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded mb-4">
                  Error: {result.error}
                </p>
              )}
              <Link
                href="/"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const questionnaires = result.questionnaires

  const getAudienceLabel = (type: AudienceType) => {
    switch (type) {
      case AudienceType.STAFF:
        return 'Staff'
      case AudienceType.MANAGER:
        return 'Manager & Above'
      case AudienceType.HR:
        return 'HR'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Questionnaires</h1>
          <Link
            href="/admin/questionnaires/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New
          </Link>
        </div>

        {questionnaires.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No questionnaires found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title (EN)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audience Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questionnaires.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {q.titleEn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getAudienceLabel(q.audienceType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          q.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {q.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/questionnaires/${q.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/questionnaires/${q.id}/responses`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Responses
                        </Link>
                      </div>
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

