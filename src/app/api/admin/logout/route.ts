import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Oturum kapatıldı.' })
  response.cookies.delete(COOKIE_NAME)
  return response
}

export async function GET(request: NextRequest) {
  const loginUrl = new URL('/admin/login', request.url)
  const response = NextResponse.redirect(loginUrl)
  response.cookies.delete(COOKIE_NAME)
  return response
}
