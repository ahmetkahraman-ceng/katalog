'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useFavorites } from '@/context/favorites-context'
import { ProductCard } from '@/components/product/product-card'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const favoriteProducts = products.filter((p) => favorites.includes(p.id))

  return (
    <div className="w-full bg-[#faf8f5] min-h-screen py-10 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-10 pb-4 border-b border-neutral-200">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-light tracking-widest uppercase text-neutral-500 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Kataloğa Dön</span>
          </Link>
          <div className="flex items-center gap-3">
            <Heart size={22} className="fill-black text-black" />
            <h1 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black">
              FAVORİ ÇANTALARIM
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-light text-neutral-400">
            Favoriler yükleniyor...
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <Heart size={28} />
            </div>
            <h2 className="text-sm font-medium tracking-wider uppercase text-neutral-800">
              Henüz Favori Çantanız Yok
            </h2>
            <p className="text-xs font-light text-neutral-400 max-w-sm">
              Ürün kartlarının üzerindeki kalp ikonuna tıklayarak beğendiğiniz çantaları favorilerinize ekleyebilirsiniz.
            </p>
            <Link
              href="/"
              className="mt-2 px-6 py-2.5 bg-black text-white text-xs font-light tracking-widest uppercase hover:bg-neutral-800 transition-colors"
            >
              Koleksiyonu İncele
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-12">
            {favoriteProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                description={p.description}
                priceMin={p.priceMin ? Number(p.priceMin) : null}
                priceMax={p.priceMax ? Number(p.priceMax) : null}
                imageUrl={p.images?.[0]?.url}
                secondImageUrl={p.images?.[1]?.url}
                badge={p.badge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
