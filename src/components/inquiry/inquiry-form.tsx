'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const inquirySchema = z.object({
  customerName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz (en az 10 hane)'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  quantityTier: z.string().optional(),
  message: z.string().optional(),
})

type InquiryFormData = z.infer<typeof inquirySchema>

interface InquiryFormProps {
  productIds?: string[]
  productName?: string
  productImage?: string
  productRef?: string
  onSuccess?: () => void
}

export function InquiryForm({
  productIds = [],
  productName,
  productImage,
  productRef,
  onSuccess,
}: InquiryFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState('1 - 5 Adet')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      quantityTier: '1 - 5 Adet',
    },
  })

  const onSubmit = async (data: InquiryFormData) => {
    setServerError(null)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          quantityTier: selectedTier,
          productIds,
        }),
      })

      const resData = await res.json()

      if (!res.ok) {
        throw new Error(resData.error || 'Bir hata oluştu')
      }

      setSubmittedId(resData.id)
      setIsSubmitted(true)
      reset()
      onSuccess?.()
    } catch (err: any) {
      setServerError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-10 px-4">
        <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-white stroke-[1.5]" />
        </div>
        <span className="text-[10px] font-light tracking-[0.25em] uppercase text-neutral-400 block mb-1">
          PROTOKOL ONAYLANDI
        </span>
        <h3 className="text-xl font-light tracking-[0.15em] uppercase text-black mb-2">
          Teklif Talebiniz Alındı
        </h3>
        <p className="text-xs font-light text-neutral-500 max-w-sm mx-auto leading-relaxed mb-4">
          Yetkili atölye temsilcimiz en kısa sürede tarafınızla iletişime geçerek resmi teklif mektubunu iletecektir.
        </p>
        {submittedId && (
          <p className="text-[11px] font-mono text-neutral-400 bg-neutral-100 py-1.5 px-3 inline-block rounded">
            Talep Referans No: {submittedId.slice(-8).toUpperCase()}
          </p>
        )}
        <div className="mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSubmitted(false)}
            className="text-xs uppercase tracking-widest font-light"
          >
            Yeni Talep Oluştur
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Selected Bag Banner */}
      {productName && (
        <div className="bg-neutral-100 p-4 border border-neutral-200/80 flex items-center gap-4">
          {productImage ? (
            <div className="w-14 h-18 bg-neutral-200 shrink-0 overflow-hidden">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-16 bg-neutral-300 text-neutral-600 flex items-center justify-center text-[10px] uppercase font-light shrink-0">
              ÇANTA
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] font-light tracking-[0.2em] uppercase text-neutral-400">
              SEÇİLEN MODEL
            </span>
            <span className="text-sm font-normal tracking-wide uppercase text-black">
              {productName}
            </span>
            {productRef && (
              <span className="text-[10px] font-mono text-neutral-500 mt-0.5">
                {productRef}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Inputs */}
      <Input
        label="Ad Soyad / Kurum Adı *"
        id="customerName"
        placeholder="Örn: Melis Erdem / Erdem Mimarlık"
        error={errors.customerName?.message}
        {...register('customerName')}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Telefon Numarası *"
          id="phone"
          type="tel"
          placeholder="0 (5XX) XXX XX XX"
          error={errors.phone?.message}
          {...register('phone')}
          required
        />

        <Input
          label="E-posta Adresi *"
          id="email"
          type="email"
          placeholder="ornek@sirket.com"
          error={errors.email?.message}
          {...register('email')}
          required
        />
      </div>

      {/* Talep Edilen Adet Aralığı (Stitch Style Pills) */}
      <div>
        <label className="block text-xs font-light tracking-wider uppercase text-neutral-500 mb-2">
          Talep Edilen Adet Aralığı
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['1 - 5 Adet', '5 - 20 Adet', '20+ Toptan'].map(tier => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className={`py-2 px-2 text-center text-xs font-light tracking-wider uppercase border transition-all ${
                selectedTier === tier
                  ? 'bg-black text-white border-black'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Özel Notlar veya Talepler (İsteğe Bağlı)"
        id="message"
        placeholder="Logo baskısı, özel deri rengi, teslim tarihi veya sormak istedikleriniz..."
        error={errors.message?.message}
        {...register('message')}
      />

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 font-light">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
        size="lg"
        className="w-full bg-black hover:bg-neutral-800 text-white tracking-[0.2em] uppercase py-4"
      >
        <Send size={15} className="mr-2" />
        Teklif Talebi Gönder
      </Button>

      <p className="text-[10px] text-neutral-400 font-light text-center leading-relaxed">
        * Bilgileriniz yalnızca resmi teklif hazırlanması ve atölye irtibatı amacıyla kullanılır.
      </p>
    </form>
  )
}
