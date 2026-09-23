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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
        {/* Top Editorial Monospace Announcement Bar */}
        <div className="w-full bg-black text-white py-1.5 px-4 text-center border-b border-neutral-800">
          <p className="text-[10px] sm:text-[11px] font-light tracking-[0.2em] uppercase">
            2025 SONBAHAR / KIŞ KOLEKSİYONU — ÖZEL ATÖLYE & KURUMSAL TEKLİFLER
          </p>
        </div>

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
