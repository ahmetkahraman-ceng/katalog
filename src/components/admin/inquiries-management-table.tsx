'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Phone,
  Mail,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'

export interface AdminInquiryItem {
  id: string
  customerName: string
  phone: string
  email: string
  message: string | null
  status: 'NEW' | 'CONTACTED' | 'CLOSED'
  createdAt: string
  items: {
    id: string
    product: {
      id: string
      name: string
      slug: string
      images: { url: string }[]
    }
  }[]
}

interface Props {
  initialInquiries: AdminInquiryItem[]
}

export function InquiriesManagementTable({ initialInquiries }: Props) {
  const [inquiries, setInquiries] = useState<AdminInquiryItem[]>(initialInquiries)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'CLOSED'>('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Quick 1-click status update
  const handleStatusChange = async (
    id: string,
    newStatus: 'NEW' | 'CONTACTED' | 'CLOSED'
  ) => {
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
      } else {
        alert('Durum güncellenirken bir hata oluştu.')
      }
    } catch (err) {
      console.error('Durum güncelleme hatası:', err)
      alert('Bağlantı hatası.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Delete inquiry
  const handleDelete = async (id: string, customerName: string) => {
    if (!confirm(`${customerName} kişisine ait teklif talebini silmek istediğinize emin misiniz?`)) {
      return
    }
    setDeletingId(id)
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id))
      } else {
        alert('Talep silinirken hata oluştu.')
      }
    } catch (err) {
      console.error('Silme hatası:', err)
      alert('Bağlantı hatası.')
    } finally {
      setDeletingId(null)
    }
  }

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      // Search
      const search = searchQuery.toLowerCase().trim()
      const matchSearch =
        search === '' ||
        inq.customerName.toLowerCase().includes(search) ||
        inq.phone.toLowerCase().includes(search) ||
        inq.email.toLowerCase().includes(search) ||
        (inq.message && inq.message.toLowerCase().includes(search)) ||
        inq.items.some((i) => i.product.name.toLowerCase().includes(search))

      // Status
      const matchStatus = statusFilter === 'ALL' || inq.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [inquiries, searchQuery, statusFilter])

  const countNew = inquiries.filter((i) => i.status === 'NEW').length
  const countContacted = inquiries.filter((i) => i.status === 'CONTACTED').length
  const countClosed = inquiries.filter((i) => i.status === 'CLOSED').length

  return (
    <div className="space-y-6">
      {/* Arama ve Filtre Sekmeleri */}
      <div className="bg-white border border-neutral-200/80 p-5 rounded-sm space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Arama */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Müşteri adı, telefon, e-posta veya model ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/70 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-neutral-400 font-light flex items-center gap-1.5">
            <Clock size={14} />
            <span>Ortalama Yanıt Hedefi: 24 Saat</span>
          </div>
        </div>

        {/* Durum Sekmeleri */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-xs ${
              statusFilter === 'ALL'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Tüm Talepler ({inquiries.length})
          </button>

          <button
            onClick={() => setStatusFilter('NEW')}
            className={`px-3.5 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-xs flex items-center gap-1.5 ${
              statusFilter === 'NEW'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Bekleyen Yeni Talepler ({countNew})
          </button>

          <button
            onClick={() => setStatusFilter('CONTACTED')}
            className={`px-3.5 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-xs flex items-center gap-1.5 ${
              statusFilter === 'CONTACTED'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            İletişime Geçildi ({countContacted})
          </button>

          <button
            onClick={() => setStatusFilter('CLOSED')}
            className={`px-3.5 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-xs flex items-center gap-1.5 ${
              statusFilter === 'CLOSED'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Kapandı / Siparişe Döndü ({countClosed})
          </button>
        </div>
      </div>

      {/* Talepler Tablosu */}
      <div className="bg-white border border-neutral-200/80 rounded-sm shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                <th className="py-3.5 px-4 w-28">TARİH</th>
                <th className="py-3.5 px-4">MÜŞTERİ BİLGİSİ</th>
                <th className="py-3.5 px-4">İLGİLENİLEN ÇANTA</th>
                <th className="py-3.5 px-4">MÜŞTERİ NOTU</th>
                <th className="py-3.5 px-4 text-center">DURUMU YÖNET</th>
                <th className="py-3.5 px-4 text-right">AKSİYON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm font-light">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-neutral-400 font-light">
                    {statusFilter === 'NEW'
                      ? 'Harika! Bekleyen yeni bir teklif talebi bulunmuyor.'
                      : 'Kriterlere uyan talep bulunamadı.'}
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => {
                  const product = inquiry.items?.[0]?.product
                  const hasImage = product?.images?.[0]?.url

                  return (
                    <tr
                      key={inquiry.id}
                      className="hover:bg-neutral-50/60 transition-colors group"
                    >
                      {/* Tarih */}
                      <td className="py-4 px-4 align-top">
                        <span className="text-xs font-mono text-neutral-600 block">
                          {new Date(inquiry.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 block">
                          {new Date(inquiry.createdAt).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Müşteri & İletişim */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-black">
                            {inquiry.customerName}
                          </span>
                          <div className="flex flex-col gap-0.5 text-xs font-mono text-neutral-500">
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="hover:text-black flex items-center gap-1.5 transition-colors"
                              title="Hemen Ara"
                            >
                              <Phone size={12} className="text-neutral-400" />
                              {inquiry.phone}
                            </a>
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="hover:text-black flex items-center gap-1.5 transition-colors"
                              title="E-posta Gönder"
                            >
                              <Mail size={12} className="text-neutral-400" />
                              {inquiry.email}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* İlgilenilen Çanta */}
                      <td className="py-4 px-4 align-top">
                        {product ? (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-13 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                              {hasImage ? (
                                <img
                                  src={hasImage}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400">
                                  ÇANTA
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                className="text-xs font-normal text-black hover:underline uppercase"
                              >
                                {product.name}
                              </Link>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                Katalog Modeli
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-block px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs font-light">
                            Genel Özel Üretim / Toplu Sipariş
                          </span>
                        )}
                      </td>

                      {/* Müşteri Notu */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        {inquiry.message ? (
                          <p className="text-xs text-neutral-600 font-light line-clamp-2 italic bg-neutral-50/80 p-2 rounded border border-neutral-100">
                            &quot;{inquiry.message}&quot;
                          </p>
                        ) : (
                          <span className="text-[11px] text-neutral-300 font-light">
                            Özel not belirtilmedi
                          </span>
                        )}
                      </td>

                      {/* 1-Click Durum Seçici */}
                      <td className="py-4 px-4 align-top text-center">
                        <select
                          value={inquiry.status}
                          disabled={updatingId === inquiry.id}
                          onChange={(e) =>
                            handleStatusChange(
                              inquiry.id,
                              e.target.value as 'NEW' | 'CONTACTED' | 'CLOSED'
                            )
                          }
                          className={`text-[11px] font-light tracking-wider uppercase px-2.5 py-1.5 border rounded-sm focus:outline-none cursor-pointer ${
                            inquiry.status === 'NEW'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                              : inquiry.status === 'CONTACTED'
                              ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          } ${updatingId === inquiry.id ? 'opacity-50' : ''}`}
                        >
                          <option value="NEW">🟡 Yeni Talep</option>
                          <option value="CONTACTED">🔵 İletişime Geçildi</option>
                          <option value="CLOSED">🟢 Kapandı / Onay</option>
                        </select>
                      </td>

                      {/* Aksiyonlar */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/inquiries/${inquiry.id}`}
                            className="p-2 text-neutral-500 hover:text-black transition-colors rounded hover:bg-neutral-100"
                            title="Tüm Detayları Gör"
                          >
                            <Eye size={16} />
                          </Link>

                          <button
                            type="button"
                            disabled={deletingId === inquiry.id}
                            onClick={() =>
                              handleDelete(inquiry.id, inquiry.customerName)
                            }
                            className="p-2 text-neutral-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 disabled:opacity-50"
                            title="Talebi Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Alt Özet */}
        <div className="p-4 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-light">
          <span>
            {filteredInquiries.length} talep listeleniyor (Toplam {inquiries.length})
          </span>
          <span className="font-mono text-[11px]">
            {countNew} Bekliyor • {countContacted} İletişimde • {countClosed} Tamamlandı
          </span>
        </div>
      </div>
    </div>
  )
}
