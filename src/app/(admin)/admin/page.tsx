import { prisma } from '@/lib/prisma'
import { Package, MessageSquare, FolderOpen, Bell, ArrowUpRight, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { DashboardRecentTables } from '@/components/admin/dashboard-recent-tables'
import { MANUAL_CATEGORIES } from '@/lib/categories-constants'
import { getAllProducts } from '@/lib/products-store'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const allProducts = await getAllProducts()
  const activeProducts = allProducts.filter((p) => p.status === 'ACTIVE').length
  const draftProducts = allProducts.filter((p) => p.status === 'DRAFT').length

  let totalInquiries = 0
  let newInquiries = 0
  let recentInquiries: any[] = []

  try {
    const [dbTotalInquiries, dbNewInquiries, dbRecentInquiries] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
      prisma.inquiry.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      }),
    ])
    totalInquiries = dbTotalInquiries
    newInquiries = dbNewInquiries
    recentInquiries = dbRecentInquiries.map((inq) => ({
      id: inq.id,
      customerName: inq.customerName,
      phone: inq.phone,
      email: inq.email,
      status: inq.status as 'NEW' | 'CONTACTED' | 'CLOSED',
      createdAt: inq.createdAt.toISOString(),
      items: inq.items.map((i) => ({
        product: { name: i.product.name },
      })),
    }))
  } catch {
    // Inquiries offline or empty
  }

  const recentProducts = allProducts.slice(0, 6).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    status: p.status,
    category: p.category ? { name: p.category.name } : undefined,
    images: p.images.map((img) => ({ url: img.url })),
  }))

  return {
    stats: {
      totalProducts: allProducts.length,
      activeProducts,
      draftProducts,
      categoryCount: MANUAL_CATEGORIES.length,
      totalInquiries,
      newInquiries,
    },
    recentInquiries,
    recentProducts,
  }
}

export default async function AdminDashboardPage() {
  const { stats, recentInquiries, recentProducts } = await getDashboardData()

  return (
    <div className="space-y-8">
      {/* Üst Başlık ve Hoşgeldin Barı */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              CANLI ATELIER KONTROL MERKEZİ
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-black font-serif">
            Genel Bakış & Operasyon
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-light tracking-wider uppercase transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>+ Yeni Model Ekle</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2.5 bg-white border border-neutral-200 hover:border-black text-black text-xs font-light tracking-wider uppercase transition-colors inline-flex items-center gap-1.5"
          >
            <span>Tüm Talepler ({stats.newInquiries} Yeni)</span>
          </Link>
        </div>
      </div>

      {/* 4 Ana Metrik Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bekleyen Talepler */}
        <div className="bg-white border border-neutral-200/80 p-5 rounded-sm shadow-2xs hover:border-neutral-300 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase">
              Bekleyen Talepler
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light tracking-tight text-black font-serif">
              {stats.newInquiries}
            </span>
            <span className="text-xs text-neutral-400 font-light">
              / {stats.totalInquiries} Toplam
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light">
            <span className="text-neutral-500">İletişime geçilmeyi bekliyor</span>
            <Link
              href="/admin/inquiries"
              className="text-black hover:underline flex items-center gap-1"
            >
              <span>Görüntüle</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Vitrindeki Modeller */}
        <div className="bg-white border border-neutral-200/80 p-5 rounded-sm shadow-2xs hover:border-neutral-300 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase">
              Vitrindeki Modeller
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light tracking-tight text-black font-serif">
              {stats.activeProducts}
            </span>
            <span className="text-xs text-neutral-400 font-light">Aktif Çanta</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light">
            <span className="text-neutral-500">{stats.draftProducts} model taslakta bekliyor</span>
            <Link
              href="/admin/products"
              className="text-black hover:underline flex items-center gap-1"
            >
              <span>Envanter</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Toplam Koleksiyon */}
        <div className="bg-white border border-neutral-200/80 p-5 rounded-sm shadow-2xs hover:border-neutral-300 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase">
              Toplam Koleksiyon
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <Package size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light tracking-tight text-black font-serif">
              {stats.totalProducts}
            </span>
            <span className="text-xs text-neutral-400 font-light">Tasarım</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light">
            <span className="text-neutral-500">Özel üretim & silüetler</span>
            <Link
              href="/admin/products/new"
              className="text-black hover:underline flex items-center gap-1"
            >
              <span>Yeni Ekle</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Silüet & Kategori */}
        <div className="bg-white border border-neutral-200/80 p-5 rounded-sm shadow-2xs hover:border-neutral-300 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase">
              Silüet ve Kategori
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <FolderOpen size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light tracking-tight text-black font-serif">
              {stats.categoryCount}
            </span>
            <span className="text-xs text-neutral-400 font-light">Silüet Grubu</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light">
            <span className="text-neutral-500">Tote, Crossbody, Clutch vb.</span>
            <Link
              href="/admin/categories"
              className="text-black hover:underline flex items-center gap-1"
            >
              <span>Yönet</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Son Talepler ve Son Eklenen Modeller */}
      <DashboardRecentTables
        initialInquiries={recentInquiries}
        initialProducts={recentProducts}
      />
    </div>
  )
}
