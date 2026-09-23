'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles,
  Save,
  CheckCircle,
  Eye,
  Sliders,
  Bell,
  Image as ImageIcon,
  Check,
  ExternalLink,
} from 'lucide-react'
import { HD_CURATED_BAG_IMAGES } from '@/lib/site-settings-constants'

export default function AdminBannerPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form State
  const [announcementEnabled, setAnnouncementEnabled] = useState(true)
  const [announcementText, setAnnouncementText] = useState('')
  const [announcementLink, setAnnouncementLink] = useState('')

  const [heroBadge, setHeroBadge] = useState('')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroCtaText, setHeroCtaText] = useState('')
  const [heroCtaLink, setHeroCtaLink] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')

  useEffect(() => {
    async function loadBanner() {
      try {
        const res = await fetch('/api/settings/banner')
        if (res.ok) {
          const data = await res.json()
          if (data.announcement) {
            setAnnouncementEnabled(Boolean(data.announcement.enabled))
            setAnnouncementText(data.announcement.text || '')
            setAnnouncementLink(data.announcement.link || '')
          }
          if (data.hero) {
            setHeroBadge(data.hero.badge || '')
            setHeroTitle(data.hero.title || '')
            setHeroSubtitle(data.hero.subtitle || '')
            setHeroCtaText(data.hero.ctaText || '')
            setHeroCtaLink(data.hero.ctaLink || '')
            setHeroImageUrl(data.hero.imageUrl || '')
          }
        }
      } catch (err) {
        console.error('Banner ayarları yüklenemedi:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBanner()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/settings/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcement: {
            enabled: announcementEnabled,
            text: announcementText,
            link: announcementLink,
          },
          hero: {
            badge: heroBadge,
            title: heroTitle,
            subtitle: heroSubtitle,
            ctaText: heroCtaText,
            ctaLink: heroCtaLink,
            imageUrl: heroImageUrl,
          },
        }),
      })

      if (res.ok) {
        setSuccessMsg('Vitrin ve banner ayarları başarıyla kaydedildi! Sitenizde anında güncellendi.')
        setTimeout(() => setSuccessMsg(null), 5000)
      } else {
        setErrorMsg('Kaydedilirken bir hata oluştu.')
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
        Vitrin ayarları yükleniyor...
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Üst Başlık Barı */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-black" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              EDİTORYAL VİTRİN KONTROLÜ
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-black font-serif">
            Vitrin & Banner Yönetimi
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="px-3.5 py-2 text-xs font-light tracking-wider uppercase border border-neutral-200 hover:border-black transition-colors inline-flex items-center gap-1.5"
          >
            <span>Canlı Vitrini Aç</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Başarı & Hata Bildirimleri */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-light rounded-sm flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-light rounded-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. KISIM: DUYURU ÇUBUĞU (ANNOUNCEMENT BAR) */}
        <div className="bg-white border border-neutral-200/80 p-6 sm:p-7 rounded-sm shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <Bell size={16} className="text-black" />
              <div>
                <h2 className="text-sm font-light tracking-wider uppercase text-black">
                  Üst Duyuru Çubuğu (Announcement Bar)
                </h2>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                  Sitenin en tepesindeki ince editoryal kampanya & teklif bandı
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span className="text-xs font-mono text-neutral-500">
                {announcementEnabled ? 'GÖSTERİLİYOR' : 'GİZLİ'}
              </span>
              <div
                onClick={() => setAnnouncementEnabled(!announcementEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                  announcementEnabled ? 'bg-black' : 'bg-neutral-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    announcementEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Duyuru Metni
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Örn: 2026 İlkbahar / Yaz Koleksiyonu İçin Butik & Toptan Siparişler Açıldı"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Yönlendirme Linki (Opsiyonel)
              </label>
              <input
                type="text"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                placeholder="/inquiry veya #koleksiyon"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. KISIM: HERO BAŞLIKLAR & METİNLER */}
        <div className="bg-white border border-neutral-200/80 p-6 sm:p-7 rounded-sm shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
            <Sliders size={16} className="text-black" />
            <div>
              <h2 className="text-sm font-light tracking-wider uppercase text-black">
                Ana Sayfa Manşeti (Hero Content)
              </h2>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Ziyaretçiyi karşılayan ana sezon manşeti, slogan ve butonlar
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Üst Rozet / Koleksiyon Etiketi
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="SS26 ATELIER KOLEKSİYONU"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Ana Manşet Başlığı
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="ZAMANSIZ DERİ ZANAATI & MİMARİ SİLÜETLER"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-sm font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors font-serif tracking-wide"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Alt Açıklama & Slogan
              </label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={2}
                placeholder="Geleneksel saraç işçiliğini modern editoryal çizgilerle buluşturan el yapımı lüks çanta koleksiyonu."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                  Buton Metni
                </label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  placeholder="Koleksiyonu Keşfet"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                  Buton Hedef Linki
                </label>
                <input
                  type="text"
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  placeholder="#koleksiyon veya /inquiry"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. KISIM: HD LÜKS ÇANTA FOTOĞRAFLARI SEÇİCİ */}
        <div className="bg-white border border-neutral-200/80 p-6 sm:p-7 rounded-sm shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <ImageIcon size={16} className="text-black" />
              <div>
                <h2 className="text-sm font-light tracking-wider uppercase text-black">
                  Hero Kapak Görseli (HD Editoryal Fotoğraflar)
                </h2>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                  Aşağıdaki HD lüks çanta görsellerinden birine tıklayarak anında seçebilirsiniz
                </p>
              </div>
            </div>
          </div>

          {/* HD Önceden Seçilmiş Galeri Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {HD_CURATED_BAG_IMAGES.map((img) => {
              const isSelected = heroImageUrl === img.url
              return (
                <div
                  key={img.id}
                  onClick={() => setHeroImageUrl(img.url)}
                  className={`relative aspect-4/3 rounded-xs overflow-hidden border-2 cursor-pointer transition-all group ${
                    isSelected
                      ? 'border-black ring-2 ring-black/20 scale-[1.02]'
                      : 'border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-tight">
                      {img.category}
                    </span>
                    <span className="text-xs text-white font-light truncate">
                      {img.title}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-black text-white p-1 rounded-full shadow-md">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Özel Görsel URL Girişi */}
          <div className="pt-3 border-t border-neutral-100">
            <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
              Veya Özel Görsel URL'si Girin
            </label>
            <input
              type="url"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* 4. KISIM: CANLI MİNİ ÖNİZLEME */}
        <div className="bg-white border border-neutral-200/80 p-6 rounded-sm shadow-2xs space-y-3">
          <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block">
            CANLI VİTRİN ÖNİZLEMESİ (MİNYATÜR)
          </span>

          <div className="relative h-64 sm:h-72 w-full rounded overflow-hidden bg-neutral-900 flex items-center justify-center text-center p-6">
            {heroImageUrl && (
              <img
                src={heroImageUrl}
                alt="Hero Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-50 filter brightness-90"
              />
            )}
            <div className="relative z-10 max-w-lg space-y-2 text-white">
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-300 uppercase block">
                {heroBadge || 'KOLEKSİYON'}
              </span>
              <h3 className="text-lg sm:text-xl font-light font-serif tracking-wider uppercase">
                {heroTitle || 'MANŞET BAŞLIĞI'}
              </h3>
              <p className="text-xs text-neutral-300 font-light max-w-sm mx-auto line-clamp-2">
                {heroSubtitle || 'Açıklama metni burada görünecektir.'}
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 bg-white text-black text-[10px] font-light tracking-widest uppercase shadow">
                  {heroCtaText || 'Keşfet'}
                </span>
              </div>
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
            <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Vitrine Uygula'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
