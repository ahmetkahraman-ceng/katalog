import { InquiryForm } from '@/components/inquiry/inquiry-form'

export const metadata = {
  title: 'Teklif İste | ÇANTA',
  description: 'Ürünlerimiz hakkında teklif almak için formu doldurun.',
}

export default function InquiryPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
      <div className="text-center mb-12">
        <h1 className="text-2xl lg:text-3xl font-extralight tracking-[0.2em] uppercase">
          Teklif İste
        </h1>
        <p className="mt-4 text-sm font-light text-neutral-500 leading-relaxed">
          Ürünlerimiz hakkında bilgi almak veya teklif istemek için 
          aşağıdaki formu doldurun. En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </div>

      <InquiryForm />
    </div>
  )
}
