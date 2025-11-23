'use client'

interface SurveyFooterProps {
  language: 'en' | 'ar'
}

export default function SurveyFooter({ language }: SurveyFooterProps) {
  const lang = language === 'ar' ? 'ar' : 'en'

  return (
    <footer className="mt-16 pt-8 border-t-2 border-gray-200">
      <div className="flex flex-col items-center gap-4 py-6">
        {/* Made by section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-gray-600">
          <span className="text-sm font-medium">
            {lang === 'ar' ? 'صُنع بواسطة' : 'Made with'}
            <span className="mx-2 text-red-500">❤️</span>
            {lang === 'ar' ? 'بواسطة' : 'by'}
          </span>
          <a
            href="https://www.njmh.com.sa/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-800">
                {lang === 'ar' ? 'نجمة التواصل' : 'Communication Star'}
              </span>
              <svg
                className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </a>
        </div>
        
        {/* Copyright */}
        <div className="text-xs text-gray-500 text-center">
          <span>{lang === 'ar' ? '© 2025 نجمة التواصل. جميع الحقوق محفوظة.' : '© 2025 Communication Star. All rights reserved.'}</span>
        </div>
      </div>
    </footer>
  )
}

