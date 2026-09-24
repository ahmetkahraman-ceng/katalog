'use client'

import { useState, useEffect } from 'react'
import {
  Settings,
  Save,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  Share2,
  ExternalLink,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Atelier state
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [workingHours, setWorkingHours] = useState('')
  const [catalogPdfUrl, setCatalogPdfUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [pinterestUrl, setPinterestUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data.atelier) {
            setName(data.atelier.name || '')
            setTagline(data.atelier.tagline || '')
            setPhone(data.atelier.phone || '')
            setWhatsapp(data.atelier.whatsapp || '')
            setWhatsappDefaultMessage(data.atelier.whatsappDefaultMessage || '')
            setEmail(data.atelier.email || '')
            setAddress(data.atelier.address || '')
            setWorkingHours(data.atelier.workingHours || '')
            setCatalogPdfUrl(data.atelier.catalogPdfUrl || '')
            setInstagramUrl(data.atelier.instagramUrl || '')
            setPinterestUrl(data.atelier.pinterestUrl || '')
            setLinkedinUrl(data.atelier.linkedinUrl || '')
          }
        }
      } catch (err) {
        console.error('Ayarlar yüklenemedi:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atelier: {
            name,
            tagline,
            phone,
            whatsapp: whatsapp.replace(/\D/g, ''),
            whatsappDefaultMessage,
            email,
            address,
            workingHours,
            catalogPdfUrl,
            instagramUrl,
            pinterestUrl,
            linkedinUrl,
          },
        }),
      })

      if (res.ok) {
        setSuccessMsg('Atölye ve iletişim ayarları başarıyla kaydedildi!')
        setTimeout(() => setSuccessMsg(null), 5000)
      } else {
        setErrorMsg('Ayarlar kaydedilirken hata oluştu.')
      }
    } catch {
      setErrorMsg('Bağlantı hatası oluştu.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-light text-neutral-400">
        Ayarlar yükleniyor...
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Üst Başlık Barı */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Settings size={14} className="text-black" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              YÖNETİM & İLETİŞİM KONFİGÜRASYONU
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-black font-serif">
            Atölye & Site Ayarları
          </h1>
        </div>
      </div>

      {/* Mesaj Bildirimleri */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-light rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle size={17} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <a
            href={`/?t=${Date.now()}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-emerald-700 text-white text-[11px] font-mono tracking-wider uppercase hover:bg-emerald-800 transition-colors inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto rounded-xs shadow-xs"
          >
            <span>Canlı URL'yi Aç</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-light rounded-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. KISIM: WHATSAPP SİPARİŞ & TEKLİF HATTI */}
        <div className="bg-white border border-neutral-200/80 p-6 sm:p-7 rounded-sm shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
            <WhatsAppIcon size={18} className="text-[#25D366]" />
            <div>
              <h2 className="text-sm font-light tracking-wider uppercase text-black">
                WhatsApp Doğrudan Teklif & Sipariş Hattı
              </h2>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Sitenin sağ altındaki ve ürün detaylarındaki WhatsApp butonlarının yönlendirdiği numara
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                WhatsApp Numarası (Ülke kodu ile, başında 90) *
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="905555550123"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
              <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                Örnek format: 905321234567 (Boşluksuz ve artı işareti olmadan)
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Varsayılan Karşılama Mesajı
              </label>
              <textarea
                value={whatsappDefaultMessage}
                onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
                rows={2}
                placeholder="Merhaba, çanta modelleriniz ve özel üretim teklifleri hakkında bilgi almak istiyorum."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 2. KISIM: ATÖLYE & İLETİŞİM DETAYLARI */}
        <div className="bg-white border border-neutral-200/80 p-6 sm:p-7 rounded-sm shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
            <MapPin size={16} className="text-black" />
            <div>
              <h2 className="text-sm font-light tracking-wider uppercase text-black">
                Atölye Bilgileri & Lokasyon
              </h2>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Header, footer ve teklif e-postalarında görünen kurumsal bilgiler
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Marka / Atölye Adı
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ÇANTA ATELIER"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Slogan / Alt Başlık
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Hakiki Deri ve Zanaatkâr El İşçiliği"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Kurumsal Telefon
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 (212) 555 01 23"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Kurumsal E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@cantaatelier.com"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Atölye / Showroom Açık Adresi
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nişantaşı / Teşvikiye Cad. No: 42, Şişli, İstanbul"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Çalışma Saatleri
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="Pazartesi - Cumartesi: 09:30 - 19:00"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Dijital PDF Katalog İndirme Linki
              </label>
              <input
                type="text"
                value={catalogPdfUrl}
                onChange={(e) => setCatalogPdfUrl(e.target.value)}
                placeholder="/katalog-2026.pdf veya Google Drive linki"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 3. KISIM: SOSYAL MEDYA LİNKLERİ */}
        <div className="bg-white border border-neutral-200/80 p-6 sm:p-7 rounded-sm shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
            <Share2 size={16} className="text-black" />
            <div>
              <h2 className="text-sm font-light tracking-wider uppercase text-black">
                Sosyal Medya Hesapları
              </h2>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Footer'da yer alan sosyal medya yönlendirme bağlantıları
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/cantamarka"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Pinterest URL
              </label>
              <input
                type="url"
                value={pinterestUrl}
                onChange={(e) => setPinterestUrl(e.target.value)}
                placeholder="https://pinterest.com/cantamarka"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/cantamarka"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-light tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Kaydediliyor...' : 'Atölye Ayarlarını Kaydet'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
