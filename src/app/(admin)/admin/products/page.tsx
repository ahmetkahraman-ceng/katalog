import { getAllProducts } from '@/lib/products-store'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'
import {
  ProductsManagementTable,
  AdminProductItem,
  AdminCategoryItem,
} from '@/components/admin/products-management-table'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const allProducts = await getAllProducts()

  const products: AdminProductItem[] = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    status: p.status,
    priceMin: p.priceMin || null,
    priceMax: p.priceMax || null,
    categoryId: p.categoryId,
    category: p.category ? { id: p.category.id, name: p.category.name } : undefined,
    images: p.images.map((img) => ({ url: img.url })),
    createdAt: p.createdAt,
  }))

  const categories: AdminCategoryItem[] = MANUAL_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            KATALOG ENVANTER YÖNETİMİ
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-black font-serif">
            Çanta Modelleri ({products.length})
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
