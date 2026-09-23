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
  Sliders,
  Settings,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavGroup {
  groupTitle: string
  items: {
    href: string
    label: string
    icon: any
    hasBadge?: boolean
  }[]
}

const navGroups: NavGroup[] = [
  {
    groupTitle: 'GENEL BAKIŞ',
    items: [{ href: '/admin', label: 'GENEL BAKIŞ', icon: LayoutDashboard }],
  },
  {
    groupTitle: 'ENVANTER & KATALOG',
    items: [
      { href: '/admin/products', label: 'ÇANTA MODELLERİ', icon: Package },
      { href: '/admin/categories', label: 'KATEGORİLER & SİLÜET', icon: FolderOpen },
    ],
  },
  {
    groupTitle: 'MÜŞTERİ & TALEPLER',
    items: [
      {
        href: '/admin/inquiries',
        label: 'GELEN TEKLİFLER',
        icon: MessageSquare,
        hasBadge: true,
      },
    ],
  },
  {
    groupTitle: 'VİTRİN & YAPILANDIRMA',
    items: [
      { href: '/admin/banner', label: 'VİTRİN & BANNER', icon: Sliders },
      { href: '/admin/settings', label: 'ATÖLYE AYARLARI', icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
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

  // Close mobile drawer on route change
  useEffect(() => {
    if (onClose) onClose()
  }, [pathname])

  const content = (
    <div className="w-64 min-h-screen bg-white flex flex-col justify-between select-none">
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
              ATELIER PANEL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
              title="Sistem Aktif"
            />
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-neutral-400 hover:text-black"
                title="Menüyü Kapat"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Add Product Button */}
        <div className="p-4 pb-2">
          <Link
            href="/admin/products/new"
            className="w-full py-2.5 px-3 bg-black hover:bg-neutral-800 text-white text-[11px] font-light tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-colors rounded-sm shadow-xs"
          >
            <Plus size={14} />
            <span>Yeni Model Ekle</span>
          </Link>
        </div>

        {/* Grouped Navigation Items */}
        <nav className="p-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              <span className="px-3 text-[9px] font-mono tracking-[0.2em] uppercase text-neutral-400 font-semibold block mb-1">
                {group.groupTitle}
              </span>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-xs font-light tracking-[0.12em] uppercase rounded-sm transition-all',
                      isActive
                        ? 'bg-neutral-100 text-black font-normal'
                        : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.hasBadge && newInquiriesCount > 0 && (
                      <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full">
                        {newInquiriesCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-neutral-200/80 space-y-2.5">
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
          type="button"
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
            ATÖLYE PANEL v2.6
          </span>
          <span>ONLINE</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen border-r border-neutral-200/80 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer (When Open) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          {/* Drawer Sidebar */}
          <div className="relative w-64 max-w-[85vw] h-full shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
