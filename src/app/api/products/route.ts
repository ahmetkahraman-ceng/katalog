import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { resolveCategoryId } from '@/lib/category-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Ürün adı ve slug zorunludur' },
        { status: 400 }
      )
    }

    // Resolve or find-or-create category so foreign key never fails
    const validCategoryId = await resolveCategoryId(body.categoryId, body.categoryName)

    // Process images if provided
    const imageList: string[] = Array.isArray(body.images)
      ? body.images.filter((url: string) => Boolean(url?.trim()))
      : body.imageUrl?.trim()
      ? [body.imageUrl.trim()]
      : []

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        priceMin: body.priceMin !== null && body.priceMin !== undefined ? Number(body.priceMin) : null,
        priceMax: body.priceMax !== null && body.priceMax !== undefined ? Number(body.priceMax) : null,
        colors: body.colors || [],
        status: body.status || 'ACTIVE',
        categoryId: validCategoryId,
        featured: Boolean(body.featured),
        images: imageList.length > 0 ? {
          create: imageList.map((url: string, idx: number) => ({
            url,
            alt: body.name,
            order: idx,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    })

    try {
      revalidatePath('/', 'layout')
      revalidatePath('/products')
      revalidatePath('/admin/products')
    } catch {
      // ignore
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Product creation error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bu slug ile zaten bir ürün mevcut. Lütfen farklı bir slug veya isim deneyin.' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Ürün oluşturulamadı' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
