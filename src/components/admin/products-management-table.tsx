'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpDown,
} from 'lucide-react'
import { formatPriceRange } from '@/lib/utils'

export interface AdminProductItem {
  id: string
  name: string
  slug: string
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  priceMin: number | null
  priceMax: number | null
  categoryId: string
  category?: {
    id: string
    name: string
  } | null
  images: { url: string }[]
  createdAt: string
}

export interface AdminCategoryItem {
  id: string
  name: string
  slug: string
}

interface Props {
  initialProducts: AdminProductItem[]
  categories: AdminCategoryItem[]
}

export function ProductsManagementTable({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<AdminProductItem[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Status toggle handler
  const handleToggleStatus = async (id: string) => {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/products/${id}/toggle-status`, {
        method: 'PATCH',
      })
      if (res.ok) {
        const data = await res.json()
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: data.status } : p))
        )
      }
    } catch (err) {
      console.error('Durum değiştirilemedi:', err)
    } finally {
      setTogglingId(null)
    }
  }

  // Delete product handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`"${name}" modelini kalıcı olarak silmek istediğinize emin misiniz?`)) {
      return
    }
    setDeletingId(id)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Silinirken bir hata meydana geldi.')
      }
    } catch (err) {
      console.error('Silme hatası:', err)
      alert('Bağlantı hatası oluştu.')
    } finally {
      setDeletingId(null)
    }
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search
      const matchSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase())

      // Category
      const matchCategory =
        selectedCategory === 'ALL' || item.categoryId === selectedCategory

      // Status
      const matchStatus =
        selectedStatus === 'ALL' || item.status === selectedStatus

      return matchSearch && matchCategory && matchStatus
    })
  }, [products, searchQuery, selectedCategory, selectedStatus])

  return (
    <div className="space-y-6">
      {/* Üst Bar: Arama, Filtreler ve Yeni Ekle */}
      <div className="bg-white border border-neutral-200/80 p-5 rounded-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Arama Alanı */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Model adı veya URL slug ile ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/70 border border-neutral-200 text-xs font-light text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Aksiyon Butonu */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="px-4 py-2.5 bg-black text-white text-xs font-light tracking-widest uppercase hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 shrink-0 shadow-xs"
            >
              <Plus size={15} />
              Yeni Model Ekle
            </Link>
          </div>
        </div>

        {/* Filtre Barı */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs font-light">
          {/* Durum Filtreleri */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider mr-1">
              DURUM:
            </span>
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-3 py-1 text-xs tracking-wider uppercase transition-colors rounded-xs ${
                selectedStatus === 'ALL'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Tümü ({products.length})
            </button>
            <button
              onClick={() => setSelectedStatus('ACTIVE')}
              className={`px-3 py-1 text-xs tracking-wider uppercase transition-colors rounded-xs ${
                selectedStatus === 'ACTIVE'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Aktif ({products.filter((p) => p.status === 'ACTIVE').length})
            </button>
            <button
              onClick={() => setSelectedStatus('DRAFT')}
              className={`px-3 py-1 text-xs tracking-wider uppercase transition-colors rounded-xs ${
                selectedStatus === 'DRAFT'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Taslak ({products.filter((p) => p.status === 'DRAFT').length})
            </button>
          </div>

          {/* Kategori Seçici */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
              KATEGORİ:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1 px-3 bg-neutral-50 border border-neutral-200 text-xs font-light text-black focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="ALL">Tüm Kategoriler</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ürün Listesi Tablosu */}
      <div className="bg-white border border-neutral-200/80 rounded-sm shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                <th className="py-3.5 px-4 w-16">GÖRSEL</th>
                <th className="py-3.5 px-4">MODEL & SLUG</th>
                <th className="py-3.5 px-4">KATEGORİ</th>
                <th className="py-3.5 px-4">FİYAT SKALASI</th>
                <th className="py-3.5 px-4 text-center">YAYIN DURUMU</th>
                <th className="py-3.5 px-4 text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm font-light">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-neutral-400 font-light">
                    Kriterlere uyan çanta modeli bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const hasImage = product.images && product.images.length > 0
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-50/70 transition-colors group"
                    >
                      {/* Görsel */}
                      <td className="py-3.5 px-4">
                        <div className="w-12 h-16 bg-neutral-100 relative overflow-hidden border border-neutral-200 shrink-0">
                          {hasImage ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400 uppercase tracking-tighter">
                              YOK
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Model & Slug */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-sm font-normal text-black hover:underline uppercase tracking-wide"
                          >
                            {product.name}
                          </Link>
                          <span className="text-[11px] font-mono text-neutral-400 tracking-tight mt-0.5">
                            /{product.slug}
                          </span>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs tracking-wider uppercase">
                          {product.category?.name || 'Kategorisiz'}
                        </span>
                      </td>

                      {/* Fiyat Skalası */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-mono text-neutral-600">
                          {formatPriceRange(product.priceMin, product.priceMax)}
                        </span>
                      </td>

                      {/* 1-Click Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={togglingId === product.id}
                          onClick={() => handleToggleStatus(product.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] tracking-wider uppercase font-light transition-all cursor-pointer ${
                            product.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                          } ${togglingId === product.id ? 'opacity-50' : ''}`}
                          title="Durumu değiştirmek için tıklayın"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.status === 'ACTIVE'
                                ? 'bg-emerald-600'
                                : 'bg-amber-600'
                            }`}
                          />
                          {product.status === 'ACTIVE' ? 'Aktif (Yayında)' : 'Taslak'}
                        </button>
                      </td>

                      {/* İşlemler */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Vitrinde Önizle */}
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 text-neutral-400 hover:text-black transition-colors rounded hover:bg-neutral-100"
                            title="Vitrinde Önizle (Yeni Sekme)"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          {/* Düzenle */}
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-neutral-500 hover:text-black transition-colors rounded hover:bg-neutral-100"
                            title="Modeli Düzenle"
                          >
                            <Edit size={15} />
                          </Link>

                          {/* Sil */}
                          <button
                            type="button"
                            disabled={deletingId === product.id}
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2 text-neutral-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 disabled:opacity-50"
                            title="Kalıcı Olarak Sil"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Tablo Alt Bilgi Barı */}
        <div className="p-4 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-light">
          <span>
            Toplam {filteredProducts.length} çanta listeleniyor (Toplam {products.length})
          </span>
          <span className="font-mono text-[11px]">
            {products.filter((p) => p.status === 'ACTIVE').length} Aktif •{' '}
            {products.filter((p) => p.status === 'DRAFT').length} Taslak
          </span>
        </div>
      </div>
    </div>
  )
}
