import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { InquiryStatusUpdater } from './status-updater'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params

  let inquiry
  try {
    inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1, orderBy: { order: 'asc' } } },
            },
          },
        },
      },
    })
  } catch {
    return <p className="text-sm text-neutral-400">Veritabanı hatası</p>
  }

  if (!inquiry) notFound()

  const statusLabels: Record<string, { label: string; variant: 'info' | 'warning' | 'success' }> = {
    NEW: { label: 'Yeni', variant: 'info' },
    CONTACTED: { label: 'İletişime Geçildi', variant: 'warning' },
    CLOSED: { label: 'Kapandı', variant: 'success' },
  }
  const status = statusLabels[inquiry.status] || statusLabels.NEW

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inquiries" className="flex items-center gap-2 text-sm font-light text-neutral-400 hover:text-black transition-colors mb-8">
        <ArrowLeft size={16} />
        Taleplere Dön
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-light tracking-wider">Talep Detayı</h1>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs font-light tracking-wider uppercase text-neutral-400 mb-1">Müşteri</p>
            <p className="text-sm font-light">{inquiry.customerName}</p>
          </div>
          <div>
            <p className="text-xs font-light tracking-wider uppercase text-neutral-400 mb-1">E-posta</p>
            <p className="text-sm font-light">{inquiry.email}</p>
          </div>
          <div>
            <p className="text-xs font-light tracking-wider uppercase text-neutral-400 mb-1">Telefon</p>
            <p className="text-sm font-light">{inquiry.phone}</p>
          </div>
          <div>
            <p className="text-xs font-light tracking-wider uppercase text-neutral-400 mb-1">Tarih</p>
            <p className="text-sm font-light">{new Date(inquiry.createdAt).toLocaleString('tr-TR')}</p>
          </div>
        </div>

        {/* Message */}
        {inquiry.message && (
          <div className="mb-8">
            <p className="text-xs font-light tracking-wider uppercase text-neutral-400 mb-2">Mesaj</p>
            <p className="text-sm font-light text-neutral-600 bg-neutral-50 p-4 rounded">{inquiry.message}</p>
          </div>
        )}

        {/* Products */}
        <div className="mb-8">
          <p className="text-xs font-light tracking-wider uppercase text-neutral-400 mb-4">İlgilenilen Ürünler</p>
          {inquiry.items && inquiry.items.length > 0 ? (
            <div className="space-y-3">
              {inquiry.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-neutral-50 rounded">
                  <div className="w-12 h-16 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] && (
                      <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-light">{item.product?.name || 'Ürün'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-neutral-50 rounded text-xs font-light text-neutral-500">
              Genel Teklif / Özel Sipariş Talebi (Belirli bir ürün seçilmedi)
            </div>
          )}
        </div>

        {/* Status Updater */}
        <InquiryStatusUpdater inquiryId={inquiry.id} currentStatus={inquiry.status} />
      </div>
    </div>
  )
}
