'use client'

import { useState, useEffect } from 'react'
import { X, Search, CheckSquare, Send, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import Link from 'next/link'

interface HowItWorksModalProps {
  isOpen: boolean
  onClose: () => void
}

const STEPS = [
  {
    number: '01',
    title: 'Model ve Kumaşı Seçin',
    description:
      'Geniş toptan çanta kataloğumuzdan ihtiyacınıza en uygun modeli (ham bez, sırt, karton, laptop vb.) ve kumaş türünü inceleyin.',
    icon: Search,
    badge: '1. Adım',
  },
  {
    number: '02',
    title: 'Teklif Listesine Ekleyin',
    description:
      'İlgilendiğiniz çantaları ve tahmini adet miktarını belirleyerek tek tıkla "Teklif Listesine Ekle" butonuna tıklayın.',
    icon: CheckSquare,
    badge: '2. Adım',
  },
  {
    number: '03',
    title: 'Logonuzu İletin & Teklif Alın',
    description:
      'Teklif formunu gönderin; tasarım ve satış ekibimiz 24 saat içinde firmanıza özel toptan fiyat ve ücretsiz baskı önizlemesi (mockup) hazırlasın.',
    icon: Send,
    badge: '3. Adım',
  },
]

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKey)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-[#c5a35a]" />
            <span>Kolay & Hızlı Kurumsal Süreç</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Nasıl Teklif Alabilirim?
          </h2>
          <p className="text-sm text-neutral-200 mt-2 max-w-lg leading-relaxed">
            Sitemiz bir e-ticaret sitesi değildir; kurumsal firmalar için toptan çanta talep ve teklif sistemidir. 3 basit adımda fiyat teklifi alabilirsiniz.
          </p>
        </div>

        {/* Steps List */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-neutral-100 bg-[#faf8f5]/60 hover:bg-[#faf8f5] transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center font-bold text-lg">
                    <Icon size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d6a4f] bg-[#2d6a4f]/10 px-2 py-0.5 rounded-full">
                        {step.badge}
                      </span>
                      <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick FAQ note */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed flex items-center gap-3">
            <span className="font-bold text-amber-700 shrink-0">Bilgi:</span>
            <span>
              Ödeme, sepet veya online kart çekimi yoktur. Teklif talebiniz bize ulaştıktan sonra satış temsilcimiz sizinle irtibata geçer.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/categories/bez-canta"
              onClick={onClose}
              className="flex-1 py-3 px-5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-medium text-sm text-center flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Kataloğu İncele</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href="https://wa.me/905300000000"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-medium text-sm text-center flex items-center justify-center gap-2 transition-colors"
            >
              <WhatsAppIcon size={16} className="text-[#25D366]" />
              <span>WhatsApp ile Sorun</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
