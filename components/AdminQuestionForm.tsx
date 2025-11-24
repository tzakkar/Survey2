'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateQuestion, createOption, updateOption, deleteOption } from '@/app/actions/admin'
import { Question, QuestionType } from '@prisma/client'

type QuestionWithOptions = Question & {
  options: Array<{
    id: string
    order: number
    value: string
    labelEn: string
    labelAr: string
  }>
  questionnaire: {
    id: string
  }
}

interface Section {
  id: string
  order: number
  titleEn: string
  titleAr: string
}

interface AdminQuestionFormProps {
  question: QuestionWithOptions
  sections?: Section[]
}

export default function AdminQuestionForm({ question, sections = [] }: AdminQuestionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    order: question.order,
    type: question.type,
    textEn: question.textEn,
    textAr: question.textAr,
    isRequired: question.isRequired,
    sectionId: (question.sectionId || '') as string | null,
  })

  const [newOption, setNewOption] = useState({
    value: '',
    labelEn: '',
    labelAr: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await updateQuestion(question.id, {
        ...formData,
        sectionId: formData.sectionId || null,
      })
      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      router.refresh()
    } catch (err) {
      setError('An error occurred')
      setIsSubmitting(false)
    }
  }

  const handleAddOption = async () => {
    if (!newOption.value || !newOption.labelEn || !newOption.labelAr) {
      alert('Please fill all option fields')
      return
    }

    const nextOrder = question.options.length + 1
    const result = await createOption({
      questionId: question.id,
      order: nextOrder,
      ...newOption,
    })

    if (result.error) {
      alert(result.error)
      return
    }

    setNewOption({ value: '', labelEn: '', labelAr: '' })
    router.refresh()
  }

  const handleDeleteOption = async (optionId: string) => {
    if (!confirm('Are you sure you want to delete this option?')) {
      return
    }

    const result = await deleteOption(optionId)
    if (result.error) {
      alert(result.error)
      return
    }

    router.refresh()
  }

  const needsOptions = formData.type === QuestionType.MULTIPLE_CHOICE || formData.type === QuestionType.SCALE_1_5

  return (
    <div>
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
            onChange={(e) => setFormData({ ...formData, sectionId: (e.target.value || null) as string | null })}
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>

      {needsOptions && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>

          {question.options.length > 0 && (
            <div className="space-y-2 mb-4">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      #{option.order}
                    </span>
                    <span className="text-sm text-gray-900">{option.labelEn}</span>
                    <span className="text-sm text-gray-600 ml-2" dir="rtl">
                      ({option.labelAr})
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteOption(option.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Option</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Value (internal identifier)
                </label>
                <input
                  type="text"
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., option1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Label (English)
                  </label>
                  <input
                    type="text"
                    value={newOption.labelEn}
                    onChange={(e) => setNewOption({ ...newOption, labelEn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Label (Arabic)
                  </label>
                  <input
                    type="text"
                    value={newOption.labelAr}
                    onChange={(e) => setNewOption({ ...newOption, labelAr: e.target.value })}
                    dir="rtl"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddOption}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

