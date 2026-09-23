'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Plus, Check } from 'lucide-react'
import { cn, formatPriceRange } from '@/lib/utils'
import { useQuote } from '@/context/quote-context'
import { useFavorites } from '@/context/favorites-context'

interface ProductCardProps {
  id: string
  name: string
  slug: string
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

  const formattedPrice = formatPriceRange(priceMin, priceMax)
  const addedToQuote = isInQuote(id)
  const favorited = isFavorite(id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id,
      name,
      slug,
      imageUrl,
      priceRange: formattedPrice,
      quantity: 50,
    })
    if (onInquiry) onInquiry(id)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  return (
    <div
      className="group relative flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Crossfade to Second Image */}
      <Link href={`/products/${slug}`} className="block relative aspect-[3/4] overflow-hidden bg-[#f4f2ee]">
        {/* Primary Image */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            fill
            unoptimized={Boolean(imageUrl.startsWith('data:'))}
            className={cn(
              'object-cover transition-all duration-700 ease-in-out',
              secondImageUrl && isHovered ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-105'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300 font-extralight tracking-widest text-xs">
            ÇANTA
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
              'object-cover transition-all duration-700 ease-in-out',
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Top Badges & Favorite Heart */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-start justify-between z-10 pointer-events-none">
          {/* Badge ("Yeni", "Popüler", "Sınırlı Stok") */}
          <div>
            {badge && (
              <span
                className={cn(
                  'inline-block px-2.5 py-0.5 text-[9px] font-medium tracking-[0.15em] uppercase pointer-events-auto shadow-2xs',
                  badge === 'Yeni' && 'bg-[#1c1917] text-white',
                  badge === 'Popüler' && 'bg-[#c5a880] text-white',
                  badge === 'Sınırlı Stok' && 'bg-[#8c3a27] text-white',
                  badge !== 'Yeni' && badge !== 'Popüler' && badge !== 'Sınırlı Stok' && 'bg-white/90 text-neutral-800'
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {/* Heart Button */}
          <button
            onClick={handleFavoriteClick}
            type="button"
            className="p-1.5 bg-white/80 hover:bg-white text-neutral-700 hover:text-black rounded-full shadow-2xs transition-all pointer-events-auto backdrop-blur-xs"
            aria-label="Favorilere Ekle"
          >
            <Heart
              size={15}
              className={cn('transition-colors', favorited ? 'fill-[#8c3a27] text-[#8c3a27]' : '')}
            />
          </button>
        </div>

        {/* Hover Bottom Action ("Teklif İste") */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 p-3 transition-all duration-300 z-10',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          )}
        >
          <button
            onClick={handleQuickAdd}
            className={cn(
              'w-full py-2.5 text-[11px] font-light tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-1.5 backdrop-blur-md',
              addedToQuote
                ? 'bg-neutral-900 text-white'
                : 'bg-white/95 text-neutral-900 hover:bg-black hover:text-white border border-neutral-200 shadow-sm'
            )}
          >
            {addedToQuote ? (
              <>
                <Check size={12} />
                <span>Listeye Eklendi</span>
              </>
            ) : (
              <>
                <Plus size={12} />
                <span>Teklif İste</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details (H&M / Zara Typography & Spacing) */}
      <div className="mt-3 flex flex-col gap-1">
        <Link href={`/products/${slug}`} className="block">
          <h3 className="text-xs sm:text-[13px] font-normal tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>

        {description && (
          <p className="text-[11px] font-light text-neutral-400 line-clamp-1 leading-snug">
            {description}
          </p>
        )}

        <div className="flex items-baseline justify-between pt-0.5">
          <span className="text-xs font-light text-neutral-800 tracking-tight">
            {formattedPrice}
          </span>
          <span className="text-[9px] font-light text-neutral-400 tracking-widest uppercase">
            Toptan Fiyat
          </span>
        </div>
      </div>
    </div>
  )
}
