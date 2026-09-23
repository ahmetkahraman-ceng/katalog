import { prisma } from '@/lib/prisma'
import { Package, MessageSquare, FolderOpen, Bell, ArrowUpRight, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { DashboardRecentTables } from '@/components/admin/dashboard-recent-tables'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  try {
    const [
      totalProducts,
      activeProducts,
      draftProducts,
      categoryCount,
      totalInquiries,
      newInquiries,
      recentInquiries,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count({ where: { status: 'DRAFT' } }),
      prisma.category.count(),
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
      prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
        },
      }),
    ])

    return {
      stats: {
        totalProducts,
        activeProducts,
        draftProducts,
        categoryCount,
        totalInquiries,
        newInquiries,
      },
      recentInquiries: recentInquiries.map((inq) => ({
        id: inq.id,
        customerName: inq.customerName,
        phone: inq.phone,
        email: inq.email,
        status: inq.status as 'NEW' | 'CONTACTED' | 'CLOSED',
        createdAt: inq.createdAt.toISOString(),
        items: inq.items.map((i) => ({
          product: { name: i.product.name },
        })),
      })),
      recentProducts: recentProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        status: p.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
        category: p.category ? { name: p.category.name } : undefined,
        images: p.images.map((img) => ({ url: img.url })),
      })),
    }
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return {
      stats: {
        totalProducts: 0,
        activeProducts: 0,
        draftProducts: 0,
        categoryCount: 0,
        totalInquiries: 0,
        newInquiries: 0,
      },
      recentInquiries: [],
      recentProducts: [],
    }
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
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
            className="px-4 py-2 bg-black text-white text-xs font-light tracking-widest uppercase hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>+</span>
            Yeni Model Ekle
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2 bg-white text-black border border-neutral-300 text-xs font-light tracking-widest uppercase hover:border-black transition-colors inline-flex items-center gap-1.5"
          >
            Tüm Talepler ({stats.newInquiries} Yeni)
          </Link>
        </div>
      </div>

      {/* 4 Ana Metrik Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Bekleyen Teklif Talepleri */}
        <div className="bg-white border border-neutral-200/80 p-6 rounded-sm relative overflow-hidden group hover:border-black/40 transition-colors shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] text-amber-700 uppercase font-semibold">
              BEKLEYEN TALEPLER
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-sm">
              <Bell size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-light tracking-tight text-black font-serif">
              {stats.newInquiries}
            </span>
            <span className="text-xs text-neutral-400 font-light">
              / {stats.totalInquiries} Toplam
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-light mt-2 flex items-center justify-between">
            <span>İletişime geçilmeyi bekliyor</span>
            <Link
              href="/admin/inquiries"
              className="text-black font-medium hover:underline inline-flex items-center"
            >
              Görüntüle <ArrowUpRight size={11} className="ml-0.5" />
            </Link>
          </p>
        </div>

        {/* 2. Aktif Katalog Ürünleri */}
        <div className="bg-white border border-neutral-200/80 p-6 rounded-sm relative overflow-hidden group hover:border-black/40 transition-colors shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
              VİTRİNDEKİ MODELLER
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-sm">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-light tracking-tight text-black font-serif">
              {stats.activeProducts}
            </span>
            <span className="text-xs text-neutral-400 font-light">
              Aktif Çanta
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-light mt-2 flex items-center justify-between">
            <span>{stats.draftProducts} model taslakta bekliyor</span>
            <Link
              href="/admin/products"
              className="text-black font-medium hover:underline inline-flex items-center"
            >
              Envanter <ArrowUpRight size={11} className="ml-0.5" />
            </Link>
          </p>
        </div>

        {/* 3. Toplam Model / Arşiv */}
        <div className="bg-white border border-neutral-200/80 p-6 rounded-sm relative overflow-hidden group hover:border-black/40 transition-colors shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
              TOPLAM KOLEKSİYON
            </span>
            <div className="p-2 bg-neutral-100 text-neutral-700 rounded-sm">
              <Package size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-light tracking-tight text-black font-serif">
              {stats.totalProducts}
            </span>
            <span className="text-xs text-neutral-400 font-light">
              Tasarım
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-light mt-2 flex items-center justify-between">
            <span>Özel üretim & silüetler</span>
            <Link
              href="/admin/products/new"
              className="text-black font-medium hover:underline inline-flex items-center"
            >
              Yeni Ekle <ArrowUpRight size={11} className="ml-0.5" />
            </Link>
          </p>
        </div>

        {/* 4. Kategoriler & Koleksiyonlar */}
        <div className="bg-white border border-neutral-200/80 p-6 rounded-sm relative overflow-hidden group hover:border-black/40 transition-colors shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
              SİLÜET VE KATEGORİ
            </span>
            <div className="p-2 bg-neutral-100 text-neutral-700 rounded-sm">
              <FolderOpen size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-light tracking-tight text-black font-serif">
              {stats.categoryCount}
            </span>
            <span className="text-xs text-neutral-400 font-light">
              Silüet Grubu
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-light mt-2 flex items-center justify-between">
            <span>Tote, Crossbody, Clutch vb.</span>
            <Link
              href="/admin/categories"
              className="text-black font-medium hover:underline inline-flex items-center"
            >
              Yönet <ArrowUpRight size={11} className="ml-0.5" />
            </Link>
          </p>
        </div>
      </div>

      {/* İnteraktif Tablolar: Son Talepler (1-tık durum değişimi) & Son Eklenen Modeller */}
      <DashboardRecentTables
        initialInquiries={recentInquiries}
        initialProducts={recentProducts}
      />
    </div>
  )
}
