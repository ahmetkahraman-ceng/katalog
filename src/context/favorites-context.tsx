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

  // 1. Initial load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    } catch {}
    setIsLoaded(true)

    // Also attempt to sync from server if logged in
    async function syncFromServer() {
      try {
        const res = await fetch('/api/favorites')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data.favorites) && data.favorites.length > 0) {
            setFavorites((prev) => Array.from(new Set([...prev, ...data.favorites])))
          }
        }
      } catch {}
    }
    syncFromServer()
  }, [])

  // 2. Persist to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      } catch {}
    }
  }, [favorites, isLoaded])

  const toggleFavorite = async (productId: string, isAuthenticated = true) => {
    if (!isAuthenticated) {
      setIsPromptModalOpen(true)
      return
    }

    const isCurrentlyFavorited = favorites.includes(productId)

    // Optimistic UI update
    setFavorites((prev) =>
      isCurrentlyFavorited ? prev.filter((id) => id !== productId) : [...prev, productId]
    )

    // Sync to DB
    try {
      if (isCurrentlyFavorited) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
      }
    } catch {
      // Non-critical, fallback remains in localStorage
    }
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
