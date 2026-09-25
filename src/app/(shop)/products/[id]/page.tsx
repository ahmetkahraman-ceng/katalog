import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { getProductByIdOrSlug, getAllProducts } from '@/lib/products-store'
import { ProductShowcase } from '@/components/product/product-showcase'
import { ProductTabs } from '@/components/product/product-tabs'
import { ProductGrid } from '@/components/product/product-grid'
import { formatPriceRange } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await getProductByIdOrSlug(id)
  if (!product) return { title: 'Ürün Bulunamadı' }
  return {
    title: `${product.name} | ÇANTA Kurumsal Toptan Koleksiyonu`,
    description: product.description || `${product.name} özellikleri ve kurumsal toptan teklif formu.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

  const product = await getProductByIdOrSlug(id)
  if (!product) notFound()

  // Related products from same category
  const all = await getAllProducts()
  const relatedProducts = all
    .filter((p) => p.id !== product.id && p.status === 'ACTIVE' && p.categoryId === product.categoryId)
    .slice(0, 4)

  const fallbackRelated = relatedProducts.length > 0
    ? relatedProducts
    : all.filter((p) => p.id !== product.id && p.status === 'ACTIVE').slice(0, 4)

  const categoryName = product.category?.name || 'Çanta Koleksiyonu'
  const categorySlug = product.category?.slug || 'sirt-cantasi'
  const formattedPrice = formatPriceRange(
    product.priceMin ? Number(product.priceMin) : null,
    product.priceMax ? Number(product.priceMax) : null
  )

  return (
    <div className="w-full bg-[#faf8f5] min-h-screen pb-20">
      {/* Editorial Breadcrumb Bar */}
      <div className="w-full border-b border-neutral-200/80 bg-white/70 px-4 sm:px-6 lg:px-12 py-3 text-[11px] font-light tracking-widest uppercase">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">
              ANA SAYFA
            </Link>
            <span>/</span>
            <Link href={`/categories/${categorySlug}`} className="hover:text-black transition-colors">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-black font-normal">{product.name}</span>
          </nav>

          <div className="hidden md:flex items-center gap-3 text-neutral-400">
            <span>MODEL REF: CNTA-{product.slug.slice(0, 4).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 lg:pt-12">
        <ProductShowcase
          product={product}
          categoryName={categoryName}
          formattedPrice={formattedPrice}
        />

        {/* 3-SEKMELİ ALAN: Ürün Açıklaması • Ürün Özellikleri • SSS */}
        <ProductTabs
          description={product.description}
          specs={product.specs}
          faqs={product.faqs}
        />

        {/* BENZER ÜRÜNLER (Aynı Kategoriden 4 Ürün) */}
        {fallbackRelated.length > 0 && (
          <section className="mt-20 lg:mt-28 pt-12 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
              <div>
                <span className="text-[11px] font-light tracking-[0.25em] uppercase text-neutral-400 block">
                  ALTERNATİF SEÇENEKLER
                </span>
                <h2 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black mt-1">
                  BENZER ÇANTA MODELLERİ
                </h2>
              </div>
              <Link
                href={`/categories/${categorySlug}`}
                className="text-xs font-light tracking-widest uppercase text-black hover:text-neutral-500 transition-colors flex items-center gap-1"
              >
                <span>TÜM {categoryName.toUpperCase()} MODELLERİ</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <ProductGrid products={fallbackRelated} />
          </section>
        )}
      </div>
    </div>
  )
}
