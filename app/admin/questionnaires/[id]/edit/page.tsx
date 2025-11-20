import { notFound } from 'next/navigation'
import { getQuestionnaire } from '@/app/actions/admin'
import QuestionnaireForm from '@/components/AdminQuestionnaireForm'
import QuestionList from '@/components/AdminQuestionList'

interface EditQuestionnairePageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const runtime = 'nodejs'

// Prevent static generation during build - return empty array
export async function generateStaticParams() {
  // Return empty array to prevent Next.js from trying to pre-generate pages
  // All pages will be generated on-demand at request time
  return []
}

export default async function EditQuestionnairePage({ params }: EditQuestionnairePageProps) {
  // Handle build-time execution gracefully
  if (!params?.id) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Questionnaire</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  let result
  try {
    result = await getQuestionnaire(params.id)
  } catch (error) {
    // Handle build-time errors gracefully
    console.error('Error loading questionnaire:', error)
    notFound()
  }

  if (!result || !result.success || !result.questionnaire) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Questionnaire</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <QuestionnaireForm questionnaire={result.questionnaire} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <QuestionList questionnaireId={params.id} questions={result.questionnaire.questions} />
        </div>
      </div>
    </div>
  )
}

