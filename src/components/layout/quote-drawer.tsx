'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Trash2, CheckCircle2, ArrowRight, Loader2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { useQuote } from '@/context/quote-context'
import { useAuth } from '@/context/auth-context'

export function QuoteDrawer() {
  const { items, removeItem, updateQuantity, clearQuote, isDrawerOpen, closeDrawer } = useQuote()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    companyName: user?.company || '',
    message: '',
  })

  // Keep synced if user logs in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        companyName: prev.companyName || user.company || '',
      }))
    }
  }, [user])

  const [errorMsg, setErrorMsg] = useState('')

  if (!isDrawerOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customerName || !formData.phone || !formData.email) {
      setErrorMsg('Lütfen ad, telefon ve e-posta alanlarını doldurun.')
      return
    }

    if (items.length === 0) {
      setErrorMsg('Teklif listenizde henüz ürün bulunmamaktadır.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        companyName: formData.companyName || null,
        customerId: user?.id || null,
        message: `${formData.companyName ? `Firma: ${formData.companyName}\n` : ''}${
          formData.message ? `Müşteri Notu: ${formData.message}\n` : ''
        }Seçilen Çantalar:\n${items
          .map(
            (i) =>
              `- ${i.name}${i.variantName ? ` [Renk: ${i.variantName}]` : ''} (${i.quantity || 50} Adet) [${
                i.priceRange || 'Fiyat sorulacak'
              }]`
          )
          .join('\n')}`,
        productIds: items.map((i) => i.id),
        items: items.map((i) => ({
          productId: i.id,
          variantId: i.variantId || null,
          variantName: i.variantName || i.color || null,
          quantity: i.quantity || 50,
        })),
      }

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error('Talep iletilirken bir hata oluştu.')
      }

      setIsSubmitted(true)
      clearQuote()
    } catch (err: any) {
      setErrorMsg(err.message || 'Bir hata oluştu, lütfen WhatsApp hattımızdan bize ulaşın.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppRedirect = () => {
    const bagList = items.map((i) => `${i.name} (${i.quantity || 50} Adet)`).join(', ')
    const text = encodeURIComponent(
      `Merhaba, web sitenizdeki çanta teklif listem için fiyat ve üretim termin süresi almak istiyorum:\n\n${bagList}`
    )
    window.open(`https://wa.me/905300000000?text=${text}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf8f5] shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-neutral-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-neutral-800" />
                <h2 className="text-sm font-medium tracking-[0.15em] uppercase text-neutral-900">
                  TEKLİF LİSTEM
                </h2>
              </div>
              <p className="text-[11px] font-light text-neutral-500 mt-0.5">
                {items.length > 0 ? `${items.length} model seçildi` : 'Listeniz boş'}
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-light tracking-wide uppercase text-neutral-900">
                  Talebiniz Alındı!
                </h3>
                <p className="text-xs font-light text-neutral-600 max-w-xs leading-relaxed">
                  Teklif talebiniz başarıyla kaydedildi. Satış ve atölye temsilcimiz en geç <strong>24 saat içinde</strong> resmi fiyat teklifinizle birlikte sizinle iletişime geçecektir.
                </p>
                <div className="pt-4 flex flex-col gap-2 w-full">
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      closeDrawer()
                    }}
                    className="w-full py-3 bg-black text-white text-xs font-light tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                  >
                    Kataloğa Geri Dön
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag size={22} />
                </div>
                <p className="text-xs font-light tracking-wider uppercase text-neutral-600">
                  Teklif listenizde henüz ürün yok
                </p>
                <p className="text-[11px] font-light text-neutral-400 max-w-xs">
                  Katalogdan ilgilendiğiniz çanta modellerini &quot;Teklif Listesine Ekle&quot; butonuyla ekleyebilirsiniz.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-4 px-6 py-2.5 bg-neutral-900 text-white text-xs font-light tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                >
                  Çantaları İncele
                </button>
              </div>
            ) : (
              <>
                {/* List of selected items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-light tracking-wider uppercase text-neutral-400 pb-1 border-b border-neutral-200">
                    <span>SEÇİLEN MODELLER</span>
                    <button
                      onClick={clearQuote}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      Listeyi Temizle
                    </button>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {items.map((item) => {
                      const itemKey = `${item.id}-${item.variantId || item.color || 'default'}`
                      return (
                        <div
                          key={itemKey}
                          className="flex gap-3 bg-white p-3 border border-neutral-200/80 shadow-2xs items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-16 bg-neutral-100 shrink-0 overflow-hidden">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400">
                                  ÇANTA
                                </div>
                              )}
                            </div>
                            <div>
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={closeDrawer}
                                className="text-xs font-medium text-neutral-900 hover:text-neutral-600 line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              {(item.variantName || item.color) && (
                                <div className="mt-0.5">
                                  <span className="text-[10px] font-normal text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-xs">
                                    Renk: {item.variantName || item.color}
                                  </span>
                                </div>
                              )}
                              <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                                {item.priceRange || 'Fiyat Sorunuz'}
                              </p>
                              {/* Quantity controls */}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-neutral-400">Adet:</span>
                                <div className="flex items-center border border-neutral-200 bg-neutral-50 text-[10px]">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, (item.quantity || 50) - 25, item.variantId)}
                                    className="px-1.5 py-0.5 hover:bg-neutral-200"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="px-2 font-mono font-medium text-neutral-800">
                                    {item.quantity || 50}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, (item.quantity || 50) + 25, item.variantId)}
                                    className="px-1.5 py-0.5 hover:bg-neutral-200"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.id, item.variantId)}
                            className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
                            title="Listeden Çıkar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Direct Inquiry Form */}
                <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 border border-neutral-200/80 shadow-2xs">
                  <span className="text-[11px] font-medium tracking-widest uppercase text-neutral-700 block">
                    TEKLİF TALEP FORMU
                  </span>

                  {errorMsg && (
                    <div className="p-2.5 bg-red-50 text-red-600 text-[11px] rounded-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="Adınız Soyadınız *"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:outline-hidden focus:border-black transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        placeholder="Telefon *"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:outline-hidden focus:border-black transition-colors"
                      />
                      <input
                        type="email"
                        placeholder="E-posta *"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:outline-hidden focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Firma / Marka Adı (Opsiyonel)"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:outline-hidden focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        placeholder="Baskı türü, kumaş gramajı veya özel notlarınız..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:outline-hidden focus:border-black transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#2d6a4f] text-white text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 rounded-xs shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>İletiliyor...</span>
                      </>
                    ) : (
                      <>
                        <span>Teklifi Gönder</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    className="w-full py-2.5 bg-[#25D366] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <WhatsAppIcon size={15} className="text-white shrink-0" />
                    <span>WhatsApp ile Hızlı Fiyat Al</span>
                  </button>

                  <p className="text-[10px] text-neutral-400 text-center font-light leading-tight pt-1">
                    * Bu bir alışveriş sepeti değildir. Toptan ve kurumsal teklif talebiniz temsilcimize iletilir.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
