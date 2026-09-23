import { Compass, ShoppingBag, FileText, Clock, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    icon: Compass,
    title: 'Ürünleri Keşfet',
    description: 'Ham bez, sırt, laptop ve fuar çantası modellerimiz arasından ihtiyacınıza uygun olanı seçin.',
  },
  {
    step: '02',
    icon: ShoppingBag,
    title: 'Teklif Listesine Ekle',
    description: 'İlgilendiğiniz modelleri tek tıkla teklif listenize ekleyerek tahmini adetlerinizi belirleyin.',
  },
  {
    step: '03',
    icon: FileText,
    title: 'Formu Doldur',
    description: 'Logo baskı tercihinizi ve kurumsal iletişim bilgilerinizi içeren talep formunu iletin.',
  },
  {
    step: '04',
    icon: Clock,
    title: '24 Saatte Dönüş Al',
    description: 'Uzman müşteri temsilcimiz 24 saat içinde resmi teklif mektubu ve ücretsiz dijital önizleme ile dönsün.',
  },
]

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="w-full bg-[#f6f4ee] py-16 lg:py-24 border-y border-neutral-200/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] font-light tracking-[0.25em] uppercase text-neutral-500">
              KOLAY VE ŞEFFAF SÜREÇ
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] uppercase text-black mt-1">
              NASIL TEKLİF ALIRIM?
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-light text-neutral-500 max-w-md mt-2 md:mt-0 leading-relaxed">
            Sepet, ödeme veya checkout adımlarıyla vakit kaybetmeyin. 4 basit adımda kurumsal toptan çanta teklifinizi oluşturun.
          </p>
        </div>

        {/* 4 Steps Horizontal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, index) => {
            const Icon = s.icon
            return (
              <div
                key={s.step}
                className="relative bg-white p-7 border border-neutral-200/80 shadow-2xs hover:border-black transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono text-neutral-400 group-hover:text-black transition-colors font-medium">
                      ADIM {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#f4f2ee] flex items-center justify-center text-neutral-700 group-hover:bg-black group-hover:text-white transition-all">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="text-sm font-medium tracking-wider uppercase text-neutral-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-neutral-400">
                    <ArrowRight size={11} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
