import { Header } from '@/components/layout/header'
import { HeroSlider } from '@/components/home/hero-slider'
import { TrustBadges } from '@/components/home/trust-badges'
import { CategoryCards } from '@/components/home/category-cards'
import { HowItWorks } from '@/components/home/how-it-works'
import { FeaturedProducts } from '@/components/home/featured-products'
import { Footer } from '@/components/layout/footer'
import { WhatsAppFloatingButton } from '@/components/ui/whatsapp-button'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-28">
        {/* 1. Full-width Hero Slider */}
        <HeroSlider />

        {/* 2. Trust Badges Ribbon */}
        <TrustBadges />

        {/* 3. Popular Categories Bento Grid (3-4 Columns) */}
        <CategoryCards />

        {/* 4. "Nasıl Teklif Alırım?" 4-Step Process Cards */}
        <HowItWorks />

        {/* 5. "Öne Çıkan Ürünler" & "Yeni Gelenler" Grids */}
        <FeaturedProducts />
      </main>
      <WhatsAppFloatingButton />
      <Footer />
    </>
  )
}
