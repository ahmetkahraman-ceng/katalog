'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Plus, Check } from 'lucide-react'
import { cn, formatPriceRange } from '@/lib/utils'
import { useQuote } from '@/context/quote-context'
import { useFavorites } from '@/context/favorites-context'
import { useAuth } from '@/context/auth-context'

export interface ProductCardProps {
  id: string
  name: string
  slug: string
  sku?: string | null
  minOrderQty?: number | null
  description?: string | null
  priceMin?: number | null
  priceMax?: number | null
  imageUrl?: string
  secondImageUrl?: string
  imageAlt?: string
  badge?: string | null
  onInquiry?: (productId: string) => void
}

export function ProductCard({
  id,
  name,
  slug,
  sku,
  minOrderQty = 50,
  description,
  priceMin,
  priceMax,
  imageUrl,
  secondImageUrl,
  imageAlt,
  badge,
  onInquiry,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem, isInQuote } = useQuote()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()

  const formattedPrice = formatPriceRange(priceMin, priceMax)
  const addedToQuote = isInQuote(id)
  const favorited = isFavorite(id)
  const refCode = sku || `REF: ${slug.slice(0, 3).toUpperCase()}-${id.slice(-3).toUpperCase()}`

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id,
      name,
      slug,
      imageUrl,
      priceRange: formattedPrice,
      quantity: minOrderQty || 50,
    })
    if (onInquiry) onInquiry(id)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id, Boolean(user))
  }

  return (
    <div
      className="group relative bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Image Container with Crossfade to Second Image */}
        <Link
          href={`/products/${slug}`}
          className="block relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100/70 mb-3"
        >
          {/* Primary Image */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || name}
              fill
              unoptimized={Boolean(imageUrl.startsWith('data:'))}
              className={cn(
                'object-cover transition-all duration-500 ease-out',
                secondImageUrl && isHovered ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-105'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-medium text-xs tracking-widest uppercase">
              Çanta Görseli
            </div>
          )}

          {/* Secondary Image (Crossfade on Hover) */}
          {secondImageUrl && (
            <Image
              src={secondImageUrl}
              alt={`${imageAlt || name} Alternatif Görünüm`}
              fill
              unoptimized={Boolean(secondImageUrl.startsWith('data:'))}
              className={cn(
                'object-cover transition-all duration-500 ease-out',
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Top Badges (Left) */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
            {badge && (
              <span
                className={cn(
                  'inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full shadow-xs',
                  badge === 'Yeni' && 'bg-[#2d6a4f] text-white',
                  badge === 'Popüler' && 'bg-[#c5a35a] text-white',
                  badge === 'Sınırlı Stok' && 'bg-rose-600 text-white',
                  badge !== 'Yeni' && badge !== 'Popüler' && badge !== 'Sınırlı Stok' && 'bg-neutral-900 text-white'
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {/* Top Right Heart Button */}
          <button
            onClick={handleFavoriteClick}
            type="button"
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-black flex items-center justify-center shadow-xs border border-neutral-200/60 backdrop-blur-xs transition-transform active:scale-90"
            aria-label="Favorilere Ekle"
            title="Favorilere Ekle"
          >
            <Heart
              size={15}
              className={cn('transition-colors', favorited ? 'fill-rose-600 text-rose-600' : '')}
            />
          </button>
        </Link>

        {/* Product Details */}
        <div className="flex flex-col gap-1">
          {/* SKU / Reference Code */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-medium tracking-wider">
              {refCode}
            </span>
            <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-sm">
              Min. {minOrderQty || 50} Adet
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${slug}`} className="block mt-1">
            <h3 className="text-xs sm:text-[14px] font-semibold text-neutral-900 group-hover:text-[#2d6a4f] transition-colors line-clamp-2 min-h-[2.25rem] leading-snug">
              {name}
            </h3>
          </Link>

          {/* Description if present */}
          {description && (
            <p className="text-[11px] text-neutral-500 line-clamp-1 leading-snug">
              {description}
            </p>
          )}

          {/* Price Range */}
          <div className="flex items-baseline gap-1.5 mt-1.5 pt-1.5 border-t border-neutral-100">
            <span className="text-xs sm:text-sm font-bold text-neutral-900">
              {formattedPrice}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              + KDV / Adet
            </span>
          </div>
        </div>
      </div>

      {/* Promozone-style Action Button */}
      <div className="mt-3">
        <button
          onClick={handleQuickAdd}
          type="button"
          className={cn(
            'w-full py-2 sm:py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.98]',
            addedToQuote
              ? 'bg-emerald-50 text-[#2d6a4f] border border-emerald-300 hover:bg-emerald-100'
              : 'bg-[#2d6a4f] hover:bg-[#1b4332] text-white'
          )}
        >
          {addedToQuote ? (
            <>
              <Check size={14} className="stroke-[2.5]" />
              <span>Teklif Listesinde</span>
            </>
          ) : (
            <>
              <Plus size={14} className="stroke-[2.5]" />
              <span>Teklif Listesine Ekle</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
