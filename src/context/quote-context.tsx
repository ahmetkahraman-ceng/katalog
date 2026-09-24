'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface QuoteItem {
  id: string
  name: string
  slug: string
  imageUrl?: string
  priceRange?: string
  color?: string
  variantId?: string | null
  variantName?: string | null
  quantity?: number
  printOption?: string
}

interface QuoteContextType {
  items: QuoteItem[]
  addItem: (item: QuoteItem) => void
  removeItem: (id: string, variantId?: string | null) => void
  updateQuantity: (id: string, quantity: number, variantId?: string | null) => void
  clearQuote: () => void
  isInQuote: (id: string, variantId?: string | null) => boolean
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
      const existing = prev.find(
        (item) => item.id === newItem.id && (item.variantId || null) === (newItem.variantId || null)
      )
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && (item.variantId || null) === (newItem.variantId || null)
            ? { ...item, quantity: (item.quantity || 1) + (newItem.quantity || 1) }
            : item
        )
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 50 }]
    })
    setIsDrawerOpen(true)
  }

  const removeItem = (id: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter((item) =>
        variantId !== undefined
          ? !(item.id === id && (item.variantId || null) === (variantId || null))
          : item.id !== id
      )
    )
  }

  const updateQuantity = (id: string, quantity: number, variantId?: string | null) => {
    setItems((prev) =>
      prev.map((item) => {
        const matches =
          variantId !== undefined
            ? item.id === id && (item.variantId || null) === (variantId || null)
            : item.id === id
        return matches ? { ...item, quantity: Math.max(1, quantity) } : item
      })
    )
  }

  const clearQuote = () => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const isInQuote = (id: string, variantId?: string | null) =>
    items.some((item) =>
      variantId !== undefined
        ? item.id === id && (item.variantId || null) === (variantId || null)
        : item.id === id
    )

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
