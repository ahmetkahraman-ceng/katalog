import { NextRequest, NextResponse } from 'next/server'
import { registerCustomer, createSessionToken } from '@/lib/auth-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, company } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Lütfen ad soyad, e-posta ve şifre alanlarını eksiksiz doldurun.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifreniz en az 6 karakter uzunluğunda olmalıdır.' },
        { status: 400 }
      )
    }

    const user = await registerCustomer({ name, email, password, phone, company })
    const token = createSessionToken(user)

    const response = NextResponse.json({ success: true, user })

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  } catch (err: any) {
    console.error('Registration error:', err)
    return NextResponse.json(
      { error: err.message || 'Kayıt sırasında bir hata oluştu.' },
      { status: 400 }
    )
  }
}
