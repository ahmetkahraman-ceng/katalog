import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json([])
  }
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
