'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSection } from '@/app/actions/admin'

interface Section {
  id: string
  order: number
  titleEn: string
  titleAr: string
  instructionsEn?: string | null
  instructionsAr?: string | null
}

interface Question {
  id: string
  order: number
  textEn: string
  textAr: string
  sectionId?: string | null
}

interface AdminSectionManagerProps {
  sections: Section[]
  questions: Question[]
  questionnaireId: string
}

export default function AdminSectionManager({ sections, questions, questionnaireId }: AdminSectionManagerProps) {
  const router = useRouter()
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ titleEn: string; titleAr: string }>({ titleEn: '', titleAr: '' })

  const handleEditClick = (section: Section) => {
    setEditingSectionId(section.id)
    setEditData({ titleEn: section.titleEn, titleAr: section.titleAr })
  }

  const handleSave = async (sectionId: string) => {
    const result = await updateSection(sectionId, {
      titleEn: editData.titleEn,
      titleAr: editData.titleAr,
    })

    if (result.error) {
      alert(result.error)
      return
    }

    setEditingSectionId(null)
    router.refresh()
  }

  const handleCancel = () => {
    setEditingSectionId(null)
    setEditData({ titleEn: '', titleAr: '' })
  }

  // Group questions by section
  const questionsBySection = new Map<string, Question[]>()
  questions.forEach((question) => {
    if (question.sectionId) {
      if (!questionsBySection.has(question.sectionId)) {
        questionsBySection.set(question.sectionId, [])
      }
      questionsBySection.get(question.sectionId)!.push(question)
    }
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sections & Questions</h2>
      
      {sections.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No sections defined yet.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => {
            const sectionQuestions = questionsBySection.get(section.id) || []
            const isEditing = editingSectionId === section.id

            return (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  {isEditing ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editData.titleEn}
                        onChange={(e) => setEditData({ ...editData, titleEn: e.target.value })}
                        placeholder="Section Title (English)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editData.titleAr}
                        onChange={(e) => setEditData({ ...editData, titleAr: e.target.value })}
                        placeholder="Section Title (Arabic)"
                        dir="rtl"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(section.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Section {section.order}: {section.titleEn}
                        </h3>
                        <p className="text-gray-600 text-sm" dir="rtl">{section.titleAr}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {sectionQuestions.length} question(s) in this section
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditClick(section)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit Name
                      </button>
                    </>
                  )}
                </div>

                {sectionQuestions.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-blue-300">
                    <p className="text-sm font-medium text-gray-700 mb-2">Questions:</p>
                    <ul className="space-y-1">
                      {sectionQuestions
                        .sort((a, b) => a.order - b.order)
                        .map((question) => (
                          <li key={question.id} className="text-sm text-gray-600">
                            #{question.order}: {question.textEn}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Questions without sections */}
      {questions.filter((q) => !q.sectionId).length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions Without Section</h3>
          <ul className="space-y-1">
            {questions
              .filter((q) => !q.sectionId)
              .sort((a, b) => a.order - b.order)
              .map((question) => (
                <li key={question.id} className="text-sm text-gray-600">
                  #{question.order}: {question.textEn}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}


