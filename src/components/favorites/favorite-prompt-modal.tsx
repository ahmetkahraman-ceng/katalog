'use client'

import React from 'react'
import { X, Heart } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

interface FavoritePromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FavoritePromptModal({ isOpen, onClose }: FavoritePromptModalProps) {
  const { openAuthModal } = useAuth()

  if (!isOpen) return null

  const handleLoginClick = () => {
    onClose()
    openAuthModal('login')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog (Matching user uploaded Image 3) */}
      <div className="relative w-full max-w-[360px] sm:max-w-[380px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Kapat"
        >
          <X size={18} />
        </button>

        {/* Soft Pink Circle with Red Heart Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-[#fee2e2]/60 flex items-center justify-center mb-6 mt-2">
          <Heart size={38} className="fill-[#dc2626] text-[#dc2626]" />
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-medium text-neutral-900 leading-snug px-2">
          Ürünü favoriye eklemek için giriş yapmanız gerekmektedir.
        </h3>

        {/* Subtitle */}
        <p className="text-xs font-light text-neutral-500 mt-2.5 px-4 leading-relaxed">
          Dilerseniz üye olmadan ürünün teklifini alabilirsiniz.
        </p>

        {/* Action Buttons: Sleek Luxury Black "Giriş Yap" + Outline "Vazgeç" */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={handleLoginClick}
            className="w-full py-3.5 bg-[#18181b] hover:bg-black text-white text-sm font-medium rounded-full transition-colors shadow-xs"
          >
            Giriş Yap
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-sm font-medium rounded-full transition-colors"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  )
}
