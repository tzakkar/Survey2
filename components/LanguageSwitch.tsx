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
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      aria-label="Switch language"
    >
      {currentLang === 'en' ? 'العربية' : 'English'}
    </button>
  )
}

