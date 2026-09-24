'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react'
import { HowItWorksModal } from '@/components/common/how-it-works-modal'

const slides = [
  {
    id: 1,
    badge: 'KURUMSAL & PROMOSYON ÇÖZÜMLERİ',
    title: 'Markanızı Taşıyan Kaliteli Toptan Çantalar',
    description:
      'Fuar, kongre, şirket içi etkinlikler ve müşteri hediyeleriniz için firmanızın logosuna özel toptan çanta üretimi.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80',
    primaryCta: 'Kataloğu Keşfet',
    primaryLink: '/categories/bez-canta',
  },
  {
    id: 2,
    badge: 'DOĞA DOSTU %100 PAMUK',
    title: 'Baskılı Ham Bez ve Kanvas Çantalar',
    description:
      'Geri dönüştürülebilir, doğa dostu kumaşlardan firmanızın kurumsal renklerinde ve ebatlarında özel üretim.',
    image: 'https://images.unsplash.com/photo-1597463510526-9f1e1a49f16b?auto=format&fit=crop&q=80',
    primaryCta: 'Bez Çantaları Gör',
    primaryLink: '/categories/bez-canta',
  },
  {
    id: 3,
    badge: 'ETKİNLİK & SEMİNER ÇANTALARI',
    title: 'Fuar, Kongre ve Konferans Çantaları',
    description:
      'Dayanıklı kumaşlar, fonksiyonel bölmeler ve yüksek kaliteli serigrafi / transfer baskı teknolojisi.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
    primaryCta: 'Koleksiyonu İncele',
    primaryLink: '/categories/fuar-kongre-cantasi',
  },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <>
      <div className="relative h-[520px] sm:h-[580px] lg:h-[620px] w-full overflow-hidden bg-neutral-900">
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
                className="object-cover opacity-45 scale-105 transition-transform duration-[8000ms]"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
            </div>

            <div className="relative max-w-[1440px] mx-auto h-full flex items-center px-6 sm:px-12 lg:px-16">
              <div className="max-w-2xl text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2d6a4f]/80 text-white text-xs font-semibold uppercase tracking-wider mb-4 border border-[#2d6a4f]">
                  <span>{slide.badge}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight mb-4">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base text-neutral-200 mb-6 leading-relaxed max-w-xl">
                  {slide.description}
                </p>

                {/* Value Props Bullet Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-neutral-300 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#25D366] shrink-0" />
                    <span>24 Saatte Hızlı Fiyat Teklifi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#25D366] shrink-0" />
                    <span>Ücretsiz Logo Mockup Önizleme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#25D366] shrink-0" />
                    <span>Üreticiden Doğrudan Toptan Fiyat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#25D366] shrink-0" />
                    <span>Tüm Türkiye&apos;ye Hızlı Teslimat</span>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.primaryLink}
                    className="rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] px-6 py-3.5 text-sm font-semibold text-white transition-all shadow-md flex items-center gap-2 active:scale-95"
                  >
                    <span>{slide.primaryCta}</span>
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-xl border border-white/40 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-xs px-5 py-3.5 text-sm font-semibold text-white transition-all flex items-center gap-2"
                  >
                    <HelpCircle size={16} />
                    <span>Nasıl Teklif Alırım?</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-xs p-2.5 text-white transition-colors"
          aria-label="Önceki Slayt"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-xs p-2.5 text-white transition-colors"
          aria-label="Sonraki Slayt"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === current ? 'w-8 bg-[#2d6a4f]' : 'w-2.5 bg-white/50'
              }`}
              aria-label={`Slayt ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
