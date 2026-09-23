'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import { slugify } from '@/lib/utils'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'
import { PlusCircle, Plus, Trash2, CheckCircle, HelpCircle, Image as ImageIcon } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  slug: string
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

const BADGE_OPTIONS = [
  { value: '', label: 'Rozet Yok' },
  { value: 'Yeni', label: 'Yeni (Siyah Rozet)' },
  { value: 'Popüler', label: 'Popüler (Gold Rozet)' },
  { value: 'Sınırlı Stok', label: 'Sınırlı Stok (Bordo Rozet)' },
]

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState<CategoryItem[]>(MANUAL_CATEGORIES)
  const [categoryId, setCategoryId] = useState(MANUAL_CATEGORIES[0].id)
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

  // Dinamik Özellikler (Specs)
  const [specs, setSpecs] = useState<SpecRow[]>([
    { specKey: 'Kumaş / Malzeme', specValue: '%100 Doğal Ham Pamuk (140 gr/m²)' },
    { specKey: 'Ölçüler', specValue: '35 x 40 cm' },
    { specKey: 'Minimum Sipariş', specValue: '50 Adet' },
  ])

  // Örnek Çalışmalar (Examples)
  const [examples, setExamples] = useState<ExampleRow[]>([])

  // Sıkça Sorulan Sorular (FAQs)
  const [faqs, setFaqs] = useState<FaqRow[]>([])

  useEffect(() => {
    async function syncExistingCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const combined = [...MANUAL_CATEGORIES]
            data.forEach((dbCat: CategoryItem) => {
              if (!combined.some((c) => c.slug === dbCat.slug || c.id === dbCat.id)) {
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

  // Spec helper methods
  const addSpecRow = () => {
    setSpecs([...specs, { specKey: '', specValue: '' }])
  }
  const removeSpecRow = (index: number) => {
    setSpecs(specs.filter((_, idx) => idx !== index))
  }
  const updateSpecRow = (index: number, field: 'specKey' | 'specValue', val: string) => {
    const updated = [...specs]
    updated[index][field] = val
    setSpecs(updated)
  }

  // Example helper methods
  const addExampleRow = () => {
    setExamples([...examples, { imageUrl: '', title: '' }])
  }
  const removeExampleRow = (index: number) => {
    setExamples(examples.filter((_, idx) => idx !== index))
  }
  const updateExampleRow = (index: number, field: 'imageUrl' | 'title', val: string) => {
    const updated = [...examples]
    updated[index][field] = val
    setExamples(updated)
  }

  // Faq helper methods
  const addFaqRow = () => {
    setFaqs([...faqs, { question: '', answer: '' }])
  }
  const removeFaqRow = (index: number) => {
    setFaqs(faqs.filter((_, idx) => idx !== index))
  }
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
    <div className="max-w-4xl pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wider uppercase text-neutral-900">
          YENİ ÇANTA MODELİ EKLE
        </h1>
        <p className="text-xs font-light text-neutral-500 mt-1">
          H&amp;M / Zara minimalizminde ürün kartı, dinamik özellik tablosu ve referans çalışmalar ekleyin.
        </p>
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
            {/* Kategori Seçimi */}
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
                  placeholder="Örn: Gabardin Bez Çanta, Fuar Çantası..."
                  className="w-full border border-neutral-400 bg-neutral-50 px-3 py-2.5 text-xs font-light focus:border-black focus:outline-hidden"
                  required
                />
              )}
            </div>

            {/* Rozet Seçici */}
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
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Örn: Ham Pamuklu Tote Bez Çanta"
              required
            />
            <Input
              label="URL Slug *"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ham-pamuklu-tote-bez-canta"
              required
            />
          </div>

          <Textarea
            label="Ürün Açıklaması (Serbest Metin)"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Kumaş kalitesi, dikiş detayları ve kullanım alanlarını açıklayın..."
          />
        </div>

        {/* 2. FİYAT ARALIĞI & RENKLER */}
        <div className="space-y-4">
          <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2">
            02 / TOPTAN FİYAT ARALIĞI &amp; RENKLER
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Min Fiyat (₺)"
              id="priceMin"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="Örn: 35"
            />
            <Input
              label="Max Fiyat (₺)"
              id="priceMax"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="Örn: 65"
            />
          </div>

          <Input
            label="Renk Seçenekleri (Virgülle ayırın)"
            id="colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Ham Bej, Siyah, Lacivert, Haki"
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
              03 / FOTOĞRAF GALERİSİ (1. VE 2. GÖRSEL CROSSFADE İÇİN)
            </h2>
            <span className="text-[11px] font-light text-neutral-400">
              Hover geçişi için en az 2 görsel önerilir
            </span>
          </div>

          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* 4. DİNAMİK ÜRÜN ÖZELLİKLERİ TABLOSU (SPECS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                04 / DİNAMİK ÜRÜN ÖZELLİKLERİ TABLOSU
              </h2>
              <p className="text-[11px] font-light text-neutral-400 mt-0.5">
                Ürün detay sayfasında tablo olarak gösterilecek anahtar-değer çiftleri (örn: Kumaş, Boyut, Askı vb.)
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
                Daha önce logolu üretilen numunelerin görsel linkleri (Galeri altında 4&apos;lü gridde listelenir)
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

          {examples.length === 0 ? (
            <p className="text-xs font-light text-neutral-400 italic">
              Özel örnek görsel eklenmezse varsayılan kurumsal referans fotoğrafları gösterilecektir.
            </p>
          ) : (
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
                    placeholder="Açıklama / Firma (Örn: ABC Kongresi Serigrafi Baskı)"
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
          )}
        </div>

        {/* 6. SIKÇA SORULAN SORULAR (FAQS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                06 / ÜRÜNE ÖZEL SIKÇA SORULAN SORULAR (SSS)
              </h2>
              <p className="text-[11px] font-light text-neutral-400 mt-0.5">
                Bu çantaya özel müşteri soruları ve cevapları
              </p>
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

          {faqs.length === 0 ? (
            <p className="text-xs font-light text-neutral-400 italic">
              Ürüne özel SSS girilmezse standart toptan sipariş/teslimat SSS maddeleri gösterilir.
            </p>
          ) : (
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
                    placeholder="Soru (Örn: Bu modelde kaç renk baskı yapılabilir?)"
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
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
          <Button type="submit" isLoading={loading} className="w-full sm:w-auto px-8">
            Çanta Modelini Kaydet
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
