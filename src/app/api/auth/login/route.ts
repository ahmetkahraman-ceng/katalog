import { NextRequest, NextResponse } from 'next/server'
import { authenticateCustomer, createSessionToken } from '@/lib/auth-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Lütfen e-posta ve şifrenizi girin.' },
        { status: 400 }
      )
    }

    const user = await authenticateCustomer(email, password)
    const token = createSessionToken(user)

    const response = NextResponse.json({ success: true, user })

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Giriş yapılamadı.' },
      { status: 401 }
    )
  }
}
