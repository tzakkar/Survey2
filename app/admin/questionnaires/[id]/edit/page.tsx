import { notFound } from 'next/navigation'
import { getQuestionnaire } from '@/app/actions/admin'
import QuestionnaireForm from '@/components/AdminQuestionnaireForm'
import QuestionList from '@/components/AdminQuestionList'

interface EditQuestionnairePageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Prevent static generation during build
export async function generateStaticParams() {
  return []
}

export default async function EditQuestionnairePage({ params }: EditQuestionnairePageProps) {
  const result = await getQuestionnaire(params.id)

  if (!result.success || !result.questionnaire) {
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

