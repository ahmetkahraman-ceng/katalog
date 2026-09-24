import { Header } from '@/components/layout/header'
import { HeroSlider } from '@/components/home/hero-slider'
import { SearchSection } from '@/components/home/search-section'
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
        <HeroSlider />
        <SearchSection />
        <TrustBadges />
        <CategoryCards />
        <HowItWorks />
        <FeaturedProducts />
      </main>
      <WhatsAppFloatingButton />
      <Footer />
    </>
  )
}
