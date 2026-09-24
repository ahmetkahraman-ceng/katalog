'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'

export interface FilterState {
  categories: string[]
  priceMin: number | null
  priceMax: number | null
  colors: string[]
  materials: string[]
}

interface ProductFiltersProps {
  colors: string[]
  materials: string[]
  initialFilters?: Partial<FilterState>
  onFilterChange?: (filters: FilterState) => void
}

export function ProductFilters({
  colors,
  materials,
  initialFilters,
  onFilterChange,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  
  const [categories, setCategories] = useState<string[]>(initialFilters?.categories || [])
  const [priceMin, setPriceMin] = useState<number | null>(initialFilters?.priceMin || null)
  const [priceMax, setPriceMax] = useState<number | null>(initialFilters?.priceMax || null)
  const [selectedColors, setSelectedColors] = useState<string[]>(initialFilters?.colors || [])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initialFilters?.materials || [])

  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    colors: true,
    materials: true
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const applyFilters = () => {
    const state = { categories, priceMin, priceMax, colors: selectedColors, materials: selectedMaterials }
    if (onFilterChange) {
      onFilterChange(state)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('category')
      params.delete('color')
      params.delete('material')
      params.delete('priceMin')
      params.delete('priceMax')

      state.categories.forEach(c => params.append('category', c))
      state.colors.forEach(c => params.append('color', c))
      state.materials.forEach(m => params.append('material', m))
      if (state.priceMin) params.set('priceMin', state.priceMin.toString())
      if (state.priceMax) params.set('priceMax', state.priceMax.toString())
      
      router.push(`?${params.toString()}`)
    }
    setIsOpen(false)
  }

  const clearFilters = () => {
    setCategories([])
    setPriceMin(null)
    setPriceMax(null)
    setSelectedColors([])
    setSelectedMaterials([])
    
    if (onFilterChange) {
      onFilterChange({
        categories: [],
        priceMin: null,
        priceMax: null,
        colors: [],
        materials: []
      })
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('category')
      params.delete('color')
      params.delete('material')
      params.delete('priceMin')
      params.delete('priceMax')
      router.push(`?${params.toString()}`)
    }
    setIsOpen(false)
  }

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const hasFilters = categories.length > 0 || priceMin !== null || priceMax !== null || selectedColors.length > 0 || selectedMaterials.length > 0

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div className="border-b border-neutral-200 pb-4">
        <button className="flex w-full items-center justify-between py-2 text-sm font-medium text-neutral-800" onClick={() => toggleSection('categories')}>
          Kategoriler
          {openSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.categories && (
          <div className="mt-3 space-y-2">
            {MANUAL_CATEGORIES.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={categories.includes(cat.slug)}
                  onChange={() => toggleArrayItem(setCategories, cat.slug)}
                  className="w-4 h-4 rounded border-neutral-300 text-[#2d6a4f] focus:ring-[#2d6a4f] accent-[#2d6a4f]"
                />
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-neutral-200 pb-4">
        <button className="flex w-full items-center justify-between py-2 text-sm font-medium text-neutral-800" onClick={() => toggleSection('price')}>
          Fiyat Aralığı
          {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.price && (
          <div className="mt-3 flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={priceMin || ''}
              onChange={e => setPriceMin(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-2 py-1.5 text-sm border border-neutral-200 rounded focus:border-[#2d6a4f] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
            />
            <span className="text-neutral-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax || ''}
              onChange={e => setPriceMax(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-2 py-1.5 text-sm border border-neutral-200 rounded focus:border-[#2d6a4f] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
            />
          </div>
        )}
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div className="border-b border-neutral-200 pb-4">
          <button className="flex w-full items-center justify-between py-2 text-sm font-medium text-neutral-800" onClick={() => toggleSection('colors')}>
            Renkler
            {openSections.colors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.colors && (
            <div className="mt-3 space-y-2">
              {colors.map(color => (
                <label key={color} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => toggleArrayItem(setSelectedColors, color)}
                    className="w-4 h-4 rounded border-neutral-300 text-[#2d6a4f] focus:ring-[#2d6a4f] accent-[#2d6a4f]"
                  />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{color}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materials */}
      {materials.length > 0 && (
        <div className="border-b border-neutral-200 pb-4">
          <button className="flex w-full items-center justify-between py-2 text-sm font-medium text-neutral-800" onClick={() => toggleSection('materials')}>
            Materyal
            {openSections.materials ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.materials && (
            <div className="mt-3 space-y-2">
              {materials.map(material => (
                <label key={material} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material)}
                    onChange={() => toggleArrayItem(setSelectedMaterials, material)}
                    className="w-4 h-4 rounded border-neutral-300 text-[#2d6a4f] focus:ring-[#2d6a4f] accent-[#2d6a4f]"
                  />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{material}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={applyFilters}
          className="w-full py-2.5 bg-[#2d6a4f] text-white text-sm font-medium rounded hover:bg-[#1b4332] transition-colors"
        >
          Sonuçları Göster
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="w-full py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex w-full items-center justify-center gap-2 py-3 mb-6 bg-white border border-neutral-200 rounded text-sm font-medium text-neutral-700"
      >
        <SlidersHorizontal size={16} />
        Filtrele
        {hasFilters && (
          <span className="ml-1 flex items-center justify-center w-5 h-5 bg-[#2d6a4f] text-white text-[10px] rounded-full">
            !
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white w-full rounded-t-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <h2 className="text-base font-medium text-[#2d6a4f]">Filtreler</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-800">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {filterContent}
            </div>
          </div>
        </div>
      )}

      <div className="hidden lg:block w-full">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={18} className="text-[#2d6a4f]" />
          <h2 className="text-lg font-medium text-neutral-900">Filtreler</h2>
        </div>
        {filterContent}
      </div>
    </>
  )
}

export function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set('sort', e.target.value)
    } else {
      params.delete('sort')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-500 hidden sm:inline-block">Sırala:</span>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="text-sm border border-neutral-200 rounded px-2 py-1.5 bg-white font-medium text-neutral-800 focus:ring-[#2d6a4f] focus:border-[#2d6a4f] cursor-pointer outline-none"
      >
        <option value="">Önerilen</option>
        <option value="price-asc">Fiyat (Düşük→Yüksek)</option>
        <option value="price-desc">Fiyat (Yüksek→Düşük)</option>
        <option value="newest">En Yeniler</option>
      </select>
    </div>
  )
}
