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
  // Handle build-time execution gracefully - during build, params might be undefined
  if (!params?.id || typeof params.id !== 'string') {
    // Return a minimal page during build to prevent build errors
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Questionnaire</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600">Please provide a valid questionnaire ID</p>
          </div>
        </div>
      </div>
    )
  }

  let result
  try {
    result = await getQuestionnaire(params.id)
  } catch (error: any) {
    // Handle build-time and runtime errors gracefully
    // During build, database might not be accessible
    console.error('Error loading questionnaire:', error?.message || error)
    
    // During build, return a minimal page instead of throwing
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Questionnaire</h1>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-600">Questionnaire will be loaded at runtime</p>
            </div>
          </div>
        </div>
      )
    }
    
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

