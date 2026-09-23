'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import { slugify } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Props {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products/${id}`),
        ])

        if (catRes.ok) {
          const cats = await catRes.json()
          setCategories(cats)
        }

        if (prodRes.ok) {
          const prod = await prodRes.json()
          setName(prod.name || '')
          setSlug(prod.slug || '')
          setCategoryId(prod.categoryId || '')
          setDescription(prod.description || '')
          setPriceMin(prod.priceMin ? String(prod.priceMin) : '')
          setPriceMax(prod.priceMax ? String(prod.priceMax) : '')
          setImages(prod.images ? prod.images.map((img: any) => img.url) : [])
          setColors(prod.colors ? prod.colors.join(', ') : '')
          setFeatured(Boolean(prod.featured))
          setStatus(prod.status || 'ACTIVE')
        }
      } catch (err) {
        console.error('Veriler yüklenirken hata:', err)
      }
    }
    loadData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
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
        throw new Error(err.error || 'Güncellenirken hata oluştu')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/products')
        router.refresh()
      }
    } catch (err) {
      console.error('Silme hatası:', err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light tracking-wider">Ürünü Düzenle</h1>
        <Button
          type="button"
          variant="outline"
          onClick={handleDelete}
          isLoading={deleting}
          className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-400"
        >
          <Trash2 size={16} className="mr-2" />
          Ürünü Sil
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl p-8 shadow-sm">
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
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Ürün Adı *"
          id="name"
          value={name}
          onChange={e => {
            setName(e.target.value)
            if (!slug) setSlug(slugify(e.target.value))
          }}
          required
        />

        <Input
          label="URL Slug"
          id="slug"
          value={slug}
          onChange={e => setSlug(e.target.value)}
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
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Min Fiyat (₺)"
            id="priceMin"
            type="number"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
          />
          <Input
            label="Max Fiyat (₺)"
            id="priceMax"
            type="number"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
          />
        </div>

        <Input
          label="Renkler (virgülle ayırın)"
          id="colors"
          value={colors}
          onChange={e => setColors(e.target.value)}
        />

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
            Değişiklikleri Kaydet
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
