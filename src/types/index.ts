import type {
  Product,
  Category,
  ProductImage,
  ProductSpec,
  ProductExample,
  ProductFaq,
  ProductVariant,
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
  ProductVariant,
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
  variants?: ProductVariant[]
}

export type ProductDetail = Product & {
  category: Category
  images: ProductImage[]
  specs: ProductSpec[]
  examples: ProductExample[]
  faqs: ProductFaq[]
  variants: ProductVariant[]
}

// Inquiry with relations
export type InquiryWithItems = Inquiry & {
  items: (InquiryItem & {
    product: ProductWithImages
    variant?: ProductVariant | null
  })[]
}

// Form types
export interface InquiryFormData {
  customerName: string
  phone: string
  email: string
  message?: string
  productIds: string[]
  items?: {
    productId: string
    variantId?: string | null
    variantName?: string | null
  }[]
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
