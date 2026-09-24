import { prisma } from '@/lib/prisma'
import { Package, MessageSquare, FolderOpen, Bell, ArrowUpRight, CheckCircle2, Sparkles, Plus } from 'lucide-react'
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
      companyName: inq.companyName || undefined,
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
    sku: p.sku,
    status: p.status,
    priceMin: p.priceMin,
    priceMax: p.priceMax,
    minOrderQty: p.minOrderQty,
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span className="text-[11px] font-bold tracking-wider text-[#2d6a4f] uppercase">
              Toptan Çanta Talep & Katalog Yönetimi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Genel Bakış & Operasyon
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Gelen müşteri teklif taleplerini inceleyin ve katalog envanterinizi güncelleyin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Yeni Model Ekle</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2.5 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-2 shadow-2xs"
          >
            <MessageSquare size={14} className="text-[#2d6a4f]" />
            <span>Tüm Talepler ({stats.newInquiries} Yeni)</span>
          </Link>
        </div>
      </div>

      {/* 4 Ana Metrik Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Bekleyen Talepler */}
        <div className="bg-white border border-neutral-200/90 p-5 rounded-2xl shadow-2xs hover:border-[#2d6a4f]/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Bekleyen Talepler
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Bell size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              {stats.newInquiries}
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              / {stats.totalInquiries} Toplam
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-medium">Cevap bekleyen teklifler</span>
            <Link
              href="/admin/inquiries"
              className="text-[#2d6a4f] font-semibold hover:underline flex items-center gap-1"
            >
              <span>İncele</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Vitrindeki Modeller */}
        <div className="bg-white border border-neutral-200/90 p-5 rounded-2xl shadow-2xs hover:border-[#2d6a4f]/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Aktif Çantalar
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2d6a4f] flex items-center justify-center font-bold">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              {stats.activeProducts}
            </span>
            <span className="text-xs text-neutral-400 font-medium">Yayında</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">{stats.draftProducts} model taslakta</span>
            <Link
              href="/admin/products"
              className="text-[#2d6a4f] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Modeller</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Toplam Koleksiyon */}
        <div className="bg-white border border-neutral-200/90 p-5 rounded-2xl shadow-2xs hover:border-[#2d6a4f]/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Toplam Koleksiyon
            </span>
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
              <Package size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              {stats.totalProducts}
            </span>
            <span className="text-xs text-neutral-400 font-medium">Model Kayıtlı</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Özel üretim & toptan</span>
            <Link
              href="/admin/products/new"
              className="text-[#2d6a4f] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Model Ekle</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Silüet & Kategori */}
        <div className="bg-white border border-neutral-200/90 p-5 rounded-2xl shadow-2xs hover:border-[#2d6a4f]/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Kategori Sayısı
            </span>
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
              <FolderOpen size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              {stats.categoryCount}
            </span>
            <span className="text-xs text-neutral-400 font-medium">Ana Grup</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Bez, Sırt, Karton, Deri vb.</span>
            <Link
              href="/admin/categories"
              className="text-[#2d6a4f] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Yönet</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Son Talepler ve Son Eklenen Modeller Tabloları */}
      <DashboardRecentTables
        initialInquiries={recentInquiries}
        initialProducts={recentProducts}
      />
    </div>
  )
}
