'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteQuestion } from '@/app/actions/admin'
import { Question, QuestionType } from '@prisma/client'
import Link from 'next/link'

type QuestionWithOptions = Question & {
  options: Array<{
    id: string
    value: string
    labelEn: string
    labelAr: string
  }>
}

interface AdminQuestionListProps {
  questionnaireId: string
  questions: QuestionWithOptions[]
}

export default function AdminQuestionList({ questionnaireId, questions }: AdminQuestionListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return
    }

    setDeletingId(id)
    const result = await deleteQuestion(id)
    setDeletingId(null)

    if (result.error) {
      alert(result.error)
      return
    }

    router.refresh()
  }

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.TEXT:
        return 'Text'
      case QuestionType.MULTIPLE_CHOICE:
        return 'Multiple Choice'
      case QuestionType.SCALE_1_5:
        return 'Scale 1-5'
      default:
        return type
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
        <Link
          href={`/admin/questionnaires/${questionnaireId}/questions/new`}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add Question
        </Link>
      </div>

      {questions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No questions yet. Add your first question!</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{question.order}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {getQuestionTypeLabel(question.type)}
                    </span>
                    {question.isRequired && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium mb-1">{question.textEn}</p>
                  <p className="text-gray-600 text-sm" dir="rtl">{question.textAr}</p>
                  {question.options.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      {question.options.length} option(s)
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/admin/questions/${question.id}/edit`}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(question.id)}
                    disabled={deletingId === question.id}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === question.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

