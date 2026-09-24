'use client'

import { useState } from 'react'
import { Check, ShieldCheck } from 'lucide-react'
import { ProductGallery, ProductGalleryVariant } from '@/components/product/product-gallery'
import { ProductExamples } from '@/components/product/product-examples'
import { ProductDetailActions } from '@/components/product/product-detail-actions'
import { StoredProduct } from '@/lib/products-store'

interface ProductShowcaseProps {
  product: StoredProduct
  categoryName: string
  formattedPrice: string
}

export function ProductShowcase({ product, categoryName, formattedPrice }: ProductShowcaseProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductGalleryVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  )

  const galleryImages = (product.images || []).map((img) => ({
    url: img.url,
    alt: img.alt || product.name,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
      {/* Sol Kolon: Büyük Galeri + Altında Örnek Çalışmalar (7 Kolon) */}
      <div className="lg:col-span-7">
        <ProductGallery
          images={galleryImages}
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
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
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed mt-2.5 whitespace-pre-line">
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

        {/* Client Interactive Actions: Colors/Variants, Quantity, Add to Quote, WhatsApp */}
        <ProductDetailActions
          productId={product.id}
          productName={product.name}
          productSlug={product.slug}
          productImage={selectedVariant?.imageUrl || product.images?.[0]?.url}
          priceRange={formattedPrice}
          colors={product.colors}
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
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
  )
}
