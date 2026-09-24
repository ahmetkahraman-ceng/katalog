import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilters, SortSelect } from '@/components/product/product-filters'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'
import { getProductsByCategory } from '@/lib/products-store'
import { Sparkles, FileText, ArrowRight, Home } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const matched = MANUAL_CATEGORIES.find((c) => c.slug === slug || c.id === slug)
  const title = matched ? matched.name : slug.replace(/-/g, ' ')
  return {
    title: `${title} Modelleri | Toptan Promosyon Çanta Kataloğu`,
    description: `${title} kurumsal promosyon ve toptan üretim çanta koleksiyonu. Hemen teklif alın.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const search = await searchParams

  const matched = MANUAL_CATEGORIES.find((c) => c.slug === slug || c.id === slug)
  const category = matched
    ? {
        id: matched.id,
        name: matched.name,
        slug: matched.slug,
        description: `${matched.name} kategorisindeki toptan üretim ve promosyon çanta modellerimiz. Kurumsal logonuzla baskılı olarak sipariş verebilirsiniz.`,
      }
    : {
        id: slug,
        name: slug
          .split('-')
          .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
          .join(' '),
        slug,
        description: 'Toptan üretim kurumsal çanta koleksiyonumuz.',
      }

  // Fetch products
  let products = await getProductsByCategory(slug)
  if (products.length === 0 && matched) {
    products = await getProductsByCategory(matched.id)
  }

  // Filter by category
  const categoryFilter = search.category
    ? Array.isArray(search.category)
      ? search.category
      : [search.category]
    : undefined

  // Filter by color
  const colorFilter = search.color
    ? Array.isArray(search.color)
      ? search.color
      : [search.color]
    : undefined

  if (colorFilter && colorFilter.length > 0) {
    products = products.filter((p) =>
      p.colors && p.colors.some((col) => colorFilter.includes(col))
    )
  }

  // Filter by material
  const materialFilter = search.material
    ? Array.isArray(search.material)
      ? search.material
      : [search.material]
    : undefined

  if (materialFilter && materialFilter.length > 0) {
    products = products.filter((p) =>
      // @ts-ignore
      p.materials && p.materials.some((mat: string) => materialFilter.includes(mat))
    )
  }

  // Filter by price
  if (search.priceMin) {
    const minVal = Number(search.priceMin)
    products = products.filter((p) => (p.priceMin ? p.priceMin >= minVal : true))
  }
  if (search.priceMax) {
    const maxVal = Number(search.priceMax)
    products = products.filter((p) => (p.priceMax ? p.priceMax <= maxVal : true))
  }

  // Sorting
  const currentSort = typeof search.sort === 'string' ? search.sort : ''
  if (currentSort === 'price-asc') {
    products.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0))
  } else if (currentSort === 'price-desc') {
    products.sort((a, b) => (b.priceMin || 0) - (a.priceMin || 0))
  }

  const allColors = [...new Set(products.flatMap((p) => p.colors || []))]
  // @ts-ignore
  const allMaterials = [...new Set(products.flatMap((p) => p.materials || []))]

  return (
    <div className="bg-[#f9fafb] min-h-screen py-8 lg:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Category Header Banner */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-4">
            <Link href="/" className="hover:text-[#2d6a4f] flex items-center gap-1">
              <Home size={13} />
              <span>Ana Sayfa</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-400">Kategoriler</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-semibold">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 border-t border-neutral-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d6a4f]/10 text-[#2d6a4f] text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles size={13} />
                <span>Toptan Üretim</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 md:pt-0">
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-xl">
                {products.length} Model
              </span>
              <SortSelect currentSort={currentSort} />
            </div>
          </div>
        </div>

        {/* Content Area: Sidebar + Grid */}
        <div className="lg:flex lg:gap-8 items-start">
          {/* Left Sidebar Filter (Promozone style) */}
          <aside className="lg:w-72 shrink-0 mb-6 lg:mb-0">
            <ProductFilters
              colors={allColors}
              materials={allMaterials}
              initialFilters={{
                categories: categoryFilter || [],
                colors: colorFilter || [],
                materials: materialFilter || [],
                priceMin: search.priceMin ? Number(search.priceMin) : null,
                priceMax: search.priceMax ? Number(search.priceMax) : null,
              }}
            />
          </aside>

          {/* Right Product Grid */}
          <div className="flex-1 min-w-0">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    // @ts-ignore
                    sku={product.sku}
                    // @ts-ignore
                    minOrderQty={product.minOrderQty}
                    description={product.description}
                    priceMin={product.priceMin ? Number(product.priceMin) : null}
                    priceMax={product.priceMax ? Number(product.priceMax) : null}
                    imageUrl={product.images?.[0]?.url}
                    secondImageUrl={product.images?.[1]?.url}
                    imageAlt={product.images?.[0]?.alt || undefined}
                    badge={product.badge}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Bu Kriterlere Uygun Çanta Bulunamadı
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mb-6 leading-relaxed">
                  Farklı filtreler deneyebilir veya firmanızın ihtiyacı olan özel model için doğrudan teklif formu doldurabilirsiniz.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/inquiry"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText size={15} />
                    <span>Özel Teklif İste</span>
                  </Link>
                  <a
                    href="https://wa.me/905300000000"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <WhatsAppIcon size={15} className="text-[#25D366]" />
                    <span>WhatsApp&apos;tan Yazın</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
