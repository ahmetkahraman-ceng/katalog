'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileDown, Share2 } from 'lucide-react'

export function Footer() {
  const [atelier, setAtelier] = useState({
    name: 'ÇANTA KATALOG',
    tagline: 'Promosyon & Kurumsal Çanta Çözümleri',
    phone: '+90 (212) 555 01 23',
    email: 'info@cantakatalog.com',
    address: 'İstoç Ticaret Merkezi, Mahmutbey, Bağcılar, İstanbul',
    catalogPdfUrl: '/katalog-2026.pdf',
    instagramUrl: 'https://instagram.com',
    pinterestUrl: 'https://pinterest.com',
    linkedinUrl: 'https://linkedin.com',
  })

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.atelier) {
            setAtelier((prev) => ({ ...prev, ...data.atelier }))
          }
        }
      } catch {
        // silent fail
      }
    }
    loadFooterSettings()
  }, [])

  const categories = [
    { title: 'Bez Çanta', slug: 'bez-canta' },
    { title: 'Sırt Çantası', slug: 'sirt-cantasi' },
    { title: 'Karton Çanta', slug: 'karton-canta' },
    { title: 'Laptop Çantası', slug: 'laptop-cantasi' },
    { title: 'Fuar & Kongre Çantası', slug: 'fuar-kongre-cantasi' },
    { title: 'Deri Çanta', slug: 'deri-canta' },
    { title: 'Spor Çantası', slug: 'spor-cantasi' },
  ]

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Craft Story */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-extralight tracking-[0.3em] uppercase mb-3">
              {atelier.name}
            </h3>
            <p className="text-xs font-mono tracking-wider text-[#2d6a4f] uppercase mb-3">
              {atelier.tagline}
            </p>
            <p className="text-xs font-light text-neutral-500 leading-relaxed mb-4">
              Kurumsal etkinlikleriniz, promosyon çalışmalarınız ve toptan çanta ihtiyaçlarınız için yüksek kaliteli, baskılı ve özelleştirilebilir çanta çözümleri sunuyoruz.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-neutral-500 pt-1">
              {atelier.instagramUrl && (
                <a
                  href={atelier.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#2d6a4f] transition-colors"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {atelier.pinterestUrl && (
                <a
                  href={atelier.pinterestUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#2d6a4f] transition-colors"
                  title="Pinterest"
                >
                  <Share2 size={17} />
                </a>
              )}
              {atelier.linkedinUrl && (
                <a
                  href={atelier.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#2d6a4f] transition-colors"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-light tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Kategoriler
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-xs font-light text-neutral-600 hover:text-[#2d6a4f] transition-colors uppercase tracking-wider"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-light tracking-[0.2em] uppercase text-neutral-400 mb-4">
              İletişim & Merkez
            </h4>
            <ul className="space-y-2 text-xs font-light text-neutral-600">
              <li className="font-mono">{atelier.phone}</li>
              <li className="font-mono">{atelier.email}</li>
              <li className="leading-relaxed pt-1">{atelier.address}</li>
            </ul>
          </div>

          {/* Actions & Catalog Download */}
          <div>
            <h4 className="text-xs font-light tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Özel Üretim & Teklif
            </h4>
            <p className="text-xs text-neutral-500 font-light mb-4 leading-relaxed">
              Kurumsal projeleriniz için toplu sipariş ve logolu çanta baskı teklifi isteyin.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/inquiry"
                className="w-full py-2.5 text-center text-xs font-light tracking-[0.15em] uppercase bg-[#2d6a4f] text-white hover:bg-[#1b4332] transition-colors shadow-xs rounded-sm"
              >
                Teklif İste
              </Link>
              {atelier.catalogPdfUrl && (
                <a
                  href={atelier.catalogPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 text-center text-xs font-light tracking-[0.15em] uppercase border border-neutral-300 text-neutral-700 hover:border-[#2d6a4f] hover:text-[#2d6a4f] transition-colors inline-flex items-center justify-center gap-1.5 rounded-sm"
                >
                  <FileDown size={14} />
                  <span>PDF Kataloğu İndir</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-neutral-400">
          <p>© {new Date().getFullYear()} {atelier.name}. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4 font-mono text-[10px]">
            <span>TOPTAN ÇANTA</span>
            <span>•</span>
            <span>KURUMSAL TEDARİK</span>
            <span>•</span>
            <span>BASKI & TASARIM</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
