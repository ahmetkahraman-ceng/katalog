'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  ShoppingBag,
} from 'lucide-react'
import { formatPriceRange, cn } from '@/lib/utils'

export interface AdminProductItem {
  id: string
  name: string
  slug: string
  sku?: string | null
  minOrderQty?: number | null
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
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))

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
      {/* Search & Filter Controls */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Model adı, kumaş veya SKU kodu ile arayın..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-[#2d6a4f] rounded-xl focus:outline-hidden transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-neutral-50 hover:bg-white border border-neutral-200 rounded-xl focus:border-[#2d6a4f] focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Tüm Kategoriler ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-neutral-50 hover:bg-white border border-neutral-200 rounded-xl focus:border-[#2d6a4f] focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="ACTIVE">Yayında (Aktif)</option>
            <option value="DRAFT">Taslak</option>
          </select>

          <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-2 rounded-xl">
            {filteredProducts.length} Model
          </span>
        </div>
      </div>

      {/* Modern Products Table */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9fafb] border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Model / Görsel</th>
                <th className="py-3.5 px-4">SKU / Ref</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Toptan Fiyat Aralığı</th>
                <th className="py-3.5 px-4">Min. Sipariş</th>
                <th className="py-3.5 px-4 text-center">Durum</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-neutral-400">
                    Arama kriterlerine uygun çanta modeli bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const imgUrl = product.images?.[0]?.url
                  const formattedPrice = formatPriceRange(product.priceMin, product.priceMax)

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-50/80 transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-neutral-100 relative overflow-hidden shrink-0 border border-neutral-200/70">
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <ShoppingBag size={18} />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="font-bold text-neutral-900 group-hover:text-[#2d6a4f] transition-colors block text-sm leading-snug line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-4 px-4 font-mono text-[11px] text-neutral-600 font-medium">
                        {product.sku || 'REF: -'}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-neutral-700 font-medium">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded-md text-[11px]">
                          {product.category?.name || 'Kategorisiz'}
                        </span>
                      </td>

                      {/* Price Range */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-neutral-900 block">
                          {formattedPrice}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          + KDV / Adet
                        </span>
                      </td>

                      {/* Min Order */}
                      <td className="py-4 px-4 text-neutral-600 font-medium">
                        {product.minOrderQty || 50} Adet
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          disabled={togglingId === product.id}
                          onClick={() => handleToggleStatus(product.id)}
                          className={cn(
                            'text-[10px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer shadow-2xs',
                            product.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-[#2d6a4f] border-emerald-200 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                          )}
                        >
                          {product.status === 'ACTIVE' ? 'Yayında' : 'Taslak'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/categories/${product.slug}`}
                            target="_blank"
                            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                            title="Vitrinde Görüntüle"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-[#2d6a4f] hover:bg-[#2d6a4f]/10 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit size={15} />
                          </Link>

                          <button
                            type="button"
                            disabled={deletingId === product.id}
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Modeli Sil"
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
      </div>
    </div>
  )
}
