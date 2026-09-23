import fs from 'fs'
import path from 'path'
import os from 'os'
import { prisma } from './prisma'
import { MANUAL_CATEGORIES } from './categories-constants'

export interface StoredProductImage {
  id?: string
  url: string
  alt?: string | null
  order?: number
}

export interface StoredProduct {
  id: string
  name: string
  slug: string
  description?: string | null
  priceMin?: number | null
  priceMax?: number | null
  colors: string[]
  featured: boolean
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
  }
  images: StoredProductImage[]
  createdAt: string
  updatedAt: string
}

// Initial curated luxury bag catalog
export const INITIAL_PRODUCTS: StoredProduct[] = [
  {
    id: 'prod-el-minimal',
    name: 'Atelier Minimal Deri El Çantası',
    slug: 'atelier-minimal-deri-el-cantasi',
    description:
      'İtalyan dana derisinden üretilmiş, zarif dikiş detayları ve minimalist formuyla öne çıkan el çantası.\n\nÖzellikler:\n- %100 Hakiki Deri\n- Manyetik kilit mekanizması\n- Çıkarılabilir omuz askısı\n- İç fermuarlı cep',
    priceMin: 3500,
    priceMax: 4800,
    colors: ['Siyah', 'Kahverengi', 'Bej'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'el-cantasi',
    category: {
      id: 'el-cantasi',
      name: 'El Çantası & Tote',
      slug: 'el-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop',
        alt: 'Atelier Minimal Deri El Çantası Ön Görünüm',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        alt: 'Atelier Minimal Deri El Çantası Detay',
        order: 1,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-el-tote',
    name: 'Monochrome Geometrik Tote Çanta',
    slug: 'monochrome-geometrik-tote-canta',
    description:
      'Geniş iç hacmi ve mimari hatlarıyla günlük kullanım ve seyahatler için mükemmel bir seçenek. Birinci sınıf dokulu deri gövde.',
    priceMin: 2800,
    priceMax: 3600,
    colors: ['Siyah', 'Beyaz'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'el-cantasi',
    category: {
      id: 'el-cantasi',
      name: 'El Çantası & Tote',
      slug: 'el-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
        alt: 'Monochrome Tote Çanta',
        order: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-sirt-nordic',
    name: 'Nordic Deri Şehir Sırt Çantası',
    slug: 'nordic-deri-sehir-sirt-cantasi',
    description:
      'İskandinav estetiğini yansıtan temiz çizgiler. Su geçirmez astar ve 14 inç korumalı laptop bölmesi içerir.',
    priceMin: 4200,
    priceMax: 5500,
    colors: ['Siyah', 'Gri', 'Lacivert'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'sirt-cantasi',
    category: {
      id: 'sirt-cantasi',
      name: 'Sırt Çantası',
      slug: 'sirt-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        alt: 'Nordic Sırt Çantası',
        order: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-evrak-exec',
    name: 'Executive Slim Evrak Çantası',
    slug: 'executive-slim-evrak-cantasi',
    description:
      'İnce silüeti ve yüksek dayanımlı deri yapısıyla profesyonellerin tercihi. A4 belgeler ve 15.6 inç bilgisayarlar için ideal.',
    priceMin: 5000,
    priceMax: 6500,
    colors: ['Kahverengi', 'Siyah'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'evrak-cantasi',
    category: {
      id: 'evrak-cantasi',
      name: 'Executive Evrak Çantası',
      slug: 'evrak-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
        alt: 'Executive Evrak Çantası',
        order: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-laptop-metro',
    name: 'Metropolitan Deri Laptop Kılıf Çanta',
    slug: 'metropolitan-deri-laptop-kilif-canta',
    description:
      'Hafif, taşınabilir ve dolgulu koruyucu iç katman. Şarj kabloları ve aksesuarlar için ön fermuarlı cep.',
    priceMin: 2200,
    priceMax: 3100,
    colors: ['Siyah', 'Lacivert', 'Bordo'],
    featured: true,
    status: 'ACTIVE',
    categoryId: 'laptop-cantasi',
    category: {
      id: 'laptop-cantasi',
      name: 'Laptop & Tablet Çantası',
      slug: 'laptop-cantasi',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
        alt: 'Metropolitan Laptop Çantası',
        order: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Global in-memory cache
const globalForProducts = globalThis as unknown as {
  __PRODUCTS_STORE__?: StoredProduct[]
}

const LOCAL_PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json')
const TMP_PRODUCTS_FILE = path.join(os.tmpdir(), 'products.json')

function readLocalStoredProducts(): StoredProduct[] {
  if (globalForProducts.__PRODUCTS_STORE__ && globalForProducts.__PRODUCTS_STORE__.length > 0) {
    return globalForProducts.__PRODUCTS_STORE__
  }

  // Try /tmp/products.json
  try {
    if (fs.existsSync(TMP_PRODUCTS_FILE)) {
      const data = fs.readFileSync(TMP_PRODUCTS_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalForProducts.__PRODUCTS_STORE__ = parsed
        return parsed
      }
    }
  } catch (err) {
    console.warn('Could not read from tmp products file:', err)
  }

  // Try src/data/products.json
  try {
    if (fs.existsSync(LOCAL_PRODUCTS_FILE)) {
      const data = fs.readFileSync(LOCAL_PRODUCTS_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalForProducts.__PRODUCTS_STORE__ = parsed
        return parsed
      }
    }
  } catch (err) {
    console.warn('Could not read from local products file:', err)
  }

  // Fallback to INITIAL_PRODUCTS
  globalForProducts.__PRODUCTS_STORE__ = [...INITIAL_PRODUCTS]
  return globalForProducts.__PRODUCTS_STORE__
}

function persistStoredProducts(products: StoredProduct[]) {
  globalForProducts.__PRODUCTS_STORE__ = products

  // Write to /tmp
  try {
    fs.writeFileSync(TMP_PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Failed writing products to tmpdir:', err)
  }

  // Write to local project file (if writable)
  try {
    const dir = path.dirname(LOCAL_PRODUCTS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(LOCAL_PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  } catch {
    // Expected on Vercel read-only filesystem; ignored!
  }
}

/**
 * Returns all products. Tries Prisma first; if empty or DB offline, returns stored products.
 */
export async function getAllProducts(): Promise<StoredProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceMin: p.priceMin ? Number(p.priceMin) : null,
        priceMax: p.priceMax ? Number(p.priceMax) : null,
        colors: p.colors || [],
        featured: Boolean(p.featured),
        status: p.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
        categoryId: p.categoryId,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
            }
          : undefined,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          order: img.order,
        })),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))
    }
  } catch {
    // DB not reachable or unseeded; fallback cleanly to store
  }

  return readLocalStoredProducts()
}

/**
 * Finds a product by ID or slug.
 */
export async function getProductByIdOrSlug(idOrSlug: string): Promise<StoredProduct | null> {
  try {
    const p = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
    })

    if (p) {
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceMin: p.priceMin ? Number(p.priceMin) : null,
        priceMax: p.priceMax ? Number(p.priceMax) : null,
        colors: p.colors || [],
        featured: Boolean(p.featured),
        status: p.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
        categoryId: p.categoryId,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
            }
          : undefined,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          order: img.order,
        })),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }
    }
  } catch {
    // fallback
  }

  const stored = readLocalStoredProducts()
  return stored.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
}

/**
 * Finds products by category (slug or ID).
 */
export async function getProductsByCategory(categorySlugOrId: string): Promise<StoredProduct[]> {
  const all = await getAllProducts()
  const target = categorySlugOrId.toLowerCase().trim()
  return all.filter((p) => {
    const catSlug = p.category?.slug?.toLowerCase()
    const catId = p.categoryId?.toLowerCase()
    return catSlug === target || catId === target || p.slug.includes(target)
  })
}

/**
 * Returns featured active products for the homepage.
 */
export async function getFeaturedProducts(limit = 8): Promise<StoredProduct[]> {
  const all = await getAllProducts()
  const featured = all.filter((p) => p.featured && p.status === 'ACTIVE')
  return (featured.length > 0 ? featured : all.filter((p) => p.status === 'ACTIVE')).slice(0, limit)
}

/**
 * Adds a new product to store (and DB if available).
 */
export async function saveProductToStore(productData: {
  name: string
  slug: string
  description?: string | null
  priceMin?: number | null
  priceMax?: number | null
  colors?: string[]
  featured?: boolean
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  categoryId: string
  categoryName?: string
  images: string[]
}): Promise<StoredProduct> {
  const newId = `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  const matchedCategory = MANUAL_CATEGORIES.find(
    (c) => c.id === productData.categoryId || c.slug === productData.categoryId
  )

  const categoryName = productData.categoryName || matchedCategory?.name || productData.categoryId
  const categorySlug = matchedCategory?.slug || productData.categoryId

  const newProduct: StoredProduct = {
    id: newId,
    name: productData.name,
    slug: productData.slug,
    description: productData.description || null,
    priceMin: productData.priceMin || null,
    priceMax: productData.priceMax || null,
    colors: productData.colors || [],
    featured: Boolean(productData.featured),
    status: productData.status || 'ACTIVE',
    categoryId: productData.categoryId,
    category: {
      id: productData.categoryId,
      name: categoryName,
      slug: categorySlug,
    },
    images: productData.images.map((url, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      url,
      alt: productData.name,
      order: idx,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Try creating in DB
  try {
    const { resolveCategoryId } = await import('./category-service')
    const validCatId = await resolveCategoryId(productData.categoryId, categoryName)
    const dbCreated = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description || null,
        priceMin: productData.priceMin !== null && productData.priceMin !== undefined ? Number(productData.priceMin) : null,
        priceMax: productData.priceMax !== null && productData.priceMax !== undefined ? Number(productData.priceMax) : null,
        colors: productData.colors || [],
        status: (productData.status as any) || 'ACTIVE',
        categoryId: validCatId,
        featured: Boolean(productData.featured),
        images: productData.images.length > 0 ? {
          create: productData.images.map((url, idx) => ({
            url,
            alt: productData.name,
            order: idx,
          })),
        } : undefined,
      },
    })
    if (dbCreated?.id) {
      newProduct.id = dbCreated.id
    }
  } catch (err) {
    console.warn('DB product creation bypassed or failed, saved to store:', err)
  }

  // Always update persistent store
  const current = readLocalStoredProducts()
  // Add to beginning of array
  const updated = [newProduct, ...current.filter((p) => p.slug !== newProduct.slug && p.id !== newProduct.id)]
  persistStoredProducts(updated)

  return newProduct
}

/**
 * Updates a product in store (and DB if available).
 */
export async function updateProductInStore(
  id: string,
  partial: Partial<StoredProduct> & { categoryName?: string }
): Promise<StoredProduct | null> {
  const current = readLocalStoredProducts()
  const existingIdx = current.findIndex((p) => p.id === id || p.slug === id)

  // Try updating in DB
  try {
    const existingDb = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    })

    if (existingDb) {
      let validCatId: string | undefined = undefined
      if (partial.categoryId) {
        const { resolveCategoryId } = await import('./category-service')
        validCatId = await resolveCategoryId(partial.categoryId, partial.categoryName)
      }

      await prisma.product.update({
        where: { id: existingDb.id },
        data: {
          name: partial.name,
          slug: partial.slug,
          description: partial.description,
          priceMin: partial.priceMin !== undefined ? (partial.priceMin ? Number(partial.priceMin) : null) : undefined,
          priceMax: partial.priceMax !== undefined ? (partial.priceMax ? Number(partial.priceMax) : null) : undefined,
          colors: partial.colors,
          status: partial.status as any,
          featured: partial.featured,
          categoryId: validCatId,
        },
      })

      if (partial.images && partial.images.length > 0) {
        await prisma.productImage.deleteMany({ where: { productId: existingDb.id } })
        await prisma.productImage.createMany({
          data: partial.images.map((img, idx) => ({
            productId: existingDb.id,
            url: img.url,
            alt: img.alt || partial.name || 'Çanta Görseli',
            order: idx,
          })),
        })
      }
    }
  } catch (err) {
    console.warn('DB product update bypassed or failed:', err)
  }

  if (existingIdx === -1) {
    return null
  }

  const existing = current[existingIdx]
  const updatedItem: StoredProduct = {
    ...existing,
    ...partial,
    updatedAt: new Date().toISOString(),
  }

  current[existingIdx] = updatedItem
  persistStoredProducts(current)
  return updatedItem
}

/**
 * Deletes a product from store (and DB if available).
 */
export async function deleteProductFromStore(id: string): Promise<boolean> {
  try {
    const existingDb = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    })
    if (existingDb) {
      await prisma.inquiryItem.deleteMany({ where: { productId: existingDb.id } })
      await prisma.productImage.deleteMany({ where: { productId: existingDb.id } })
      await prisma.product.delete({ where: { id: existingDb.id } })
    }
  } catch (err) {
    console.warn('DB product delete bypassed or failed:', err)
  }

  const current = readLocalStoredProducts()
  const filtered = current.filter((p) => p.id !== id && p.slug !== id)
  persistStoredProducts(filtered)
  return true
}
