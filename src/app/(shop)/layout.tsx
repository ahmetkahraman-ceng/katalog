import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppFloatingButton } from '@/components/ui/whatsapp-button'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 lg:pt-20">
        {children}
      </main>
      <WhatsAppFloatingButton />
      <Footer />
    </>
  )
}
