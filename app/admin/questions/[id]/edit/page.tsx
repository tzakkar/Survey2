import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import QuestionForm from '@/components/AdminQuestionForm'

interface EditQuestionPageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: {
      options: {
        orderBy: { order: 'asc' },
      },
      questionnaire: true,
    },
  })

  if (!question) {
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
          <QuestionForm question={question} />
        </div>
      </div>
    </div>
  )
}

