import { Shield, Sparkles, Truck, Palette } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: 'EN UYGUN FİYAT GARANTİSİ',
    description: 'Üreticiden tüketiciye aracısız fiyatlar'
  },
  {
    icon: Sparkles,
    title: 'EN KALİTELİ BASKI',
    description: 'Yüksek çözünürlüklü ve kalıcı baskı teknolojisi'
  },
  {
    icon: Truck,
    title: 'HIZLI & ÜCRETSİZ TESLİMAT',
    description: 'Tüm Türkiye\'ye zamanında teslimat'
  },
  {
    icon: Palette,
    title: 'ÖZEL TASARIM HİZMETİ',
    description: 'Markanıza özel profesyonel tasarım desteği'
  }
]

export function TrustBadges() {
  return (
    <section className="bg-white py-12 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-[#2d6a4f]/10 p-4">
                  <Icon className="h-8 w-8 text-[#2d6a4f]" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{badge.title}</h3>
                <p className="text-sm text-gray-500">{badge.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
