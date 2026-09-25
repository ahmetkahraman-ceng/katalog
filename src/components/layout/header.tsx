'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Menu, Heart, ShoppingBag, ChevronDown, Clock, HelpCircle, X, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { cn } from '@/lib/utils'
import { useQuote } from '@/context/quote-context'
import { useFavorites } from '@/context/favorites-context'
import { UserDropdown } from '@/components/auth/user-dropdown'
import { MobileMenu } from './mobile-menu'
import { HowItWorksModal } from '@/components/common/how-it-works-modal'

interface MegaCategory {
  title: string
  slug: string
  description: string
  image: string
  subItems: { label: string; href: string }[]
}

const MEGA_CATEGORIES: MegaCategory[] = [
  {
    title: 'Bez Çanta',
    slug: 'bez-canta',
    description: 'Doğa dostu, fuar ve etkinlikler için promosyon bez çantalar.',
    image: '/products/bez-canta-kategori.jpg',
    subItems: [
      { label: 'Ham Bez Çanta', href: '/categories/bez-canta' },
      { label: 'Kanvas Çanta', href: '/categories/bez-canta' },
      { label: 'Gabardin Çanta', href: '/categories/bez-canta' },
    ],
  },
  {
    title: 'Sırt Çantası',
    slug: 'sirt-cantasi',
    description: 'Ergonomik, korumalı laptop bölmeli ve suya dayanıklı modeller.',
    image: '/products/sirt-canta-antrasit-laptop.png',
    subItems: [
      { label: 'Kurumsal Sırt Çantası', href: '/categories/sirt-cantasi' },
      { label: 'Promosyon Sırt Çantası', href: '/categories/sirt-cantasi' },
    ],
  },
  {
    title: 'Karton Çanta',
    slug: 'karton-canta',
    description: 'Mağazalar ve kurumsal hediyeler için baskılı karton çantalar.',
    image: '/products/karton-canta-kategori.jpg',
    subItems: [
      { label: 'Kraft Karton Çanta', href: '/categories/karton-canta' },
      { label: 'Kuşe Karton Çanta', href: '/categories/karton-canta' },
    ],
  },
  {
    title: 'Laptop Çantası',
    slug: 'laptop-cantasi',
    description: 'Kurumsal seminer, konferans ve ofis çalışanlarına özel tasarımlar.',
    image: '/products/laptop-cantasi-kategori.jpg',
    subItems: [
      { label: '13-14 inç Laptop Çantası', href: '/categories/laptop-cantasi' },
      { label: '15.6 inç Laptop Çantası', href: '/categories/laptop-cantasi' },
    ],
  },
  {
    title: 'Fuar & Kongre Çantası',
    slug: 'fuar-kongre-cantasi',
    description: 'Etkinlikleriniz için ekonomik ve prestijli çözümler.',
    image: '/products/fuar-kongre-cantasi-kategori.jpg',
    subItems: [
      { label: 'Seminer Çantası', href: '/categories/fuar-kongre-cantasi' },
      { label: 'Evrak Çantası', href: '/categories/fuar-kongre-cantasi' },
    ],
  },
  {
    title: 'Deri Çanta',
    slug: 'deri-canta',
    description: 'Yönetici ve VIP hediyelik hakiki ve suni deri çanta modelleri.',
    image: '/products/laptop-cantasi-kategori.jpg',
    subItems: [
      { label: 'Hakiki Deri Çanta', href: '/categories/deri-canta' },
      { label: 'Suni Deri Çanta', href: '/categories/deri-canta' },
    ],
  },
  {
    title: 'Spor Çantası',
    slug: 'spor-cantasi',
    description: 'Spor salonları, takımlar ve kulüpler için geniş hacimli çantalar.',
    image: '/products/spor-cantasi-kategori.jpg',
    subItems: [
      { label: 'Silindir Spor Çantası', href: '/categories/spor-cantasi' },
      { label: 'Spor & Seyahat Çantası', href: '/categories/spor-cantasi' },
    ],
  },
]

const POPULAR_SEARCH_TAGS = ['Bez Çanta', 'Sırt Çantası', 'Karton Çanta', 'Laptop Çantası', 'Fuar Çantası', 'Deri Çanta', 'Spor Çantası']

export function Header() {
  const router = useRouter()
  const { items: quoteItems, openDrawer } = useQuote()
  const { favorites } = useFavorites()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag)
    router.push(`/search?q=${encodeURIComponent(tag)}`)
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
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white border-b border-neutral-200',
          isScrolled ? 'shadow-sm' : ''
        )}
      >
        {/* Top Info / Utility Bar (Promozone style) */}
        <div className="border-b border-neutral-100 bg-[#f9fafb] px-4 sm:px-6 lg:px-12 py-1.5 text-xs text-neutral-600">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            {/* Left: How to get quote guide trigger */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="inline-flex items-center gap-1.5 font-medium text-[#2d6a4f] hover:text-[#1b4332] transition-colors"
              >
                <HelpCircle size={14} />
                <span>Nasıl Teklif Alabilirim?</span>
              </button>
              <span className="hidden sm:inline-block text-neutral-300">|</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-neutral-500">
                <Clock size={12} />
                <span>Hafta İçi 09:00 - 18:00</span>
              </span>
            </div>

            {/* Right: WhatsApp Line & Admin */}
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/905300000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-neutral-700 hover:text-black transition-colors"
              >
                <WhatsAppIcon size={14} className="text-[#25D366]" />
                <span className="hidden xs:inline">Hızlı Teklif Hattı:</span>
                <span className="font-semibold text-neutral-900">+90 (530) 000 00 00</span>
              </a>
              <span className="text-neutral-300">|</span>
              <Link
                href="/admin"
                className="text-neutral-500 hover:text-neutral-900 transition-colors text-[11px]"
              >
                Atölye Yönetimi
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-800 hover:text-black rounded-lg"
              aria-label="Menüyü Aç"
            >
              <Menu size={24} />
            </button>

            {/* Brand Logo (Promozone-like Clean Identity) */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                Ç
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-wider text-neutral-900 leading-none">
                  ÇANTA<span className="text-[#2d6a4f]">PRO</span>
                </span>
                <span className="text-[10px] tracking-widest text-neutral-400 font-medium uppercase mt-0.5">
                  Toptan & Promosyon
                </span>
              </div>
            </Link>

            {/* Center: Promozone-Style Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-2 flex-col">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Kumaş türü, model veya çanta adı arayın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-5 pr-12 py-2.5 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-[#2d6a4f] rounded-full text-xs font-normal text-neutral-800 focus:outline-hidden transition-all placeholder:text-neutral-400 shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white flex items-center justify-center transition-colors shadow-2xs"
                  aria-label="Arama Yap"
                >
                  <Search size={14} />
                </button>
              </form>

              {/* Sık Aranan Popüler Etiketler */}
              <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                  Popüler:
                </span>
                {POPULAR_SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="text-[10px] font-normal text-neutral-600 hover:text-[#2d6a4f] hover:bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200 transition-colors shrink-0"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
              {/* Favorites Button */}
              <Link
                href="/favorites"
                className="relative w-10 h-10 rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
                title="Favorilerim"
              >
                <Heart
                  size={19}
                  className={favorites.length > 0 ? 'fill-rose-600 text-rose-600' : ''}
                />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Teklif Listesi Button (Promozone Style) */}
              <button
                onClick={openDrawer}
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-xl transition-all shadow-xs font-semibold text-xs sm:text-sm active:scale-95"
                title="Teklif Listesi"
              >
                <div className="relative">
                  <ShoppingBag size={18} />
                  <span className="absolute -top-2 -left-2 w-4 h-4 bg-[#c5a35a] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-2xs">
                    {quoteItems.length}
                  </span>
                </div>
                <span className="hidden sm:inline">Teklif Listesi</span>
              </button>

              {/* User Account / Giriş Yap */}
              <UserDropdown />
            </div>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="block md:hidden px-4 pb-3 pt-1 bg-white border-t border-neutral-100">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Model veya kumaş ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-[#2d6a4f] rounded-full text-xs text-neutral-800 focus:outline-hidden transition-all placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center"
            >
              <Search size={12} />
            </button>
          </form>
        </div>

        {/* Lower Mega-Menu Navigation Bar (Desktop) */}
        <div className="hidden lg:block border-t border-neutral-200 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
            <nav className="flex items-center space-x-6 xl:space-x-8">
              {/* Mega Menu Trigger */}
              <div
                onMouseEnter={handleMouseEnterMega}
                onMouseLeave={handleMouseLeaveMega}
                className="relative py-3.5"
              >
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors',
                    isMegaMenuOpen ? 'text-[#2d6a4f]' : 'text-neutral-800 hover:text-[#2d6a4f]'
                  )}
                >
                  <span>TÜM KATEGORİLER</span>
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform duration-200', isMegaMenuOpen && 'rotate-180')}
                  />
                </button>

                {/* Mega Menu Dropdown Panel */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 w-[1140px] bg-white border border-neutral-200 rounded-2xl shadow-2xl p-8 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {MEGA_CATEGORIES.map((cat) => (
                      <div key={cat.title} className="flex flex-col space-y-3 group/item">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-100 block group"
                        >
                          <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="260px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5">
                            <span className="text-white text-xs font-bold leading-tight block drop-shadow-xs">
                              {cat.title}
                            </span>
                          </div>
                        </Link>

                        <div>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        <ul className="space-y-1.5 pt-1 border-t border-neutral-100">
                          {cat.subItems.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                className="text-xs text-neutral-600 hover:text-[#2d6a4f] hover:translate-x-0.5 transition-all flex items-center justify-between"
                              >
                                <span>{sub.label}</span>
                                <ArrowRight size={11} className="opacity-0 group-hover/item:opacity-100 text-[#2d6a4f] transition-opacity" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Links to Categories */}
              {MEGA_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="py-3.5 text-xs font-semibold text-neutral-700 hover:text-[#2d6a4f] transition-colors"
                >
                  {cat.title}
                </Link>
              ))}

              {/* Top Guide Button */}
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="py-3.5 text-xs font-bold text-[#c5a35a] hover:text-[#2d6a4f] transition-colors ml-auto flex items-center gap-1.5"
              >
                <HelpCircle size={14} />
                <span>Nasıl Teklif Alırım?</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Guide Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={[
          ...MEGA_CATEGORIES.map((cat) => ({ href: `/categories/${cat.slug}`, label: cat.title })),
          { href: '/favorites', label: 'Favorilerim' },
          { href: '/inquiry', label: 'Teklif Talebi Gönder' },
        ]}
      />
    </>
  )
}
