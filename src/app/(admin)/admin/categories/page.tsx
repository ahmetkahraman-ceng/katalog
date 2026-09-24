'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  FolderTree,
} from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  _count?: { products: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Kategoriler alınamadı:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setAdding(true)
    setActionError(null)
    setActionSuccess(null)

    try {
      const slug = slugify(newName)
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          slug,
          description: newDesc.trim() || null,
        }),
      })

      if (res.ok) {
        setNewName('')
        setNewDesc('')
        setActionSuccess('Kategori başarıyla eklendi.')
        await fetchCategories()
      } else {
        const data = await res.json()
        setActionError(data.error || 'Kategori eklenemedi.')
      }
    } catch {
      setActionError('Bağlantı hatası oluştu.')
    } finally {
      setAdding(false)
    }
  }

  const handleStartEdit = (cat: Category) => {
    setEditId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return
    setSavingEdit(true)
    setActionError(null)

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          slug: editSlug.trim() || slugify(editName),
        }),
      })

      if (res.ok) {
        setEditId(null)
        await fetchCategories()
        setActionSuccess('Kategori güncellendi.')
      } else {
        const data = await res.json()
        setActionError(data.error || 'Güncellenemedi.')
      }
    } catch {
      setActionError('Bağlantı hatası.')
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (id: string, name: string, productCount: number) => {
    if (productCount > 0) {
      alert(
        `"${name}" kategorisinde ${productCount} adet ürün var. Önce bu ürünlerin kategorisini değiştirmelisiniz veya silmelisiniz.`
      )
      return
    }

    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) {
      return
    }

    setActionError(null)
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id))
        setActionSuccess('Kategori silindi.')
      } else {
        const data = await res.json()
        setActionError(data.error || 'Kategori silinemedi.')
      }
    } catch {
      setActionError('Bağlantı hatası.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-6">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#2d6a4f] uppercase block mb-1">
            KATALOG & SİLÜET YAPILANDIRMASI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Çanta Kategorileri ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Müşterilerin filtreleme yapabileceği ana çanta kategorilerini düzenleyin.
          </p>
        </div>
      </div>

      {/* Mesaj Bildirimleri */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#2d6a4f]" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700">
            <X size={15} />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700">
            <X size={15} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sol Kolon: Yeni Kategori Ekleme Formu */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/90 p-6 sm:p-7 rounded-3xl shadow-xs">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center font-bold">
              <Plus size={16} />
            </div>
            <h2 className="text-sm font-bold text-neutral-900">
              Yeni Kategori Ekle
            </h2>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Kategori Adı *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Örn: Evrak & Konferans Çantası"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs"
              />
              {newName && (
                <p className="text-[11px] font-mono text-[#2d6a4f] mt-1.5">
                  URL: /categories/{slugify(newName)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Açıklama (Opsiyonel)
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Kategorideki modellerin kullanım amacı, kumaş yapısı veya özellikleri..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all resize-none shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={adding || !newName.trim()}
              className="w-full py-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {adding ? 'Kaydediliyor...' : '+ Kategoriyi Kaydet'}
            </button>
          </form>
        </div>

        {/* Sağ Kolon: Mevcut Kategoriler Listesi */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/90 p-6 sm:p-7 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
                <FolderOpen size={16} />
              </div>
              <h2 className="text-sm font-bold text-neutral-900">
                Mevcut Çanta Kategorileri ({categories.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              Kategoriler yükleniyor...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              Henüz kategori tanımlanmamış. Sol taraftan ilk kategorinizi ekleyebilirsiniz.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {categories.map((cat) => {
                const productCount = cat._count?.products || 0
                const isEditing = editId === cat.id

                return (
                  <div
                    key={cat.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors px-2 -mx-2 rounded-xl"
                  >
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#2d6a4f] flex-1"
                        />
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          placeholder="slug"
                          className="px-3 py-1.5 text-xs font-mono border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#2d6a4f] w-32"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={savingEdit}
                            onClick={() => handleSaveEdit(cat.id)}
                            className="p-1.5 text-[#2d6a4f] hover:bg-emerald-50 rounded-lg"
                            title="Kaydet"
                          >
                            <Save size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditId(null)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg"
                            title="İptal"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-neutral-900">
                              {cat.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                              /{cat.slug}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500 font-medium">
                            {productCount} Çanta Modeli
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {/* Vitrinde Gör */}
                          <Link
                            href={`/categories/${cat.slug}`}
                            target="_blank"
                            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-lg hover:bg-neutral-100"
                            title="Vitrinde Gör"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          {/* Düzenle */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cat)}
                            className="p-2 text-neutral-500 hover:text-[#2d6a4f] transition-colors rounded-lg hover:bg-neutral-100"
                            title="Düzenle"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Sil */}
                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id, cat.name, productCount)}
                            className="p-2 text-rose-500 hover:text-rose-700 transition-colors rounded-lg hover:bg-rose-50"
                            title="Kategoriyi Sil"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
