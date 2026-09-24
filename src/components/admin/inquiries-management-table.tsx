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
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { cn } from '@/lib/utils'

export interface AdminInquiryItem {
  id: string
  customerName: string
  phone: string
  email: string
  companyName?: string | null
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

  // Status update
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

  // Counts
  const counts = useMemo(() => {
    return {
      all: inquiries.length,
      new: inquiries.filter((i) => i.status === 'NEW').length,
      contacted: inquiries.filter((i) => i.status === 'CONTACTED').length,
      closed: inquiries.filter((i) => i.status === 'CLOSED').length,
    }
  }, [inquiries])

  // Filter
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const search = searchQuery.toLowerCase().trim()
      const matchSearch =
        search === '' ||
        inq.customerName.toLowerCase().includes(search) ||
        inq.phone.includes(search) ||
        inq.email.toLowerCase().includes(search) ||
        (inq.companyName && inq.companyName.toLowerCase().includes(search)) ||
        (inq.message && inq.message.toLowerCase().includes(search))

      const matchStatus = statusFilter === 'ALL' || inq.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [inquiries, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      {/* Top Filter Tabs & Search */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer',
              statusFilter === 'ALL'
                ? 'bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-2xs'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200'
            )}
          >
            Tüm Talepler ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('NEW')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer',
              statusFilter === 'NEW'
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-amber-50 hover:bg-amber-100/80 text-amber-800 border-amber-200'
            )}
          >
            Yeni ({counts.new})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('CONTACTED')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer',
              statusFilter === 'CONTACTED'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-blue-50 hover:bg-blue-100/80 text-blue-800 border-blue-200'
            )}
          >
            İletişime Geçildi ({counts.contacted})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('CLOSED')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer',
              statusFilter === 'CLOSED'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200'
            )}
          >
            Tamamlandı ({counts.closed})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri, telefon veya firma..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-[#2d6a4f] rounded-xl focus:outline-hidden transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9fafb] border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Müşteri / Firma</th>
                <th className="py-3.5 px-4">İletişim Bilgileri</th>
                <th className="py-3.5 px-4">Talep Edilen Modeller</th>
                <th className="py-3.5 px-4">Tarih</th>
                <th className="py-3.5 px-4 text-center">Talep Durumu</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-neutral-400">
                    Kriterlere uygun teklif talebi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const dateStr = new Date(inq.createdAt).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  const cleanPhone = inq.phone.replace(/\D/g, '')

                  return (
                    <tr key={inq.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Customer / Company */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-neutral-900 text-sm">
                          {inq.customerName}
                        </div>
                        {inq.companyName ? (
                          <span className="text-[11px] font-semibold text-[#2d6a4f] bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            {inq.companyName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-normal">
                            Bireysel Talep
                          </span>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${inq.phone}`}
                              className="font-mono text-neutral-800 hover:text-black font-medium"
                            >
                              {inq.phone}
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-md bg-emerald-50 text-[#25D366] hover:bg-emerald-100 transition-colors"
                              title="WhatsApp ile Mesaj Gönder"
                            >
                              <WhatsAppIcon size={13} />
                            </a>
                          </div>
                          <div className="text-neutral-500 flex items-center gap-1 text-[11px]">
                            <Mail size={11} className="text-neutral-400" />
                            <span>{inq.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Requested Products */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-neutral-800 line-clamp-1">
                            {inq.items.map((i) => i.product.name).join(', ') || 'Özel Teklif Talebi'}
                          </span>
                          {inq.message && (
                            <p className="text-[11px] text-neutral-500 line-clamp-1 italic">
                              "{inq.message}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-neutral-500 font-mono text-[11px] whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4 text-center">
                        <select
                          value={inq.status}
                          disabled={updatingId === inq.id}
                          onChange={(e) =>
                            handleStatusChange(inq.id, e.target.value as any)
                          }
                          className={cn(
                            'text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors outline-hidden cursor-pointer shadow-2xs',
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
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/inquiries/${inq.id}`}
                            className="p-2 text-[#2d6a4f] hover:bg-[#2d6a4f]/10 rounded-xl transition-colors"
                            title="Talebi İncele"
                          >
                            <Eye size={15} />
                          </Link>

                          <button
                            type="button"
                            disabled={deletingId === inq.id}
                            onClick={() => handleDelete(inq.id, inq.customerName)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Talebi Sil"
                          >
                            <Trash2 size={15} />
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
      </div>
    </div>
  )
}
