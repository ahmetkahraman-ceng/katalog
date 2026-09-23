import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'

export async function GET() {
  try {
    let categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { order: 'asc' },
    })

    // If database is connected but has no categories yet, automatically seed the silhouettes
    if (categories.length === 0) {
      for (let i = 0; i < MANUAL_CATEGORIES.length; i++) {
        const item = MANUAL_CATEGORIES[i]
        await prisma.category.upsert({
          where: { slug: item.slug },
          update: {},
          create: {
            name: item.name,
            slug: item.slug,
            order: i,
          },
        }).catch(() => null)
      }
      categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { order: 'asc' },
      })
    }

    if (categories && categories.length > 0) {
      return NextResponse.json(categories)
    }
  } catch (err) {
    console.error('Categories DB query fallback:', err)
  }

  // Fallback to static manual categories if DB is empty or unreachable
  return NextResponse.json(
    MANUAL_CATEGORIES.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      _count: { products: 0 },
    }))
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image: body.image || null,
      },
    })
    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kategori oluşturulamadı' },
      { status: 500 }
    )
  }
}
