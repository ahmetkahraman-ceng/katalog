import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendInquiryNotification } from '@/lib/resend'

const inquiryItemInputSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional().nullable(),
  variantName: z.string().optional().nullable(),
})

const inquirySchema = z.object({
  customerName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  message: z.string().optional().nullable(),
  quantityTier: z.string().optional().nullable(),
  productIds: z.array(z.string()).optional().default([]),
  items: z.array(inquiryItemInputSchema).optional().default([]),
})

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true } },
            variant: true,
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
    const allProductKeys = Array.from(
      new Set([...data.productIds, ...data.items.map((i) => i.productId)])
    )

    const existingProducts =
      allProductKeys.length > 0
        ? await prisma.product.findMany({
            where: {
              OR: [
                { id: { in: allProductKeys } },
                { slug: { in: allProductKeys } },
              ],
            },
            select: { id: true, name: true, slug: true },
          })
        : []

    const productMap = new Map<string, { id: string; name: string }>()
    existingProducts.forEach((p) => {
      productMap.set(p.id, p)
      productMap.set(p.slug, p)
    })

    const itemsToCreate: { productId: string; variantId?: string | null; variantName?: string | null }[] = []

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const matched = productMap.get(item.productId)
        if (matched) {
          itemsToCreate.push({
            productId: matched.id,
            variantId: item.variantId || null,
            variantName: item.variantName || null,
          })
        }
      }
    } else if (data.productIds && data.productIds.length > 0) {
      for (const pid of data.productIds) {
        const matched = productMap.get(pid)
        if (matched) {
          itemsToCreate.push({
            productId: matched.id,
          })
        }
      }
    }

    // Verify valid variant IDs in DB if provided
    if (itemsToCreate.length > 0) {
      const candidateVariantIds = itemsToCreate
        .map((i) => i.variantId)
        .filter(Boolean) as string[]

      if (candidateVariantIds.length > 0) {
        const validVariants = await prisma.productVariant.findMany({
          where: { id: { in: candidateVariantIds } },
          select: { id: true },
        })
        const validVariantIdSet = new Set(validVariants.map((v) => v.id))
        for (const item of itemsToCreate) {
          if (item.variantId && !validVariantIdSet.has(item.variantId)) {
            item.variantId = null
          }
        }
      }
    }

    const productNames = Array.from(
      new Set(itemsToCreate.map((item) => productMap.get(item.productId)?.name || 'Çanta'))
    )

    // Create inquiry with items
    const inquiry = await prisma.inquiry.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        message: fullMessage || null,
        items:
          itemsToCreate.length > 0
            ? {
                create: itemsToCreate.map((item) => ({
                  productId: item.productId,
                  variantId: item.variantId || undefined,
                  variantName: item.variantName || undefined,
                })),
              }
            : undefined,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
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
