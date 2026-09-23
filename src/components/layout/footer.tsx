import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-extralight tracking-[0.3em] uppercase mb-4">ÇANTA</h3>
            <p className="text-sm font-light text-neutral-500 leading-relaxed">
              Kaliteli ve şık çanta koleksiyonlarımızı keşfedin. 
              Her tarza uygun, özenle tasarlanmış ürünlerimiz ile 
              tarzınızı tamamlayın.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-light tracking-[0.2em] uppercase text-neutral-400 mb-4">Kategoriler</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/categories/el-cantasi" className="text-sm font-light text-neutral-600 hover:text-black transition-colors">
                  El Çantası
                </Link>
              </li>
              <li>
                <Link href="/categories/sirt-cantasi" className="text-sm font-light text-neutral-600 hover:text-black transition-colors">
                  Sırt Çantası
                </Link>
              </li>
              <li>
                <Link href="/categories/laptop-cantasi" className="text-sm font-light text-neutral-600 hover:text-black transition-colors">
                  Laptop Çantası
                </Link>
              </li>
              <li>
                <Link href="/categories/evrak-cantasi" className="text-sm font-light text-neutral-600 hover:text-black transition-colors">
                  Evrak Çantası
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-light tracking-[0.2em] uppercase text-neutral-400 mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm font-light text-neutral-600">
              <li>info@cantafirma.com</li>
              <li>+90 (212) 000 00 00</li>
              <li>İstanbul, Türkiye</li>
            </ul>
            <Link
              href="/inquiry"
              className="inline-block mt-6 px-6 py-3 text-xs font-light tracking-[0.15em] uppercase border border-black text-black hover:bg-black hover:text-white transition-colors"
            >
              Teklif İste
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 text-center">
          <p className="text-xs font-light text-neutral-400 tracking-wider">
            © {new Date().getFullYear()} ÇANTA. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
