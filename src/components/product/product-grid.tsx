import { ProductCard } from './product-card'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
  id: string
  name: string
  slug: string
  sku?: string | null
  minOrderQty?: number | null
  description?: string | null
  priceMin?: any
  priceMax?: any
  badge?: string | null
  images: { url: string; alt?: string | null }[]
}

interface ProductGridProps {
  products: Product[]
  onInquiry?: (productId: string) => void
}

export function ProductGrid({ products, onInquiry }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-neutral-200">
        <p className="text-sm font-medium text-neutral-500">
          Kriterlere uygun çanta bulunamadı
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          sku={product.sku}
          minOrderQty={product.minOrderQty}
          description={product.description}
          priceMin={product.priceMin ? Number(product.priceMin) : null}
          priceMax={product.priceMax ? Number(product.priceMax) : null}
          imageUrl={product.images[0]?.url}
          secondImageUrl={product.images[1]?.url}
          imageAlt={product.images[0]?.alt || undefined}
          badge={product.badge}
          onInquiry={onInquiry}
        />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 bg-white rounded-2xl border border-neutral-200">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="h-3 w-1/3 mt-3" />
          <Skeleton className="h-4 w-3/4 mt-2" />
          <Skeleton className="h-4 w-1/2 mt-2" />
          <Skeleton className="h-9 w-full mt-3 rounded-xl" />
        </div>
      ))}
    </div>
  )
}
