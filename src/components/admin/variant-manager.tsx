'use client'

import { useState, useRef } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react'

export interface VariantItem {
  id?: string
  variantName: string
  variantType?: string
  imageUrl?: string | null
  sortOrder?: number
}

interface VariantManagerProps {
  variants: VariantItem[]
  onChange: (variants: VariantItem[]) => void
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const handleAdd = () => {
    onChange([
      ...variants,
      {
        variantName: '',
        variantType: 'Renk',
        imageUrl: '',
        sortOrder: variants.length,
      },
    ])
  }

  const handleRemove = (index: number) => {
    const updated = variants.filter((_, idx) => idx !== index)
    onChange(updated.map((v, idx) => ({ ...v, sortOrder: idx })))
  }

  const handleUpdate = (index: number, field: 'variantName' | 'imageUrl', value: string) => {
    const updated = [...variants]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    onChange(updated)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1
    if (newIdx < 0 || newIdx >= variants.length) return

    const updated = [...variants]
    const temp = updated[index]
    updated[index] = updated[newIdx]
    updated[newIdx] = temp

    onChange(updated.map((v, idx) => ({ ...v, sortOrder: idx })))
  }

  const handleFileUpload = async (index: number, file: File) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploadingIdx(index)

    try {
      const formData = new FormData()
      formData.append('files', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.urls && data.urls.length > 0) {
          handleUpdate(index, 'imageUrl', data.urls[0])
        }
      } else {
        alert('Fotoğraf yüklenemedi. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      console.error('Variant image upload error:', err)
      alert('Yükleme hatası oluştu.')
    } finally {
      setUploadingIdx(null)
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
        <div>
          <h2 className="text-xs font-medium tracking-widest uppercase text-neutral-900">
            07 / RENK SEÇENEKLERİ (VARYANTLAR)
          </h2>
          <p className="text-[11px] font-light text-neutral-500 mt-0.5">
            Her renk için renk adını ve o renge ait çanta fotoğrafını ekleyin. Müşteri ürün detayında renk butonuna tıkladığında ana görsel bu fotoğrafa dönüşür.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-light tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Plus size={13} />
          <span>+ Renk Ekle</span>
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="p-6 border border-dashed border-neutral-300 text-center bg-neutral-50/50">
          <p className="text-xs font-light text-neutral-500">
            Henüz renk seçeneği eklenmedi. Ürünün farklı renk varyantları ve fotoğrafları varsa &ldquo;+ Renk Ekle&rdquo; butonu ile ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-neutral-50 p-3.5 border border-neutral-200"
            >
              {/* Reorder buttons */}
              <div className="flex sm:flex-col items-center justify-center gap-1 text-neutral-400">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 hover:text-black disabled:opacity-20 transition-colors"
                  title="Yukarı Taşı"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === variants.length - 1}
                  className="p-1 hover:text-black disabled:opacity-20 transition-colors"
                  title="Aşağı Taşı"
                >
                  <ArrowDown size={13} />
                </button>
              </div>

              {/* Thumbnail preview */}
              <div className="w-14 h-14 bg-neutral-200 border border-neutral-300 overflow-hidden flex items-center justify-center shrink-0 relative group">
                {v.imageUrl ? (
                  <img
                    src={v.imageUrl}
                    alt={v.variantName || `Renk ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={20} className="text-neutral-400" />
                )}
                {uploadingIdx === idx && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 size={16} className="text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Color name input */}
              <div className="w-full sm:w-44">
                <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-1">
                  Renk Adı *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Siyah, Ham Bej"
                  value={v.variantName}
                  onChange={(e) => handleUpdate(idx, 'variantName', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 text-xs font-light focus:outline-hidden focus:border-black"
                  required
                />
              </div>

              {/* Image URL input & upload button */}
              <div className="flex-1">
                <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-1">
                  Fotoğraf (URL veya Dosya Yükle)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... veya dosya yükleyin"
                    value={v.imageUrl || ''}
                    onChange={(e) => handleUpdate(idx, 'imageUrl', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 text-xs font-light focus:outline-hidden focus:border-black"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      fileInputRefs.current[idx] = el
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(idx, e.target.files[0])
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    disabled={uploadingIdx === idx}
                    className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-light uppercase tracking-wider flex items-center gap-1 transition-colors shrink-0"
                    title="Fotoğraf Yükle"
                  >
                    <UploadCloud size={13} />
                    <span>{uploadingIdx === idx ? 'Yükleniyor...' : 'Fotoğraf Seç'}</span>
                  </button>
                </div>
              </div>

              {/* Delete button */}
              <div className="flex items-center justify-end sm:pt-4">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                  title="Bu rengi sil"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
