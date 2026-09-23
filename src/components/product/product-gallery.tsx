'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: { url: string; alt: string }[]
  productName?: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-neutral-100 flex items-center justify-center">
        <div className="text-neutral-300">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    )
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Stage Image */}
      <div
        className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden group select-none cursor-crosshair"
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <Image
          src={images[activeIndex]?.url || images[0].url}
          alt={images[activeIndex]?.alt || productName || 'Çanta Görseli'}
          fill
          unoptimized={Boolean((images[activeIndex]?.url || images[0]?.url)?.startsWith('data:'))}
          className={cn(
            'object-cover object-center transition-transform duration-500 ease-out',
            isZoomed ? 'scale-[2.2]' : 'group-hover:scale-105'
          )}
          style={
            isZoomed
              ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
              : undefined
          }
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
        />

        {/* Floating Action Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] text-black tracking-[0.2em] uppercase font-light">
            ÖZEL ATÖLYE SERİSİ
          </span>
          <span className="bg-black text-white px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-light">
            1. SINIF DERİ İŞÇİLİĞİ
          </span>
        </div>

        {/* Zoom trigger icon */}
        <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-2 pointer-events-none">
          <div className="w-9 h-9 bg-white/90 backdrop-blur-sm text-black flex items-center justify-center shadow-xs">
            <ZoomIn size={16} />
          </div>
        </div>

        {/* Mobile nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex((activeIndex - 1 + images.length) % images.length)
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm text-black flex items-center justify-center lg:hidden z-10"
              aria-label="Önceki görsel"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex((activeIndex + 1) % images.length)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm text-black flex items-center justify-center lg:hidden z-10"
              aria-label="Sonraki görsel"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Carousel Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 select-none">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'flex flex-col gap-1 p-1 bg-neutral-50 transition-all border text-left',
                index === activeIndex
                  ? 'border-black opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-neutral-300'
              )}
            >
              <div className="aspect-[3/4] w-full bg-neutral-100 overflow-hidden relative">
                <Image
                  src={image.url}
                  alt={image.alt || `Açı ${index + 1}`}
                  fill
                  unoptimized={Boolean(image.url.startsWith('data:'))}
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 120px"
                />
              </div>
              <span className="text-[10px] tracking-wider text-neutral-600 truncate uppercase mt-0.5">
                0{index + 1}. AÇI
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Craftsmanship Accent Strip */}
      <div className="p-4 bg-neutral-100/60 border border-neutral-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-black shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-black">
              SERİ NUMARALI VE İMZALI
            </p>
            <p className="text-[11px] font-light text-neutral-500">
              Her çanta atölyemizde özenle tek tek kontrol edilir ve onaylanır.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-light tracking-[0.2em] uppercase bg-white border border-neutral-200 px-2.5 py-1 shrink-0 text-neutral-700">
          ÖZEL ÜRETİM
        </span>
      </div>
    </div>
  )
}
