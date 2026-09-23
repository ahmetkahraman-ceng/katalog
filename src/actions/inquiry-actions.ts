'use server'

import { prisma } from '@/lib/prisma'
import { sendInquiryNotification } from '@/lib/resend'
import { z } from 'zod'

const inquirySchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  message: z.string().optional(),
  productIds: z.array(z.string()).min(1),
})

export async function createInquiry(formData: z.infer<typeof inquirySchema>) {
  const data = inquirySchema.parse(formData)

  const inquiry = await prisma.inquiry.create({
    data: {
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      message: data.message || null,
      items: {
        create: data.productIds.map(productId => ({ productId })),
      },
    },
    include: {
      items: { include: { product: true } },
    },
  })

  // Send notification
  try {
    await sendInquiryNotification({
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      message: data.message,
      productNames: inquiry.items.map(item => item.product.name),
    })
  } catch {
    console.error('Email notification failed')
  }

  return { success: true, id: inquiry.id }
}

export async function updateInquiryStatus(id: string, status: 'NEW' | 'CONTACTED' | 'CLOSED') {
  await prisma.inquiry.update({
    where: { id },
    data: { status },
  })
  return { success: true }
}
