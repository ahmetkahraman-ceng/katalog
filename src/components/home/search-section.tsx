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
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <section className="relative -mt-12 sm:-mt-14 z-20 mx-auto max-w-5xl px-4 sm:px-6">
      <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-xl border border-neutral-200/90">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Model, kumaş türü (kanvas, gabardin, imperteks) veya çanta ara..."
              className="block w-full rounded-2xl border border-neutral-200 py-3.5 pl-12 pr-4 text-neutral-900 placeholder:text-neutral-400 focus:border-[#2d6a4f] focus:outline-hidden focus:ring-2 focus:ring-[#2d6a4f]/20 text-sm sm:text-base bg-neutral-50 hover:bg-white focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center rounded-2xl bg-[#2d6a4f] hover:bg-[#1b4332] px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all active:scale-95 shrink-0"
          >
            Model Ara
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Popüler Aramalar:
          </span>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="rounded-full bg-neutral-100/90 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-[#2d6a4f] hover:text-white transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
