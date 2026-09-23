import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function resolveCategoryId(categoryIdOrName: string, categoryName?: string): Promise<string> {
  if (!categoryIdOrName || !categoryIdOrName.trim()) {
    categoryIdOrName = 'El Çantası & Tote'
  }

  const trimmed = categoryIdOrName.trim()
  const candidateName = (categoryName || trimmed).trim()
  const candidateSlug = slugify(candidateName) || slugify(trimmed) || `cat-${Date.now()}`

  // 1. Try finding by ID
  try {
    const existingById = await prisma.category.findUnique({
      where: { id: trimmed },
    })
    if (existingById) return existingById.id
  } catch {
    // Not a valid ID or findUnique failed
  }

  // 2. Try finding by slug or exact name
  try {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: candidateSlug },
          { name: candidateName },
          { slug: trimmed },
          { name: trimmed },
        ],
      },
    })
    if (existing) return existing.id
  } catch {
    // Ignore error
  }

  // 3. Create category if not found
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: candidateName,
        slug: candidateSlug,
      },
    })
    return newCategory.id
  } catch {
    // In case of unique constraint conflict on slug, lookup the existing category
    try {
      const fallback = await prisma.category.findFirst({
        where: { slug: candidateSlug },
      })
      if (fallback) return fallback.id
    } catch {
      // ignore
    }

    // Try finding any category or create with timestamped slug
    try {
      const created = await prisma.category.create({
        data: {
          name: candidateName,
          slug: `${candidateSlug}-${Date.now().toString(36)}`,
        },
      })
      return created.id
    } catch {
      const anyCat = await prisma.category.findFirst()
      if (anyCat) return anyCat.id
      throw new Error('Kategori oluşturulamadı veya bulunamadı')
    }
  }
}
