'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
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
    materials: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
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

      state.categories.forEach((c) => params.append('category', c))
      state.colors.forEach((c) => params.append('color', c))
      state.materials.forEach((m) => params.append('material', m))
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
        materials: [],
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
    setter((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  const hasFilters =
    categories.length > 0 ||
    priceMin !== null ||
    priceMax !== null ||
    selectedColors.length > 0 ||
    selectedMaterials.length > 0

  const filterContent = (
    <div className="space-y-5">
      {/* Categories Accordion */}
      <div className="border-b border-neutral-100 pb-4">
        <button
          type="button"
          className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-neutral-900"
          onClick={() => toggleSection('categories')}
        >
          <span>Kategoriler</span>
          {openSections.categories ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {openSections.categories && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
            {MANUAL_CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 cursor-pointer group py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
              >
                <input
                  type="checkbox"
                  checked={categories.includes(cat.slug)}
                  onChange={() => toggleArrayItem(setCategories, cat.slug)}
                  className="w-4 h-4 rounded-md border-neutral-300 text-[#2d6a4f] focus:ring-[#2d6a4f] accent-[#2d6a4f]"
                />
                <span className="font-normal">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Accordion */}
      <div className="border-b border-neutral-100 pb-4">
        <button
          type="button"
          className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-neutral-900"
          onClick={() => toggleSection('price')}
        >
          <span>Fiyat Aralığı (₺)</span>
          {openSections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {openSections.price && (
          <div className="mt-3 space-y-2.5">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">₺</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin || ''}
                  onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : null)}
                  className="w-full pl-6 pr-2 py-1.5 text-xs border border-neutral-200 rounded-lg focus:border-[#2d6a4f] focus:outline-hidden focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>
              <span className="text-neutral-300">-</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">₺</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax || ''}
                  onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : null)}
                  className="w-full pl-6 pr-2 py-1.5 text-xs border border-neutral-200 rounded-lg focus:border-[#2d6a4f] focus:outline-hidden focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Colors Accordion */}
      {colors.length > 0 && (
        <div className="border-b border-neutral-100 pb-4">
          <button
            type="button"
            className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-neutral-900"
            onClick={() => toggleSection('colors')}
          >
            <span>Renkler</span>
            {openSections.colors ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {openSections.colors && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
              {colors.map((color) => (
                <label
                  key={color}
                  className="flex items-center gap-2.5 cursor-pointer group py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => toggleArrayItem(setSelectedColors, color)}
                    className="w-4 h-4 rounded-md border-neutral-300 text-[#2d6a4f] focus:ring-[#2d6a4f] accent-[#2d6a4f]"
                  />
                  <span>{color}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materials Accordion */}
      {materials.length > 0 && (
        <div className="border-b border-neutral-100 pb-4">
          <button
            type="button"
            className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-neutral-900"
            onClick={() => toggleSection('materials')}
          >
            <span>Materyal / Kumaş</span>
            {openSections.materials ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {openSections.materials && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
              {materials.map((mat) => (
                <label
                  key={mat}
                  className="flex items-center gap-2.5 cursor-pointer group py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(mat)}
                    onChange={() => toggleArrayItem(setSelectedMaterials, mat)}
                    className="w-4 h-4 rounded-md border-neutral-300 text-[#2d6a4f] focus:ring-[#2d6a4f] accent-[#2d6a4f]"
                  />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          onClick={applyFilters}
          className="w-full py-2.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs active:scale-98"
        >
          Filtreleri Uygula
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Filtreleri Temizle</span>
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex w-full items-center justify-center gap-2 py-3 mb-4 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 shadow-2xs"
      >
        <SlidersHorizontal size={15} className="text-[#2d6a4f]" />
        <span>Filtrele & Sırala</span>
        {hasFilters && (
          <span className="ml-1 w-5 h-5 rounded-full bg-[#2d6a4f] text-white text-[10px] font-bold flex items-center justify-center">
            •
          </span>
        )}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col z-10 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#2d6a4f]" />
                <h2 className="text-sm font-bold text-neutral-900">Katalog Filtreleri</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">{filterContent}</div>
          </div>
        </div>
      )}

      {/* Desktop Filter Panel */}
      <div className="hidden lg:block w-full bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs sticky top-32">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#2d6a4f]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Filtreler
            </h2>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Temizle
            </button>
          )}
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
      <span className="text-xs font-medium text-neutral-500 hidden sm:inline-block">
        Sırala:
      </span>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="text-xs border border-neutral-200 rounded-xl px-3 py-2 bg-white font-medium text-neutral-800 focus:ring-1 focus:ring-[#2d6a4f] focus:border-[#2d6a4f] cursor-pointer outline-hidden shadow-2xs"
      >
        <option value="">Önerilen Sıralama</option>
        <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
        <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
        <option value="newest">En Yeniler</option>
      </select>
    </div>
  )
}
