'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { reorderQuestions } from '@/app/actions/admin'

interface Question {
  id: string
  order: number
  textEn: string
  textAr: string
  type: string
}

interface AdminQuestionReorderProps {
  questions: Question[]
  questionnaireId: string
}

function SortableQuestionItem({ question }: { question: Question }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-move"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-500">#{question.order}</span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{question.type}</span>
          </div>
          <p className="text-gray-900 font-medium">{question.textEn}</p>
          <p className="text-gray-600 text-sm" dir="rtl">{question.textAr}</p>
        </div>
      </div>
    </div>
  )
}

export default function AdminQuestionReorder({ questions, questionnaireId }: AdminQuestionReorderProps) {
  const router = useRouter()
  const [items, setItems] = useState(questions)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSaveOrder = async () => {
    setIsSaving(true)
    const questionIds = items.map((item) => item.id)
    const result = await reorderQuestions(questionIds)

    if (result.error) {
      alert(result.error)
      setIsSaving(false)
      return
    }

    setIsSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Reorder Questions</h2>
        <button
          onClick={handleSaveOrder}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Order'}
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Drag and drop questions to reorder them. Click &quot;Save Order&quot; when done.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((question) => (
              <SortableQuestionItem key={question.id} question={question} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

