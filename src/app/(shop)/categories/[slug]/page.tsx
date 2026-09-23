import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/product/product-grid'
import { ProductFilters } from '@/components/product/product-filters'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  let category
  try {
    category = await prisma.category.findUnique({ where: { slug } })
  } catch {
    return { title: 'Kategori' }
  }
  if (!category) return { title: 'Kategori Bulunamadı' }
  return {
    title: `${category.name} | ÇANTA`,
    description: category.description || `${category.name} koleksiyonumuzu keşfedin`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const search = await searchParams

  let category
  try {
    category = await prisma.category.findUnique({ where: { slug } })
  } catch {
    // DB not connected
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-extralight tracking-[0.2em] uppercase text-center mb-8">
          {slug.replace(/-/g, ' ')}
        </h1>
        <p className="text-center text-sm text-neutral-400">Veritabanı bağlantısı bekleniyor...</p>
      </div>
    )
  }

  if (!category) notFound()

  const page = Number(search.page) || 1
  const limit = 12
  const skip = (page - 1) * limit

  const colorFilter = search.color
    ? Array.isArray(search.color) ? search.color : [search.color]
    : undefined

  const where: any = {
    categoryId: category.id,
    status: 'ACTIVE' as const,
  }

  if (colorFilter) {
    where.colors = { hasSome: colorFilter }
  }

  if (search.priceMin || search.priceMax) {
    where.priceMin = {}
    if (search.priceMin) where.priceMin.gte = Number(search.priceMin)
    if (search.priceMax) where.priceMax = { lte: Number(search.priceMax) }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  // Get unique colors for filter
  const allProducts = await prisma.product.findMany({
    where: { categoryId: category.id, status: 'ACTIVE' },
    select: { colors: true },
  })
  const allColors = [...new Set(allProducts.flatMap(p => p.colors))]

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      {/* Category Title */}
      <div className="text-center mb-12">
        <h1 className="text-2xl lg:text-3xl font-extralight tracking-[0.2em] uppercase">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 text-sm font-light text-neutral-500">{category.description}</p>
        )}
        <p className="mt-2 text-xs font-light text-neutral-400">{total} ürün</p>
      </div>

      <div className="lg:flex lg:gap-12">
        {/* Filters */}
        <aside className="lg:w-56 flex-shrink-0 mb-8 lg:mb-0">
          <ProductFilters
            colors={allColors}
            currentColors={colorFilter}
            currentPriceMin={search.priceMin as string | undefined}
            currentPriceMax={search.priceMax as string | undefined}
            basePath={`/categories/${slug}`}
          />
        </aside>

        {/* Products */}
        <div className="flex-1">
          <ProductGrid products={products} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/categories/${slug}?page=${p}${colorFilter ? colorFilter.map(c => `&color=${c}`).join('') : ''}${search.priceMin ? `&priceMin=${search.priceMin}` : ''}${search.priceMax ? `&priceMax=${search.priceMax}` : ''}`}
                  className={`px-4 py-2 text-xs font-light tracking-wider ${
                    p === page
                      ? 'bg-black text-white'
                      : 'text-neutral-500 hover:text-black border border-neutral-200 hover:border-black'
                  } transition-colors`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
