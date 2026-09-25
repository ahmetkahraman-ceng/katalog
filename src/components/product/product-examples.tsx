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
  return null
}
