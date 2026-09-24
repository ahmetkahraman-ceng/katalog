'use client'

import { useState } from 'react'
import { Search, ShoppingBag, FileText, CheckCircle2, ArrowRight } from 'lucide-react'
import { HowItWorksModal } from '@/components/common/how-it-works-modal'
import Link from 'next/link'

const steps = [
  {
    step: '01',
    title: 'Model ve Kumaşı Seçin',
    description: 'Ham bez, sırt çantası, evrak veya karton çantalar arasından ihtiyacınıza uygun modeli belirleyin.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Teklif Listesine Ekleyin',
    description: 'İlgilendiğiniz modellerin adet miktarını ve renklerini seçip "Teklif Listesine Ekle" butonuna basın.',
    icon: ShoppingBag,
  },
  {
    step: '03',
    title: 'Talebinizi İletin',
    description: 'Firma bilgilerinizi ve varsa logonuzu ekleyerek teklif formunu tek tıkla bize gönderin.',
    icon: FileText,
  },
  {
    step: '04',
    title: '24 Saatte Fiyat & Mockup',
    description: 'Uzman müşteri temsilcimiz 24 saat içinde firmanıza özel toptan fiyat ve dijital önizleme hazırlasın.',
    icon: CheckCircle2,
  },
]

export function HowItWorks() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section id="nasil-calisir" className="bg-[#faf8f5] py-16 sm:py-24 border-t border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2d6a4f] bg-[#2d6a4f]/10 px-3 py-1 rounded-full inline-block mb-3">
              Kurumsal Süreç Rehberi
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Nasıl Teklif Alabilirsiniz?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Ödeme ve sepet süreci yok. Firmanız için en uygun toptan çanta teklifini 4 kolay adımda alın.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={item.step}
                  className="relative bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <span className="text-2xl font-black text-neutral-200">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-neutral-200 text-neutral-400 flex items-center justify-center">
                      <ArrowRight size={12} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Info Banner */}
          <div className="mt-12 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h4 className="text-base font-bold text-neutral-900">
                Aklınıza takılan sorular mı var?
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Doğrudan müşteri temsilcimizle WhatsApp üzerinden görüşebilir veya detaylı rehberi açabilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs sm:text-sm font-semibold transition-colors"
              >
                Rehberi Aç
              </button>

              <Link
                href="/categories/bez-canta"
                className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                Hemen Ürünleri İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
