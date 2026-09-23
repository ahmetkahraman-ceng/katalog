import { NextRequest, NextResponse } from 'next/server'
import { getSiteSettings, updateSiteSettings } from '@/lib/site-settings'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  const settings = getSiteSettings()
  return NextResponse.json({
    announcement: settings.announcement,
    hero: settings.hero,
  })
}

export async function POST(request: NextRequest) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { hero, announcement } = body

    const updated = updateSiteSettings({
      hero: hero ? { ...getSiteSettings().hero, ...hero } : undefined,
      announcement: announcement ? { ...getSiteSettings().announcement, ...announcement } : undefined,
    })

    return NextResponse.json({ success: true, settings: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Hata oluştu' }, { status: 500 })
  }
}
