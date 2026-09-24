'use client'

import { useState } from 'react'
import { Plus, Minus, Check, MessageCircle, FileText, ShoppingBag } from 'lucide-react'
import { useQuote } from '@/context/quote-context'
import { InquiryModal } from '@/components/inquiry/inquiry-modal'
import { cn } from '@/lib/utils'

import Image from 'next/image'

export interface ProductDetailVariant {
  id?: string
  variantName: string
  variantType?: string
  imageUrl?: string | null
  sortOrder?: number
}

interface ProductDetailActionsProps {
  productId: string
  productName: string
  productSlug: string
  productImage?: string
  priceRange?: string
  colors?: string[]
  variants?: ProductDetailVariant[]
  selectedVariant?: ProductDetailVariant | null
  onSelectVariant?: (variant: ProductDetailVariant) => void
}

export function ProductDetailActions({
  productId,
  productName,
  productSlug,
  productImage,
  priceRange,
  colors = [],
  variants = [],
  selectedVariant,
  onSelectVariant,
}: ProductDetailActionsProps) {
  const { addItem, isInQuote } = useQuote()
  const [quantity, setQuantity] = useState(50)
  const [internalSelectedColor, setInternalSelectedColor] = useState<string>(
    variants[0]?.variantName || colors[0] || 'Standart'
  )
  const [printOption, setPrintOption] = useState<'baskili' | 'baskisiz'>('baskili')

  const activeColor = selectedVariant?.variantName || internalSelectedColor
  const isAlreadyInQuote = isInQuote(productId, selectedVariant?.id || null)

  const handleAddToQuote = () => {
    addItem({
      id: productId,
      name: `${productName} (${printOption === 'baskili' ? 'Baskılı' : 'Baskısız'}, ${activeColor})`,
      slug: productSlug,
      imageUrl: selectedVariant?.imageUrl || productImage,
      priceRange,
      color: activeColor,
      variantId: selectedVariant?.id || null,
      variantName: activeColor,
      quantity,
      printOption: printOption === 'baskili' ? 'Logo Baskılı' : 'Baskısız Ham',
    })
  }

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Merhaba! ${productName} (Ref: ${productSlug}) modelinden "${activeColor}" rengi için yaklaşık ${quantity} adet ${
        printOption === 'baskili' ? 'logo baskılı' : 'baskısız'
      } toptan fiyat ve termin süresi öğrenmek istiyorum.`
    )
    window.open(`https://wa.me/905300000000?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-5 pt-2">
      {/* 1. Renk Seçenekleri (Varyantlar Veya Düz Renkler) */}
      {variants.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-light tracking-[0.15em] uppercase text-neutral-500">
              RENK SEÇENEĞİ:
            </span>
            <span className="font-medium text-black uppercase">{activeColor}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {variants.map((v, idx) => {
              const isSelected =
                selectedVariant?.id
                  ? selectedVariant.id === v.id
                  : activeColor === v.variantName
              return (
                <button
                  key={v.id || idx}
                  type="button"
                  onClick={() => {
                    onSelectVariant?.(v)
                    setInternalSelectedColor(v.variantName)
                  }}
                  className={cn(
                    'group relative flex items-center gap-2 p-1.5 border transition-all text-left',
                    isSelected
                      ? 'border-black bg-neutral-50 ring-1 ring-black'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  )}
                  title={v.variantName}
                >
                  <div className="w-8 h-8 bg-neutral-100 relative overflow-hidden shrink-0 border border-neutral-200">
                    {v.imageUrl ? (
                      <Image
                        src={v.imageUrl}
                        alt={v.variantName}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400 uppercase">
                        {v.variantName.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs tracking-wider uppercase pr-1.5',
                      isSelected ? 'font-medium text-black' : 'font-light text-neutral-700'
                    )}
                  >
                    {v.variantName}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : colors.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-light tracking-[0.15em] uppercase text-neutral-500">
              RENK SEÇENEĞİ:
            </span>
            <span className="font-medium text-neutral-900">{activeColor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setInternalSelectedColor(color)}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-light tracking-wider border transition-all',
                  activeColor === color
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-black'
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* 2. Baskı Seçeneği */}
      <div className="space-y-2">
        <span className="text-xs font-light tracking-[0.15em] uppercase text-neutral-500 block">
          BASKI TERCİHİ:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPrintOption('baskili')}
            className={cn(
              'p-2.5 text-xs font-light border text-left transition-all',
              printOption === 'baskili'
                ? 'border-black bg-[#faf8f5] text-black font-medium ring-1 ring-black'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
            )}
          >
            <div className="flex items-center justify-between">
              <span>Logo Baskılı</span>
              {printOption === 'baskili' && <Check size={13} className="text-black" />}
            </div>
            <span className="text-[10px] text-neutral-400 font-light block mt-0.5">
              Serigrafi / DTF / Nakış
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPrintOption('baskisiz')}
            className={cn(
              'p-2.5 text-xs font-light border text-left transition-all',
              printOption === 'baskisiz'
                ? 'border-black bg-[#faf8f5] text-black font-medium ring-1 ring-black'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
            )}
          >
            <div className="flex items-center justify-between">
              <span>Baskısız Ham</span>
              {printOption === 'baskisiz' && <Check size={13} className="text-black" />}
            </div>
            <span className="text-[10px] text-neutral-400 font-light block mt-0.5">
              Düz Ürün Teslimatı
            </span>
          </button>
        </div>
      </div>

      {/* 3. Adet Seçimi */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-light tracking-[0.15em] uppercase text-neutral-500">
            TAHMİNİ TALEP ADEDİ:
          </span>
          <span className="text-[11px] text-neutral-400">Min. 50 Adet</span>
        </div>
        <div className="flex items-center border border-neutral-300 bg-white w-full max-w-xs">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(50, q - 25))}
            className="p-3 hover:bg-neutral-100 transition-colors text-neutral-700"
            aria-label="Azalt"
          >
            <Minus size={14} />
          </button>
          <div className="flex-1 text-center font-mono text-sm font-medium text-neutral-900">
            {quantity} <span className="text-xs font-sans text-neutral-500">Adet</span>
          </div>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 25)}
            className="p-3 hover:bg-neutral-100 transition-colors text-neutral-700"
            aria-label="Artır"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* 4. Ana Aksiyon Butonları */}
      <div className="space-y-2.5 pt-2">
        {/* Teklif Listesine Ekle (Sepet yerine) */}
        <button
          type="button"
          onClick={handleAddToQuote}
          className={cn(
            'w-full py-3.5 px-6 text-xs font-light tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2',
            isAlreadyInQuote
              ? 'bg-neutral-900 text-white'
              : 'bg-black text-white hover:bg-neutral-800'
          )}
        >
          <ShoppingBag size={15} />
          <span>{isAlreadyInQuote ? 'TEKLİF LİSTEMDE (+ EKLENDİ)' : 'TEKLİF LİSTESİNE EKLE'}</span>
        </button>

        {/* Doğrudan Teklif Formu Modalı */}
        <InquiryModal
          productId={productId}
          productName={productName}
          productImage={productImage}
          productRef={`REF: CNTA-${productSlug.slice(0, 4).toUpperCase()}`}
        />

        {/* WhatsApp Hızlı Destek */}
        <button
          type="button"
          onClick={handleWhatsAppInquiry}
          className="w-full py-3 px-6 bg-emerald-700 text-white text-xs font-light tracking-wider uppercase hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle size={15} />
          <span>WhatsApp&apos;tan Fiyat Sor</span>
        </button>
      </div>
    </div>
  )
}
