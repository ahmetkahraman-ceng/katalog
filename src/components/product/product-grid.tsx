import { ProductCard } from './product-card'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
  id: string
  name: string
  slug: string
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
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm font-light text-neutral-400 tracking-wider uppercase">
          Ürün bulunamadı
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-12">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-4 w-3/4 mt-3" />
          <Skeleton className="h-3 w-1/2 mt-2" />
        </div>
      ))}
    </div>
  )
}
