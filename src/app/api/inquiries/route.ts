import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendInquiryNotification } from '@/lib/resend'

const inquirySchema = z.object({
  customerName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  message: z.string().optional().nullable(),
  quantityTier: z.string().optional().nullable(),
  productIds: z.array(z.string()).optional().default([]),
})

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    })
    return NextResponse.json(inquiries)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = inquirySchema.parse(body)

    // Build the final message by appending quantityTier if provided
    let fullMessage = data.message?.trim() || ''
    if (data.quantityTier) {
      fullMessage = fullMessage
        ? `[Talep Edilen Adet: ${data.quantityTier}]\n${fullMessage}`
        : `[Talep Edilen Adet: ${data.quantityTier}]`
    }

    // Resolve valid products from DB
    const validProductIds: string[] = []
    let productNames: string[] = []

    if (data.productIds && data.productIds.length > 0) {
      const existingProducts = await prisma.product.findMany({
        where: {
          OR: [
            { id: { in: data.productIds } },
            { slug: { in: data.productIds } },
          ],
        },
        select: { id: true, name: true },
      })

      validProductIds.push(...existingProducts.map(p => p.id))
      productNames = existingProducts.map(p => p.name)
    }

    // Create inquiry with items
    const inquiry = await prisma.inquiry.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        message: fullMessage || null,
        items: validProductIds.length > 0
          ? {
              create: validProductIds.map(productId => ({
                productId,
              })),
            }
          : undefined,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Send email notification (non-blocking)
    try {
      await sendInquiryNotification({
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        message: fullMessage || undefined,
        productNames: productNames.length > 0 ? productNames : ['Genel Danışma & Teklif Talebi'],
      })
    } catch (emailError) {
      console.warn('E-posta bildirimi gönderilemedi (atlandı):', emailError)
    }

    return NextResponse.json(
      {
        success: true,
        id: inquiry.id,
        message: 'Teklif talebiniz başarıyla alındı.',
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Lütfen formu eksiksiz doldurunuz.', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Inquiry creation error:', error)
    return NextResponse.json(
      { error: 'Talep oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.' },
      { status: 500 }
    )
  }
}
