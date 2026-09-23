export interface BannerSlide {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  badge: string
  ctaText: string
  ctaLink: string
}

export interface SiteSettings {
  announcement: {
    enabled: boolean
    text: string
    link?: string
  }
  hero: {
    badge: string
    title: string
    subtitle: string
    ctaText: string
    ctaLink: string
    imageUrl: string
    slides: BannerSlide[]
  }
  atelier: {
    name: string
    tagline: string
    phone: string
    whatsapp: string
    whatsappDefaultMessage: string
    email: string
    address: string
    workingHours: string
    catalogPdfUrl: string
    instagramUrl: string
    pinterestUrl: string
    linkedinUrl: string
  }
}

// Curated HD Luxury Leather Bag Photos from Unsplash
export const HD_CURATED_BAG_IMAGES = [
  {
    id: 'hd-tote-noir',
    title: 'Siyah Deri Editoryal Tote',
    category: 'Tote & Omuz Çantası',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'hd-crossbody-caramel',
    title: 'Karamel Deri Baget & Postacı',
    category: 'Crossbody',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'hd-craft-close',
    title: 'El Dikişi Zanaat Detayı',
    category: 'Atölye & İşçilik',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'hd-travel-leather',
    title: 'Vintage Deri Seyahat & Hafta Sonu',
    category: 'Sırt & Seyahat',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'hd-atelier-brown',
    title: 'Atölye İmzalı Taba Tote',
    category: 'Koleksiyon',
    url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'hd-minimal-ivory',
    title: 'Minimalist Fildişi & Krem Silüet',
    category: 'El Çantası',
    url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1600&auto=format&fit=crop',
  },
]

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcement: {
    enabled: true,
    text: '2026 İlkbahar / Yaz Koleksiyonu İçin Butik & Toptan Siparişler Açıldı • Özel Üretim Teklifi Alın',
    link: '/inquiry',
  },
  hero: {
    badge: 'SS26 ATELIER KOLEKSİYONU',
    title: 'ZAMANSIZ DERİ ZANAATI & MİMARİ SİLÜETLER',
    subtitle:
      'Geleneksel saraç işçiliğini modern editoryal çizgilerle buluşturan el yapımı lüks çanta koleksiyonu.',
    ctaText: 'Koleksiyonu Keşfet',
    ctaLink: '#koleksiyon',
    imageUrl:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop',
    slides: [
      {
        id: 'slide-1',
        title: 'ZAMANSIZ DERİ ZANAATI',
        subtitle: 'Usta ellerde şekillenen el yapımı lüks çanta koleksiyonu.',
        imageUrl:
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop',
        badge: 'SS26 KOLEKSİYONU',
        ctaText: 'Koleksiyonu İncele',
        ctaLink: '#koleksiyon',
      },
      {
        id: 'slide-2',
        title: 'MİMARİ BAGET & TOTE',
        subtitle: 'Gün boyu zarafeti taşıyan hakiki deri silüetler.',
        imageUrl:
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1600&auto=format&fit=crop',
        badge: 'ÖZEL İŞÇİLİK',
        ctaText: 'Teklif İste',
        ctaLink: '/inquiry',
      },
    ],
  },
  atelier: {
    name: 'ÇANTA ATELIER',
    tagline: 'Hakiki Deri ve Zanaatkâr El İşçiliği',
    phone: '+90 (212) 555 01 23',
    whatsapp: '905555550123',
    whatsappDefaultMessage:
      'Merhaba, çanta modelleriniz ve özel üretim teklifleri hakkında bilgi almak istiyorum.',
    email: 'info@cantaatelier.com',
    address: 'Nişantaşı / Teşvikiye Cad. No: 42, Şişli, İstanbul',
    workingHours: 'Pazartesi - Cumartesi: 09:30 - 19:00',
    catalogPdfUrl: '/katalog-2026.pdf',
    instagramUrl: 'https://instagram.com',
    pinterestUrl: 'https://pinterest.com',
    linkedinUrl: 'https://linkedin.com',
  },
}
