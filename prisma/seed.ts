import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/postgres'
const adapter = new PrismaPg(connectionString)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding initial categories and products...')

  // Clear existing
  await prisma.inquiryItem.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'El Çantası',
        slug: 'el-cantasi',
        description: 'Zarif, modern ve zamansız kadın el çantası koleksiyonu.',
        order: 1,
        image:
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sırt Çantası',
        slug: 'sirt-cantasi',
        description: 'Fonksiyonel ve minimalist deri ve kanvas sırt çantaları.',
        order: 2,
        image:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Laptop Çantası',
        slug: 'laptop-cantasi',
        description: 'Teknolojiye uyumlu, koruyucu bölmeli lüks laptop çantaları.',
        order: 3,
        image:
          'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Evrak Çantası',
        slug: 'evrak-cantasi',
        description: 'İş dünyasına uygun prestijli deri evrak ve portföy çantaları.',
        order: 4,
        image:
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
      },
    }),
  ])

  const [elCantasi, sirtCantasi, laptopCantasi, evrakCantasi] = categories

  // Products
  const sampleProducts = [
    {
      name: 'Atelier Minimal Deri El Çantası',
      slug: 'atelier-minimal-deri-el-cantasi',
      description:
        'İtalyan dana derisinden üretilmiş, zarif dikiş detayları ve minimalist formuyla öne çıkan el çantası.\n\nÖzellikler:\n- %100 Hakiki Deri\n- Manyetik kilit mekanizması\n- Çıkarılabilir omuz askısı\n- İç fermuarlı cep',
      priceMin: 3500,
      priceMax: 4800,
      colors: ['Siyah', 'Kahverengi', 'Bej'],
      featured: true,
      categoryId: elCantasi.id,
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
    },
    {
      name: 'Monochrome Geometrik Tote Çanta',
      slug: 'monochrome-geometrik-tote-canta',
      description:
        'Geniş iç hacmi ve mimari hatlarıyla günlük kullanım ve seyahatler için mükemmel bir seçenek.',
      priceMin: 2800,
      priceMax: 3600,
      colors: ['Siyah', 'Beyaz'],
      featured: true,
      categoryId: elCantasi.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
          alt: 'Monochrome Tote Çanta',
          order: 0,
        },
      ],
    },
    {
      name: 'Nordic Deri Şehir Sırt Çantası',
      slug: 'nordic-deri-sehir-sirt-cantasi',
      description:
        'İskandinav estetiğini yansıtan temiz çizgiler. Su geçirmez astar ve 14 inç korumalı laptop bölmesi içerir.',
      priceMin: 4200,
      priceMax: 5500,
      colors: ['Siyah', 'Gri', 'Lacivert'],
      featured: true,
      categoryId: sirtCantasi.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
          alt: 'Nordic Sırt Çantası',
          order: 0,
        },
      ],
    },
    {
      name: 'Executive Slim Evrak Çantası',
      slug: 'executive-slim-evrak-cantasi',
      description:
        'İnce silüeti ve yüksek dayanımlı deri yapısıyla profesyonellerin tercihi. A4 belgeler ve 15.6 inç bilgisayarlar için ideal.',
      priceMin: 5000,
      priceMax: 6500,
      colors: ['Kahverengi', 'Siyah'],
      featured: true,
      categoryId: evrakCantasi.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
          alt: 'Executive Evrak Çantası',
          order: 0,
        },
      ],
    },
    {
      name: 'Metropolitan Deri Laptop Kılıf Çanta',
      slug: 'metropolitan-deri-laptop-kilif-canta',
      description:
        'Hafif, taşınabilir ve dolgulu koruyucu iç katman. Şarj kabloları ve aksesuarlar için ön fermuarlı cep.',
      priceMin: 2200,
      priceMax: 3100,
      colors: ['Siyah', 'Lacivert', 'Bordo'],
      featured: true,
      categoryId: laptopCantasi.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
          alt: 'Metropolitan Laptop Çantası',
          order: 0,
        },
      ],
    },
  ]

  for (const prod of sampleProducts) {
    const { images, ...productData } = prod
    const created = await prisma.product.create({
      data: productData,
    })

    for (const img of images) {
      await prisma.productImage.create({
        data: {
          ...img,
          productId: created.id,
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
