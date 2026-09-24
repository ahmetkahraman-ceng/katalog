import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { saveProductToStore, getAllProducts } from '@/lib/products-store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Ürün adı ve slug zorunludur' },
        { status: 400 }
      )
    }

    if (!body.categoryId) {
      return NextResponse.json(
        { error: 'Lütfen bir kategori seçin' },
        { status: 400 }
      )
    }

    // Process images
    const imageList: string[] = Array.isArray(body.images)
      ? body.images.filter((url: string) => Boolean(url?.trim()))
      : body.imageUrl?.trim()
      ? [body.imageUrl.trim()]
      : []

    // Save product into unified store (DB + local persistence)
    const product = await saveProductToStore({
      name: body.name,
      slug: body.slug,
      sku: body.sku || null,
      minOrderQty: body.minOrderQty ? Number(body.minOrderQty) : 50,
      description: body.description || null,
      priceMin: body.priceMin !== null && body.priceMin !== undefined ? Number(body.priceMin) : null,
      priceMax: body.priceMax !== null && body.priceMax !== undefined ? Number(body.priceMax) : null,
      colors: body.colors || [],
      badge: body.badge || null,
      tags: body.tags || [],
      featured: Boolean(body.featured),
      status: body.status || 'ACTIVE',
      categoryId: body.categoryId,
      categoryName: body.categoryName,
      images: imageList,
      specs: body.specs || [],
      examples: body.examples || [],
      faqs: body.faqs || [],
      variants: body.variants || [],
    })

    try {
      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath('/admin/products')
      revalidatePath('/admin')
      if (product.category?.slug) {
        revalidatePath(`/categories/${product.category.slug}`)
      }
    } catch {
      // ignore
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Ürün oluşturulamadı' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json(
      { products },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch {
    return NextResponse.json({ products: [] }, { status: 200 })
  }
}
