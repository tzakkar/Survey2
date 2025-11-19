import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Survey System',
  description: 'A comprehensive survey system with multilingual support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

