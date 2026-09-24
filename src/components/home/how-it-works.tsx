const steps = [
  {
    number: '1',
    title: 'Ürünleri İncele',
    description: 'Kategorilerimizden ihtiyacınıza uygun çantayı seçin.'
  },
  {
    number: '2',
    title: 'Teklif Listene Ekle',
    description: 'Beğendiğiniz ürünleri teklif listesine ekleyin.'
  },
  {
    number: '3',
    title: 'Formu Doldur',
    description: 'İstediğiniz adet, baskı detayı ve bilgilerinizi girin.'
  },
  {
    number: '4',
    title: 'Teklif Al',
    description: 'Uzman ekibimiz en kısa sürede size teklif sunsun.'
  }
]

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900">NASIL TEKLİF ALIRSINIZ?</h2>
          <div className="mt-4 h-1 w-20 bg-[#c5a35a] mx-auto rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d6a4f] text-2xl font-bold text-white shadow-lg">
                {step.number}
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-gray-300 -translate-y-1/2 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
