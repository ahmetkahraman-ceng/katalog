'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { InquiryForm } from './inquiry-form'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

interface InquiryModalProps {
  productId: string
  productName: string
  productImage?: string
  productRef?: string
  triggerText?: string
  variant?: 'primary' | 'secondary' | 'outline'
}

export function InquiryModal({
  productId,
  productName,
  productImage,
  productRef,
  triggerText = 'TEKLİF İSTE',
  variant = 'primary',
}: InquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        variant={variant}
        className="w-full tracking-[0.25em] uppercase py-4 font-normal"
      >
        <FileText size={16} className="mr-2" />
        {triggerText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="RESMİ TEKLİF PROTOKOLÜ"
      >
        <InquiryForm
          productIds={[productId]}
          productName={productName}
          productImage={productImage}
          productRef={productRef}
          onSuccess={() => {
            setTimeout(() => setIsOpen(false), 3500)
          }}
        />
      </Modal>
    </>
  )
}
