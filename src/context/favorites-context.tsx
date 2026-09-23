'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { FavoritePromptModal } from '@/components/favorites/favorite-prompt-modal'

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (productId: string, isAuthenticated?: boolean) => void
  isFavorite: (productId: string) => boolean
  openFavoritePrompt: () => void
  closeFavoritePrompt: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_KEY = 'bag_catalog_favorites'

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    } catch {}
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      } catch {}
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (productId: string, isAuthenticated = true) => {
    if (!isAuthenticated) {
      setIsPromptModalOpen(true)
      return
    }

    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const isFavorite = (productId: string) => favorites.includes(productId)

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        openFavoritePrompt: () => setIsPromptModalOpen(true),
        closeFavoritePrompt: () => setIsPromptModalOpen(false),
      }}
    >
      {children}
      <FavoritePromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
