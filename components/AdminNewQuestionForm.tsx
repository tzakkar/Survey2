'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createQuestion } from '@/app/actions/admin'
import { QuestionType } from '@prisma/client'

interface Section {
  id: string
  order: number
  titleEn: string
  titleAr: string
}

interface AdminNewQuestionFormProps {
  questionnaireId: string
  nextOrder: number
  sections?: Section[]
}

export default function AdminNewQuestionForm({ questionnaireId, nextOrder, sections = [] }: AdminNewQuestionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    order: nextOrder,
    type: QuestionType.TEXT as QuestionType,
    textEn: '',
    textAr: '',
    isRequired: false,
    sectionId: '' as string | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await createQuestion({
        questionnaireId,
        ...formData,
        sectionId: formData.sectionId || null,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      router.push(`/admin/questionnaires/${questionnaireId}/edit`)
    } catch (err) {
      setError('An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Order
        </label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          required
          min={1}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={QuestionType.TEXT}>Text</option>
          <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
          <option value={QuestionType.SCALE_1_5}>Scale 1-5</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text (English)
          </label>
          <textarea
            value={formData.textEn}
            onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text (Arabic)
          </label>
          <textarea
            value={formData.textAr}
            onChange={(e) => setFormData({ ...formData, textAr: e.target.value })}
            required
            rows={3}
            dir="rtl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section
        </label>
        <select
          value={formData.sectionId || ''}
          onChange={(e) => setFormData({ ...formData, sectionId: e.target.value || null as string | null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No Section (Unassigned)</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              Section {section.order}: {section.titleEn}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Select a section to group this question with others, or leave unassigned.
        </p>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isRequired}
            onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Required</span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Question'}
        </button>
      </div>

      {formData.type !== QuestionType.TEXT && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            After creating this question, you&apos;ll be able to add options for it.
          </p>
        </div>
      )}
    </form>
  )
}

