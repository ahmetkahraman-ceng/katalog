import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllProducts } from '@/lib/products-store'
import { ProductGrid } from '@/components/product/product-grid'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = (q || '').trim().toLowerCase()

  const allProducts = await getAllProducts()
  const filteredProducts = query
    ? allProducts.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(query)
        const descMatch = (product.description || '').toLowerCase().includes(query)
        const catMatch = (product.category?.name || '').toLowerCase().includes(query)
        const slugMatch = product.slug.toLowerCase().includes(query)
        const tagMatch = (product.tags || []).some((t) => t.toLowerCase().includes(query))
        return nameMatch || descMatch || catMatch || slugMatch || tagMatch
      })
    : allProducts

  return (
    <div className="w-full bg-[#faf8f5] min-h-screen py-10 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-10 pb-4 border-b border-neutral-200">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-light tracking-widest uppercase text-neutral-500 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black">
              {query ? `"${query}" İçin Arama Sonuçları` : 'Tüm Çanta Kataloğu'}
            </h1>
            <span className="text-xs font-light text-neutral-500">
              {filteredProducts.length} çanta modeli bulundu
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  )
}
