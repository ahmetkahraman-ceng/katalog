import { Zap, ShieldCheck, Award, Eye } from 'lucide-react'

const BADGES = [
  {
    icon: Zap,
    title: 'HIZLI DÖNÜŞ',
    description: 'Tüm teklif ve numune taleplerine 24 saat içinde yanıt',
  },
  {
    icon: Award,
    title: 'KALİTELİ MALZEME',
    description: 'Birinci sınıf kumaş, dayanıklı dikiş ve yüksek çözünürlüklü baskı',
  },
  {
    icon: ShieldCheck,
    title: 'GÜVENİLİR FİRMA',
    description: 'Yılların atölye tecrübesi ve kurumsal referans portföyü',
  },
  {
    icon: Eye,
    title: 'ÜCRETSİZ MOCK-UP',
    description: 'Seri üretim öncesi logonuzla hazırlanmış 3D dijital numune',
  },
]

export function TrustBadges() {
  return (
    <section className="w-full bg-white border-y border-neutral-200 py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {BADGES.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#f4f2ee] flex items-center justify-center text-neutral-800 shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-neutral-900">
                    {b.title}
                  </h4>
                  <p className="text-[11px] font-light text-neutral-500 mt-0.5 leading-snug">
                    {b.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
