import { prisma } from '@/lib/prisma'
import {
  ProductsManagementTable,
  AdminProductItem,
  AdminCategoryItem,
} from '@/components/admin/products-management-table'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  let products: AdminProductItem[] = []
  let categories: AdminCategoryItem[] = []

  try {
    const [dbProducts, dbCategories] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: { select: { id: true, name: true } },
          images: { orderBy: { order: 'asc' }, select: { url: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        orderBy: { order: 'asc' },
        select: { id: true, name: true, slug: true },
      }),
    ])

    products = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      status: p.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
      priceMin: p.priceMin ? Number(p.priceMin) : null,
      priceMax: p.priceMax ? Number(p.priceMax) : null,
      categoryId: p.categoryId,
      category: p.category,
      images: p.images,
      createdAt: p.createdAt.toISOString(),
    }))

    categories = dbCategories
  } catch (error) {
    console.error('Error fetching admin products:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            KATALOG ENVANTER YÖNETİMİ
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-black font-serif">
            Çanta Modelleri
          </h1>
        </div>
      </div>

      <ProductsManagementTable
        initialProducts={products}
        categories={categories}
      />
    </div>
  )
}
