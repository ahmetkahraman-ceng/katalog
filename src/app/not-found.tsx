import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-white">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
            <Sparkles size={12} className="text-black" />
            <span>404 • SAYFA BULUNAMADI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-light font-serif tracking-wide uppercase text-black">
            Aradığınız Model veya Sayfa Mevcut Değil
          </h1>

          <p className="text-xs sm:text-sm font-light text-neutral-500 leading-relaxed">
            Talep ettiğiniz içerik taşınmış, güncellenmiş veya henüz kataloğa eklenmemiş olabilir. Ana koleksiyondan diğer siluetlerimizi inceleyebilirsiniz.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-light tracking-widest uppercase inline-flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Ana Sayfaya Dön</span>
            </Link>
            <Link
              href="/inquiry"
              className="w-full sm:w-auto px-6 py-3.5 border border-neutral-300 hover:border-black text-black text-xs font-light tracking-widest uppercase inline-flex items-center justify-center transition-colors"
            >
              <span>Özel Teklif İste</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
