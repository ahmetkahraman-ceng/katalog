import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    code: 'SİLÜET 01',
    name: 'El Çantası',
    slug: 'el-cantasi',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA014272hXDPKj45B5Gd_vtgxdkmAm4KBbNDkT7N8QBL7amy_Wuuba7C5WbyhFpshAUZoN6OtjwERZDuqnlj9Kz_RExbz8YkRtlnvP3F8_MTMEbE0hpAFCT6ITu4M4vn4NOx8b3krvdu4CdQWKyqdImZjzh1U0oIoOE4-fDjcUke3oa0BxoULE2QmosMwZwgZqOXDvnhFei6kvEPWFBwqzpFuHzhWxJVY1hrqWIIQYSzonTYm62InIahA',
  },
  {
    code: 'SİLÜET 02',
    name: 'Sırt Çantası',
    slug: 'sirt-cantasi',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBc42zgdRbVDWGeCzOXVsg_oCEMXOuU9fGciNKIOeifSGmufHS1ZFWg3_u7Ee-dDd63UaGIIC7Kkh7iq_pg62xltJt5nDCFh8pwEdS-tGj4hgyfLnlbrqP1qdUyQvP7D_bywIVbqN3k81E60PTPwtlmme0rG7_SXDvTEPsN4EAvteB9_SKl4gpzcK1gcezmS15_OY-dTAHl86hOeX1eGPPgvPBXMxSgbO13nKtquScn1S_44aKPm1yp1w',
  },
  {
    code: 'SİLÜET 03',
    name: 'Laptop Çantası',
    slug: 'laptop-cantasi',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFcFePPm0r4YpStKPBJ4ySizTtGQu60uABXlhTA2oRwKKhR82-Sgdbu-odQruRSp3uYL72mAWzzR1W4YUDbUzZ8oYHyAxlKqsHNpanQEfJdRtv3-dZcWD-MgD9OZ3LiiFwLTOMAd27LqYb-IIODj12RInhE8WA6BjkOswgOYWxu6UXfCir1eYUg_tV0Fyytm0LKNMA814TBzz7DmXuXQaT1TnZa9zufqaBkQi8Cew1WGDFU3DCMok3ow',
  },
  {
    code: 'SİLÜET 04',
    name: 'Evrak Çantası',
    slug: 'evrak-cantasi',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9slav8C3A0LFvNtDcx2Yp7OqM_1KQoYUO-V75OPoPs6-kSCvevKBS5JaO-xhVEOR2xxZPgyCCMlCunZVw5NAbh_2FddJGRZ1DtZNWhqjCsZeEoRvbxX0Wamkt-4R1uEemxkkq5OQFmzFeSqKl4ZX4ySDpUYJvZglBqepCKFWtPXC95oVggk_llkip1BHU4ovnYDeiU4N06AU7naXxpdZ-PspnAI1xaGCN65kWbOW99-1quDrRHWzmoA',
  },
]

export function CategoryCards() {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
      {/* Editorial Category Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-light tracking-[0.25em] uppercase text-neutral-400">
            01 / DİSİPLİNLER
          </span>
          <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] uppercase text-black mt-1">
            KATEGORİLER
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-light text-neutral-500 max-w-md mt-2 md:mt-0 leading-relaxed">
          Mimari form dili ve katı minimalizmle tasarlanan dört ana atölye silüeti.
        </p>
      </div>

      {/* 4 Cards Bento Grid (3:4 ratio) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 flex flex-col justify-end p-6"
          >
            {/* Background Image */}
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[10px] font-light tracking-[0.25em] uppercase text-neutral-300">
                {category.code}
              </span>
              <h3 className="text-base sm:text-lg font-light tracking-[0.15em] uppercase text-white">
                {category.name}
              </h3>
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-[10px] font-light tracking-widest uppercase text-white/90">
                  İNCELE
                </span>
                <ArrowRight
                  size={14}
                  className="text-white transform group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
