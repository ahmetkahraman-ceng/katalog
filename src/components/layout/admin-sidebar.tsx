'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Plus,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'GENEL BAKIŞ', icon: LayoutDashboard },
  { href: '/admin/products', label: 'ÜRÜNLER & KATALOG', icon: Package },
  { href: '/admin/categories', label: 'KATEGORİLER', icon: FolderOpen },
  {
    href: '/admin/inquiries',
    label: 'GELEN TEKLİFLER',
    icon: MessageSquare,
    hasBadge: true,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [newInquiriesCount, setNewInquiriesCount] = useState<number>(0)

  useEffect(() => {
    async function checkInquiries() {
      try {
        const res = await fetch('/api/inquiries')
        if (res.ok) {
          const inquiries = await res.json()
          const unread = inquiries.filter((i: any) => i.status === 'NEW').length
          setNewInquiriesCount(unread)
        }
      } catch {
        // silent fail
      }
    }
    checkInquiries()
  }, [pathname])

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-neutral-200/80 flex flex-col justify-between select-none shrink-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-200/80 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="text-xl font-extralight tracking-[0.3em] uppercase text-black hover:opacity-80 transition-opacity block"
            >
              ÇANTA
            </Link>
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block mt-0.5">
              YÖNETİM SİSTEMİ
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sistem Aktif" />
        </div>

        {/* Quick Add Product Button */}
        <div className="p-4 pb-2">
          <Link
            href="/admin/products/new"
            className="w-full py-2.5 px-3 bg-black hover:bg-neutral-800 text-white text-[11px] font-light tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-colors rounded-sm shadow-xs"
          >
            <Plus size={14} />
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 text-xs font-light tracking-[0.12em] uppercase rounded-sm transition-all',
                  isActive
                    ? 'bg-neutral-100 text-black font-normal'
                    : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                  <span>{item.label}</span>
                </div>

                {item.hasBadge && newInquiriesCount > 0 && (
                  <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full">
                    {newInquiriesCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-neutral-200/80 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-light tracking-wider uppercase text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-sm transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            Vitrini Görüntüle
          </span>
          <span className="text-[10px] text-neutral-400">↗</span>
        </Link>

        <button
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' })
            window.location.href = '/admin/login'
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-light tracking-wider uppercase text-red-500 hover:text-red-700 hover:bg-red-50/70 rounded-sm transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <LogOut size={14} />
            Güvenli Çıkış
          </span>
          <span className="text-[10px] font-mono">EXIT</span>
        </button>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            ATÖLYE PANEL v2.5
          </span>
          <span>ONLINE</span>
        </div>
      </div>
    </aside>
  )
}
