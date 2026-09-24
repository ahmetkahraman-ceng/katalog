'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, FileText, Heart, Clock, CheckCircle2, ChevronRight, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

interface InquiryItem {
  id: string
  quantity?: number
  variantName?: string | null
  product: {
    id: string
    name: string
    slug: string
    images?: Array<{ url: string }>
  }
}

interface Inquiry {
  id: string
  createdAt: string
  status: 'NEW' | 'CONTACTED' | 'CLOSED'
  companyName?: string | null
  message?: string | null
  items: InquiryItem[]
}

export default function CustomerInquiriesPage() {
  const { user, openAuthModal } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInquiries() {
      if (!user) return
      try {
        const res = await fetch(`/api/inquiries?customerId=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          setInquiries(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Talepler yüklenemedi:', err)
      } finally {
        setLoading(false)
      }
    }
    loadInquiries()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 border border-neutral-200 shadow-sm rounded-sm">
          <FileText className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
          <h1 className="text-xl font-medium text-neutral-900 mb-2">Taleplerinizi Görüntüleyin</h1>
          <p className="text-xs text-neutral-500 mb-6">
            Geçmiş teklif taleplerinizi takip etmek için lütfen giriş yapın.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 bg-[#2d6a4f] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#1b4332] transition-colors rounded-sm"
          >
            Giriş Yap / Kayıt Ol
          </button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={11} />
            İnceleniyor
          </span>
        )
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={11} />
            Temsilci İletişime Geçti
          </span>
        )
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
            Tamamlandı
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-light">
          <Link href="/" className="hover:text-black transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link href="/hesabim" className="hover:text-black transition-colors">
            Hesabım
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-normal">Geçmiş Taleplerim</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sol Menü */}
          <div className="md:col-span-1">
            <div className="bg-white border border-neutral-200 rounded-sm p-4 space-y-1">
              <div className="pb-3 mb-2 border-b border-neutral-100 px-3 pt-1">
                <p className="text-xs font-semibold text-neutral-900">{user.name}</p>
                <p className="text-[11px] text-neutral-400 font-light truncate">{user.email}</p>
              </div>

              <Link
                href="/hesabim"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-light text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-xs transition-colors"
              >
                <User size={15} />
                <span>Hesap Bilgilerim</span>
              </Link>

              <Link
                href="/hesabim/taleplerim"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2d6a4f] bg-neutral-50 rounded-xs"
              >
                <FileText size={15} />
                <span>Geçmiş Taleplerim</span>
              </Link>

              <Link
                href="/favorites"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-light text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-xs transition-colors"
              >
                <Heart size={15} />
                <span>Favorilerim</span>
              </Link>
            </div>
          </div>

          {/* Sağ İçerik: Talepler Listesi */}
          <div className="md:col-span-3">
            <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-6">
                <h2 className="text-lg font-medium tracking-wide text-neutral-900">
                  GEÇMİŞ TEKLİF TALEPLERİM ({inquiries.length})
                </h2>
              </div>

              {loading ? (
                <div className="py-16 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={24} className="animate-spin text-[#2d6a4f]" />
                  <span className="text-xs">Talepleriniz yükleniyor...</span>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
                  <p className="text-sm font-medium text-neutral-800 mb-1">
                    Henüz bir teklif talebiniz bulunmuyor.
                  </p>
                  <p className="text-xs text-neutral-500 mb-6">
                    Kataloğumuzdaki çanta modellerini inceleyip teklif listenize ekleyerek talep oluşturabilirsiniz.
                  </p>
                  <Link
                    href="/categories/bez-canta"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2d6a4f] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#1b4332] transition-colors rounded-xs shadow-2xs"
                  >
                    <span>Kataloğu Keşfet</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="border border-neutral-200/90 rounded-xs p-4 sm:p-5 hover:border-neutral-300 transition-colors bg-white shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-neutral-500 font-medium">
                            #{inquiry.id.slice(-6).toUpperCase()}
                          </span>
                          <span className="text-neutral-400">
                            {new Date(inquiry.createdAt).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div>{getStatusBadge(inquiry.status)}</div>
                      </div>

                      {/* Items */}
                      <div className="py-3 space-y-2.5">
                        {inquiry.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="font-medium text-neutral-900 hover:text-[#2d6a4f] transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              {item.variantName && (
                                <span className="text-[11px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-xs border border-neutral-100">
                                  {item.variantName}
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-neutral-600 font-medium">
                              {item.quantity || 50} Adet
                            </span>
                          </div>
                        ))}
                      </div>

                      {inquiry.message && (
                        <div className="mt-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-xs">
                          <span className="font-medium text-neutral-700 block mb-0.5">Not:</span>
                          <p className="whitespace-pre-line leading-relaxed">{inquiry.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
