import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      select: { status: true, slug: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }

    const nextStatus = product.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE'

    const updated = await prisma.product.update({
      where: { id },
      data: { status: nextStatus },
      select: { id: true, status: true },
    })

    try {
      revalidatePath('/', 'layout')
      revalidatePath(`/products/${product.slug}`)
      revalidatePath('/admin/products')
    } catch {
      // ignore
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
