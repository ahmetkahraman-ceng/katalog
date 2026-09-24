import { prisma } from '../src/lib/prisma'
import { INITIAL_PRODUCTS } from '../src/lib/products-store'

async function main() {
  console.log('Seeding products into PostgreSQL database...')

  for (const prod of INITIAL_PRODUCTS) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ slug: prod.categoryId }, { id: prod.categoryId }],
      },
    })

    if (!existingCategory) {
      console.warn(`Category not found for product: ${prod.name} (${prod.categoryId})`)
      continue
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug: prod.slug }, { id: prod.id }],
      },
    })

    if (existingProduct) {
      console.log(`Updating product: ${prod.name}`)
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku || null,
          minOrderQty: prod.minOrderQty || 50,
          description: prod.description || null,
          priceMin: prod.priceMin ? Number(prod.priceMin) : null,
          priceMax: prod.priceMax ? Number(prod.priceMax) : null,
          colors: prod.colors || [],
          badge: prod.badge || null,
          tags: prod.tags || [],
          featured: prod.featured,
          categoryId: existingCategory.id,
        },
      })
    } else {
      console.log(`Creating product: ${prod.name}`)
      await prisma.product.create({
        data: {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku || null,
          minOrderQty: prod.minOrderQty || 50,
          description: prod.description || null,
          priceMin: prod.priceMin ? Number(prod.priceMin) : null,
          priceMax: prod.priceMax ? Number(prod.priceMax) : null,
          colors: prod.colors || [],
          badge: prod.badge || null,
          tags: prod.tags || [],
          featured: prod.featured,
          categoryId: existingCategory.id,
          images: {
            create: prod.images.map((img, idx) => ({
              url: img.url,
              alt: img.alt || prod.name,
              order: idx,
            })),
          },
          specs: prod.specs
            ? {
                create: prod.specs.map((s, idx) => ({
                  specKey: s.specKey,
                  specValue: s.specValue,
                  sortOrder: s.sortOrder ?? idx,
                })),
              }
            : undefined,
          variants: prod.variants
            ? {
                create: prod.variants.map((v, idx) => ({
                  variantName: v.variantName,
                  variantType: v.variantType || 'Renk',
                  imageUrl: v.imageUrl || null,
                  sortOrder: v.sortOrder ?? idx,
                })),
              }
            : undefined,
        },
      })
    }
  }

  console.log('Products seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding products:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
