import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 'bez-canta',
    name: 'Bez Çanta',
    slug: 'bez-canta',
    image: 'https://images.unsplash.com/photo-1597463510526-9f1e1a49f16b?auto=format&fit=crop&q=80'
  },
  {
    id: 'sirt-cantasi',
    name: 'Sırt Çantası',
    slug: 'sirt-cantasi',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80'
  },
  {
    id: 'karton-canta',
    name: 'Karton Çanta',
    slug: 'karton-canta',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80'
  },
  {
    id: 'laptop-cantasi',
    name: 'Laptop Çantası',
    slug: 'laptop-cantasi',
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&q=80'
  },
  {
    id: 'fuar-kongre-cantasi',
    name: 'Fuar & Kongre Çantası',
    slug: 'fuar-kongre-cantasi',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80'
  },
  {
    id: 'deri-canta',
    name: 'Deri Çanta',
    slug: 'deri-canta',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80'
  },
  {
    id: 'spor-cantasi',
    name: 'Spor Çantası',
    slug: 'spor-cantasi',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80'
  }
]

export function CategoryCards() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">KATEGORİLER</h2>
          <div className="mt-4 h-1 w-20 bg-[#c5a35a] mx-auto rounded"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-gray-100"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
                <h3 className="text-lg font-bold text-white sm:text-xl group-hover:text-[#c5a35a] transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
