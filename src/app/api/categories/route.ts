import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_CATEGORIES = [
  { id: 'cat-el', name: 'El Çantası & Tote', slug: 'el-cantasi', _count: { products: 0 } },
  { id: 'cat-sirt', name: 'Sırt Çantası', slug: 'sirt-cantasi', _count: { products: 0 } },
  { id: 'cat-laptop', name: 'Laptop & Tablet Çantası', slug: 'laptop-cantasi', _count: { products: 0 } },
  { id: 'cat-evrak', name: 'Executive Evrak Çantası', slug: 'evrak-cantasi', _count: { products: 0 } },
]

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { order: 'asc' },
    })
    if (categories && categories.length > 0) {
      return NextResponse.json(categories)
    }
  } catch {
    // database not connected or offline, fallback cleanly
  }
  return NextResponse.json(DEFAULT_CATEGORIES)
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
