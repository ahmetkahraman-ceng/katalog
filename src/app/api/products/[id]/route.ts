import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  getProductByIdOrSlug,
  updateProductInStore,
  deleteProductFromStore,
} from '@/lib/products-store'

interface Props {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const product = await getProductByIdOrSlug(id)
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

    const updated = await updateProductInStore(id, {
      name: body.name,
      slug: body.slug,
      sku: body.sku !== undefined ? body.sku : undefined,
      minOrderQty: body.minOrderQty !== undefined ? (body.minOrderQty ? Number(body.minOrderQty) : 50) : undefined,
      description: body.description,
      priceMin: body.priceMin !== undefined ? (body.priceMin ? Number(body.priceMin) : null) : undefined,
      priceMax: body.priceMax !== undefined ? (body.priceMax ? Number(body.priceMax) : null) : undefined,
      colors: body.colors,
      badge: body.badge !== undefined ? body.badge : undefined,
      tags: body.tags !== undefined ? body.tags : undefined,
      status: body.status,
      categoryId: body.categoryId,
      categoryName: body.categoryName,
      featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
      images: Array.isArray(body.images)
        ? body.images.map((url: string, idx: number) => ({ url, order: idx }))
        : undefined,
      specs: body.specs,
      examples: body.examples,
      faqs: body.faqs,
      variants: body.variants,
    })

    try {
      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath('/admin/products')
      if (updated?.slug) {
        revalidatePath(`/products/${updated.slug}`)
      }
    } catch {
      // ignore
    }

    return NextResponse.json(updated || { success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    await deleteProductFromStore(id)

    try {
      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/admin/products')
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
