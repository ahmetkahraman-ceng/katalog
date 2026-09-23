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
  Layers,
  FolderOpen,
  CheckCircle,
  AlertCircle,
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      setActionError('Bağlantı hatası.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            KOLLEKSİYON & SİLÜET YAPILANDIRMASI
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-black font-serif">
            Kategoriler
          </h1>
        </div>
      </div>

      {/* Mesaj Bildirimleri */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-light rounded-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700">
            <X size={14} />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-light rounded-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-red-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-700">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sol Kolon: Yeni Kategori Ekleme Formu */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/80 p-6 rounded-sm shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
            <Plus size={16} className="text-black" />
            <h2 className="text-sm font-light tracking-wider uppercase text-black">
              Yeni Silüet / Kategori Ekle
            </h2>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Kategori Adı *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Örn: Baget & Omuz Çantası"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
              {newName && (
                <p className="text-[10px] font-mono text-neutral-400 mt-1">
                  Oluşacak URL: /categories/{slugify(newName)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-neutral-500 mb-1.5">
                Açıklama (Opsiyonel)
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Bu silüet grubunun tasarım dili ve kullanım alanı..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={adding || !newName.trim()}
              className="w-full py-2.5 bg-black text-white text-xs font-light tracking-widest uppercase hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {adding ? 'Ekleniyor...' : '+ Kategoriyi Kaydet'}
            </button>
          </form>
        </div>

        {/* Sağ Kolon: Mevcut Kategoriler Listesi */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/80 p-6 rounded-sm shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <FolderOpen size={16} className="text-black" />
              <h2 className="text-sm font-light tracking-wider uppercase text-black">
                Mevcut Kategoriler ({categories.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-light">
              Yükleniyor...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-light">
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
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/60 transition-colors px-2 -mx-2 rounded"
                  >
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2.5 py-1 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black flex-1"
                        />
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          placeholder="slug"
                          className="px-2.5 py-1 text-xs font-mono border border-neutral-300 rounded focus:outline-none focus:border-black w-32"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={savingEdit}
                            onClick={() => handleSaveEdit(cat.id)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Kaydet"
                          >
                            <Save size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditId(null)}
                            className="p-1.5 text-neutral-400 hover:text-black rounded"
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
                            <span className="text-sm font-normal text-black uppercase">
                              {cat.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              /{cat.slug}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-neutral-500">
                              {productCount} Çanta Modeli
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {/* Vitrinde Gör */}
                          <Link
                            href={`/categories/${cat.slug}`}
                            target="_blank"
                            className="p-1.5 text-neutral-400 hover:text-black transition-colors rounded hover:bg-neutral-100"
                            title="Kategoriyi Vitrinde Gör"
                          >
                            <ExternalLink size={14} />
                          </Link>

                          {/* Düzenle */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 text-neutral-500 hover:text-black transition-colors rounded hover:bg-neutral-100"
                            title="Düzenle"
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Sil */}
                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id, cat.name, productCount)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                            title={
                              productCount > 0
                                ? 'Bu kategoride ürün olduğu için silinemez'
                                : 'Kategoriyi Sil'
                            }
                          >
                            <Trash2 size={14} />
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
