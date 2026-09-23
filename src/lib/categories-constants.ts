export interface ManualCategory {
  id: string
  name: string
  slug: string
}

export const MANUAL_CATEGORIES: ManualCategory[] = [
  { id: 'el-cantasi', name: 'El Çantası & Tote', slug: 'el-cantasi' },
  { id: 'sirt-cantasi', name: 'Sırt Çantası', slug: 'sirt-cantasi' },
  { id: 'laptop-cantasi', name: 'Laptop & Tablet Çantası', slug: 'laptop-cantasi' },
  { id: 'evrak-cantasi', name: 'Executive Evrak Çantası', slug: 'evrak-cantasi' },
  { id: 'omuz-cantasi', name: 'Omuz & Postacı Çantası (Crossbody)', slug: 'omuz-cantasi' },
  { id: 'clutch-cantasi', name: 'Clutch & Portföy Çanta', slug: 'clutch-cantasi' },
  { id: 'seyahat-cantasi', name: 'Seyahat & Hafta Sonu Çantası', slug: 'seyahat-cantasi' },
  { id: 'cuzdan-aksesuar', name: 'Cüzdan & Küçük Deri Aksesuar', slug: 'cuzdan-aksesuar' },
  { id: 'ozel-tasarim', name: 'Özel Tasarım / Butik Üretim', slug: 'ozel-tasarim' },
]
