export type Language = 'en' | 'ar'

export const translations = {
  en: {
    survey: {
      submit: 'Submit',
      required: 'Required',
      thankYou: 'Thank you!',
      thankYouMessage: 'Your response has been submitted successfully.',
      backToSurvey: 'Back to Survey',
    },
    admin: {
      questionnaires: 'Questionnaires',
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      title: 'Title',
      description: 'Description',
      audienceType: 'Audience Type',
      isActive: 'Active',
      createdAt: 'Created At',
      actions: 'Actions',
      viewResponses: 'View Responses',
      questions: 'Questions',
      addQuestion: 'Add Question',
      editQuestion: 'Edit Question',
      questionText: 'Question Text',
      questionType: 'Question Type',
      required: 'Required',
      order: 'Order',
      options: 'Options',
      addOption: 'Add Option',
      responses: 'Responses',
      responseId: 'Response ID',
      submittedAt: 'Submitted At',
      language: 'Language',
      noResponses: 'No responses yet',
      noQuestionnaires: 'No questionnaires found',
    },
  },
  ar: {
    survey: {
      submit: 'إرسال',
      required: 'مطلوب',
      thankYou: 'شكراً لك!',
      thankYouMessage: 'تم إرسال ردك بنجاح.',
      backToSurvey: 'العودة إلى الاستبيان',
    },
    admin: {
      questionnaires: 'الاستبيانات',
      create: 'إنشاء',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      title: 'العنوان',
      description: 'الوصف',
      audienceType: 'نوع الجمهور',
      isActive: 'نشط',
      createdAt: 'تاريخ الإنشاء',
      actions: 'الإجراءات',
      viewResponses: 'عرض الردود',
      questions: 'الأسئلة',
      addQuestion: 'إضافة سؤال',
      editQuestion: 'تعديل سؤال',
      questionText: 'نص السؤال',
      questionType: 'نوع السؤال',
      required: 'مطلوب',
      order: 'الترتيب',
      options: 'الخيارات',
      addOption: 'إضافة خيار',
      responses: 'الردود',
      responseId: 'معرف الرد',
      submittedAt: 'تاريخ الإرسال',
      language: 'اللغة',
      noResponses: 'لا توجد ردود بعد',
      noQuestionnaires: 'لم يتم العثور على استبيانات',
    },
  },
} as const

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English if translation missing
      value = translations.en
      for (const k2 of keys) {
        value = value?.[k2]
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}

export function getDir(lang: Language): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr'
}

