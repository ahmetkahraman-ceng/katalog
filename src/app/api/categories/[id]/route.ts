import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await request.json()

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description !== undefined ? body.description : undefined,
        image: body.image !== undefined ? body.image : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
      include: {
        _count: { select: { products: true } },
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kategori güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params

    // Check if category has products
    const count = await prisma.product.count({ where: { categoryId: id } })
    if (count > 0) {
      return NextResponse.json(
        { error: `Bu kategoride ${count} adet ürün bulunmaktadır. Önce bu ürünlerin kategorisini değiştirin veya silin.` },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kategori silinemedi' },
      { status: 500 }
    )
  }
}
