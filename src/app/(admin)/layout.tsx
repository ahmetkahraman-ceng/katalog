import { AdminSidebar } from '@/components/layout/admin-sidebar'
import Link from 'next/link'
import { Plus, ExternalLink } from 'lucide-react'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAuthenticated()

  if (!isAuth) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9f8] text-[#1a1c1c]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="h-16 bg-white border-b border-neutral-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400">
              ÇANTA ATELIER / MERKEZ KONTROL
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-neutral-300" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SİSTEM AKTİF & SENKRONİZE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-light tracking-wider uppercase text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors border border-neutral-200"
            >
              <ExternalLink size={13} />
              <span>Vitrini Gör</span>
            </Link>

            <Link
              href="/admin/products/new"
              className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-light tracking-widest uppercase flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus size={14} />
              <span>Ürün Ekle</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
