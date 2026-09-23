'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MobileMenu } from './mobile-menu'

const navLinks = [
  { href: '/categories/el-cantasi', label: 'El Çantası' },
  { href: '/categories/sirt-cantasi', label: 'Sırt Çantası' },
  { href: '/categories/laptop-cantasi', label: 'Laptop Çantası' },
  { href: '/categories/evrak-cantasi', label: 'Evrak Çantası' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [announcement, setAnnouncement] = useState<{
    enabled: boolean
    text: string
    link?: string
  }>({
    enabled: true,
    text: '2026 İlkbahar / Yaz Koleksiyonu İçin Butik & Toptan Siparişler Açıldı • Özel Üretim Teklifi Alın',
    link: '/inquiry',
  })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // 1. Instant local render if available
    try {
      const cached = localStorage.getItem('site_announcement_settings')
      if (cached) {
        const parsed = JSON.parse(cached)
        setAnnouncement({
          enabled: Boolean(parsed.enabled),
          text: parsed.text || '',
          link: parsed.link || '/inquiry',
        })
      }
    } catch {
      // ignore
    }

    async function loadBannerSettings() {
      try {
        const res = await fetch(`/api/settings/banner?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data.announcement) {
            const nextAnn = {
              enabled: Boolean(data.announcement.enabled),
              text: data.announcement.text || '',
              link: data.announcement.link || '/inquiry',
            }
            setAnnouncement(nextAnn)
            try {
              localStorage.setItem('site_announcement_settings', JSON.stringify(nextAnn))
            } catch {}
          }
        }
      } catch {
        // silent fail
      }
    }
    loadBannerSettings()

    const handleStorageChange = () => {
      try {
        const cached = localStorage.getItem('site_announcement_settings')
        if (cached) {
          const parsed = JSON.parse(cached)
          setAnnouncement({
            enabled: Boolean(parsed.enabled),
            text: parsed.text || '',
            link: parsed.link || '/inquiry',
          })
        }
      } catch {}
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs'
            : 'bg-white'
        )}
      >
        {/* Dynamic Editorial Monospace Announcement Bar */}
        {announcement.enabled && announcement.text && (
          <div className="w-full bg-black text-white py-1.5 px-4 text-center border-b border-neutral-800">
            {announcement.link ? (
              <Link
                href={announcement.link}
                className="text-[10px] sm:text-[11px] font-light tracking-[0.2em] uppercase hover:underline inline-block"
              >
                {announcement.text}
              </Link>
            ) : (
              <p className="text-[10px] sm:text-[11px] font-light tracking-[0.2em] uppercase">
                {announcement.text}
              </p>
            )}
          </div>
        )}

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-800 hover:text-black"
              aria-label="Menüyü Aç"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="text-xl lg:text-2xl font-extralight tracking-[0.35em] uppercase text-black hover:opacity-80 transition-opacity"
            >
              ÇANTA
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-light tracking-[0.2em] uppercase text-neutral-600 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions: Search & Quick Links */}
            <div className="flex items-center gap-4 sm:gap-6">
              {isSearchOpen ? (
                <div className="flex items-center bg-neutral-100 px-3 py-1 border border-neutral-300">
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-32 sm:w-48 bg-transparent text-xs font-light focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="p-1 text-neutral-400 hover:text-black">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1 text-neutral-600 hover:text-black transition-colors"
                  aria-label="Ara"
                >
                  <Search size={18} />
                </button>
              )}

              {/* Teklif İste Link */}
              <Link
                href="/inquiry"
                className="hidden sm:flex items-center gap-1.5 text-[11px] font-light tracking-widest uppercase text-neutral-800 hover:text-black border-b border-transparent hover:border-black pb-0.5 transition-all"
              >
                <FileText size={14} />
                <span>TEKLİF İSTE</span>
              </Link>

              {/* Admin Link */}
              <Link
                href="/admin"
                className="text-[10px] font-light tracking-widest uppercase text-neutral-400 hover:text-black transition-colors border border-neutral-200 px-2 py-1"
              >
                YÖNETİM
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  )
}
