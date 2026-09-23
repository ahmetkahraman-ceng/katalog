'use client'

import React from 'react'
import { QuoteProvider } from '@/context/quote-context'
import { FavoritesProvider } from '@/context/favorites-context'
import { QuoteDrawer } from '@/components/layout/quote-drawer'

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <QuoteProvider>
        {children}
        <QuoteDrawer />
      </QuoteProvider>
    </FavoritesProvider>
  )
}
