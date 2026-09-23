'use client'

import { useState } from 'react'
import { Plus, Minus, Check, MessageCircle, FileText, ShoppingBag } from 'lucide-react'
import { useQuote } from '@/context/quote-context'
import { InquiryModal } from '@/components/inquiry/inquiry-modal'
import { cn } from '@/lib/utils'

interface ProductDetailActionsProps {
  productId: string
  productName: string
  productSlug: string
  productImage?: string
  priceRange?: string
  colors?: string[]
}

export function ProductDetailActions({
  productId,
  productName,
  productSlug,
  productImage,
  priceRange,
  colors = [],
}: ProductDetailActionsProps) {
  const { addItem, isInQuote } = useQuote()
  const [quantity, setQuantity] = useState(50)
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || 'Standart')
  const [printOption, setPrintOption] = useState<'baskili' | 'baskisiz'>('baskili')

  const isAlreadyInQuote = isInQuote(productId)

  const handleAddToQuote = () => {
    addItem({
      id: productId,
      name: `${productName} (${printOption === 'baskili' ? 'Baskılı' : 'Baskısız'}, ${selectedColor})`,
      slug: productSlug,
      imageUrl: productImage,
      priceRange,
      color: selectedColor,
      quantity,
      printOption: printOption === 'baskili' ? 'Logo Baskılı' : 'Baskısız Ham',
    })
  }

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Merhaba! ${productName} (Ref: ${productSlug}) modelinden yaklaşık ${quantity} adet için ${
        printOption === 'baskili' ? 'logo baskılı' : 'baskısız'
      } toptan fiyat ve termin süresi öğrenmek istiyorum.`
    )
    window.open(`https://wa.me/905300000000?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-5 pt-2">
      {/* 1. Renk Seçenekleri */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-light tracking-[0.15em] uppercase text-neutral-500">
              RENK SEÇENEĞİ:
            </span>
            <span className="font-medium text-neutral-900">{selectedColor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-light tracking-wider border transition-all',
                  selectedColor === color
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-black'
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

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
