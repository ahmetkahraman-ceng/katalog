'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface QuoteItem {
  id: string
  name: string
  slug: string
  imageUrl?: string
  priceRange?: string
  color?: string
  quantity?: number
  printOption?: string
}

interface QuoteContextType {
  items: QuoteItem[]
  addItem: (item: QuoteItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearQuote: () => void
  isInQuote: (id: string) => boolean
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  openDrawer: () => void
  closeDrawer: () => void
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

const STORAGE_KEY = 'bag_catalog_quote_items'

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      // Ignore JSON parse errors
    }
    setIsLoaded(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch {
        // Ignore quota errors
      }
    }
  }, [items, isLoaded])

  const addItem = (newItem: QuoteItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id)
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: (item.quantity || 1) + (newItem.quantity || 1) }
            : item
        )
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 50 }]
    })
    setIsDrawerOpen(true)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    )
  }

  const clearQuote = () => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const isInQuote = (id: string) => items.some((item) => item.id === id)

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearQuote,
        isInQuote,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider')
  }
  return context
}
