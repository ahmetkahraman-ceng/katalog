'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import { slugify } from '@/lib/utils'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'
import { Trash2, PlusCircle, Plus } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  slug?: string
}

interface SpecRow {
  specKey: string
  specValue: string
}

interface ExampleRow {
  imageUrl: string
  title: string
}

interface FaqRow {
  question: string
  answer: string
}

interface Props {
  params: Promise<{ id: string }>
}

const BADGE_OPTIONS = [
  { value: '', label: 'Rozet Yok' },
  { value: 'Yeni', label: 'Yeni (Siyah Rozet)' },
  { value: 'Popüler', label: 'Popüler (Gold Rozet)' },
  { value: 'Sınırlı Stok', label: 'Sınırlı Stok (Bordo Rozet)' },
]

export default function EditProductPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [categories, setCategories] = useState<CategoryItem[]>(MANUAL_CATEGORIES)
  const [categoryId, setCategoryId] = useState('')
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [customCategoryName, setCustomCategoryName] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [badge, setBadge] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [colors, setColors] = useState('')
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState('ACTIVE')
  const [error, setError] = useState('')

  const [specs, setSpecs] = useState<SpecRow[]>([])
  const [examples, setExamples] = useState<ExampleRow[]>([])
  const [faqs, setFaqs] = useState<FaqRow[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products/${id}`),
        ])

        if (catRes.ok) {
          const cats = await catRes.json()
          if (Array.isArray(cats) && cats.length > 0) {
            const combined: CategoryItem[] = [...MANUAL_CATEGORIES]
            cats.forEach((dbCat: CategoryItem) => {
              if (!combined.some((c) => c.id === dbCat.id || c.name === dbCat.name)) {
                combined.push(dbCat)
              }
            })
            setCategories(combined)
          }
        }

        if (prodRes.ok) {
          const prod = await prodRes.json()
          setName(prod.name || '')
          setSlug(prod.slug || '')
          setCategoryId(prod.categoryId || '')
          setDescription(prod.description || '')
          setPriceMin(prod.priceMin ? String(prod.priceMin) : '')
          setPriceMax(prod.priceMax ? String(prod.priceMax) : '')
          setBadge(prod.badge || '')
          setImages(prod.images ? prod.images.map((img: any) => img.url) : [])
          setColors(prod.colors ? prod.colors.join(', ') : '')
          setFeatured(Boolean(prod.featured))
          setStatus(prod.status || 'ACTIVE')

          if (prod.specs && prod.specs.length > 0) {
            setSpecs(
              prod.specs.map((s: any) => ({
                specKey: s.specKey || '',
                specValue: s.specValue || '',
              }))
            )
          } else {
            setSpecs([
              { specKey: 'Kumaş / Malzeme', specValue: '%100 Pamuklu Kumaş' },
              { specKey: 'Ölçüler', specValue: '35 x 40 cm' },
            ])
          }

          if (prod.examples && prod.examples.length > 0) {
            setExamples(
              prod.examples.map((e: any) => ({
                imageUrl: e.imageUrl || '',
                title: e.title || '',
              }))
            )
          }

          if (prod.faqs && prod.faqs.length > 0) {
            setFaqs(
              prod.faqs.map((f: any) => ({
                question: f.question || '',
                answer: f.answer || '',
              }))
            )
          }

          if (prod.category && !categories.some((c) => c.id === prod.category.id)) {
            setCategories((prev) => [...prev, { id: prod.category.id, name: prod.category.name }])
          }
        }
      } catch (err) {
        console.error('Veriler yüklenirken hata:', err)
      }
    }
    loadData()
  }, [id])

  // Spec handlers
  const addSpecRow = () => setSpecs([...specs, { specKey: '', specValue: '' }])
  const removeSpecRow = (index: number) => setSpecs(specs.filter((_, idx) => idx !== index))
  const updateSpecRow = (index: number, field: 'specKey' | 'specValue', val: string) => {
    const updated = [...specs]
    updated[index][field] = val
    setSpecs(updated)
  }

  // Example handlers
  const addExampleRow = () => setExamples([...examples, { imageUrl: '', title: '' }])
  const removeExampleRow = (index: number) => setExamples(examples.filter((_, idx) => idx !== index))
  const updateExampleRow = (index: number, field: 'imageUrl' | 'title', val: string) => {
    const updated = [...examples]
    updated[index][field] = val
    setExamples(updated)
  }

  // Faq handlers
  const addFaqRow = () => setFaqs([...faqs, { question: '', answer: '' }])
  const removeFaqRow = (index: number) => setFaqs(faqs.filter((_, idx) => idx !== index))
  const updateFaqRow = (index: number, field: 'question' | 'answer', val: string) => {
    const updated = [...faqs]
    updated[index][field] = val
    setFaqs(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const selectedCat = categories.find((c) => c.id === categoryId)
    const effectiveCategoryId = isCustomCategory ? customCategoryName.trim() : categoryId
    const effectiveCategoryName = isCustomCategory
      ? customCategoryName.trim()
      : selectedCat
      ? selectedCat.name
      : categoryId

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          categoryId: effectiveCategoryId,
          categoryName: effectiveCategoryName,
          description,
          priceMin: priceMin ? Number(priceMin) : null,
          priceMax: priceMax ? Number(priceMax) : null,
          badge: badge || null,
          images,
          colors: colors
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean),
          featured,
          status,
          specs: specs.filter((s) => s.specKey.trim() && s.specValue.trim()),
          examples: examples.filter((e) => e.imageUrl.trim()),
          faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Ürün güncellenirken hata oluştu')
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
      if (!res.ok) throw new Error('Ürün silinemedi')
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wider uppercase text-neutral-900">
            ÇANTA MODELİNİ DÜZENLE
          </h1>
          <p className="text-xs font-light text-neutral-500 mt-1">
            Rozet, teknik özellikler tablosu ve örnek çalışmalar referanslarını güncelleyin.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleDelete}
          isLoading={deleting}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400"
        >
          <Trash2 size={15} className="mr-2" />
          Ürünü Sil
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-neutral-200 shadow-2xs">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-xs font-light rounded-xs border border-red-200">
            {error}
          </div>
        )}

        {/* 1. KATEGORİ VE TEMEL BİLGİLER */}
        <div className="space-y-4">
          <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2">
            01 / TEMEL BİLGİLER &amp; KATEGORİ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-light tracking-wider uppercase text-neutral-600">
                  Kategori / Siluet *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                  className="text-[11px] text-neutral-600 hover:text-black flex items-center gap-1 transition-colors"
                >
                  <PlusCircle size={12} />
                  {isCustomCategory ? 'Listeden Seç' : '+ Yeni Kategori'}
                </button>
              </div>

              {!isCustomCategory ? (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-xs font-light focus:border-black focus:outline-hidden"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="Kategori Adı..."
                  className="w-full border border-neutral-400 bg-neutral-50 px-3 py-2.5 text-xs font-light focus:border-black focus:outline-hidden"
                  required
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-light tracking-wider uppercase text-neutral-600">
                Ürün Rozeti (Badge)
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-xs font-light focus:border-black focus:outline-hidden"
              >
                {BADGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Çanta Model Adı *"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!slug) setSlug(slugify(e.target.value))
              }}
              required
            />
            <Input
              label="URL Slug *"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Ürün Açıklaması (Serbest Metin)"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* 2. FİYAT VE SEÇENEKLER */}
        <div className="space-y-4">
          <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2">
            02 / TOPTAN FİYAT ARALIĞI &amp; SEÇENEKLER
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Min Fiyat (₺)"
              id="priceMin"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <Input
              label="Max Fiyat (₺)"
              id="priceMax"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>

          <Input
            label="Renk Seçenekleri (Virgülle ayırın)"
            id="colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-light text-neutral-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-black border-neutral-300 rounded-xs"
              />
              <span>Ana Sayfada Öne Çıkar</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-light text-neutral-700">
              <input
                type="checkbox"
                checked={status === 'ACTIVE'}
                onChange={(e) => setStatus(e.target.checked ? 'ACTIVE' : 'DRAFT')}
                className="w-4 h-4 text-black border-neutral-300 rounded-xs"
              />
              <span>Aktif / Yayında</span>
            </label>
          </div>
        </div>

        {/* 3. FOTOĞRAF GALERİSİ */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-neutral-100 pb-2">
            <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
              03 / FOTOĞRAF GALERİSİ (CROSSFADE HOVER)
            </h2>
            <span className="text-[11px] font-light text-neutral-400">
              1. görsel varsayılan, 2. görsel hover durumunda gösterilir
            </span>
          </div>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* 4. DİNAMİK ÜRÜN ÖZELLİKLERİ TABLOSU */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                04 / DİNAMİK ÜRÜN ÖZELLİKLERİ TABLOSU (SPECS)
              </h2>
              <p className="text-[11px] font-light text-neutral-400 mt-0.5">
                Ürün detay sayfasındaki sekmeli tabloda gösterilen anahtar-değer çiftleri
              </p>
            </div>
            <button
              type="button"
              onClick={addSpecRow}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 text-xs font-light tracking-wider uppercase transition-colors flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>+ Özellik Ekle</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {specs.map((row, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-neutral-50 p-2.5 border border-neutral-200">
                <input
                  type="text"
                  placeholder="Özellik Adı (Örn: Hacim, Malzeme)"
                  value={row.specKey}
                  onChange={(e) => updateSpecRow(idx, 'specKey', e.target.value)}
                  className="w-1/3 px-3 py-1.5 bg-white border border-neutral-300 text-xs font-light focus:outline-hidden focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Değeri (Örn: 16 Litre, %100 Pamuk)"
                  value={row.specValue}
                  onChange={(e) => updateSpecRow(idx, 'specValue', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 text-xs font-light focus:outline-hidden focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(idx)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ÖRNEK ÇALIŞMALAR (EXAMPLES) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                05 / ÖRNEK ÇALIŞMALAR &amp; REFERANS BASKILAR
              </h2>
              <p className="text-[11px] font-light text-neutral-400 mt-0.5">
                Ürün galerisinin altında 4&apos;lü kare gridde gösterilecek referans numune görselleri
              </p>
            </div>
            <button
              type="button"
              onClick={addExampleRow}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 text-xs font-light tracking-wider uppercase transition-colors flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>+ Örnek Ekle</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {examples.map((ex, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-neutral-50 p-2.5 border border-neutral-200">
                <input
                  type="url"
                  placeholder="Görsel URL (https://...)"
                  value={ex.imageUrl}
                  onChange={(e) => updateExampleRow(idx, 'imageUrl', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 text-xs font-light focus:outline-hidden focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Açıklama / Firma"
                  value={ex.title}
                  onChange={(e) => updateExampleRow(idx, 'title', e.target.value)}
                  className="w-1/3 px-3 py-1.5 bg-white border border-neutral-300 text-xs font-light focus:outline-hidden focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => removeExampleRow(idx)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 6. SIKÇA SORULAN SORULAR (FAQS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                06 / ÜRÜNE ÖZEL SIKÇA SORULAN SORULAR (SSS)
              </h2>
            </div>
            <button
              type="button"
              onClick={addFaqRow}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 text-xs font-light tracking-wider uppercase transition-colors flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>+ Soru Ekle</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-neutral-50 p-3 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-neutral-500">SORU {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaqRow(idx)}
                    className="text-neutral-400 hover:text-red-500 text-xs"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Soru..."
                  value={faq.question}
                  onChange={(e) => updateFaqRow(idx, 'question', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 text-xs font-light focus:outline-hidden focus:border-black"
                />
                <textarea
                  rows={2}
                  placeholder="Cevap..."
                  value={faq.answer}
                  onChange={(e) => updateFaqRow(idx, 'answer', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 text-xs font-light focus:outline-hidden focus:border-black resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
          <Button type="submit" isLoading={loading} className="w-full sm:w-auto px-8">
            Değişiklikleri Kaydet
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            İptal
          </Button>
        </div>
      </form>
    </div>
  )
}
