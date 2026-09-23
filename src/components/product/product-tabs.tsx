'use client'

import { useState } from 'react'
import { ChevronDown, FileText, CheckCircle, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SpecItem {
  specKey: string
  specValue: string
}

export interface FaqItem {
  question: string
  answer: string
}

interface ProductTabsProps {
  description?: string | null
  specs?: SpecItem[]
  faqs?: FaqItem[]
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'Minimum sipariş adedi (MOQ) ne kadardır?',
    answer:
      'Genellikle ham bez ve fuar çantalarında minimum sipariş 50 veya 100 adettir. Özel üretim sırt ve deri evrak çantalarında 30 adetten başlayan üretim imkanımız bulunmaktadır.',
  },
  {
    question: 'Logolu baskı için hangi dosya formatlarını kabul ediyorsunuz?',
    answer:
      'Vektörel formatlar (AI, EPS, PDF, SVG) en yüksek baskı kalitesini sağlar. Yüksek çözünürlüklü PNG ve JPEG dosyaları da tasarım ekibimiz tarafından incelenip baskıya uygun hale getirilebilir.',
  },
  {
    question: 'Seri üretim öncesi numune veya dijital mockup alabilir miyim?',
    answer:
      'Evet! Talebiniz alındıktan sonra 24 saat içinde logonuzun çanta üzerindeki 3D dijital mockup önizlemesini ücretsiz olarak iletiyoruz. İhtiyaç halinde fiziksel numune gönderimi de organize edilmektedir.',
  },
  {
    question: 'Üretim ve teslimat süresi ortalama kaç gündür?',
    answer:
      'Stoklu ürünlerde baskı ve paketleme 3-5 iş günü; sıfırdan dikim ve özel kumaş üretimlerinde ise adede bağlı olarak 7-12 iş günüdür.',
  },
]

export function ProductTabs({ description, specs = [], faqs = [] }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'faqs'>('desc')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const activeFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS

  return (
    <div className="w-full bg-white border border-neutral-200/80 shadow-2xs mt-12">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-neutral-200">
        <button
          type="button"
          onClick={() => setActiveTab('desc')}
          className={cn(
            'flex-1 py-4 px-4 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-center transition-colors border-b-2 -mb-px',
            activeTab === 'desc'
              ? 'border-black text-black bg-[#faf8f5]'
              : 'border-transparent text-neutral-500 hover:text-black hover:bg-neutral-50'
          )}
        >
          <span className="flex items-center justify-center gap-1.5">
            <FileText size={14} />
            <span>Ürün Açıklaması</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={cn(
            'flex-1 py-4 px-4 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-center transition-colors border-b-2 -mb-px',
            activeTab === 'specs'
              ? 'border-black text-black bg-[#faf8f5]'
              : 'border-transparent text-neutral-500 hover:text-black hover:bg-neutral-50'
          )}
        >
          <span className="flex items-center justify-center gap-1.5">
            <CheckCircle size={14} />
            <span>Ürün Özellikleri</span>
            {specs.length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                {specs.length}
              </span>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={cn(
            'flex-1 py-4 px-4 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-center transition-colors border-b-2 -mb-px',
            activeTab === 'faqs'
              ? 'border-black text-black bg-[#faf8f5]'
              : 'border-transparent text-neutral-500 hover:text-black hover:bg-neutral-50'
          )}
        >
          <span className="flex items-center justify-center gap-1.5">
            <HelpCircle size={14} />
            <span>Sıkça Sorulan Sorular</span>
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8">
        {/* 1. ÜRÜN AÇIKLAMASI */}
        {activeTab === 'desc' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {description ? (
              <div className="text-sm font-light text-neutral-700 leading-relaxed whitespace-pre-line space-y-3">
                {description}
              </div>
            ) : (
              <p className="text-sm font-light text-neutral-400">
                Bu ürün için henüz detaylı serbest metin açıklaması eklenmemiştir.
              </p>
            )}

            <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-4 text-xs font-light text-neutral-500">
              <span>• İsteğe özel kurumsal logo transferi &amp; serigrafi</span>
              <span>• Yüksek mukavemetli takviyeli dikiş yapısı</span>
              <span>• Türkiye içi sigortalı kurumsal sevkiyat</span>
            </div>
          </div>
        )}

        {/* 2. DİNAMİK ÜRÜN ÖZELLİKLERİ TABLOSU */}
        {activeTab === 'specs' && (
          <div className="animate-in fade-in duration-200">
            {specs.length > 0 ? (
              <div className="divide-y divide-neutral-200 border border-neutral-200">
                {specs.map((item, idx) => (
                  <div
                    key={`${item.specKey}-${idx}`}
                    className={cn(
                      'grid grid-cols-1 sm:grid-cols-3 py-3 px-4 text-xs',
                      idx % 2 === 0 ? 'bg-[#faf8f5]' : 'bg-white'
                    )}
                  >
                    <span className="font-medium text-neutral-900 tracking-wider uppercase sm:col-span-1">
                      {item.specKey}
                    </span>
                    <span className="font-light text-neutral-600 sm:col-span-2 mt-1 sm:mt-0">
                      {item.specValue}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-neutral-200 border border-neutral-200">
                {[
                  { key: 'Kumaş / Malzeme', val: 'Birinci sınıf pamuklu kanvas & dayanıklı imperteks dokuma' },
                  { key: 'Ölçüler & Hacim', val: 'Standart ergonomik form (35 x 40 cm / 16 Litre)' },
                  { key: 'Taşıma Kapasitesi', val: '12 - 15 kg taşıma dayanımı' },
                  { key: 'Askı Tipi', val: 'Takviyeli omuz ve el taşıma kulpu' },
                  { key: 'Baskı Seçenekleri', val: 'Serigrafi, DTF Transfer, Nakış veya Kabartma' },
                  { key: 'Minimum Sipariş', val: '50 Adet (Kurumsal Logo Baskılı)' },
                ].map((item, idx) => (
                  <div
                    key={item.key}
                    className={cn(
                      'grid grid-cols-1 sm:grid-cols-3 py-3 px-4 text-xs',
                      idx % 2 === 0 ? 'bg-[#faf8f5]' : 'bg-white'
                    )}
                  >
                    <span className="font-medium text-neutral-900 tracking-wider uppercase sm:col-span-1">
                      {item.key}
                    </span>
                    <span className="font-light text-neutral-600 sm:col-span-2 mt-1 sm:mt-0">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. SIKÇA SORULAN SORULAR */}
        {activeTab === 'faqs' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {activeFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={faq.question}
                  className="border border-neutral-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-4 text-xs sm:text-[13px] font-medium text-neutral-900 hover:text-black transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={15}
                      className={cn('transition-transform duration-200 shrink-0 text-neutral-400', isOpen && 'rotate-180 text-black')}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs font-light text-neutral-600 leading-relaxed border-t border-neutral-100 bg-[#faf8f5]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
