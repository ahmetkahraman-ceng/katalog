'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

export interface ProductExampleItem {
  imageUrl: string
  title?: string | null
}

interface ProductExamplesProps {
  examples?: ProductExampleItem[]
  productName: string
}

// Fallback example photos of bags produced with logos/references
const DEFAULT_EXAMPLES: ProductExampleItem[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    title: 'Örnek Serigrafi Baskı Uygulaması',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    title: 'Kurumsal Etkinlik & Kongre Referansı',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop',
    title: 'Logo Kabartma & Nakış Uygulaması',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    title: 'Özel Kumaş & Astar Tasarımı',
  },
]

export function ProductExamples({ examples = [], productName }: ProductExamplesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const displayExamples = examples && examples.length > 0 ? examples : DEFAULT_EXAMPLES

  return (
    <div className="mt-8 pt-6 border-t border-neutral-200">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 block">
            REFERANS İMALATLAR
          </span>
          <h3 className="text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-neutral-900 mt-0.5">
            ÖRNEK ÇALIŞMALAR &amp; BASKI UYGULAMALARI
          </h3>
        </div>
        <span className="text-[11px] font-light text-neutral-400 hidden sm:inline">
          Daha önce üretilen referans örnekler
        </span>
      </div>

      {/* 4-Item Square Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayExamples.slice(0, 4).map((ex, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(ex.imageUrl)}
            className="group relative aspect-square w-full bg-neutral-100 overflow-hidden border border-neutral-200 cursor-pointer shadow-2xs hover:border-black transition-all"
          >
            <Image
              src={ex.imageUrl}
              alt={ex.title || `${productName} Örnek Çalışma`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <ZoomIn size={18} />
            </div>
            {ex.title && (
              <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] font-light px-1.5 py-0.5 truncate text-center backdrop-blur-2xs">
                {ex.title}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative max-w-2xl w-full aspect-square bg-neutral-900 overflow-hidden shadow-2xl">
            <Image
              src={selectedImage}
              alt="Büyük Örnek Görsel"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
