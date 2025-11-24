import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Survey System
        </h1>
        <div className="space-y-4">
          <Link
            href="/survey/staff-questionnaire?lang=en"
            className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Staff Questionnaire
          </Link>
          <Link
            href="/survey/manager-questionnaire?lang=en"
            className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Manager Questionnaire
          </Link>
          <Link
            href="/survey/hr-questionnaire?lang=en"
            className="block w-full text-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            HR Questionnaire
          </Link>
        </div>
      </div>
    </div>
  )
}

