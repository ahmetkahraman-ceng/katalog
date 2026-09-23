'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import { slugify } from '@/lib/utils'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'
import { PlusCircle } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Manuel ve hemen seçilebilir hazır kategoriler (asla yükleme beklemez)
  const [categories, setCategories] = useState<CategoryItem[]>(MANUAL_CATEGORIES)
  const [categoryId, setCategoryId] = useState(MANUAL_CATEGORIES[0].id)
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [customCategoryName, setCustomCategoryName] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [colors, setColors] = useState('')
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState('ACTIVE')
  const [error, setError] = useState('')

  useEffect(() => {
    async function syncExistingCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            // Mevcut veritabanı kategorilerini hazır listeyle birleştir
            const combined = [...MANUAL_CATEGORIES]
            data.forEach((dbCat: CategoryItem) => {
              if (!combined.some(c => c.slug === dbCat.slug || c.id === dbCat.id)) {
                combined.push(dbCat)
              }
            })
            setCategories(combined)
          }
        }
      } catch (err) {
        console.error('Kategori senkronizasyon:', err)
      }
    }
    syncExistingCategories()
  }, [])

  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(slugify(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const selectedCat = categories.find(c => c.id === categoryId)
    const effectiveCategoryId = isCustomCategory ? customCategoryName.trim() : categoryId
    const effectiveCategoryName = isCustomCategory 
      ? customCategoryName.trim() 
      : (selectedCat ? selectedCat.name : categoryId)

    if (!effectiveCategoryId) {
      setError('Lütfen bir kategori seçin veya yeni bir kategori adı yazın.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          categoryId: effectiveCategoryId,
          categoryName: effectiveCategoryName,
          description,
          priceMin: priceMin ? Number(priceMin) : null,
          priceMax: priceMax ? Number(priceMax) : null,
          images,
          colors: colors
            .split(',')
            .map(c => c.trim())
            .filter(Boolean),
          featured,
          status,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Ürün kaydedilirken hata oluştu')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-light tracking-wider mb-8">Yeni Ürün Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl p-8 shadow-sm">
        {/* Manuel Kategori Seçimi */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-light tracking-wider uppercase text-neutral-500">
              Kategori / Siluet *
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCustomCategory(!isCustomCategory)
                if (!isCustomCategory) {
                  setCustomCategoryName('')
                }
              }}
              className="text-xs text-neutral-600 hover:text-black flex items-center gap-1 transition-colors"
            >
              <PlusCircle size={13} />
              {isCustomCategory ? 'Listeden Seç' : '+ Farklı Kategori Yaz'}
            </button>
          </div>

          {!isCustomCategory ? (
            <select
              value={categoryId}
              onChange={e => {
                if (e.target.value === '__custom__') {
                  setIsCustomCategory(true)
                } else {
                  setCategoryId(e.target.value)
                }
              }}
              className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-black focus:outline-none"
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value="__custom__">+ Yeni Kategori / Siluet Tanımla...</option>
            </select>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={customCategoryName}
                onChange={e => setCustomCategoryName(e.target.value)}
                placeholder="Örn: Mini Bag, Portföy Çanta, Plaj Çantası..."
                className="w-full border-b border-neutral-400 bg-neutral-50 px-3 py-2.5 text-sm font-light focus:border-black focus:outline-none rounded-t"
                autoFocus
                required
              />
              <p className="text-xs text-neutral-400">
                Girdiğiniz kategori otomatik olarak veritabanına kaydedilip ürünle ilişkilendirilecektir.
              </p>
            </div>
          )}
        </div>

        <Input
          label="Ürün Adı *"
          id="name"
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="Örn: Deri Tote Çanta"
          required
        />

        <Input
          label="URL Slug"
          id="slug"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="deri-tote-canta"
          required
        />

        {/* Görsel Sürükle Bırak / Dosya Seç */}
        <ImageUploader
          images={images}
          onChange={setImages}
          maxImages={6}
        />

        <Textarea
          label="Açıklama"
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Ürün özellikleri, malzeme bilgisi ve detayları..."
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Min Fiyat (₺)"
            id="priceMin"
            type="number"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            placeholder="0"
          />
          <Input
            label="Max Fiyat (₺)"
            id="priceMax"
            type="number"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            placeholder="0"
          />
        </div>

        <Input
          label="Renkler (virgülle ayırın)"
          id="colors"
          value={colors}
          onChange={e => setColors(e.target.value)}
          placeholder="Siyah, Kahverengi, Bordo"
        />

        {/* Öne Çıkan & Durum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-light tracking-wider uppercase text-neutral-500 mb-2">
              Yayın Durumu
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-black focus:outline-none"
            >
              <option value="ACTIVE">Aktif (Vitrinde Görünür)</option>
              <option value="DRAFT">Taslak</option>
              <option value="ARCHIVED">Arşiv</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
              />
              <span className="text-sm font-light text-neutral-700">
                Öne Çıkar (Ana sayfada göster)
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-light rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button type="submit" isLoading={loading}>
            Kaydet
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Vazgeç
          </Button>
        </div>
      </form>
    </div>
  )
}
