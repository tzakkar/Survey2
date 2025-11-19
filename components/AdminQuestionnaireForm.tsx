'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createQuestionnaire, updateQuestionnaire } from '@/app/actions/admin'
import { AudienceType, Questionnaire } from '@prisma/client'

interface AdminQuestionnaireFormProps {
  questionnaire?: Questionnaire
}

export default function AdminQuestionnaireForm({ questionnaire }: AdminQuestionnaireFormProps) {
  const router = useRouter()
  const isEditing = !!questionnaire
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    slug: questionnaire?.slug || '',
    titleEn: questionnaire?.titleEn || '',
    titleAr: questionnaire?.titleAr || '',
    descriptionEn: questionnaire?.descriptionEn || '',
    descriptionAr: questionnaire?.descriptionAr || '',
    audienceType: questionnaire?.audienceType || AudienceType.STAFF,
    isActive: questionnaire?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (isEditing) {
        const result = await updateQuestionnaire(questionnaire.id, formData)
        if (result.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }
      } else {
        const result = await createQuestionnaire(formData)
        if (result.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }
        router.push(`/admin/questionnaires/${result.questionnaire?.id}/edit`)
        return
      }

      router.refresh()
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
          Slug (URL-friendly identifier)
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          disabled={isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title (English)
          </label>
          <input
            type="text"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title (Arabic)
          </label>
          <input
            type="text"
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            required
            dir="rtl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (English)
          </label>
          <textarea
            value={formData.descriptionEn}
            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Arabic)
          </label>
          <textarea
            value={formData.descriptionAr}
            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
            rows={3}
            dir="rtl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Audience Type
        </label>
        <select
          value={formData.audienceType}
          onChange={(e) => setFormData({ ...formData, audienceType: e.target.value as AudienceType })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={AudienceType.STAFF}>Staff</option>
          <option value={AudienceType.MANAGER}>Manager & Above</option>
          <option value={AudienceType.HR}>HR</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
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
  )
}

