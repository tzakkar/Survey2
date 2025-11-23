import { notFound } from 'next/navigation'
import { getQuestionnaireBySlug } from '@/app/actions/survey'
import SurveyForm from '@/components/SurveyForm'
import LanguageSwitch from '@/components/LanguageSwitch'
import { getDir } from '@/lib/helpers/i18n'

interface SurveyPageProps {
  params: { slug: string }
  searchParams: { lang?: string }
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Prevent static generation during build
export async function generateStaticParams() {
  return []
}

export default async function SurveyPage({ params, searchParams }: SurveyPageProps) {
  const lang = (searchParams.lang || 'en') === 'ar' ? 'ar' : 'en'
  const dir = getDir(lang)

  // Handle build-time execution gracefully
  if (!params?.slug || typeof params.slug !== 'string') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dir}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {lang === 'ar' ? 'الاستبيان غير متاح' : 'Questionnaire Not Available'}
          </h1>
          <p className="text-gray-600 mb-4">Loading...</p>
        </div>
      </div>
    )
  }

  let questionnaire
  try {
    questionnaire = await getQuestionnaireBySlug(params.slug)
    // Debug: Log sections on server side
    if (questionnaire) {
      console.log('📊 Server: Questionnaire loaded:', {
        id: questionnaire.id,
        slug: questionnaire.slug,
        sectionsCount: questionnaire.sections?.length || 0,
        questionsCount: questionnaire.questions?.length || 0,
        sections: questionnaire.sections?.map((s: any) => ({ order: s.order, title: s.titleEn })) || []
      })
    }
  } catch (error) {
    console.error('Error loading questionnaire:', error)
    questionnaire = null
  }

  if (!questionnaire || !questionnaire.isActive) {
    // Show a helpful error message instead of just 404
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dir}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {lang === 'ar' ? 'الاستبيان غير متاح' : 'Questionnaire Not Available'}
          </h1>
          <p className="text-gray-600 mb-4">
            {lang === 'ar' 
              ? 'لا يمكن الوصول إلى الاستبيان. يرجى التحقق من اتصال قاعدة البيانات أو الاتصال بالمسؤول.'
              : 'Unable to access the questionnaire. Please check database connection or contact administrator.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
          </a>
        </div>
      </div>
    )
  }

  const title = lang === 'ar' ? questionnaire.titleAr : questionnaire.titleEn
  const description = lang === 'ar' ? questionnaire.descriptionAr : questionnaire.descriptionEn

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <LanguageSwitch currentLang={lang} />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100 relative">
          <SurveyForm questionnaire={questionnaire} language={lang} />
        </div>
      </div>
    </div>
  )
}

