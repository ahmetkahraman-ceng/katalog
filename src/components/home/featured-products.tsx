import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllProducts } from '@/lib/products-store'
import { ProductGrid } from '@/components/product/product-grid'

export async function FeaturedProducts() {
  const all = await getAllProducts()
  const activeProducts = all.filter((p) => p.status === 'ACTIVE')

  // Featured products
  const featured = activeProducts.filter((p) => p.featured)
  const displayFeatured = (featured.length > 0 ? featured : activeProducts).slice(0, 4)

  // New arrivals (badge "Yeni" or sorted by createdAt)
  const newArrivals = activeProducts
    .filter((p) => p.badge === 'Yeni' || !displayFeatured.some((f) => f.id === p.id))
    .slice(0, 4)

  return (
    <div className="space-y-20 lg:space-y-28 py-16 lg:py-24">
      {/* 1. ÖNE ÇIKAN ÜRÜNLER */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400">
              02 / KURUMSAL TERCİHLER
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] uppercase text-black mt-1">
              ÖNE ÇIKAN ÇANTALAR
            </h2>
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <p className="text-xs sm:text-sm font-light text-neutral-500 max-w-sm hidden sm:block">
              En çok tercih edilen kurumsal promosyon ve atölye modellerimiz.
            </p>
            <Link
              href="/categories/el-cantasi"
              className="text-xs font-light tracking-widest uppercase text-black hover:text-neutral-500 transition-colors flex items-center gap-1 shrink-0"
            >
              <span>TÜMÜNÜ GÖR</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <ProductGrid products={displayFeatured} />
      </section>

      {/* 2. YENİ GELENLER */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400">
                03 / 2026 SERİSİ
              </span>
              <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] uppercase text-black mt-1">
                YENİ GELENLER
              </h2>
            </div>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <p className="text-xs sm:text-sm font-light text-neutral-500 max-w-sm hidden sm:block">
                Yeni sezon pamuklu dokular, su geçirmez astarlar ve fonksiyonel kesimler.
              </p>
              <Link
                href="/categories/sirt-cantasi"
                className="text-xs font-light tracking-widest uppercase text-black hover:text-neutral-500 transition-colors flex items-center gap-1 shrink-0"
              >
                <span>YENİ MODELLER</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <ProductGrid products={newArrivals} />
        </section>
      )}
    </div>
  )
}
