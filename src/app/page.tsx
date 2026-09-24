import { Header } from '@/components/layout/header'
import { HeroSlider } from '@/components/home/hero-slider'
import { SearchSection } from '@/components/home/search-section'
import { TrustBadges } from '@/components/home/trust-badges'
import { CategoryCards } from '@/components/home/category-cards'
import { FeaturedProducts } from '@/components/home/featured-products'
import { HowItWorks } from '@/components/home/how-it-works'
import { CorporateCta } from '@/components/home/corporate-cta'
import { Footer } from '@/components/layout/footer'
import { WhatsAppFloatingButton } from '@/components/ui/whatsapp-button'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-24 sm:pt-28 lg:pt-32 bg-white">
        <HeroSlider />
        <SearchSection />
        <TrustBadges />
        <CategoryCards />
        <FeaturedProducts />
        <HowItWorks />
        <CorporateCta />
      </main>
      <WhatsAppFloatingButton />
      <Footer />
    </>
  )
}
