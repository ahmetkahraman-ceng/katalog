import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const categories = [
  {
    id: 'bez-canta',
    name: 'Bez Çanta',
    slug: 'bez-canta',
    subtitle: 'Ham Bez, Kanvas & Gabardin',
    description: 'Çevre dostu, fuar ve kurumsal etkinlikler için baskılı bez çantalar.',
    image: 'https://images.unsplash.com/photo-1597463510526-9f1e1a49f16b?auto=format&fit=crop&q=80',
    count: '12+ Model',
  },
  {
    id: 'sirt-cantasi',
    name: 'Sırt Çantası',
    slug: 'sirt-cantasi',
    subtitle: 'Ergonomik & Suya Dayanıklı',
    description: 'Laptop bölmeli kurumsal şirket çalışanları ve promosyon için sırt çantaları.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
    count: '8+ Model',
  },
  {
    id: 'karton-canta',
    name: 'Karton Çanta',
    slug: 'karton-canta',
    subtitle: 'Kraft & Kuşe Karton',
    description: 'Perakende mağazaları, butikler ve prestijli hediye paketlemeleri için.',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80',
    count: '10+ Model',
  },
  {
    id: 'laptop-cantasi',
    name: 'Laptop Çantası',
    slug: 'laptop-cantasi',
    subtitle: '13"-16" Korumalı Bölmeli',
    description: 'Ofis ve iş seyahatleri için darbe emici süngerli evrak ve laptop çantaları.',
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&q=80',
    count: '6+ Model',
  },
  {
    id: 'fuar-kongre-cantasi',
    name: 'Fuar & Kongre Çantası',
    slug: 'fuar-kongre-cantasi',
    subtitle: 'Seminer & Konferans',
    description: 'Etkinlik ve organizasyonlar için ekonomik ve prestijli omuz askılı çantalar.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80',
    count: '9+ Model',
  },
  {
    id: 'deri-canta',
    name: 'Deri Çanta',
    slug: 'deri-canta',
    subtitle: 'Hakiki & Suni Deri',
    description: 'Yönetici hediyelikleri ve VIP kurumsal çözümler için özel üretim.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80',
    count: '5+ Model',
  },
  {
    id: 'spor-cantasi',
    name: 'Spor & Seyahat Çantası',
    slug: 'spor-cantasi',
    subtitle: 'Geniş Hacimli & Dayanıklı',
    description: 'Spor kulüpleri, spor salonları ve çalışan seyahatleri için silindir çantalar.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
    count: '7+ Model',
  },
]

export function CategoryCards() {
  return (
    <section className="bg-neutral-50/60 py-16 sm:py-20 border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2d6a4f] mb-1">
              <Sparkles size={14} />
              <span>Toptan Üretim Grupları</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              ÇANTA KATEGORİLERİ
            </h2>
          </div>
          <Link
            href="/categories/bez-canta"
            className="text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332] inline-flex items-center gap-1 transition-colors"
          >
            <span>Tüm Kategorileri İncele</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Categories Grid (Promozone card-type-2 style) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative bg-white border border-neutral-200/90 hover:border-[#2d6a4f]/50 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  {category.count}
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-[#2d6a4f] uppercase tracking-wider block mb-1">
                    {category.subtitle}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-[#2d6a4f] transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800 group-hover:text-[#2d6a4f] transition-colors">
                  <span>Modelleri Gör</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
