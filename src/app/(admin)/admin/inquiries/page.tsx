import { prisma } from '@/lib/prisma'
import {
  InquiriesManagementTable,
  AdminInquiryItem,
} from '@/components/admin/inquiries-management-table'

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage() {
  let inquiries: AdminInquiryItem[] = []

  try {
    const dbInquiries = await prisma.inquiry.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    inquiries = dbInquiries.map((inq) => ({
      id: inq.id,
      customerName: inq.customerName,
      phone: inq.phone,
      email: inq.email,
      message: inq.message,
      status: inq.status as 'NEW' | 'CONTACTED' | 'CLOSED',
      createdAt: inq.createdAt.toISOString(),
      items: inq.items.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          images: item.product.images,
        },
      })),
    }))
  } catch (error) {
    console.error('Error fetching admin inquiries:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            B2B & MÜŞTERİ TALEPLERİ
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-black font-serif">
            Teklif Talepleri
          </h1>
        </div>
      </div>

      <InquiriesManagementTable initialInquiries={inquiries} />
    </div>
  )
}
