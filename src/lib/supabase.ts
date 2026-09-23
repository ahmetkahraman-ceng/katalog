import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Browser client (for public use)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client (for admin operations with service role)
export function createServerClient() {
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Storage helper
export function getStorageUrl(bucket: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
