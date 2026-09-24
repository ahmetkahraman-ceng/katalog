'use client'

import { useState, useEffect } from 'react'
import {
  Settings,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  Share2,
  ExternalLink,
  Building2,
  AlertCircle,
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
        setSuccessMsg('Firma ve iletişim ayarları başarıyla kaydedildi!')
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
      <div className="py-24 text-center text-xs text-neutral-400">
        Ayarlar yükleniyor...
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-6">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#2d6a4f] uppercase block mb-1">
            SİSTEM & KURUMSAL BİLGİLER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Firma & İletişim Ayarları
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Teklif formlarında, header ve footer alanlarında görünen iletişim ve firma bilgileri.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Save size={15} />
          <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={16} className="text-[#2d6a4f]" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-2xs">
          <AlertCircle size={16} className="text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Marka & Firma */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center font-bold">
              <Building2 size={16} />
            </div>
            <h2 className="text-sm font-bold text-neutral-900">
              Marka & Firma Kimliği
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Marka / Firma Adı
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: ÇANTA PRO"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Slogan / Alt Başlık
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Örn: Kurumsal Promosyon Çanta Çözümleri"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Hızlı Teklif & WhatsApp */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center font-bold">
              <WhatsAppIcon size={16} />
            </div>
            <h2 className="text-sm font-bold text-neutral-900">
              Hızlı Teklif Hattı & WhatsApp
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                WhatsApp Numarası
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="905300000000"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Sabit / Ofis Telefonu
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 (212) 000 00 00"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                WhatsApp Varsayılan Karşılama Mesajı
              </label>
              <input
                type="text"
                value={whatsappDefaultMessage}
                onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
                placeholder="Merhaba, toptan çanta üretimi ve fiyat teklifi hakkında bilgi almak istiyorum."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Card 3: İletişim & Lokasyon */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
              <MapPin size={16} />
            </div>
            <h2 className="text-sm font-bold text-neutral-900">
              İletişim & Lokasyon Bilgileri
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Kurumsal E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teklif@cantapro.com"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Çalışma Saatleri
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="Hafta içi 09:00 - 18:00"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Atölye / Fabrika Adresi
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="İkitelli OSB, Çanta İmalatçıları Sanayi Sitesi, No: 42, Başakşehir / İstanbul"
                rows={2}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all resize-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Katalog PDF & Sosyal Medya */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
              <Share2 size={16} />
            </div>
            <h2 className="text-sm font-bold text-neutral-900">
              Katalog PDF & Sosyal Medya Bağlantıları
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Katalog PDF İndirme Bağlantısı
              </label>
              <input
                type="url"
                value={catalogPdfUrl}
                onChange={(e) => setCatalogPdfUrl(e.target.value)}
                placeholder="https://example.com/2026-toptan-canta-katalogu.pdf"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/cantapro"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/cantapro"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Save size={16} />
            <span>{saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
