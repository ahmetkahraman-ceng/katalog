import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'ÇANTA | Kaliteli Çanta Koleksiyonu',
  description: 'El çantası, sırt çantası, laptop çantası ve evrak çantası koleksiyonumuzu keşfedin. Teklif almak için bizimle iletişime geçin.',
}

import { RootProviders } from '@/components/providers/root-providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
