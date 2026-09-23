import type {
  Product,
  Category,
  ProductImage,
  ProductSpec,
  ProductExample,
  ProductFaq,
  Inquiry,
  InquiryItem,
  ProductStatus,
  InquiryStatus,
} from '@prisma/client'

export type {
  Product,
  Category,
  ProductImage,
  ProductSpec,
  ProductExample,
  ProductFaq,
  Inquiry,
  InquiryItem,
  ProductStatus,
  InquiryStatus,
}

// Product with relations
export type ProductWithImages = Product & {
  images: ProductImage[]
}

export type ProductWithCategory = Product & {
  category: Category
  images: ProductImage[]
  specs?: ProductSpec[]
  examples?: ProductExample[]
  faqs?: ProductFaq[]
}

export type ProductDetail = Product & {
  category: Category
  images: ProductImage[]
  specs: ProductSpec[]
  examples: ProductExample[]
  faqs: ProductFaq[]
}

// Inquiry with relations
export type InquiryWithItems = Inquiry & {
  items: (InquiryItem & {
    product: ProductWithImages
  })[]
}

// Form types
export interface InquiryFormData {
  customerName: string
  phone: string
  email: string
  message?: string
  productIds: string[]
  companyName?: string
  estimatedQuantity?: string
}

// Filter types
export interface ProductFilters {
  categorySlug?: string
  colors?: string[]
  priceMin?: number
  priceMax?: number
  badge?: string
  search?: string
  page?: number
  limit?: number
}
