import { ShieldCheck, Sparkles, Truck, Palette } from 'lucide-react'

const badges = [
  {
    icon: ShieldCheck,
    title: 'EN İYİ FİYAT GARANTİSİ',
    description: 'Üreticiden doğrudan aracısız kurumsal toptan fiyatlandırma.',
  },
  {
    icon: Sparkles,
    title: 'ÜCRETSİZ LOGO MOCKUP',
    description: 'Teklif öncesi logonuzla hazırlanan ücretsiz dijital baskı örneği.',
  },
  {
    icon: Truck,
    title: 'HIZLI & GÜVENİLİR TESLİMAT',
    description: 'Tüm Türkiye genelinde zamanında ve güvenli kargo/ambar teslimatı.',
  },
  {
    icon: Palette,
    title: 'ÖZEL TASARIM & KUMAŞ',
    description: 'İsteğinize özel kumaş, ebat, renk ve yüksek kaliteli baskı seçenekleri.',
  },
]

export function TrustBadges() {
  return (
    <section className="bg-white py-12 border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf8f5]/60 hover:bg-[#faf8f5] border border-neutral-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-900 mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {badge.description}
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
