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

// Curated HD Promotional & Corporate Backpacks and Hand/Tote Bags
export const HD_CURATED_BAG_IMAGES = [
  {
    id: 'hd-sirt-antrasit',
    title: 'Antrasit Executive Laptop Sırt Çantası',
    category: 'Sırt Çantası',
    url: '/products/sirt-canta-antrasit-laptop.png',
  },
  {
    id: 'hd-sirt-bosch',
    title: 'Ergonomik Kurumsal Promosyon Sırt Çantası',
    category: 'Sırt Çantası',
    url: '/products/sirt-canta-bosch-kurumsal.png',
  },
  {
    id: 'hd-sirt-bordo',
    title: 'Promosyon Okul & Kurs Sırt Çantası',
    category: 'Sırt Çantası',
    url: '/products/sirt-canta-bordo-okul.png',
  },
  {
    id: 'hd-sirt-haki',
    title: 'Özel Desen Baskılı Promosyon Sırt Çantası',
    category: 'Sırt Çantası',
    url: '/products/sirt-canta-haki-desenli.jpg',
  },
  {
    id: 'hd-bez-el-canta',
    title: 'Doğa Dostu Ham Pamuk Bez El Çantası',
    category: 'Bez & El Çantası',
    url: 'https://images.unsplash.com/photo-1597463510526-9f1e1a49f16b?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'hd-evrak-laptop',
    title: 'Executive Laptop & Evrak El Çantası',
    category: 'Evrak & Laptop Çantası',
    url: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?q=80&w=1600&auto=format&fit=crop',
  },
]

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcement: {
    enabled: true,
    text: '2026 Koleksiyonu Kurumsal & Toptan Siparişler Açıldı • 24 Saatte Hızlı Teklif Alın',
    link: '/inquiry',
  },
  hero: {
    badge: 'KURUMSAL & PROMOSYON ÇÖZÜMLERİ',
    title: 'MARKANIZI TAŞIYAN KALİTELİ TOPTAN ÇANTALAR',
    subtitle:
      'Fuar, kongre, çalışan kiti ve kurumsal etkinlikleriniz için firmanızın logosuna özel toptan sırt çantası, bez çanta ve evrak çantası imalatı.',
    ctaText: 'Kataloğu Keşfet',
    ctaLink: '/categories/sirt-cantasi',
    imageUrl: '/products/sirt-canta-antrasit-laptop.png',
    slides: [
      {
        id: 'slide-1',
        title: 'PROMOSYON SIRT ÇANTASI İMALATI',
        subtitle: 'Logonuzla özel baskılı ve nakışlı dayanıklı kurumsal sırt çantaları.',
        imageUrl: '/products/sirt-canta-antrasit-laptop.png',
        badge: 'TOPTAN İMALAT',
        ctaText: 'Modelleri İncele',
        ctaLink: '/categories/sirt-cantasi',
      },
      {
        id: 'slide-2',
        title: 'DOĞA DOSTU HAM BEZ ÇANTA',
        subtitle: '%100 pamuklu, geri dönüştürülebilir ve çevre dostu fuar çantaları.',
        imageUrl:
          'https://images.unsplash.com/photo-1597463510526-9f1e1a49f16b?q=80&w=1600&auto=format&fit=crop',
        badge: 'ÇEVRE DOSTU',
        ctaText: 'Teklif İste',
        ctaLink: '/categories/bez-canta',
      },
    ],
  },
  atelier: {
    name: 'ÇANTA PRO',
    tagline: 'Promosyon & Kurumsal Çanta Çözümleri',
    phone: '+90 (530) 000 00 00',
    whatsapp: '905300000000',
    whatsappDefaultMessage:
      'Merhaba, kurumsal toptan çanta üretimi ve fiyat teklifi hakkında bilgi almak istiyorum.',
    email: 'teklif@cantapro.com',
    address: 'İkitelli OSB, Çanta İmalatçıları Sanayi Sitesi, Başakşehir / İstanbul',
    workingHours: 'Hafta içi 09:00 - 18:00',
    catalogPdfUrl: '/katalog-2026.pdf',
    instagramUrl: 'https://instagram.com/cantapro',
    pinterestUrl: 'https://pinterest.com',
    linkedinUrl: 'https://linkedin.com/company/cantapro',
  },
}
