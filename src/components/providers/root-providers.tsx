'use client'

import React from 'react'
import { AuthProvider } from '@/context/auth-context'
import { QuoteProvider } from '@/context/quote-context'
import { FavoritesProvider } from '@/context/favorites-context'
import { QuoteDrawer } from '@/components/layout/quote-drawer'
import { AuthModal } from '@/components/auth/auth-modal'

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <QuoteProvider>
          {children}
          <QuoteDrawer />
          <AuthModal />
        </QuoteProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}
