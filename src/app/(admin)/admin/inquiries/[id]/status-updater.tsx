'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { updateInquiryStatus } from '@/actions/inquiry-actions'

interface StatusUpdaterProps {
  inquiryId: string
  currentStatus: string
}

export function InquiryStatusUpdater({ inquiryId, currentStatus }: StatusUpdaterProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (status: 'NEW' | 'CONTACTED' | 'CLOSED') => {
    setLoading(true)
    try {
      await updateInquiryStatus(inquiryId, status)
      router.refresh()
    } catch (err) {
      console.error('Status update failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="text-xs font-light tracking-wider uppercase text-neutral-400 mb-3">Durumu Güncelle</p>
      <div className="flex gap-3">
        <Button
          size="sm"
          variant={currentStatus === 'NEW' ? 'primary' : 'outline'}
          onClick={() => handleUpdate('NEW')}
          isLoading={loading}
        >
          Yeni
        </Button>
        <Button
          size="sm"
          variant={currentStatus === 'CONTACTED' ? 'primary' : 'outline'}
          onClick={() => handleUpdate('CONTACTED')}
          isLoading={loading}
        >
          İletişime Geçildi
        </Button>
        <Button
          size="sm"
          variant={currentStatus === 'CLOSED' ? 'primary' : 'outline'}
          onClick={() => handleUpdate('CLOSED')}
          isLoading={loading}
        >
          Kapandı
        </Button>
      </div>
    </div>
  )
}
