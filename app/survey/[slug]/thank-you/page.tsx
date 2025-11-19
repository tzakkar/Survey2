import Link from 'next/link'
import { getDir, getTranslation } from '@/lib/helpers/i18n'

interface ThankYouPageProps {
  params: { slug: string }
  searchParams: { lang?: string }
}

export default function ThankYouPage({ params, searchParams }: ThankYouPageProps) {
  const lang = (searchParams.lang || 'en') === 'ar' ? 'ar' : 'en'
  const dir = getDir(lang)
  const t = (key: string) => getTranslation(lang, key)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dir}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('survey.thankYou')}
          </h1>
          <p className="text-gray-600">{t('survey.thankYouMessage')}</p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('survey.backToSurvey')}
        </Link>
      </div>
    </div>
  )
}

