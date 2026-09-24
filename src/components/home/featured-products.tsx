'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductData {
  id: string
  name: string
  slug: string
  sku?: string | null
  minOrderQty?: number | null
  description?: string | null
  priceMin?: number | null
  priceMax?: number | null
  badge?: string | null
  categoryId?: string | null
  category?: {
    id: string
    name: string
    slug: string
  } | null
  images?: Array<{ url: string; alt?: string | null }>
  imageUrl?: string
}

const CATEGORY_TABS = [
  { label: 'Tüm Modeller', slug: 'all' },
  { label: 'Bez Çanta', slug: 'bez-canta' },
  { label: 'Sırt Çantası', slug: 'sirt-cantasi' },
  { label: 'Karton Çanta', slug: 'karton-canta' },
  { label: 'Laptop Çantası', slug: 'laptop-cantasi' },
  { label: 'Fuar & Kongre', slug: 'fuar-kongre-cantasi' },
  { label: 'Deri Çanta', slug: 'deri-canta' },
  { label: 'Spor Çantası', slug: 'spor-cantasi' },
]

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') {
      return products.slice(0, 12)
    }
    return products.filter((p) => {
      const catSlug = p.category?.slug || p.categoryId
      return catSlug === activeTab
    })
  }, [products, activeTab])

  return (
    <section className="bg-white py-16 sm:py-20 border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2d6a4f] mb-1">
              <Sparkles size={14} />
              <span>Geniş Model Seçenekleri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              ÖNE ÇIKAN ÇANTA MODELLERİ
            </h2>
          </div>

          <Link
            href={activeTab === 'all' ? '/categories/bez-canta' : `/categories/${activeTab}`}
            className="text-xs font-semibold text-white bg-[#2d6a4f] hover:bg-[#1b4332] px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <span>Tüm Koleksiyonu Gör</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Promozone-style Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.slug
            return (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border shrink-0',
                  isActive
                    ? 'bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200/80 hover:text-neutral-900'
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-2xl border border-neutral-200">
                <div className="aspect-[4/3] bg-neutral-200 rounded-xl mb-3" />
                <div className="h-3 bg-neutral-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4" />
                <div className="h-9 bg-neutral-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                sku={product.sku}
                minOrderQty={product.minOrderQty}
                description={product.description}
                priceMin={product.priceMin}
                priceMax={product.priceMax}
                badge={product.badge}
                imageUrl={product.images?.[0]?.url || product.imageUrl}
                secondImageUrl={product.images?.[1]?.url}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-neutral-50 rounded-2xl border border-neutral-200 p-8">
            <p className="text-sm text-neutral-500 mb-4">
              Bu kategoride ürün bulunamadı veya henüz eklenmedi.
            </p>
            <Link
              href="/inquiry"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d6a4f] text-white text-xs font-semibold rounded-xl"
            >
              Özel Üretim Teklifi İsteyin
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
