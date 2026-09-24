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
  Plus,
  LogOut,
  Sliders,
  Settings,
  X,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: any
  hasBadge?: boolean
}

interface NavGroup {
  groupTitle: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    groupTitle: 'OPERASYON & TALEP',
    items: [
      { href: '/admin', label: 'Genel Bakış', icon: LayoutDashboard },
      { href: '/admin/inquiries', label: 'Teklif Talepleri', icon: MessageSquare, hasBadge: true },
      { href: '/admin/products', label: 'Çanta Modelleri', icon: Package },
      { href: '/admin/categories', label: 'Kategoriler', icon: FolderOpen },
    ],
  },
  {
    groupTitle: 'VİTRİN & AYARLAR',
    items: [
      { href: '/admin/banner', label: 'Vitrin & Duyuru', icon: Sliders },
      { href: '/admin/settings', label: 'Firma & İletişim', icon: Settings },
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
    <div className="w-64 min-h-screen bg-white flex flex-col justify-between select-none border-r border-neutral-200/90 shadow-2xs">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              Ç
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-wider text-neutral-900 leading-none">
                ÇANTA<span className="text-[#2d6a4f]">PRO</span>
              </span>
              <span className="text-[10px] tracking-widest text-neutral-400 font-medium uppercase mt-0.5">
                Yönetim Paneli
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Menüyü Kapat"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Add Product Button */}
        <div className="p-4 pb-2">
          <Link
            href="/admin/products/new"
            className="w-full py-2.5 px-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Yeni Model Ekle</span>
          </Link>
        </div>

        {/* Grouped Navigation */}
        <nav className="p-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-wider uppercase text-neutral-400 block mb-2">
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
                      'flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all',
                      isActive
                        ? 'bg-[#2d6a4f] text-white font-semibold shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={17}
                        className={cn(isActive ? 'text-white' : 'text-neutral-500')}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.hasBadge && newInquiriesCount > 0 && (
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs',
                          isActive
                            ? 'bg-[#c5a35a] text-white'
                            : 'bg-emerald-100 text-[#2d6a4f]'
                        )}
                      >
                        {newInquiriesCount} Yeni
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-neutral-100 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} className="text-neutral-400" />
            Vitrini Görüntüle
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">↗</span>
        </Link>

        <button
          type="button"
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' })
            window.location.href = '/admin/login'
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <LogOut size={14} />
            Güvenli Çıkış
          </span>
          <span className="text-[10px] font-mono text-rose-400">ÇIKIŞ</span>
        </button>

        <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 text-[10px] text-neutral-400">
          <span className="flex items-center gap-1.5 font-medium text-neutral-500">
            <CheckCircle2 size={13} className="text-emerald-500" />
            ÇantaPro Panel v2.8
          </span>
          <span className="font-mono text-emerald-600 font-semibold">ONLINE</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer (When Open) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-64 max-w-[85vw] h-full shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
