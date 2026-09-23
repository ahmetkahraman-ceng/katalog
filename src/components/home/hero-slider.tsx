'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const slides = [
  {
    id: 1,
    subtitle: 'YENİ KOLEKSİYON • LIMITED RUN',
    title: '2025 SONBAHAR / KIŞ',
    description: 'Zamana meydan okuyan hakiki İtalyan dana derisi ve zanaatkâr el işçiliğinin mimari birlikteliği.',
    cta: 'KOLEKSİYONU KEŞFET',
    secondaryCta: 'ÖZEL ATÖLYE TEKLİFİ',
    href: '/categories/el-cantasi',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ5pQ3MkUNKLQ8ToAHl-9Kp0tC-KKvwFf9dPvnB8HL-tzR2XFQC-bBt5HArzWMTUED8aGP6vSK52dMxOXOnVVzRHKz-VY_SBoUtIEwOy8nVUjOf65VCBfXJugVW9xn2hfJywq5xIL_fEEI1HAP68E7vtQBV53wI6O0EaX933LHSsK4x6fzjfrtsp8vnkzfjgDfBla5PwuKzMos9E8ZIspmfHiEPNk6DW9Hi9IGJ3eOC7qWf9IBe2a6JQ',
  },
  {
    id: 2,
    subtitle: 'MİMARİ FORMLAR • SIRTLIK ARŞİVİ',
    title: 'FONKSİYONEL SİLÜETLER',
    description: 'Şehir yaşamı ve modern mobilite için tasarlanan minimalist deri sırt çantası koleksiyonu.',
    cta: 'SIRT ÇANTALARI',
    secondaryCta: 'TEKLİF AL',
    href: '/categories/sirt-cantasi',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkUAog-7HxagmQWR8K_BrWPWD22H-mmwLv7h0J6-9PKWHadPhYE9Pa6CPwAxQIPp6n060FJv0oSNa2fPEqkHjj3HhnxHBRB1zrYmPTx0huK8FZpLkxRn7QU1AQA55c4z1vLuEdanyITCjB60yO0J8CyJvQl6pseDbeIBjY8af93aeo4Jp8rJoNdUBjHGKsxOiZc9tSKoqNLuV8uSvybKXey58YHNNOyYewycZOKNXgDIbyTRsf7TWkwA',
  },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent(index)
      setTimeout(() => setIsTransitioning(false), 700)
    },
    [isTransitioning]
  )

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  useEffect(() => {
    const timer = setInterval(goNext, 6000)
    return () => clearInterval(timer)
  }, [goNext])

  return (
    <section className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[90vh] overflow-hidden bg-black text-white">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-out',
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center brightness-[0.85]"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>

          {/* Editorial Content Overlay */}
          <div className="relative h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 flex flex-col justify-end">
            <div className="max-w-2xl flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                <span className="text-[10px] sm:text-xs font-light tracking-[0.25em] uppercase text-neutral-300">
                  {slide.subtitle}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extralight tracking-[0.1em] uppercase text-white leading-[1.05]">
                {slide.title}
              </h1>

              <p className="text-xs sm:text-sm font-light text-neutral-300 max-w-lg leading-relaxed pt-1">
                {slide.description}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={slide.href}
                  className="px-6 sm:px-8 py-3.5 bg-transparent border border-white text-white text-xs font-light tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
                >
                  {slide.cta}
                </Link>
                <Link
                  href="/inquiry"
                  className="px-6 py-3.5 bg-white text-black text-xs font-light tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
                >
                  {slide.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all hidden sm:flex z-10"
        aria-label="Önceki Slayt"
      >
        <ChevronLeft size={22} strokeWidth={1.5} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all hidden sm:flex z-10"
        aria-label="Sonraki Slayt"
      >
        <ChevronRight size={22} strokeWidth={1.5} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-6 lg:right-12 z-10 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              'h-1 transition-all duration-300',
              index === current ? 'w-10 bg-white' : 'w-4 bg-white/40 hover:bg-white/70'
            )}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
