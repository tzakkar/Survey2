'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useRef } from 'react'

interface AdminQRCodeGeneratorProps {
  questionnaireSlug: string
  questionnaireTitle: string
}

export default function AdminQRCodeGenerator({ questionnaireSlug, questionnaireTitle }: AdminQRCodeGeneratorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en')
  
  // Get the base URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const surveyUrl = `${baseUrl}/survey/${questionnaireSlug}?lang=${selectedLanguage}`

  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-${questionnaireSlug}-${selectedLanguage}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">QR Code Generator</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedLanguage === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage('ar')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedLanguage === 'ar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              العربية
            </button>
          </div>

          <div ref={qrRef} className="bg-white p-4 rounded-lg border-2 border-gray-300">
            <QRCodeSVG
              value={surveyUrl}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">{questionnaireTitle}</p>
            <p className="text-xs text-gray-500 break-all max-w-xs">{surveyUrl}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Download QR Code
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(surveyUrl)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

