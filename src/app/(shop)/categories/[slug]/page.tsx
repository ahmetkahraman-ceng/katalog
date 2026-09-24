import Link from 'next/link'
import { ProductGrid } from '@/components/product/product-grid'
import { ProductFilters } from '@/components/product/product-filters'
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
    title: `${title} | ÇANTA Atölye Koleksiyonu`,
    description: `${title} lüks el yapımı deri çanta siluetleri ve özel üretim kataloğu.`,
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
        description: `${matched.name} siluetinde geleneksel saraç ve deri işçiliği ile üretilen modellerimiz.`,
      }
    : {
        id: slug,
        name: slug
          .split('-')
          .map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
          .join(' '),
        slug,
        description: 'Lüks deri çanta koleksiyonumuz.',
      }

  // Fetch products from hybrid store (DB or stored models)
  let products = await getProductsByCategory(slug)
  if (products.length === 0 && matched) {
    products = await getProductsByCategory(matched.id)
  }

  // Filter by color if provided
  const colorFilter = search.color
    ? Array.isArray(search.color)
      ? search.color
      : [search.color]
    : undefined

  if (colorFilter && colorFilter.length > 0) {
    products = products.filter((p) =>
      p.colors.some((col) => colorFilter.includes(col))
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

  const allColors = [...new Set(products.flatMap((p) => p.colors))]

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
      {/* Category Header */}
      <div className="text-center mb-10 pb-6 border-b border-neutral-100">
        <span className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-2">
          ATÖLYE SİLÜETİ • {category.slug.toUpperCase()}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.15em] uppercase font-serif">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 text-xs sm:text-sm font-light text-neutral-500 max-w-xl mx-auto leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {products.length > 0 ? (
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
          </div>
        </div>
      ) : (
        /* Luxury Editorial Empty State */
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-mono tracking-widest text-neutral-600 uppercase mb-6">
            <Sparkles size={12} className="text-black" />
            <span>2026 ATÖLYE SERİSİ • BUTİK ÜRETİM</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-light font-serif tracking-wide uppercase text-neutral-800 mb-3">
            {category.name} Modellerimiz Atölyemizde Hazırlanıyor
          </h2>

          <p className="text-xs sm:text-sm font-light text-neutral-500 max-w-lg mx-auto leading-relaxed mb-8">
            Bu siluete ait yeni sezon tasarımlarımız saraç ustalarımız tarafından işlenmektedir. Özel deri tercihi, kurumsal sipariş veya toptan butik üretim talebiniz için doğrudan atölyemizden teklif alabilirsiniz.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/inquiry"
              className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-light tracking-widest uppercase inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileText size={15} />
              <span>Özel Teklif & Sipariş Talebi</span>
            </Link>
            <a
              href="https://wa.me/905555555555?text=Merhaba,%20çanta%20modelleri%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 border border-neutral-300 hover:border-black text-black text-xs font-light tracking-widest uppercase inline-flex items-center gap-2 transition-colors"
            >
              <WhatsAppIcon size={16} className="text-[#25D366]" />
              <span>WhatsApp Teklif Hattı</span>
            </a>
          </div>

          {/* Diğer Siluetleri Keşfet */}
          <div className="pt-10 border-t border-neutral-200">
            <span className="text-[11px] font-mono tracking-[0.2em] text-neutral-400 uppercase block mb-6">
              DİĞER ATÖLYE SİLÜETLERİNİ İNCELEYİN
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MANUAL_CATEGORIES.filter(c => c.slug !== slug).slice(0, 4).map(other => (
                <Link
                  key={other.slug}
                  href={`/categories/${other.slug}`}
                  className="p-4 bg-white border border-neutral-200 hover:border-black transition-all text-left group rounded-xs shadow-2xs"
                >
                  <span className="text-[10px] font-mono text-neutral-400 block mb-1">SİLÜET</span>
                  <span className="text-xs font-light text-black group-hover:underline flex items-center justify-between">
                    <span>{other.name}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
