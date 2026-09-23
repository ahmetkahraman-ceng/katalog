import { HeroSlider } from '@/components/home/hero-slider'
import { CategoryCards } from '@/components/home/category-cards'
import { FeaturedProducts } from '@/components/home/featured-products'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppFloatingButton } from '@/components/ui/whatsapp-button'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider />
        <CategoryCards />
        <FeaturedProducts />
      </main>
      <WhatsAppFloatingButton />
      <Footer />
    </>
  )
}
