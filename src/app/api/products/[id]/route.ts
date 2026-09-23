import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
    })
    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await request.json()

    // Handle image update if provided
    if (Array.isArray(body.images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      if (body.images.length > 0) {
        await prisma.productImage.createMany({
          data: body.images.map((url: string, index: number) => ({
            url,
            alt: body.name,
            productId: id,
            order: index,
          })),
        })
      }
    } else if (body.imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.create({
        data: {
          url: body.imageUrl,
          alt: body.name,
          productId: id,
          order: 0,
        },
      })
    }

    let categoryIdToSet: string | undefined = undefined
    if (body.categoryId) {
      const { resolveCategoryId } = await import('@/lib/category-service')
      categoryIdToSet = await resolveCategoryId(body.categoryId, body.categoryName)
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        priceMin: body.priceMin !== undefined ? (body.priceMin ? Number(body.priceMin) : null) : undefined,
        priceMax: body.priceMax !== undefined ? (body.priceMax ? Number(body.priceMax) : null) : undefined,
        colors: body.colors,
        status: body.status,
        categoryId: categoryIdToSet,
        featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    })

    try {
      revalidatePath('/', 'layout')
      revalidatePath(`/products/${updated.slug}`)
      revalidatePath('/admin/products')
    } catch {
      // ignore
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    await prisma.productImage.deleteMany({ where: { productId: id } })
    await prisma.inquiryItem.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })

    try {
      revalidatePath('/', 'layout')
      revalidatePath('/admin/products')
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
