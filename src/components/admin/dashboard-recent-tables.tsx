'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, ExternalLink, ArrowRight, CheckCircle2, Clock, Phone, Mail, ShoppingBag } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { formatPriceRange, cn } from '@/lib/utils'

interface Inquiry {
  id: string
  customerName: string
  phone: string
  email: string
  companyName?: string
  status: 'NEW' | 'CONTACTED' | 'CLOSED'
  createdAt: string
  items: { product: { name: string } }[]
}

interface Product {
  id: string
  name: string
  slug: string
  sku?: string | null
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  category?: { name: string }
  images: { url: string }[]
  priceMin?: number | null
  priceMax?: number | null
  minOrderQty?: number | null
}

interface Props {
  initialInquiries: Inquiry[]
  initialProducts: Product[]
}

export function DashboardRecentTables({ initialInquiries, initialProducts }: Props) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleInquiryStatusChange = async (id: string, newStatus: 'NEW' | 'CONTACTED' | 'CLOSED') => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        )
      }
    } catch (err) {
      console.error('Durum güncellenemedi:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleProductToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/toggle-status`, {
        method: 'PATCH',
      })
      if (res.ok) {
        const data = await res.json()
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: data.status } : p))
        )
      }
    } catch (err) {
      console.error('Ürün durumu değiştirilemedi:', err)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sol 7 Kolon: Son Gelen Talepler */}
      <div className="lg:col-span-7 bg-white border border-neutral-200/90 rounded-3xl shadow-xs p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#2d6a4f] uppercase block mb-0.5">
              MÜŞTERİ TALEPLERİ
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
              Son Gelen Teklif Talepleri
            </h2>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332] transition-colors flex items-center gap-1"
          >
            <span>Tümünü Gör</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            Henüz bekleyen bir teklif talebi bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {inquiries.map((inq) => {
              const formattedDate = new Date(inq.createdAt).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <div key={inq.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">
                        {inq.customerName}
                      </span>
                      {inq.companyName && (
                        <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                          {inq.companyName}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <a
                        href={`tel:${inq.phone}`}
                        className="hover:text-black flex items-center gap-1"
                      >
                        <Phone size={12} className="text-neutral-400" />
                        <span>{inq.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${inq.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#25D366] flex items-center gap-1 text-[#25D366] font-medium"
                      >
                        <WhatsAppIcon size={12} />
                        <span>WhatsApp</span>
                      </a>
                      <span className="text-neutral-300">•</span>
                      <span className="text-[11px] text-neutral-400 font-mono">{formattedDate}</span>
                    </div>

                    <div className="pt-1">
                      <span className="text-xs text-neutral-600 line-clamp-1">
                        <span className="font-semibold text-neutral-700">İstenen: </span>
                        {inq.items.map((i) => i.product.name).join(', ') || 'Özel talep'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) =>
                        handleInquiryStatusChange(inq.id, e.target.value as any)
                      }
                      className={cn(
                        'text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-colors outline-hidden cursor-pointer shadow-2xs',
                        inq.status === 'NEW' &&
                          'bg-amber-50 text-amber-800 border-amber-200',
                        inq.status === 'CONTACTED' &&
                          'bg-blue-50 text-blue-800 border-blue-200',
                        inq.status === 'CLOSED' &&
                          'bg-emerald-50 text-[#2d6a4f] border-emerald-200'
                      )}
                    >
                      <option value="NEW">Yeni Talep</option>
                      <option value="CONTACTED">İletişime Geçildi</option>
                      <option value="CLOSED">Tamamlandı</option>
                    </select>

                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                      title="Detay Görüntüle"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Sağ 5 Kolon: Son Eklenen Çanta Modelleri */}
      <div className="lg:col-span-5 bg-white border border-neutral-200/90 rounded-3xl shadow-xs p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#2d6a4f] uppercase block mb-0.5">
              KATALOG ENVANTERİ
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
              Son Çanta Modelleri
            </h2>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332] transition-colors flex items-center gap-1"
          >
            <span>Tüm Modeller</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            Katalogda henüz kayıtlı çanta bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {products.map((p) => {
              const imgUrl = p.images?.[0]?.url
              const priceText = formatPriceRange(p.priceMin, p.priceMax)

              return (
                <div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 relative overflow-hidden shrink-0 border border-neutral-200/60">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ShoppingBag size={18} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-[#2d6a4f] transition-colors truncate block"
                      >
                        {p.name}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span className="font-mono">{p.sku || 'REF: -'}</span>
                        <span>•</span>
                        <span>{p.category?.name || 'Kategorisiz'}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-neutral-800 mt-0.5">
                        {priceText}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleProductToggle(p.id)}
                      className={cn(
                        'text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer shadow-2xs',
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-[#2d6a4f] border-emerald-200 hover:bg-emerald-100'
                          : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                      )}
                    >
                      {p.status === 'ACTIVE' ? 'Yayında' : 'Taslak'}
                    </button>

                    <Link
                      href={`/categories/${p.slug}`}
                      target="_blank"
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                      title="Vitrinde Gör"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
