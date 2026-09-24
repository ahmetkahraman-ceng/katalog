import fs from 'fs'
import path from 'path'
import os from 'os'
import { prisma } from './prisma'
import { MANUAL_CATEGORIES } from './categories-constants'

export interface StoredProductImage {
  id?: string
  url: string
  alt?: string | null
  order?: number
}

export interface StoredProductSpec {
  id?: string
  specKey: string
  specValue: string
  sortOrder?: number
}

export interface StoredProductExample {
  id?: string
  imageUrl: string
  title?: string | null
  sortOrder?: number
}

export interface StoredProductFaq {
  id?: string
  question: string
  answer: string
  sortOrder?: number
}

export interface StoredProductVariant {
  id?: string
  variantName: string
  variantType?: string
  imageUrl?: string | null
  sortOrder?: number
}

export interface StoredProduct {
  id: string
  name: string
  slug: string
  sku?: string | null
  minOrderQty?: number | null
  description?: string | null
  priceMin?: number | null
  priceMax?: number | null
  colors: string[]
  badge?: string | null // "Yeni", "Popüler", "Sınırlı Stok"
  tags?: string[]
  featured: boolean
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
  }
  images: StoredProductImage[]
  specs?: StoredProductSpec[]
  examples?: StoredProductExample[]
  faqs?: StoredProductFaq[]
  variants?: StoredProductVariant[]
  createdAt: string
  updatedAt: string
}

// Initial curated luxury bag catalog with H&M/Zara & Promozone B2B specs, examples, and faqs
export const INITIAL_PRODUCTS: StoredProduct[] = [
  {
    id: 'prod-el-minimal',
    name: 'Ham Pamuklu Kurumsal Tote Bez Çanta',
    slug: 'ham-pamuklu-kurumsal-tote-bez-canta',
    description:
      'Geniş iç hacmi, güçlendirilmiş kulpları ve doğal pamuk dokusu ile şirket etkinlikleri, fuarlar ve kurumsal hediyeler için mükemmel bir seçenek.\n\nÖzellikler:\n- %100 Doğal Ham Pamuk (140 gr/m²)\n- Çift dikiş takviyeli taşıma sapları\n- İki yönlü yüksek çözünürlüklü serigrafi veya DTF baskı imkanı',
    priceMin: 35,
    priceMax: 65,
    colors: ['Ham Bej', 'Siyah', 'Lacivert'],
    badge: 'Popüler',
    tags: ['Ham Bez', 'Tote', 'Promosyon Bez Çanta', 'Fuar Çantası'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'bez-canta',
    category: {
      id: 'bez-canta',
      name: 'Bez Çanta',
      slug: 'bez-canta',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop',
        alt: 'Ham Pamuklu Bez Çanta Ön Görünüm',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
        alt: 'Ham Pamuklu Bez Çanta Detay ve Dikiş',
        order: 1,
      },
    ],
    specs: [
      { specKey: 'Kumaş Türü', specValue: '%100 Doğal Ham Pamuk (140 gr/m²)', sortOrder: 0 },
      { specKey: 'Ölçüler', specValue: '35 x 40 cm (Tabansız veya Körüklü opsiyon)', sortOrder: 1 },
      { specKey: 'Taşıma Kapasitesi', specValue: '10 - 12 kg', sortOrder: 2 },
      { specKey: 'Askı / Kulp Tipi', specValue: '70 cm omuz askılı, çapraz takviyeli dikiş', sortOrder: 3 },
      { specKey: 'Baskı Seçenekleri', specValue: 'Serigrafi, DTF Transfer, Nakış veya Transfer Baskı', sortOrder: 4 },
      { specKey: 'Minimum Sipariş', specValue: '100 Adet (Baskılı)', sortOrder: 5 },
      { specKey: 'Termin Süresi', specValue: '5 - 7 İş Günü', sortOrder: 6 },
    ],
    examples: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
        title: 'Örnek 2 Renk Serigrafi Uygulama',
        sortOrder: 0,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
        title: 'Kurumsal Kongre Baskısı',
        sortOrder: 1,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop',
        title: 'Renkli DTF Transfer Baskı',
        sortOrder: 2,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
        title: 'Özel Kulp ve Etiket İmalatı',
        sortOrder: 3,
      },
    ],
    faqs: [
      {
        question: 'Ham bez çantanın gramaj seçenekleri nelerdir?',
        answer: 'Standart olarak 140 gr/m² ham bez kullanmaktayız. Talep üzerine 220 gr gabardin veya 320 gr kanvas kumaş seçeneklerimiz de mevcuttur.',
        sortOrder: 0,
      },
      {
        question: 'Yıkandığında çekme yapar mı?',
        answer: '%100 doğal pamuk olduğu için 30 derecede elde veya hassas yıkama önerilir. Yüksek sıcaklıkta kurutma yapılmamalıdır.',
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: 'var-el-1',
        variantName: 'Ham Bej',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 0,
      },
      {
        id: 'var-el-2',
        variantName: 'Siyah',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 1,
      },
      {
        id: 'var-el-3',
        variantName: 'Lacivert',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 2,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-sirt-nordic',
    name: 'Nordic Korumalı Laptop Sırt Çantası',
    slug: 'nordic-korumali-laptop-sirt-cantasi',
    description:
      'İskandinav estetiğini yansıtan fonksiyonel ve minimalist şehir sırt çantası. Suya dayanıklı imperteks kumaş, 15.6 inç sünger dolgulu laptop bölmesi ve ergonomik sırt desteği.',
    priceMin: 280,
    priceMax: 420,
    colors: ['Siyah', 'Antrasit Gri', 'Lacivert'],
    badge: 'Yeni',
    tags: ['Sırt Çantası', 'Laptop', 'Promosyon Sırt Çantası', 'Su Geçirmez'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'sirt-cantasi',
    category: {
      id: 'sirt-cantasi',
      name: 'Sırt Çantası',
      slug: 'sirt-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        alt: 'Nordic Sırt Çantası Ön Görünüm',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        alt: 'Nordic Sırt Çantası İç Bölme ve Sırt Desteği',
        order: 1,
      },
    ],
    specs: [
      { specKey: 'Kumaş / Dış Malzeme', specValue: '600D Su Geçirmez İmperteks Kumaş', sortOrder: 0 },
      { specKey: 'İç Hacim & Kapasite', specValue: '18 Litre (15.6 inç Laptop uyumlu)', sortOrder: 1 },
      { specKey: 'Fermuar & Aksesuar', specValue: 'Tip 8 Kaliteli Metal Başlıklı Fermuar', sortOrder: 2 },
      { specKey: 'Bölmeler', specValue: 'Ana bölme, ön fermuarlı cep, 2 yan matara cebi', sortOrder: 3 },
      { specKey: 'Baskı Seçenekleri', specValue: 'Kauçuk Etiket, Nakış, Reflektörlü Baskı veya Serigrafi', sortOrder: 4 },
      { specKey: 'Minimum Sipariş', specValue: '50 Adet', sortOrder: 5 },
      { specKey: 'Termin Süresi', specValue: '7 - 10 İş Günü', sortOrder: 6 },
    ],
    examples: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
        title: 'Kauçuk Logo Uygulaması',
        sortOrder: 0,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
        title: 'Şirket Çalışanlarına Özel Nakış',
        sortOrder: 1,
      },
    ],
    faqs: [
      {
        question: 'Yağmurda su geçirir mi?',
        answer: 'Dış imperteks kumaşı ve içindeki su itici astarı sayesinde yoğun yağış hariç günlük su sıçramalarına ve yağmura karşı tam koruma sağlar.',
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: 'var-sirt-1',
        variantName: 'Siyah',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 0,
      },
      {
        id: 'var-sirt-2',
        variantName: 'Antrasit Gri',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 1,
      },
      {
        id: 'var-sirt-3',
        variantName: 'Lacivert',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 2,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-evrak-exec',
    name: 'Executive Seminer & Evrak Çantası',
    slug: 'executive-seminer-evrak-cantasi',
    description:
      'İnce silüeti, sünger destekli koruyucu gövdesi ve ayarlanabilir omuz askısı ile kongre, seminer ve yönetim kurulu toplantıları için tasarlanmış kurumsal evrak çantası.',
    priceMin: 180,
    priceMax: 310,
    colors: ['Siyah', 'Koyu Gri'],
    badge: 'Popüler',
    tags: ['Evrak Çantası', 'Seminer', 'Kongre', 'Kurumsal'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'fuar-kongre-cantasi',
    category: {
      id: 'fuar-kongre-cantasi',
      name: 'Fuar & Kongre Çantası',
      slug: 'fuar-kongre-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
        alt: 'Executive Evrak Çantası',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
        alt: 'Executive Evrak Çantası Yan ve İç Cep',
        order: 1,
      },
    ],
    specs: [
      { specKey: 'Malzeme', specValue: 'Lüks Keten Dokulu Su İtici Kumaş', sortOrder: 0 },
      { specKey: 'Ölçüler', specValue: '39 x 29 x 6 cm (A4 ve 14 inç uyumlu)', sortOrder: 1 },
      { specKey: 'İç Yapı', specValue: 'Darbeye dayanıklı 8mm eva sünger destekli astar', sortOrder: 2 },
      { specKey: 'Baskı Alanı', specValue: 'Ön kapak merkez (12 x 8 cm logo alanı)', sortOrder: 3 },
      { specKey: 'Minimum Sipariş', specValue: '50 Adet', sortOrder: 4 },
    ],
    variants: [
      {
        id: 'var-evrak-1',
        variantName: 'Siyah',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 0,
      },
      {
        id: 'var-evrak-2',
        variantName: 'Koyu Gri',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 1,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-laptop-metro',
    name: 'Metropolitan Dolgulu Laptop Kılıf Çanta',
    slug: 'metropolitan-dolgulu-laptop-kilif-canta',
    description:
      'Hafif, taşınabilir ve dolgulu koruyucu iç katman. Şarj adaptörü, mouse ve kablolar için ön fermuarlı ek aksesuar cebi.',
    priceMin: 140,
    priceMax: 240,
    colors: ['Siyah', 'Bej', 'Füme'],
    badge: 'Sınırlı Stok',
    tags: ['Laptop', 'Kılıf', 'Promosyon Laptop', 'Süngerli'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'laptop-cantasi',
    category: {
      id: 'laptop-cantasi',
      name: 'Laptop & Tablet Çantası',
      slug: 'laptop-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
        alt: 'Metropolitan Laptop Çantası',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        alt: 'Metropolitan Laptop Çantası İç Yumuşak Astar',
        order: 1,
      },
    ],
    specs: [
      { specKey: 'Malzeme', specValue: 'Neopren & Su Geçirmez Kumaş Kombinasyonu', sortOrder: 0 },
      { specKey: 'Ölçü Uyumluluğu', specValue: '13.3 inç - 14.1 inç ve 15.6 inç alternatifler', sortOrder: 1 },
      { specKey: 'İç Kaplama', specValue: 'Çizilmez kadife peluş iç koruma', sortOrder: 2 },
      { specKey: 'Minimum Sipariş', specValue: '50 Adet', sortOrder: 3 },
    ],
    variants: [
      {
        id: 'var-laptop-1',
        variantName: 'Siyah',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 0,
      },
      {
        id: 'var-laptop-2',
        variantName: 'Bej',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 1,
      },
      {
        id: 'var-laptop-3',
        variantName: 'Füme',
        variantType: 'Renk',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        sortOrder: 2,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-karton-lux',
    name: 'Özel Varak Baskılı Lüks Karton Mağaza Çantası',
    slug: 'ozel-varak-baskili-luks-karton-magaza-cantasi',
    sku: 'KRT-001',
    minOrderQty: 500,
    description: 'Kuşe veya Amerikan Bristol kartondan, mat/parlak laminasyonlu, yaldız varak veya lak baskılı lüks butik ve mağaza çantası. Pamuk kordon saplı.',
    priceMin: 8,
    priceMax: 18,
    colors: ['Beyaz', 'Siyah', 'Kraft'],
    badge: 'Popüler',
    tags: ['Karton Çanta', 'Mağaza Çantası', 'Baskılı Poşet', 'Bristol'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'karton-canta',
    category: {
      id: 'karton-canta',
      name: 'Karton Çanta',
      slug: 'karton-canta',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
        alt: 'Lüks Karton Çanta',
        order: 0,
      },
    ],
    specs: [
      { specKey: 'Kağıt / Karton Türü', specValue: '250 gr Amerikan Bristol veya Kraft', sortOrder: 0 },
      { specKey: 'Laminasyon', specValue: 'Mat Selefon / Parlak Selefon', sortOrder: 1 },
      { specKey: 'Sap Tipi', specValue: 'Büküm Sap, Kurdele veya Pamuk Kordon', sortOrder: 2 },
      { specKey: 'Baskı', specValue: 'Ofset Baskı + Varak Yaldız / Bölgesel Lak', sortOrder: 3 },
      { specKey: 'Minimum Sipariş', specValue: '500 Adet', sortOrder: 4 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-deri-premium',
    name: 'Hakiki Deri Executive El & Evrak Çantası',
    slug: 'hakiki-deri-executive-el-evrak-cantasi',
    sku: 'DER-001',
    minOrderQty: 25,
    description: 'Birinci sınıf dana derisinden üretilmiş, pirinç metal aksesuarlı, iç bölmeli ve laptop hazneli prestijli kurumsal deri çanta.',
    priceMin: 850,
    priceMax: 1450,
    colors: ['Taba Kahve', 'Siyah', 'Bordo'],
    badge: 'Yeni',
    tags: ['Deri Çanta', 'Hakiki Deri', 'Executive', 'VIP Hediye'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'deri-canta',
    category: {
      id: 'deri-canta',
      name: 'Deri Çanta',
      slug: 'deri-canta',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
        alt: 'Hakiki Deri Çanta',
        order: 0,
      },
    ],
    specs: [
      { specKey: 'Deri Cinsi', specValue: '1. Sınıf Hakiki Dana Derisi (Vaketa)', sortOrder: 0 },
      { specKey: 'Astar & Fermuar', specValue: 'Süet astar, YKK antik pirinç fermuar', sortOrder: 1 },
      { specKey: 'Minimum Sipariş', specValue: '25 Adet', sortOrder: 2 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-spor-fit',
    name: 'Hafta Sonu & Spor Seyahat Çantası',
    slug: 'hafta-sonu-spor-seyahat-cantasi',
    sku: 'SPR-001',
    minOrderQty: 50,
    description: 'Ayakkabı bölmeli, su geçirmez astarlı, geniş hacimli ve omuz pedli spor/seyahat çantası. Fitness merkezleri ve kurumsal spor etkinlikleri için ideal.',
    priceMin: 220,
    priceMax: 350,
    colors: ['Siyah', 'Lacivert', 'Haki'],
    badge: 'Popüler',
    tags: ['Spor Çantası', 'Seyahat', 'Fitness', 'Duffle'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'spor-cantasi',
    category: {
      id: 'spor-cantasi',
      name: 'Spor Çantası',
      slug: 'spor-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        alt: 'Spor Seyahat Çantası',
        order: 0,
      },
    ],
    specs: [
      { specKey: 'Kumaş', specValue: 'Yüksek Mukavemetli Su Geçirmez Oxford Kumaş', sortOrder: 0 },
      { specKey: 'Kapasite', specValue: '35 Litre (Ayrı ayakkabı ve ıslak giysi gözü)', sortOrder: 1 },
      { specKey: 'Minimum Sipariş', specValue: '50 Adet', sortOrder: 2 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Global in-memory cache
const globalForProducts = globalThis as unknown as {
  __PRODUCTS_STORE__?: StoredProduct[]
}

const LOCAL_PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json')
const TMP_PRODUCTS_FILE = path.join(os.tmpdir(), 'products.json')

function readLocalStoredProducts(): StoredProduct[] {
  if (globalForProducts.__PRODUCTS_STORE__ && globalForProducts.__PRODUCTS_STORE__.length > 0) {
    return globalForProducts.__PRODUCTS_STORE__
  }

  // Try /tmp/products.json
  try {
    if (fs.existsSync(TMP_PRODUCTS_FILE)) {
      const data = fs.readFileSync(TMP_PRODUCTS_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalForProducts.__PRODUCTS_STORE__ = parsed
        return parsed
      }
    }
  } catch (err) {
    console.warn('Could not read from tmp products file:', err)
  }

  // Try src/data/products.json
  try {
    if (fs.existsSync(LOCAL_PRODUCTS_FILE)) {
      const data = fs.readFileSync(LOCAL_PRODUCTS_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalForProducts.__PRODUCTS_STORE__ = parsed
        return parsed
      }
    }
  } catch (err) {
    console.warn('Could not read from local products file:', err)
  }

  // Fallback to INITIAL_PRODUCTS
  globalForProducts.__PRODUCTS_STORE__ = [...INITIAL_PRODUCTS]
  return globalForProducts.__PRODUCTS_STORE__
}

function persistStoredProducts(products: StoredProduct[]) {
  globalForProducts.__PRODUCTS_STORE__ = products

  // Write to /tmp
  try {
    fs.writeFileSync(TMP_PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Failed writing products to tmpdir:', err)
  }

  // Write to local project file (if writable)
  try {
    const dir = path.dirname(LOCAL_PRODUCTS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(LOCAL_PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  } catch {
    // Expected on Vercel read-only filesystem; ignored!
  }
}

/**
 * Returns all products. Tries Prisma first; if empty or DB offline, returns stored products.
 */
export async function getAllProducts(): Promise<StoredProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        specs: { orderBy: { sortOrder: 'asc' } },
        examples: { orderBy: { sortOrder: 'asc' } },
        faqs: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: (p as any).sku || null,
        minOrderQty: (p as any).minOrderQty || 50,
        description: p.description,
        priceMin: p.priceMin ? Number(p.priceMin) : null,
        priceMax: p.priceMax ? Number(p.priceMax) : null,
        colors: p.colors || [],
        badge: (p as any).badge || null,
        tags: (p as any).tags || [],
        featured: Boolean(p.featured),
        status: p.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
        categoryId: p.categoryId,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
            }
          : undefined,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          order: img.order,
        })),
        specs: (p as any).specs?.map((s: any) => ({
          id: s.id,
          specKey: s.specKey,
          specValue: s.specValue,
          sortOrder: s.sortOrder,
        })) || [],
        examples: (p as any).examples?.map((e: any) => ({
          id: e.id,
          imageUrl: e.imageUrl,
          title: e.title,
          sortOrder: e.sortOrder,
        })) || [],
        faqs: (p as any).faqs?.map((f: any) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          sortOrder: f.sortOrder,
        })) || [],
        variants: (p as any).variants?.map((v: any) => ({
          id: v.id,
          variantName: v.variantName,
          variantType: v.variantType,
          imageUrl: v.imageUrl,
          sortOrder: v.sortOrder,
        })) || [],
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))
    }
  } catch {
    // DB not reachable or unseeded; fallback cleanly to store
  }

  return readLocalStoredProducts()
}

/**
 * Finds a product by ID or slug.
 */
export async function getProductByIdOrSlug(idOrSlug: string): Promise<StoredProduct | null> {
  try {
    const p = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        specs: { orderBy: { sortOrder: 'asc' } },
        examples: { orderBy: { sortOrder: 'asc' } },
        faqs: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    })

    if (p) {
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: (p as any).sku || null,
        minOrderQty: (p as any).minOrderQty || 50,
        description: p.description,
        priceMin: p.priceMin ? Number(p.priceMin) : null,
        priceMax: p.priceMax ? Number(p.priceMax) : null,
        colors: p.colors || [],
        badge: (p as any).badge || null,
        tags: (p as any).tags || [],
        featured: Boolean(p.featured),
        status: p.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
        categoryId: p.categoryId,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
            }
          : undefined,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          order: img.order,
        })),
        specs: (p as any).specs?.map((s: any) => ({
          id: s.id,
          specKey: s.specKey,
          specValue: s.specValue,
          sortOrder: s.sortOrder,
        })) || [],
        examples: (p as any).examples?.map((e: any) => ({
          id: e.id,
          imageUrl: e.imageUrl,
          title: e.title,
          sortOrder: e.sortOrder,
        })) || [],
        faqs: (p as any).faqs?.map((f: any) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          sortOrder: f.sortOrder,
        })) || [],
        variants: (p as any).variants?.map((v: any) => ({
          id: v.id,
          variantName: v.variantName,
          variantType: v.variantType,
          imageUrl: v.imageUrl,
          sortOrder: v.sortOrder,
        })) || [],
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }
    }
  } catch {
    // fallback
  }

  const stored = readLocalStoredProducts()
  return stored.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
}

/**
 * Finds products by category (slug or ID).
 */
export async function getProductsByCategory(categorySlugOrId: string): Promise<StoredProduct[]> {
  const all = await getAllProducts()
  const target = categorySlugOrId.toLowerCase().trim()
  return all.filter((p) => {
    const catSlug = p.category?.slug?.toLowerCase()
    const catId = p.categoryId?.toLowerCase()
    return catSlug === target || catId === target || p.slug.includes(target)
  })
}

/**
 * Returns featured active products for the homepage.
 */
export async function getFeaturedProducts(limit = 8): Promise<StoredProduct[]> {
  const all = await getAllProducts()
  const featured = all.filter((p) => p.featured && p.status === 'ACTIVE')
  return (featured.length > 0 ? featured : all.filter((p) => p.status === 'ACTIVE')).slice(0, limit)
}

/**
 * Adds a new product to store (and DB if available).
 */
export async function saveProductToStore(productData: {
  name: string
  slug: string
  description?: string | null
  priceMin?: number | null
  priceMax?: number | null
  colors?: string[]
  badge?: string | null
  tags?: string[]
  featured?: boolean
  sku?: string | null
  minOrderQty?: number | null
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  categoryId: string
  categoryName?: string
  images: string[]
  specs?: { specKey: string; specValue: string; sortOrder?: number }[]
  examples?: { imageUrl: string; title?: string | null; sortOrder?: number }[]
  faqs?: { question: string; answer: string; sortOrder?: number }[]
  variants?: { variantName: string; variantType?: string; imageUrl?: string | null; sortOrder?: number }[]
}): Promise<StoredProduct> {
  const newId = `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  const matchedCategory = MANUAL_CATEGORIES.find(
    (c) => c.id === productData.categoryId || c.slug === productData.categoryId
  )

  const categoryName = productData.categoryName || matchedCategory?.name || productData.categoryId
  const categorySlug = matchedCategory?.slug || productData.categoryId

  const newProduct: StoredProduct = {
    id: newId,
    name: productData.name,
    slug: productData.slug,
    sku: productData.sku || null,
    minOrderQty: productData.minOrderQty || 50,
    description: productData.description || null,
    priceMin: productData.priceMin || null,
    priceMax: productData.priceMax || null,
    colors: productData.colors || [],
    badge: productData.badge || null,
    tags: productData.tags || [],
    featured: Boolean(productData.featured),
    status: productData.status || 'ACTIVE',
    categoryId: productData.categoryId,
    category: {
      id: productData.categoryId,
      name: categoryName,
      slug: categorySlug,
    },
    images: productData.images.map((url, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      url,
      alt: productData.name,
      order: idx,
    })),
    specs: productData.specs || [],
    examples: productData.examples || [],
    faqs: productData.faqs || [],
    variants: (productData.variants || []).map((v, idx) => ({
      id: `var-${Date.now()}-${idx}`,
      variantName: v.variantName,
      variantType: v.variantType || 'Renk',
      imageUrl: v.imageUrl || null,
      sortOrder: v.sortOrder ?? idx,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Try creating in DB
  try {
    const { resolveCategoryId } = await import('./category-service')
    const validCatId = await resolveCategoryId(productData.categoryId, categoryName)
    const dbCreated = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        sku: productData.sku || null,
        minOrderQty: productData.minOrderQty || 50,
        description: productData.description || null,
        priceMin: productData.priceMin !== null && productData.priceMin !== undefined ? Number(productData.priceMin) : null,
        priceMax: productData.priceMax !== null && productData.priceMax !== undefined ? Number(productData.priceMax) : null,
        colors: productData.colors || [],
        badge: productData.badge || null,
        tags: productData.tags || [],
        status: (productData.status as any) || 'ACTIVE',
        categoryId: validCatId,
        featured: Boolean(productData.featured),
        images: productData.images.length > 0 ? {
          create: productData.images.map((url, idx) => ({
            url,
            alt: productData.name,
            order: idx,
          })),
        } : undefined,
        specs: productData.specs && productData.specs.length > 0 ? {
          create: productData.specs.map((s, idx) => ({
            specKey: s.specKey,
            specValue: s.specValue,
            sortOrder: s.sortOrder ?? idx,
          })),
        } : undefined,
        examples: productData.examples && productData.examples.length > 0 ? {
          create: productData.examples.map((e, idx) => ({
            imageUrl: e.imageUrl,
            title: e.title || null,
            sortOrder: e.sortOrder ?? idx,
          })),
        } : undefined,
        faqs: productData.faqs && productData.faqs.length > 0 ? {
          create: productData.faqs.map((f, idx) => ({
            question: f.question,
            answer: f.answer,
            sortOrder: f.sortOrder ?? idx,
          })),
        } : undefined,
        variants: productData.variants && productData.variants.length > 0 ? {
          create: productData.variants.map((v, idx) => ({
            variantName: v.variantName,
            variantType: v.variantType || 'Renk',
            imageUrl: v.imageUrl || null,
            sortOrder: v.sortOrder ?? idx,
          })),
        } : undefined,
      },
    })
    if (dbCreated?.id) {
      newProduct.id = dbCreated.id
    }
  } catch (err) {
    console.warn('DB product creation bypassed or failed, saved to store:', err)
  }

  // Always update persistent store
  const current = readLocalStoredProducts()
  const updated = [newProduct, ...current.filter((p) => p.slug !== newProduct.slug && p.id !== newProduct.id)]
  persistStoredProducts(updated)

  return newProduct
}

/**
 * Updates a product in store (and DB if available).
 */
export async function updateProductInStore(
  id: string,
  partial: Partial<StoredProduct> & { categoryName?: string }
): Promise<StoredProduct | null> {
  const current = readLocalStoredProducts()
  const existingIdx = current.findIndex((p) => p.id === id || p.slug === id)

  // Try updating in DB
  try {
    const existingDb = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    })

    if (existingDb) {
      let validCatId: string | undefined = undefined
      if (partial.categoryId) {
        const { resolveCategoryId } = await import('./category-service')
        validCatId = await resolveCategoryId(partial.categoryId, partial.categoryName)
      }

      await prisma.product.update({
        where: { id: existingDb.id },
        data: {
          name: partial.name,
          slug: partial.slug,
          sku: partial.sku !== undefined ? partial.sku : undefined,
          minOrderQty: partial.minOrderQty !== undefined ? (partial.minOrderQty ? Number(partial.minOrderQty) : 50) : undefined,
          description: partial.description,
          priceMin: partial.priceMin !== undefined ? (partial.priceMin ? Number(partial.priceMin) : null) : undefined,
          priceMax: partial.priceMax !== undefined ? (partial.priceMax ? Number(partial.priceMax) : null) : undefined,
          colors: partial.colors,
          badge: partial.badge,
          tags: partial.tags,
          status: partial.status as any,
          featured: partial.featured,
          categoryId: validCatId,
        },
      })

      if (partial.images && partial.images.length > 0) {
        await prisma.productImage.deleteMany({ where: { productId: existingDb.id } })
        await prisma.productImage.createMany({
          data: partial.images.map((img, idx) => ({
            productId: existingDb.id,
            url: img.url,
            alt: img.alt || partial.name || 'Çanta Görseli',
            order: idx,
          })),
        })
      }

      if (partial.specs) {
        await prisma.productSpec.deleteMany({ where: { productId: existingDb.id } })
        if (partial.specs.length > 0) {
          await prisma.productSpec.createMany({
            data: partial.specs.map((s, idx) => ({
              productId: existingDb.id,
              specKey: s.specKey,
              specValue: s.specValue,
              sortOrder: s.sortOrder ?? idx,
            })),
          })
        }
      }

      if (partial.examples) {
        await prisma.productExample.deleteMany({ where: { productId: existingDb.id } })
        if (partial.examples.length > 0) {
          await prisma.productExample.createMany({
            data: partial.examples.map((e, idx) => ({
              productId: existingDb.id,
              imageUrl: e.imageUrl,
              title: e.title || null,
              sortOrder: e.sortOrder ?? idx,
            })),
          })
        }
      }

      if (partial.faqs) {
        await prisma.productFaq.deleteMany({ where: { productId: existingDb.id } })
        if (partial.faqs.length > 0) {
          await prisma.productFaq.createMany({
            data: partial.faqs.map((f, idx) => ({
              productId: existingDb.id,
              question: f.question,
              answer: f.answer,
              sortOrder: f.sortOrder ?? idx,
            })),
          })
        }
      }

      if (partial.variants) {
        await prisma.productVariant.deleteMany({ where: { productId: existingDb.id } })
        if (partial.variants.length > 0) {
          await prisma.productVariant.createMany({
            data: partial.variants.map((v, idx) => ({
              productId: existingDb.id,
              variantName: v.variantName,
              variantType: v.variantType || 'Renk',
              imageUrl: v.imageUrl || null,
              sortOrder: v.sortOrder ?? idx,
            })),
          })
        }
      }
    }
  } catch (err) {
    console.warn('DB product update bypassed or failed:', err)
  }

  if (existingIdx === -1) {
    return null
  }

  const existing = current[existingIdx]
  const updatedItem: StoredProduct = {
    ...existing,
    ...partial,
    updatedAt: new Date().toISOString(),
  }

  current[existingIdx] = updatedItem
  persistStoredProducts(current)
  return updatedItem
}

/**
 * Deletes a product from store (and DB if available).
 */
export async function deleteProductFromStore(id: string): Promise<boolean> {
  try {
    const existingDb = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    })
    if (existingDb) {
      await prisma.productVariant.deleteMany({ where: { productId: existingDb.id } }).catch(() => {})
      await prisma.productSpec.deleteMany({ where: { productId: existingDb.id } }).catch(() => {})
      await prisma.productExample.deleteMany({ where: { productId: existingDb.id } }).catch(() => {})
      await prisma.productFaq.deleteMany({ where: { productId: existingDb.id } }).catch(() => {})
      await prisma.inquiryItem.deleteMany({ where: { productId: existingDb.id } }).catch(() => {})
      await prisma.productImage.deleteMany({ where: { productId: existingDb.id } }).catch(() => {})
      await prisma.product.delete({ where: { id: existingDb.id } })
    }
  } catch (err) {
    console.warn('DB product delete bypassed or failed:', err)
  }

  const current = readLocalStoredProducts()
  const filtered = current.filter((p) => p.id !== id && p.slug !== id)
  persistStoredProducts(filtered)
  return true
}
