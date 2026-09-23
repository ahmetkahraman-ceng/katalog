import { getFeaturedProducts } from '@/lib/products-store'
import { ProductGrid } from '@/components/product/product-grid'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8)

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400">
            02 / SEÇİLMİŞ MODELLER
          </span>
          <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] uppercase text-black mt-1 font-serif">
            Öne Çıkan Çantalar
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-light text-neutral-500 max-w-md mt-2 md:mt-0 leading-relaxed">
          Atölyemizde sınırlı sayıda üretilen zanaatkar deri çanta koleksiyonu.
        </p>
      </div>

      <ProductGrid products={products} />
    </section>
  )
}
