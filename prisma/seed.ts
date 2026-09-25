import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { MANUAL_CATEGORIES } from '../src/lib/categories-constants'
import { INITIAL_PRODUCTS } from '../src/lib/products-store'

async function main() {
  console.log('Seeding corporate bag categories and products...')

  // Upsert categories
  for (let i = 0; i < MANUAL_CATEGORIES.length; i++) {
    const cat = MANUAL_CATEGORIES[i]
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description || '',
        order: i + 1,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        order: i + 1,
      },
    })
  }

  // Upsert initial products
  for (const prod of INITIAL_PRODUCTS) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.category?.slug || prod.categoryId },
    })

    if (!category) continue

    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku || null,
        minOrderQty: prod.minOrderQty || 50,
        description: prod.description || '',
        priceMin: prod.priceMin || 0,
        priceMax: prod.priceMax || 0,
        colors: prod.colors || [],
        badge: prod.badge || null,
        tags: prod.tags || [],
        featured: prod.featured ?? true,
        status: prod.status || 'ACTIVE',
        categoryId: category.id,
      },
      create: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku || null,
        minOrderQty: prod.minOrderQty || 50,
        description: prod.description || '',
        priceMin: prod.priceMin || 0,
        priceMax: prod.priceMax || 0,
        colors: prod.colors || [],
        badge: prod.badge || null,
        tags: prod.tags || [],
        featured: prod.featured ?? true,
        status: prod.status || 'ACTIVE',
        categoryId: category.id,
      },
    })

    // Upsert images
    await prisma.productImage.deleteMany({ where: { productId: prod.id } })
    for (const img of prod.images) {
      await prisma.productImage.create({
        data: {
          url: img.url,
          alt: img.alt || prod.name,
          order: img.order || 0,
          productId: prod.id,
        },
      })
    }
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
