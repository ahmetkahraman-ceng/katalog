'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'

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
  images?: Array<{ url: string; alt?: string | null }>
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?featured=true')
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

  return (
    <section className="bg-neutral-50 py-16 sm:py-20 border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-10 flex flex-col items-start justify-between sm:flex-row sm:items-end gap-4 border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[11px] font-light tracking-[0.25em] uppercase text-[#2d6a4f] block">
              KURUMSAL TOPTAN KOLEKSİYON
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-[0.1em] uppercase text-black mt-1">
              ÖNE ÇIKAN ÇANTA MODELLERİ
            </h2>
          </div>
          <Link
            href="/categories/bez-canta"
            className="text-xs font-medium tracking-wider uppercase text-white bg-[#2d6a4f] hover:bg-[#1b4332] px-5 py-2.5 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            Tüm Kataloğu Gör →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-4 rounded-xs border border-neutral-100">
                  <div className="aspect-[3/4] bg-neutral-200 mb-3" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                </div>
              ))
            : products.map((product) => (
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
                  imageUrl={product.images?.[0]?.url}
                  secondImageUrl={product.images?.[1]?.url}
                />
              ))}
        </div>
      </div>
    </section>
  )
}
