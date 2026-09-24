import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

export function CorporateCta() {
  return (
    <section className="bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-neutral-100 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
          Özel İmalat & Kurumsal Çözümler
        </span>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-3xl mx-auto leading-tight sm:leading-tight">
          Özel Ebat, Kumaş veya Büyük Adetli Projeleriniz Mi Var?
        </h2>

        <p className="mt-4 text-sm sm:text-base text-neutral-200 max-w-2xl mx-auto leading-relaxed">
          Katalogdaki standart modellerin dışında firmanıza özel ölçü, kumaş gramajı, cep detayları ve baskı teknikleriyle toptan üretim gerçekleştiriyoruz.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/inquiry"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-neutral-100 text-[#1b4332] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <FileText size={18} />
            <span>Özel Teklif Talebi Gönder</span>
            <ArrowRight size={18} />
          </Link>

          <a
            href="https://wa.me/905300000000"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <WhatsAppIcon size={18} className="text-[#25D366]" />
            <span>WhatsApp ile Danışın</span>
          </a>
        </div>
      </div>
    </section>
  )
}
