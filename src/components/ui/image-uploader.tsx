'use client'

import { useState, useRef } from 'react'
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({
  images = [],
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(Array.from(e.target.files))
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const uploadFiles = async (files: File[]) => {
    setError(null)
    const validFiles = files.filter(f => f.type.startsWith('image/'))

    if (validFiles.length === 0) {
      setError('Lütfen yalnızca görsel dosyaları (JPG, PNG, WEBP) seçin.')
      return
    }

    if (images.length + validFiles.length > maxImages) {
      setError(`En fazla ${maxImages} görsel yükleyebilirsiniz.`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      validFiles.forEach(file => formData.append('files', file))

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Yükleme başarısız oldu')
      }

      const data = await res.json()
      onChange([...images, ...data.urls])
    } catch (err: any) {
      setError(err.message || 'Yükleme sırasında bir hata oluştu.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, i) => i !== indexToRemove))
  }

  const addFromUrl = () => {
    if (!urlInput.trim()) return
    onChange([...images, urlInput.trim()])
    setUrlInput('')
    setShowUrlInput(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-light tracking-wider uppercase text-neutral-500">
          Ürün Görselleri ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-light text-neutral-500 hover:text-black transition-colors underline"
        >
          {showUrlInput ? 'Kapat' : '+ URL ile ekle'}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded">
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            className="flex-1 bg-white border border-neutral-300 px-3 py-1.5 text-xs font-light focus:outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={addFromUrl}
            className="px-4 py-1.5 bg-black text-white text-xs font-light uppercase tracking-wider hover:bg-neutral-800"
          >
            Ekle
          </button>
        </div>
      )}

      {/* Drag & Drop Area */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-200',
            isDragging
              ? 'border-black bg-neutral-100 scale-[1.01]'
              : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-neutral-600" />
                <p className="text-xs font-light text-neutral-600">Görseller yükleniyor...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
                <p className="text-sm font-light text-neutral-700">
                  Fotoğrafları buraya <span className="font-normal text-black underline">sürükleyip bırakın</span> veya{' '}
                  <span className="font-normal text-black underline">dosya seçin</span>
                </p>
                <p className="text-[11px] font-light text-neutral-400">
                  PNG, JPG, WEBP • Çanta için portre (dikey) oran önerilir
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-light">{error}</p>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] bg-neutral-100 rounded overflow-hidden border border-neutral-200 shadow-xs"
            >
              <img
                src={url}
                alt={`Görsel ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded font-light tracking-wider uppercase">
                  Kapak
                </span>
              )}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  removeImage(idx)
                }}
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                title="Görseli kaldır"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
