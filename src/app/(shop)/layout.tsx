import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}
