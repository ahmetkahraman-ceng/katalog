'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Menu, Heart, ShoppingBag, ChevronDown, Phone, Clock, HelpCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuote } from '@/context/quote-context'
import { useFavorites } from '@/context/favorites-context'
import { UserDropdown } from '@/components/auth/user-dropdown'
import { MobileMenu } from './mobile-menu'

interface MegaCategory {
  title: string
  slug: string
  description: string
  image: string
  subItems: { label: string; href: string }[]
}

const MEGA_CATEGORIES: MegaCategory[] = [
  {
    title: 'Bez Çanta & Tote',
    slug: 'el-cantasi',
    description: '140g-220g ham pamuk, gabardin ve kanvas kumaş seçenekleri.',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400&auto=format&fit=crop',
    subItems: [
      { label: 'Ham Bez Çanta (140 gr)', href: '/categories/el-cantasi?q=ham-bez' },
      { label: 'Gabardin Bez Çanta', href: '/categories/el-cantasi?q=gabardin' },
      { label: 'Baskılı Tote Çanta', href: '/categories/el-cantasi' },
      { label: 'Lüks Kanvas Çanta', href: '/categories/el-cantasi?q=kanvas' },
    ],
  },
  {
    title: 'Sırt Çantası',
    slug: 'sirt-cantasi',
    description: 'Ergonomik, korumalı laptop bölmeli ve suya dayanıklı modeller.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop',
    subItems: [
      { label: 'Laptop Bölmeli Sırt Çantası', href: '/categories/sirt-cantasi' },
      { label: 'Şehir & Günlük Sırt Çantası', href: '/categories/sirt-cantasi' },
      { label: 'USB Girişli Sırt Çantası', href: '/categories/sirt-cantasi' },
      { label: 'İpli Büzgülü Sırt Çantası', href: '/categories/sirt-cantasi' },
    ],
  },
  {
    title: 'Laptop & Evrak Çantası',
    slug: 'laptop-cantasi',
    description: 'Kurumsal seminer, konferans ve ofis çalışanlarına özel tasarımlar.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop',
    subItems: [
      { label: 'Executive Evrak Çantası', href: '/categories/evrak-cantasi' },
      { label: 'Dolgulu Laptop Kılıf Çanta', href: '/categories/laptop-cantasi' },
      { label: 'Omuz Askılı Seminer Çantası', href: '/categories/laptop-cantasi' },
      { label: 'Hakiki Deri Konferans Çantası', href: '/categories/evrak-cantasi' },
    ],
  },
  {
    title: 'Fuar & Kraft Çanta',
    slug: 'el-cantasi',
    description: 'Etkinlikler ve lüks mağazalar için yüksek adetli ekonomik çözümler.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop',
    subItems: [
      { label: 'Fuar & Kongre Çantaları', href: '/categories/el-cantasi' },
      { label: 'Karton Mağaza Çantası', href: '/categories/el-cantasi' },
      { label: 'Büküm Saplı Kraft Çanta', href: '/categories/el-cantasi' },
      { label: 'Tela & Nonwoven Çanta', href: '/categories/el-cantasi' },
    ],
  },
]

const POPULAR_SEARCH_TAGS = ['Ham Bez', 'Sırt Çantası', 'Laptop', 'Fuar Çantası', 'Karton Poşet', 'Deri Evrak']

export function Header() {
  const router = useRouter()
  const { items: quoteItems, openDrawer } = useQuote()
  const { favorites } = useFavorites()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [announcement, setAnnouncement] = useState<{
    enabled: boolean
    text: string
    link?: string
  }>({
    enabled: true,
    text: '2026 Koleksiyonu Kurumsal & Toptan Siparişler Açıldı • Numune ve Dijital Önizleme İçin Teklif Alın',
    link: '/inquiry',
  })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    setIsSearchFocused(false)
  }

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag)
    router.push(`/search?q=${encodeURIComponent(tag)}`)
    setIsSearchFocused(false)
  }

  const handleMouseEnterMega = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
    setIsMegaMenuOpen(true)
  }

  const handleMouseLeaveMega = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false)
    }, 200)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white border-b border-neutral-200/80',
          isScrolled ? 'shadow-xs' : ''
        )}
      >
        {/* Dynamic Top Announcement Bar */}
        {announcement.enabled && announcement.text && (
          <div className="w-full bg-[#1c1917] text-white py-1.5 px-4 text-center">
            {announcement.link ? (
              <Link
                href={announcement.link}
                className="text-[10px] sm:text-[11px] font-light tracking-[0.2em] uppercase hover:underline inline-block text-neutral-200"
              >
                {announcement.text}
              </Link>
            ) : (
              <p className="text-[10px] sm:text-[11px] font-light tracking-[0.2em] uppercase text-neutral-200">
                {announcement.text}
              </p>
            )}
          </div>
        )}

        {/* Top Info Bar (B2B Quick Info: WhatsApp, Hours, How to get quote) */}
        <div className="hidden lg:flex items-center justify-between border-b border-neutral-100 px-6 sm:px-12 py-1.5 text-[11px] font-light text-neutral-500 bg-[#faf8f5]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-neutral-700" />
              <span>Hızlı Teklif Hattı:</span>
              <a
                href="https://wa.me/905300000000"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-neutral-800 hover:text-black hover:underline"
              >
                +90 (530) 000 00 00
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Clock size={12} />
              <span>Hafta içi 09:00 - 18:00</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/#nasil-calisir"
              className="flex items-center gap-1 text-neutral-600 hover:text-black transition-colors"
            >
              <HelpCircle size={12} />
              <span>Nasıl Teklif Alırım?</span>
            </Link>
            <span className="text-neutral-300">|</span>
            <Link href="/admin" className="text-neutral-400 hover:text-black transition-colors">
              Atölye Yönetimi
            </Link>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-800 hover:text-black"
              aria-label="Menüyü Aç"
            >
              <Menu size={22} />
            </button>

            {/* Brand Logo (Zara / H&M Editorial Style) */}
            <div className="flex items-baseline gap-2">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-light tracking-[0.35em] uppercase text-black hover:opacity-80 transition-opacity"
              >
                ÇANTA
              </Link>
              <span className="hidden sm:inline-block text-[10px] font-extralight tracking-widest uppercase text-neutral-400 border-l border-neutral-300 pl-2">
                ATELIER &amp; B2B
              </span>
            </div>

            {/* Center: Prominent Search Input with Tag Chips */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 flex-col relative">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Kumaş türü (ham bez, kanvas, gabardin) veya model ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full pl-9 pr-8 py-2 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-400 text-xs font-light text-neutral-800 focus:outline-hidden transition-all placeholder:text-neutral-400"
                />
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {/* Sık Arananlar (Chip Etiketleri) */}
              <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-neutral-400 font-light tracking-wider shrink-0">
                  Sık Aranan:
                </span>
                {POPULAR_SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="text-[10px] font-light text-neutral-500 hover:text-black hover:bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200/70 transition-colors shrink-0 whitespace-nowrap"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Actions: Favorites, Quote List Icon (sepet yerine), Teklif İste CTA */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Favorites (Kalp) */}
              <Link
                href="/favorites"
                className="relative p-2 text-neutral-700 hover:text-black transition-colors"
                title="Favorilerim"
              >
                <Heart size={20} className={favorites.length > 0 ? 'fill-neutral-900 text-neutral-900' : ''} />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Teklif Listesi Button (Matching Image 2 with orange count badge) */}
              <button
                onClick={openDrawer}
                className="relative flex items-center gap-2.5 px-4 py-2.5 bg-[#2ba366] hover:bg-[#238a55] text-white rounded-xl transition-all shadow-2xs font-medium text-xs sm:text-[13px]"
                title="Teklif Listesi"
              >
                <div className="relative">
                  <ShoppingBag size={18} />
                  <span className="absolute -top-2 -left-2 w-4 h-4 bg-[#f59e0b] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {quoteItems.length}
                  </span>
                </div>
                <span className="tracking-wide">Teklif Listesi</span>
              </button>

              {/* User Dropdown Button (Matching Image 2 positioned right of Teklif Listesi) */}
              <UserDropdown />
            </div>
          </div>
        </div>

        {/* Lower Mega-Menu Navigation Bar (Desktop) */}
        <div className="hidden lg:block border-t border-neutral-100 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
            <nav className="flex items-center space-x-8">
              {/* Mega Menu Trigger */}
              <div
                onMouseEnter={handleMouseEnterMega}
                onMouseLeave={handleMouseLeaveMega}
                className="relative py-3"
              >
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-1.5 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors',
                    isMegaMenuOpen ? 'text-black' : 'text-neutral-700 hover:text-black'
                  )}
                >
                  <span>TÜM ÇANTA MODELLERİ</span>
                  <ChevronDown
                    size={13}
                    className={cn('transition-transform duration-200', isMegaMenuOpen && 'rotate-180')}
                  />
                </button>

                {/* Mega Menu Dropdown Panel */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 w-[920px] bg-white border border-neutral-200 shadow-xl p-8 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {MEGA_CATEGORIES.map((cat) => (
                      <div key={cat.title} className="flex flex-col space-y-3">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden block group"
                        >
                          <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="200px"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        </Link>

                        <div>
                          <Link
                            href={`/categories/${cat.slug}`}
                            className="text-xs font-medium tracking-wider uppercase text-black hover:underline"
                          >
                            {cat.title}
                          </Link>
                          <p className="text-[11px] text-neutral-400 font-light mt-1 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        <ul className="space-y-1.5 pt-2 border-t border-neutral-100">
                          {cat.subItems.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                className="text-[11px] font-light text-neutral-600 hover:text-black hover:translate-x-0.5 transition-all block"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Links */}
              <Link
                href="/categories/el-cantasi"
                className="py-3 text-[11px] font-light tracking-[0.2em] uppercase text-neutral-600 hover:text-black transition-colors"
              >
                Ham Bez Çanta
              </Link>
              <Link
                href="/categories/sirt-cantasi"
                className="py-3 text-[11px] font-light tracking-[0.2em] uppercase text-neutral-600 hover:text-black transition-colors"
              >
                Sırt Çantası
              </Link>
              <Link
                href="/categories/laptop-cantasi"
                className="py-3 text-[11px] font-light tracking-[0.2em] uppercase text-neutral-600 hover:text-black transition-colors"
              >
                Laptop &amp; Evrak
              </Link>
              <Link
                href="/categories/evrak-cantasi"
                className="py-3 text-[11px] font-light tracking-[0.2em] uppercase text-neutral-600 hover:text-black transition-colors"
              >
                Kongre &amp; Fuar
              </Link>
              <Link
                href="/#nasil-calisir"
                className="py-3 text-[11px] font-light tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors ml-auto"
              >
                Nasıl Teklif Alırım?
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={[
          { href: '/categories/el-cantasi', label: 'Ham Bez Çantalar' },
          { href: '/categories/sirt-cantasi', label: 'Sırt Çantaları' },
          { href: '/categories/laptop-cantasi', label: 'Laptop & Tablet Çantaları' },
          { href: '/categories/evrak-cantasi', label: 'Evrak & Kongre Çantaları' },
          { href: '/favorites', label: 'Favorilerim' },
          { href: '/inquiry', label: 'Teklif Talebi Gönder' },
        ]}
      />
    </>
  )
}
