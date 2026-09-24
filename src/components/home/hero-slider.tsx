'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'PROMOSYON ÇANTA ÇÖZÜMLERİ',
    description: 'Kurumsal kimliğinize uygun, kaliteli ve dayanıklı promosyon çanta üretiminde profesyonel çözümler.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80',
    primaryCta: 'Hemen Teklif Al',
    primaryLink: '/iletisim',
    secondaryCta: 'Ürünleri İncele',
    secondaryLink: '/categories'
  },
  {
    id: 2,
    title: 'TOPTAN BEZ ÇANTA',
    description: '%100 pamuklu, doğa dostu ve markanıza özel baskılı bez çantalar.',
    image: 'https://images.unsplash.com/photo-1597463510526-9f1e1a49f16b?auto=format&fit=crop&q=80',
    primaryCta: 'Bez Çantalar',
    primaryLink: '/categories/bez-canta',
    secondaryCta: 'Fiyat Teklifi',
    secondaryLink: '/iletisim'
  },
  {
    id: 3,
    title: 'FUAR & KONGRE ÇANTALARI',
    description: 'Etkinlikleriniz için prestijli, fonksiyonel ve özel tasarımlı çantalar.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
    primaryCta: 'Koleksiyonu Gör',
    primaryLink: '/categories/fuar-kongre-cantasi',
    secondaryCta: 'İletişim',
    secondaryLink: '/iletisim'
  }
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-60"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative flex h-full items-center justify-center text-center">
            <div className="max-w-3xl px-4 sm:px-6 lg:px-8">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mb-8 text-xl text-gray-200">
                {slide.description}
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                <Link
                  href={slide.primaryLink}
                  className="rounded-md bg-[#2d6a4f] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#1b4332]"
                >
                  {slide.primaryCta}
                </Link>
                <Link
                  href={slide.secondaryLink}
                  className="rounded-md border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/20"
                >
                  {slide.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
