import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth-service'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('customer_token')?.value
    if (!token) {
      return NextResponse.json({ favorites: [] })
    }

    const session = verifySessionToken(token)
    if (!session) {
      return NextResponse.json({ favorites: [] })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.id },
      select: { productId: true },
    })

    return NextResponse.json({
      favorites: favorites.map((f) => f.productId),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('customer_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 })
    }

    const session = verifySessionToken(token)
    if (!session) {
      return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Ürün ID zorunludur' }, { status: 400 })
    }

    // Check if product exists in DB
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      // If product only exists in memory/local store, don't crash DB
      return NextResponse.json({ success: true, localOnly: true })
    }

    await prisma.favorite.upsert({
      where: {
        userId_productId: {
          userId: session.id,
          productId: product.id,
        },
      },
      update: {},
      create: {
        userId: session.id,
        productId: product.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('customer_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 })
    }

    const session = verifySessionToken(token)
    if (!session) {
      return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Ürün ID zorunludur' }, { status: 400 })
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.id,
        productId: productId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
