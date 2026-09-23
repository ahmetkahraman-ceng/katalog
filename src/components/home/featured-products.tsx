import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/product/product-grid'

export async function FeaturedProducts() {
  let products: any[] = []

  try {
    products = await prisma.product.findMany({
      where: {
        featured: true,
        status: 'ACTIVE',
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    // Database not connected yet - show empty state
    products = []
  }

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <h2 className="text-center text-xs font-light tracking-[0.3em] uppercase text-neutral-400 mb-12">
        Öne Çıkan Ürünler
      </h2>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-sm font-light text-neutral-400">
            Henüz öne çıkan ürün eklenmemiş.
          </p>
        </div>
      )}
    </section>
  )
}
