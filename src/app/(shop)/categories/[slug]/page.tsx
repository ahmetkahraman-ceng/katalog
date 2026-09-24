import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilters, SortSelect } from '@/components/product/product-filters'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'
import { getProductsByCategory } from '@/lib/products-store'
import { Sparkles, FileText, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const matched = MANUAL_CATEGORIES.find(c => c.slug === slug || c.id === slug)
  const title = matched ? matched.name : slug.replace(/-/g, ' ')
  return {
    title: `${title} | Kurumsal Çanta Kataloğu`,
    description: `${title} kurumsal promosyon ve toptan üretim çanta koleksiyonu.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const search = await searchParams

  const matched = MANUAL_CATEGORIES.find(c => c.slug === slug || c.id === slug)
  const category = matched
    ? {
        id: matched.id,
        name: matched.name,
        slug: matched.slug,
        description: `${matched.name} kategorisindeki toptan üretim ve promosyon çanta modellerimiz.`,
      }
    : {
        id: slug,
        name: slug
          .split('-')
          .map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
          .join(' '),
        slug,
        description: 'Toptan üretim çanta koleksiyonumuz.',
      }

  // Fetch products from hybrid store
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

  if (categoryFilter && categoryFilter.length > 0) {
    // Note: Assuming you might want to fetch multiple categories if requested
    // but typically a category page is just one category. If they select more,
    // we could filter within or expand. Let's just filter.
  }

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
      // @ts-ignore assuming p.materials exists or fallback
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
  } else if (currentSort === 'newest') {
    // Add logic if created date exists
    // products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const allColors = [...new Set(products.flatMap((p) => p.colors || []))]
  // @ts-ignore assuming materials might exist
  const allMaterials = [...new Set(products.flatMap((p) => p.materials || []))]

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-neutral-200 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-3">
            <Link href="/" className="hover:text-[#2d6a4f]">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-[#2d6a4f]">Kategoriler</Link>
            <span>/</span>
            <span className="text-neutral-900">{category.name}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-sm text-neutral-600 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-500">
            {products.length} Ürün Bulundu
          </span>
          <SortSelect currentSort={currentSort} />
        </div>
      </div>

      {products.length > 0 ? (
        <div className="lg:flex lg:gap-10">
          {/* Left Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0 mb-6 lg:mb-0">
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
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2d6a4f]/10 rounded-full text-xs font-medium text-[#2d6a4f] uppercase mb-6">
            <Sparkles size={14} />
            <span>Kurumsal Üretim Çözümleri</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4">
            {category.name} Kategorisinde Özel Üretim
          </h2>

          <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed mb-8">
            Şu anda bu kategoride listelenen ürün bulunmuyor. Ancak {category.name} modelleri için firmanıza özel tasarım ve toptan üretim sağlayabiliriz.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/inquiry"
              className="px-6 py-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-sm font-medium rounded inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileText size={16} />
              <span>Teklif İste</span>
            </Link>
            <a
              href="https://wa.me/905555555555?text=Merhaba,%20kurumsal%20çanta%20üretimi%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-neutral-300 hover:border-[#2d6a4f] text-neutral-800 text-sm font-medium rounded inline-flex items-center gap-2 transition-colors"
            >
              <WhatsAppIcon size={18} className="text-[#25D366]" />
              <span>WhatsApp İletişim</span>
            </a>
          </div>

          <div className="pt-10 border-t border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-900 mb-6">Diğer Kategorileri İnceleyin</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MANUAL_CATEGORIES.filter(c => c.slug !== slug).slice(0, 4).map(other => (
                <Link
                  key={other.slug}
                  href={`/categories/${other.slug}`}
                  className="p-4 bg-white border border-neutral-200 hover:border-[#2d6a4f] rounded-lg transition-all text-left group shadow-sm hover:shadow-md"
                >
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-[#2d6a4f] flex items-center justify-between">
                    <span className="truncate">{other.name}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* WhatsApp Floating Button (if not globally provided) */}
      <a
        href="https://wa.me/905555555555"
        className="fixed bottom-6 right-6 p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon size={24} />
      </a>
    </div>
  )
}
