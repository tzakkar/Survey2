'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Language } from '@/lib/helpers/i18n'

interface LanguageSwitchProps {
  currentLang: Language
}

export default function LanguageSwitch({ currentLang }: LanguageSwitchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en'
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', newLang)
    router.push(`?${params.toString()}`)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
      aria-label="Switch language"
    >
      <span className="text-lg">{currentLang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
      <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
    </button>
  )
}

