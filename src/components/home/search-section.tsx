'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'

const categories = [
  { name: 'Bez Çanta', slug: 'bez-canta' },
  { name: 'Sırt Çantası', slug: 'sirt-cantasi' },
  { name: 'Karton Çanta', slug: 'karton-canta' },
  { name: 'Laptop Çantası', slug: 'laptop-cantasi' },
  { name: 'Fuar & Kongre', slug: 'fuar-kongre-cantasi' },
  { name: 'Deri Çanta', slug: 'deri-canta' },
  { name: 'Spor Çantası', slug: 'spor-cantasi' },
]

export function SearchSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <section className="relative -mt-10 z-10 mx-auto max-w-5xl px-4">
      <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5 sm:p-8">
        <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Çanta modeli, rengi veya kullanım alanı arayın..."
              className="block w-full rounded-xl border-0 py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#2d6a4f] sm:text-lg sm:leading-6"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-[#2d6a4f] px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#1b4332] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6a4f]"
          >
            Ara
          </button>
        </form>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Popüler Aramalar:</span>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-[#2d6a4f] hover:text-white transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
