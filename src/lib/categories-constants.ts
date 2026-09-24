export interface ManualCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string // emoji veya lucide icon adı
}

export const MANUAL_CATEGORIES: ManualCategory[] = [
  {
    id: 'bez-canta',
    name: 'Bez Çanta',
    slug: 'bez-canta',
    description: 'Doğal pamuklu bez çantalar, baskılı promosyon çantaları',
    icon: '👜',
  },
  {
    id: 'sirt-cantasi',
    name: 'Sırt Çantası',
    slug: 'sirt-cantasi',
    description: 'Günlük kullanım ve seyahat sırt çantaları',
    icon: '🎒',
  },
  {
    id: 'karton-canta',
    name: 'Karton Çanta',
    slug: 'karton-canta',
    description: 'Özel tasarım karton ve kağıt çantalar',
    icon: '🛍️',
  },
  {
    id: 'laptop-cantasi',
    name: 'Laptop Çantası',
    slug: 'laptop-cantasi',
    description: 'Laptop ve tablet taşıma çantaları',
    icon: '💼',
  },
  {
    id: 'fuar-kongre-cantasi',
    name: 'Fuar & Kongre Çantası',
    slug: 'fuar-kongre-cantasi',
    description: 'Fuar, kongre ve etkinlik çantaları',
    icon: '📋',
  },
  {
    id: 'deri-canta',
    name: 'Deri Çanta',
    slug: 'deri-canta',
    description: 'Hakiki ve suni deri çantalar, el çantaları',
    icon: '👝',
  },
  {
    id: 'spor-cantasi',
    name: 'Spor Çantası',
    slug: 'spor-cantasi',
    description: 'Spor ve fitness çantaları, seyahat valizleri',
    icon: '🏋️',
  },
]
