'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, ExternalLink, ArrowRight, CheckCircle2, Clock, Phone, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Inquiry {
  id: string
  customerName: string
  phone: string
  email: string
  status: 'NEW' | 'CONTACTED' | 'CLOSED'
  createdAt: string
  items: { product: { name: string } }[]
}

interface Product {
  id: string
  name: string
  slug: string
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  category?: { name: string }
  images: { url: string }[]
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
        setInquiries(prev =>
          prev.map(inq => (inq.id === id ? { ...inq, status: newStatus } : inq))
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
        setProducts(prev =>
          prev.map(p => (p.id === id ? { ...p, status: data.status } : p))
        )
      }
    } catch (err) {
      console.error('Ürün durumu değiştirilemedi:', err)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sol 7 Kolon: Son Gelen Talepler */}
      <div className="lg:col-span-7 bg-white border border-neutral-200/80 rounded-sm shadow-xs p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
              MÜŞTERİ İLETİŞİM AKIŞI
            </span>
            <h2 className="text-base sm:text-lg font-light tracking-wider uppercase text-black mt-0.5">
              Son Gelen Teklif Talepleri
            </h2>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-[11px] font-light tracking-widest uppercase text-neutral-500 hover:text-black transition-colors flex items-center gap-1"
          >
            Tümünü Gör
            <ArrowRight size={13} />
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="py-12 text-center text-xs font-light text-neutral-400">
            Henüz bekleyen bir teklif talebi bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {inquiries.map((inq) => {
              const productName =
                inq.items?.[0]?.product?.name || 'Genel Teklif Talebi'
              return (
                <div
                  key={inq.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/60 transition-colors px-2 -mx-2 rounded"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-normal text-black">
                        {inq.customerName}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {new Date(inq.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 font-light truncate max-w-xs">
                      {productName}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono pt-0.5">
                      <a
                        href={`tel:${inq.phone}`}
                        className="hover:text-black flex items-center gap-1"
                      >
                        <Phone size={11} />
                        {inq.phone}
                      </a>
                      <span>•</span>
                      <a
                        href={`mailto:${inq.email}`}
                        className="hover:text-black flex items-center gap-1"
                      >
                        <Mail size={11} />
                        {inq.email}
                      </a>
                    </div>
                  </div>

                  {/* 1-Click Status Dropdown & Action */}
                  <div className="flex items-center gap-2.5 sm:self-center">
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) =>
                        handleInquiryStatusChange(
                          inq.id,
                          e.target.value as any
                        )
                      }
                      className={`text-[11px] font-light tracking-wider uppercase px-2.5 py-1.5 border rounded-sm focus:outline-none cursor-pointer ${
                        inq.status === 'NEW'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : inq.status === 'CONTACTED'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <option value="NEW">Yeni Talep</option>
                      <option value="CONTACTED">İletişime Geçildi</option>
                      <option value="CLOSED">Kapandı / Onay</option>
                    </select>

                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                      title="Detay Görüntüle"
                    >
                      <Eye size={15} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Sağ 5 Kolon: Son Eklenen Modeller & Hızlı İşlemler */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white border border-neutral-200/80 rounded-sm shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                ENVANTER
              </span>
              <h2 className="text-base font-light tracking-wider uppercase text-black mt-0.5">
                Son Eklenen Modeller
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-[11px] font-light tracking-widest uppercase text-neutral-500 hover:text-black transition-colors flex items-center gap-1"
            >
              Tümü
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {products.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-13 bg-neutral-100 overflow-hidden relative border border-neutral-200 shrink-0">
                    {prod.images?.[0] ? (
                      <img
                        src={prod.images[0].url}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400">
                        ÇANTA
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-light text-black truncate max-w-[150px] uppercase">
                      {prod.name}
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-light block">
                      {prod.category?.name || 'Kategorisiz'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleProductToggle(prod.id)}
                    className={`text-[9px] font-light tracking-widest uppercase px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      prod.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    title="Durumu değiştirmek için tıkla"
                  >
                    {prod.status === 'ACTIVE' ? 'Aktif' : 'Taslak'}
                  </button>

                  <Link
                    href={`/products/${prod.slug}`}
                    target="_blank"
                    className="p-1 text-neutral-400 hover:text-black"
                    title="Vitrinde Gör"
                  >
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hızlı Atölye Kısayolları */}
        <div className="bg-neutral-100/70 border border-neutral-200/80 p-5 rounded-sm">
          <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase block mb-3">
            HIZLI İŞLEMLER
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/admin/products/new"
              className="p-3 bg-white hover:bg-neutral-50 border border-neutral-200 text-center transition-colors block"
            >
              <span className="text-xs font-light text-black uppercase tracking-wider block">
                + Yeni Model
              </span>
              <span className="text-[10px] text-neutral-400 font-light block mt-0.5">
                Kataloğa ekle
              </span>
            </Link>
            <Link
              href="/admin/categories"
              className="p-3 bg-white hover:bg-neutral-50 border border-neutral-200 text-center transition-colors block"
            >
              <span className="text-xs font-light text-black uppercase tracking-wider block">
                Kategoriler
              </span>
              <span className="text-[10px] text-neutral-400 font-light block mt-0.5">
                Silüetleri düzenle
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
