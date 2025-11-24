import { notFound } from 'next/navigation'
import { getQuestionnaire } from '@/app/actions/admin'
import NewQuestionForm from '@/components/AdminNewQuestionForm'

interface NewQuestionPageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Prevent static generation during build
export async function generateStaticParams() {
  return []
}

export default async function NewQuestionPage({ params }: NewQuestionPageProps) {
  // Handle build-time execution gracefully
  if (!params?.id || typeof params.id !== 'string') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Question</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  let result
  try {
    result = await getQuestionnaire(params.id)
  } catch (error: any) {
    console.error('Error loading questionnaire:', error?.message || String(error))
    notFound()
  }

  if (!result || !result.success || !result.questionnaire) {
    notFound()
  }

  const nextOrder = result.questionnaire.questions.length + 1
  const sections = (result.questionnaire as any).sections || []

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <a
            href={`/admin/questionnaires/${params.id}/edit`}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Questionnaire
          </a>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Question</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <NewQuestionForm questionnaireId={params.id} nextOrder={nextOrder} sections={sections} />
        </div>
      </div>
    </div>
  )
}

