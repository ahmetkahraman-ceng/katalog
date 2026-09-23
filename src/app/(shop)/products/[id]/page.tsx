import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { getProductByIdOrSlug, getAllProducts } from '@/lib/products-store'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductExamples } from '@/components/product/product-examples'
import { ProductTabs } from '@/components/product/product-tabs'
import { ProductDetailActions } from '@/components/product/product-detail-actions'
import { ProductGrid } from '@/components/product/product-grid'
import { formatPriceRange } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await getProductByIdOrSlug(id)
  if (!product) return { title: 'Ürün Bulunamadı' }
  return {
    title: `${product.name} | ÇANTA Kurumsal Toptan Koleksiyonu`,
    description: product.description || `${product.name} özellikleri ve kurumsal toptan teklif formu.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

  const product = await getProductByIdOrSlug(id)
  if (!product) notFound()

  // Related products from same category
  const all = await getAllProducts()
  const relatedProducts = all
    .filter((p) => p.id !== product.id && p.status === 'ACTIVE' && p.categoryId === product.categoryId)
    .slice(0, 4)

  const fallbackRelated = relatedProducts.length > 0
    ? relatedProducts
    : all.filter((p) => p.id !== product.id && p.status === 'ACTIVE').slice(0, 4)

  const categoryName = product.category?.name || 'Çanta Koleksiyonu'
  const categorySlug = product.category?.slug || 'el-cantasi'
  const formattedPrice = formatPriceRange(
    product.priceMin ? Number(product.priceMin) : null,
    product.priceMax ? Number(product.priceMax) : null
  )

  return (
    <div className="w-full bg-[#faf8f5] min-h-screen pb-20">
      {/* Editorial Breadcrumb Bar */}
      <div className="w-full border-b border-neutral-200/80 bg-white/70 px-4 sm:px-6 lg:px-12 py-3 text-[11px] font-light tracking-widest uppercase">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">
              ANA SAYFA
            </Link>
            <span>/</span>
            <Link href={`/categories/${categorySlug}`} className="hover:text-black transition-colors">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-black font-normal">{product.name}</span>
          </nav>

          <div className="hidden md:flex items-center gap-3 text-neutral-400">
            <span>MODEL REF: CNTA-{product.slug.slice(0, 4).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Sol Kolon: Büyük Galeri + Altında Örnek Çalışmalar (7 Kolon) */}
          <div className="lg:col-span-7">
            {/* Fotoğraf Galerisi */}
            <ProductGallery
              images={product.images.map((img: any) => ({
                url: img.url,
                alt: img.alt || product.name,
              }))}
              productName={product.name}
            />

            {/* Fotoğraf Galerisinin Altında Örnek Çalışmalar Bölümü */}
            <ProductExamples
              examples={product.examples || []}
              productName={product.name}
            />
          </div>

          {/* Sağ Kolon: Ürün Detayları & Teklif Kutusu (5 Kolon - Sticky) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28 bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-2xs">
            {/* Rozet ve Model Kodu */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400">
                REF: CNTA-{product.slug.slice(0, 4).toUpperCase()}
              </span>

              {product.badge ? (
                <span className="px-2.5 py-0.5 text-[10px] font-medium tracking-widest uppercase bg-black text-white">
                  {product.badge}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-[10px] font-light tracking-widest uppercase bg-neutral-100 text-neutral-700">
                  {categoryName}
                </span>
              )}
            </div>

            {/* Ürün Başlığı & Kısa Açıklama */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-[0.08em] uppercase text-black leading-tight">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed mt-2.5">
                  {product.description}
                </p>
              )}
            </div>

            {/* Fiyat Aralığı Kartı */}
            <div className="p-4 bg-[#faf8f5] border border-neutral-200/60 flex flex-col gap-1">
              <div className="flex items-baseline justify-between text-[10px] tracking-widest uppercase text-neutral-400">
                <span>TOPTAN BİRİM FİYAT ARALIĞI</span>
                <span>KDV HARİÇ</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-light tracking-tight text-black">
                  {formattedPrice}
                </span>
                <span className="text-xs text-neutral-400 font-light">/ Adet</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-light pt-1 border-t border-neutral-200/50">
                * Kesin fiyat; talep edilen adet, logo baskı türü ve kumaş gramajına göre teklif formunda sunulur.
              </p>
            </div>

            {/* Client Interactive Actions: Colors, Quantity, Add to Quote, WhatsApp */}
            <ProductDetailActions
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              productImage={product.images?.[0]?.url}
              priceRange={formattedPrice}
              colors={product.colors}
            />

            {/* Kurumsal Güvence Maddeleri */}
            <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs font-light text-neutral-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-black shrink-0" />
                <span>Minimum 50 adetten başlayan kurumsal seri imalat</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-black shrink-0" />
                <span>Üretim öncesi ücretsiz 3D dijital logo önizlemesi (Mock-up)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-black shrink-0" />
                <span>Dayanıklı dikiş, kaliteli astar ve kumaş garantisi</span>
              </div>
            </div>

            <p className="text-[11px] font-light text-neutral-400 text-center leading-relaxed">
              Bu bir e-ticaret sitesi değildir. Toptan ve kurumsal talepleriniz için lütfen teklif listesine ekleyin veya formu doldurun.
            </p>
          </div>
        </div>

        {/* 3-SEKMELİ ALAN: Ürün Açıklaması • Ürün Özellikleri • SSS */}
        <ProductTabs
          description={product.description}
          specs={product.specs}
          faqs={product.faqs}
        />

        {/* BENZER ÜRÜNLER (Aynı Kategoriden 4 Ürün) */}
        {fallbackRelated.length > 0 && (
          <section className="mt-20 lg:mt-28 pt-12 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
              <div>
                <span className="text-[11px] font-light tracking-[0.25em] uppercase text-neutral-400 block">
                  ALTERNATİF SEÇENEKLER
                </span>
                <h2 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black mt-1">
                  BENZER ÇANTA MODELLERİ
                </h2>
              </div>
              <Link
                href={`/categories/${categorySlug}`}
                className="text-xs font-light tracking-widest uppercase text-black hover:text-neutral-500 transition-colors flex items-center gap-1"
              >
                <span>TÜM {categoryName.toUpperCase()} MODELLERİ</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <ProductGrid products={fallbackRelated} />
          </section>
        )}
      </div>
    </div>
  )
}
