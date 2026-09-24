import { prisma } from '../src/lib/prisma'
import { MANUAL_CATEGORIES } from '../src/lib/categories-constants'

async function main() {
  console.log('Seeding 7 bag categories...')

  for (let i = 0; i < MANUAL_CATEGORIES.length; i++) {
    const cat = MANUAL_CATEGORIES[i]
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ slug: cat.slug }, { name: cat.name }],
      },
    })

    if (existing) {
      console.log(`Updating existing category: ${cat.name} (${cat.slug})`)
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          order: i,
        },
      })
    } else {
      console.log(`Creating category: ${cat.name} (${cat.slug})`)
      await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          order: i,
        },
      })
    }
  }

  console.log('Categories seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding categories:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
