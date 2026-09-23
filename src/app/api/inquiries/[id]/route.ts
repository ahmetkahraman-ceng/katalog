import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const inquiry = await prisma.inquiry.findUnique({
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

    if (!inquiry) {
      return NextResponse.json({ error: 'Talep bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.status || !['NEW', 'CONTACTED', 'CLOSED'].includes(body.status)) {
      return NextResponse.json({ error: 'Geçersiz talep durumu' }, { status: 400 })
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status: body.status },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    await prisma.inquiryItem.deleteMany({ where: { inquiryId: id } })
    await prisma.inquiry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
