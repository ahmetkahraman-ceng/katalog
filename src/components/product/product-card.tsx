'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatPriceRange } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  priceMin?: number | null
  priceMax?: number | null
  imageUrl?: string
  imageAlt?: string
  onInquiry?: (productId: string) => void
}

export function ProductCard({
  id,
  name,
  slug,
  priceMin,
  priceMax,
  imageUrl,
  imageAlt,
  onInquiry,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || name}
              fill
              unoptimized={Boolean(imageUrl.startsWith('data:'))}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Hover overlay with CTA */}
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 p-4 transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
          >
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onInquiry?.(id)
              }}
              className="w-full py-3 text-xs font-light tracking-[0.15em] uppercase bg-white/95 backdrop-blur-sm text-black hover:bg-black hover:text-white transition-colors"
            >
              Teklif İste
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <Link href={`/products/${slug}`}>
          <h3 className="text-sm font-light tracking-wide text-neutral-800 hover:text-black transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-xs font-light text-neutral-500">
          {formatPriceRange(priceMin, priceMax)}
        </p>
      </div>
    </div>
  )
}
