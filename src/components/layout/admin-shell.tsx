'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminSidebar } from './admin-sidebar'
import { Plus, ExternalLink, Menu, Bell, ShieldCheck } from 'lucide-react'

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f9fafb] text-neutral-900">
      {/* Sidebar (Desktop static + Mobile drawer) */}
      <AdminSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="h-16 bg-white border-b border-neutral-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl cursor-pointer transition-colors"
              title="Menüyü Aç"
            >
              <Menu size={20} />
            </button>

            <span className="text-xs font-bold text-neutral-800 tracking-wide">
              TOPTAN ÇANTA YÖNETİM MERKEZİ
            </span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-neutral-300" />
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200 rounded-xl"
            >
              <ExternalLink size={13} />
              <span>Vitrini Gör</span>
            </Link>

            <Link
              href="/admin/products/new"
              className="px-4 py-1.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Yeni Model</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
