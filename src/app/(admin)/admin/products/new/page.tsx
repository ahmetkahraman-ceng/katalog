'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import { slugify } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
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
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
          if (data.length > 0) {
            setCategoryId(data[0].id)
          }
        }
      } catch (err) {
        console.error('Kategoriler yüklenemedi:', err)
      }
    }
    loadCategories()
  }, [])

  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(slugify(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!categoryId) {
      setError('Lütfen bir kategori seçin.')
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
          categoryId,
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
        {/* Kategori Seçimi */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-neutral-500 mb-2">
            Kategori *
          </label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm font-light focus:border-black focus:outline-none"
            required
          >
            {categories.length === 0 ? (
              <option value="">Kategoriler yükleniyor...</option>
            ) : (
              categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
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
