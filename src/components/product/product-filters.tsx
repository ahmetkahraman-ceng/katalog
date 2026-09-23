'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ProductFiltersProps {
  colors: string[]
  currentColors?: string[]
  currentPriceMin?: string
  currentPriceMax?: string
  basePath: string
}

const colorMap: Record<string, string> = {
  'Siyah': 'bg-black',
  'Beyaz': 'bg-white border border-neutral-300',
  'Kahverengi': 'bg-amber-800',
  'Lacivert': 'bg-navy-900',
  'Bordo': 'bg-red-900',
  'Gri': 'bg-gray-400',
  'Bej': 'bg-amber-100',
  'Pembe': 'bg-pink-300',
  'Mavi': 'bg-blue-500',
  'Yeşil': 'bg-green-700',
  'Kırmızı': 'bg-red-500',
  'Turuncu': 'bg-orange-500',
}

export function ProductFilters({
  colors,
  currentColors = [],
  currentPriceMin,
  currentPriceMax,
  basePath,
}: ProductFiltersProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColors, setSelectedColors] = useState<string[]>(currentColors)
  const [priceMin, setPriceMin] = useState(currentPriceMin || '')
  const [priceMax, setPriceMax] = useState(currentPriceMax || '')

  const applyFilters = () => {
    const params = new URLSearchParams()
    selectedColors.forEach(c => params.append('color', c))
    if (priceMin) params.set('priceMin', priceMin)
    if (priceMax) params.set('priceMax', priceMax)
    const query = params.toString()
    router.push(`${basePath}${query ? `?${query}` : ''}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setSelectedColors([])
    setPriceMin('')
    setPriceMax('')
    router.push(basePath)
    setIsOpen(false)
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const hasFilters = selectedColors.length > 0 || priceMin || priceMax

  const filterContent = (
    <div className="space-y-8">
      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-xs font-light tracking-[0.2em] uppercase text-neutral-400 mb-4">Renk</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={cn(
                  'w-7 h-7 rounded-full transition-all',
                  colorMap[color] || 'bg-neutral-300',
                  selectedColors.includes(color)
                    ? 'ring-2 ring-offset-2 ring-black'
                    : 'hover:ring-1 hover:ring-offset-1 hover:ring-neutral-400'
                )}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-light tracking-[0.2em] uppercase text-neutral-400 mb-4">Fiyat Aralığı</h3>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm font-light focus:border-black focus:outline-none"
          />
          <span className="text-neutral-300">—</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm font-light focus:border-black focus:outline-none"
          />
        </div>
      </div>

      {/* Apply / Clear */}
      <div className="flex gap-3">
        <Button onClick={applyFilters} size="sm" className="flex-1">
          Uygula
        </Button>
        {hasFilters && (
          <Button onClick={clearFilters} variant="ghost" size="sm">
            Temizle
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 text-xs font-light tracking-wider uppercase text-neutral-600 mb-6"
      >
        <SlidersHorizontal size={16} />
        Filtrele
        {hasFilters && (
          <span className="bg-black text-white text-[10px] px-1.5 py-0.5">
            {selectedColors.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white p-6 pb-10 rounded-t-2xl max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-light tracking-[0.2em] uppercase">Filtreler</h2>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        {filterContent}
      </div>
    </>
  )
}
