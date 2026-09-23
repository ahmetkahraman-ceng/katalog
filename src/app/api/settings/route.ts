import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSiteSettings, updateSiteSettings } from '@/lib/site-settings'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
}

export async function GET() {
  const settings = await getSiteSettings()
  return NextResponse.json(settings, { headers: NO_CACHE_HEADERS })
}

export async function POST(request: NextRequest) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const updated = await updateSiteSettings(body)

    // Instant On-Demand Revalidation
    try {
      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/admin/banner')
      revalidatePath('/admin/settings')
    } catch {
      // ignore
    }

    return NextResponse.json(
      { success: true, settings: updated },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Hata oluştu' }, { status: 500 })
  }
}
