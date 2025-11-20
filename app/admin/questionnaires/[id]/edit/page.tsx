import { notFound } from 'next/navigation'
import { getQuestionnaire } from '@/app/actions/admin'
import QuestionnaireForm from '@/components/AdminQuestionnaireForm'
import QuestionList from '@/components/AdminQuestionList'

interface EditQuestionnairePageProps {
  params: { id: string }
}

// Force dynamic rendering - never pre-render this page
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

// Prevent static generation during build
export async function generateStaticParams() {
  // Return empty array - no pages will be pre-generated
  // This prevents Next.js from trying to collect page data during build
  return []
}

export default async function EditQuestionnairePage({ params }: EditQuestionnairePageProps) {
  // Validate params - this will handle build-time execution gracefully
  if (!params || typeof params.id !== 'string' || !params.id) {
    // During build or invalid params, return minimal page
    // This prevents build errors
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

  // Fetch data - wrapped in try-catch to handle any errors gracefully
  let result
  try {
    result = await getQuestionnaire(params.id)
    
    // Check if result is valid
    if (!result || !result.success || !result.questionnaire) {
      // During build or if result indicates build-time skip, return loading page
      if (result?.error?.includes('Build time') || !process.env.VERCEL) {
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
      notFound()
    }
  } catch (error: any) {
    // Handle any errors during data fetching
    // During build, NEVER throw - always return a valid component
    console.error('Error in EditQuestionnairePage:', error?.message || String(error))
    
    // Always return a valid component, never throw during build
    // Check if error is build-related
    const errorMessage = error?.message || String(error) || ''
    if (errorMessage.includes('Build time') || 
        errorMessage.includes('Can\'t reach database') ||
        !process.env.VERCEL) {
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
    
    // Only call notFound() at runtime, not during build
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

