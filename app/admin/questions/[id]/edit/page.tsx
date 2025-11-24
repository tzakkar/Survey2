import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import QuestionForm from '@/components/AdminQuestionForm'

interface EditQuestionPageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Prevent static generation during build
export async function generateStaticParams() {
  return []
}

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  // Handle build-time execution gracefully
  if (!params?.id || typeof params.id !== 'string') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Question</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  let question
  let sections
  try {
    question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
        questionnaire: {
          include: {
            sections: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (question) {
      sections = question.questionnaire.sections || []
    }

    if (!question) {
      // During build, return loading page instead of 404
      if (!process.env.VERCEL) {
        return (
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Question</h1>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        )
      }
      notFound()
    }
  } catch (error: any) {
    // Handle errors during build
    console.error('Error loading question:', error?.message || String(error))
    
    // During build, always return a valid component
    if (!process.env.VERCEL || error?.message?.includes('Can\'t reach database')) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Question</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      )
    }
    
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <a
            href={`/admin/questionnaires/${question.questionnaireId}/edit`}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Questionnaire
          </a>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Question</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <QuestionForm question={question} sections={sections || []} />
        </div>
      </div>
    </div>
  )
}

