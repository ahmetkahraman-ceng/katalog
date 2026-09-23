import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ProductGallery } from '@/components/product/product-gallery'
import { InquiryModal } from '@/components/inquiry/inquiry-modal'
import { formatPriceRange } from '@/lib/utils'
import { ArrowRight, Check } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  let product
  try {
    product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    })
  } catch {
    return { title: 'Ürün' }
  }
  if (!product) return { title: 'Ürün Bulunamadı' }
  return {
    title: `${product.name} | ÇANTA Atölye Koleksiyonu`,
    description: product.description || `${product.name} detayları ve teklif formu.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

  let product: any = null
  let relatedProducts: any[] = []

  try {
    product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        status: 'ACTIVE',
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
      },
    })

    if (product) {
      // Benzer Çantalar: Aynı kategorideki diğer aktif modeller
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          status: 'ACTIVE',
        },
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          category: true,
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
      })

      // Eğer aynı kategoride 4'ten az ürün varsa, diğer kategorilerden tamamla
      if (relatedProducts.length < 4) {
        const fallbackProducts = await prisma.product.findMany({
          where: {
            id: { notIn: [product.id, ...relatedProducts.map(p => p.id)] },
            status: 'ACTIVE',
          },
          include: {
            images: { orderBy: { order: 'asc' }, take: 1 },
            category: true,
          },
          take: 4 - relatedProducts.length,
          orderBy: { createdAt: 'desc' },
        })
        relatedProducts = [...relatedProducts, ...fallbackProducts]
      }
    }
  } catch (err) {
    console.error('Veritabanı hatası:', err)
  }

  if (!product) notFound()

  return (
    <div className="w-full bg-[#f9f9f8] min-h-screen">
      {/* Minimalist Top Breadcrumb Bar */}
      <div className="w-full border-b border-neutral-200 bg-neutral-100/70 px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between text-[11px] font-light tracking-widest uppercase">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-neutral-500">
          <Link href="/" className="hover:text-black transition-colors">
            KOLEKSİYON
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${product.category.slug}`}
            className="hover:text-black transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-black font-normal">{product.name}</span>
        </nav>
        <div className="hidden md:flex items-center gap-4 text-neutral-400">
          <span>ATÖLYE SERİSİ</span>
          <span className="w-1 h-1 rounded-full bg-black inline-block"></span>
          <span className="text-black">{product.category.name}</span>
        </div>
      </div>

      {/* Main Showcase Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Sol Kolon: Fotoğraf Galerisi (7 Kolon) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images.map((img: any) => ({
                url: img.url,
                alt: img.alt || product.name,
              }))}
              productName={product.name}
            />
          </div>

          {/* Sağ Kolon: Ürün Detayları & Teklif İste (5 Kolon - Sticky) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            {/* Header Bilgisi */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-light tracking-[0.2em] uppercase text-neutral-400">
                  REF: CNTA-{product.slug.slice(0, 4).toUpperCase()}
                </span>
                <span className="text-[10px] tracking-widest uppercase bg-neutral-200 text-neutral-800 px-2 py-0.5 font-light">
                  {product.category.name}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-[0.1em] uppercase text-black leading-tight mt-1">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-sm font-light text-neutral-600 leading-relaxed whitespace-pre-line mt-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Tahmini Birim Fiyat Aralığı Kartı */}
            <div className="p-5 bg-white border border-neutral-200/80 shadow-xs flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-[11px] tracking-widest uppercase text-neutral-400">
                <span>TAHMİNİ BİRİM FİYAT ARALIĞI</span>
                <span>KDV HARİÇ</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-light tracking-tight text-black">
                  {formatPriceRange(
                    product.priceMin ? Number(product.priceMin) : null,
                    product.priceMax ? Number(product.priceMax) : null
                  )}
                </span>
                <span className="text-xs text-neutral-400 font-light">/ Adet</span>
              </div>

              <p className="text-[11px] text-neutral-400 font-light leading-relaxed mt-1 border-t border-neutral-100 pt-2">
                * Kesin fiyat; talep edilen adet, kurumsal logo/baskı ve deri türüne göre resmi teklif mektubunda iletilir.
              </p>
            </div>

            {/* Renk Seçenekleri */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-light">
                  RENK SEÇENEKLERİ
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <span
                      key={color}
                      className="px-3.5 py-1.5 text-xs font-light tracking-wider bg-white border border-neutral-300 text-neutral-800"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Özellikler Maddeleri */}
            <div className="space-y-2 py-2 border-y border-neutral-200 text-xs font-light text-neutral-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-black shrink-0" />
                <span>Birinci sınıf tabaklanmış hakiki dana derisi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-black shrink-0" />
                <span>El boyaması kenarlar ve güçlendirilmiş dikişler</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-black shrink-0" />
                <span>Kurumsal toptan siparişlerde özel logo kabartma imkanı</span>
              </div>
            </div>

            {/* Birincil Aksiyon Butonu - TEKLİF İSTE (Sepete Ekle KESİNLİKLE YOK) */}
            <div className="pt-2">
              <InquiryModal
                productId={product.id}
                productName={product.name}
                productImage={product.images?.[0]?.url}
                productRef={`REF: CNTA-${product.slug.slice(0, 4).toUpperCase()}`}
              />
            </div>

            {/* Bilgilendirme Notu */}
            <p className="text-[11px] font-light text-neutral-400 leading-relaxed text-center">
              Bu bir e-ticaret sitesi değildir. Satın alma, toptan üretim ve numune talepleriniz için lütfen teklif formumuzu doldurun.
            </p>
          </div>
        </div>

        {/* 🌟 İSTENEN ÖZELLİK: BENZER ÇANTALAR / TAMAMLAYICI PARÇALAR */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 lg:mt-28 pt-12 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
              <div>
                <span className="text-[11px] font-light tracking-[0.25em] uppercase text-neutral-400 block">
                  TAMAMLAYICI PARÇALAR
                </span>
                <h2 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black mt-1">
                  BENZER MODELLER
                </h2>
              </div>
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-xs font-light tracking-widest uppercase text-black hover:text-neutral-500 transition-colors underline flex items-center gap-1"
              >
                TÜM {product.category.name.toUpperCase()} MODELLERİ
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Benzer Ürünler Izgarası (4 Kolon) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((rel: any) => {
                const relImage = rel.images?.[0]?.url
                return (
                  <div
                    key={rel.id}
                    className="group flex flex-col bg-white p-3 border border-neutral-200/80 shadow-xs hover:border-black transition-all duration-300"
                  >
                    {/* Görsel & Kategori Etiketi */}
                    <Link
                      href={`/products/${rel.slug}`}
                      className="block relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-3"
                    >
                      {relImage ? (
                        <Image
                          src={relImage}
                          alt={rel.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          ÇANTA
                        </div>
                      )}

                      <span className="absolute top-2 right-2 bg-black text-white text-[9px] font-light tracking-widest px-2 py-0.5 uppercase">
                        {rel.category.name}
                      </span>
                    </Link>

                    {/* Bilgiler */}
                    <div className="flex flex-col gap-1 flex-1 justify-between">
                      <div>
                        <Link href={`/products/${rel.slug}`}>
                          <h3 className="text-xs sm:text-sm font-light tracking-wider uppercase text-black hover:text-neutral-600 transition-colors line-clamp-1">
                            {rel.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] font-light text-neutral-500 mt-0.5">
                          {formatPriceRange(
                            rel.priceMin ? Number(rel.priceMin) : null,
                            rel.priceMax ? Number(rel.priceMax) : null
                          )}
                        </p>
                      </div>

                      {/* Teklif İste Butonu */}
                      <Link
                        href={`/products/${rel.slug}`}
                        className="mt-3 w-full py-2 px-3 bg-neutral-100 hover:bg-black hover:text-white text-black text-[11px] font-light tracking-widest uppercase transition-colors flex items-center justify-between"
                      >
                        <span>İNCELE & TEKLİF AL</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
