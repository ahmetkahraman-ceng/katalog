'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

export function WhatsAppFloatingButton() {
  const [whatsapp, setWhatsapp] = useState('905555555555')
  const [message, setMessage] = useState(
    'Merhaba, çanta modelleriniz ve özel üretim teklifleri hakkında bilgi almak istiyorum.'
  )

  useEffect(() => {
    async function loadAtelier() {
      try {
        const res = await fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data.atelier?.whatsapp) {
            setWhatsapp(data.atelier.whatsapp.replace(/\D/g, ''))
          }
          if (data.atelier?.whatsappDefaultMessage) {
            setMessage(data.atelier.whatsappDefaultMessage)
          }
        }
      } catch {
        // silent fail
      }
    }
    loadAtelier()
  }, [])

  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
      title="WhatsApp ile Hızlı Teklif Al"
    >
      <MessageCircle size={22} className="shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-light tracking-wider uppercase pr-1">
        Hızlı Teklif Hattı
      </span>
    </a>
  )
}
