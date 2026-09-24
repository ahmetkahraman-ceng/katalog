'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles,
  Save,
  CheckCircle2,
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
    try {
      const cachedHero = localStorage.getItem('site_hero_settings')
      if (cachedHero) {
        const h = JSON.parse(cachedHero)
        if (h.badge) setHeroBadge(h.badge)
        if (h.title) setHeroTitle(h.title)
        if (h.subtitle) setHeroSubtitle(h.subtitle)
        if (h.ctaText) setHeroCtaText(h.ctaText)
        if (h.ctaLink) setHeroCtaLink(h.ctaLink)
        if (h.imageUrl) setHeroImageUrl(h.imageUrl)
      }
      const cachedAnn = localStorage.getItem('site_announcement_settings')
      if (cachedAnn) {
        const a = JSON.parse(cachedAnn)
        setAnnouncementEnabled(Boolean(a.enabled))
        if (a.text) setAnnouncementText(a.text)
        if (a.link) setAnnouncementLink(a.link)
      }
    } catch {
      // ignore
    }

    async function loadBanner() {
      try {
        const res = await fetch(`/api/settings/banner?t=${Date.now()}`, { cache: 'no-store' })
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

    const payloadHero = {
      badge: heroBadge,
      title: heroTitle,
      subtitle: heroSubtitle,
      ctaText: heroCtaText,
      ctaLink: heroCtaLink,
      imageUrl: heroImageUrl,
    }

    const payloadAnnouncement = {
      enabled: announcementEnabled,
      text: announcementText,
      link: announcementLink,
    }

    try {
      localStorage.setItem('site_hero_settings', JSON.stringify(payloadHero))
      localStorage.setItem('site_announcement_settings', JSON.stringify(payloadAnnouncement))
      window.dispatchEvent(new Event('storage'))
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/settings/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcement: payloadAnnouncement,
          hero: payloadHero,
        }),
      })

      if (res.ok) {
        setSuccessMsg('Vitrin ve banner ayarları başarıyla kaydedildi! Sitenizde anında güncellendi.')
        setTimeout(() => setSuccessMsg(null), 6000)
      } else {
        const errData = await res.json().catch(() => ({}))
        setErrorMsg(errData.error || 'Kaydedilirken bir hata oluştu.')
      }
    } catch {
      setErrorMsg('Bağlantı hatası oluştu, ancak tarayıcı önbelleğinize kaydedildi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-neutral-400">
        Vitrin ayarları yükleniyor...
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Üst Başlık Barı */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-6">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#2d6a4f] uppercase block mb-1">
            VİTRİN & KAMPANYA YÖNETİMİ
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Vitrin & Banner Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Ana sayfa üst duyuru bandı ve hero manşet alanındaki başlık, görsel ve metinleri düzenleyin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            <span>Canlı Vitrini Aç</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Bildirimler */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#2d6a4f] shrink-0" />
            <span>{successMsg}</span>
          </div>
          <a
            href={`/?t=${Date.now()}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Canlı Görünümü Aç</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl shadow-2xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. DUYURU ÇUBUĞU */}
        <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center font-bold">
                <Bell size={16} />
              </div>
              <h2 className="text-sm font-bold text-neutral-900">
                Üst Duyuru Çubuğu (Announcement Bar)
              </h2>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {announcementEnabled ? 'GÖSTERİLİYOR' : 'GİZLİ'}
              </span>
              <div
                onClick={() => setAnnouncementEnabled(!announcementEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                  announcementEnabled ? 'bg-[#2d6a4f]' : 'bg-neutral-200'
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Duyuru Metni
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Örn: 2026 Koleksiyonu Toptan & Kurumsal Siparişler Açıldı • 24 Saatte Hızlı Teklif Alın"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Yönlendirme Linki (Opsiyonel)
              </label>
              <input
                type="text"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                placeholder="/inquiry veya /categories/bez-canta"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* 2. HERO BAŞLIKLAR & METİNLER */}
        <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center font-bold">
              <Sliders size={16} />
            </div>
            <h2 className="text-sm font-bold text-neutral-900">
              Ana Sayfa Manşeti (Hero Content)
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Üst Rozet / Koleksiyon Etiketi
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="KURUMSAL & PROMOSYON ÇANTA ÇÖZÜMLERİ"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Ana Manşet Başlığı
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Markanızı Taşıyan Yüksek Kaliteli Toptan Çantalar"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Alt Açıklama & Slogan
              </label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={2}
                placeholder="Fuar, etkinlik, çalışan kiti ve kurumsal hediyeleriniz için firmanıza özel logo baskılı toptan çanta üretimi."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all resize-none shadow-2xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Buton Metni
                </label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  placeholder="Kataloğu Keşfet"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Buton Hedef Linki
                </label>
                <input
                  type="text"
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  placeholder="/categories/bez-canta"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. HD GÖRSEL SEÇİCİ */}
        <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center font-bold">
              <ImageIcon size={16} />
            </div>
            <h2 className="text-sm font-bold text-neutral-900">
              Hero Kapak Görseli
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {HD_CURATED_BAG_IMAGES.map((img) => {
              const isSelected = heroImageUrl === img.url
              return (
                <div
                  key={img.id}
                  onClick={() => setHeroImageUrl(img.url)}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                    isSelected
                      ? 'border-[#2d6a4f] ring-2 ring-[#2d6a4f]/20 scale-[1.02]'
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
                    <span className="text-xs text-white font-medium truncate">
                      {img.title}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#2d6a4f] text-white p-1 rounded-full shadow-md">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Veya Özel Görsel URL&apos;si Girin
            </label>
            <input
              type="url"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Save size={16} />
            <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Vitrine Uygula'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
