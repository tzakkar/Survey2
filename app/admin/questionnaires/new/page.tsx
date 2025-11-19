import QuestionnaireForm from '@/components/AdminQuestionnaireForm'

export default function NewQuestionnairePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Questionnaire</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <QuestionnaireForm />
        </div>
      </div>
    </div>
  )
}

