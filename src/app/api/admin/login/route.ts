import { NextRequest, NextResponse } from 'next/server'
import {
  getClientIdentifier,
  checkLockout,
  recordFailedAttempt,
  resetAttempts,
  verifyCredentials,
  createSessionToken,
  COOKIE_NAME,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request)
    const lockoutState = checkLockout(identifier)

    // Check if system is currently locked
    if (lockoutState.isLocked) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          remainingSeconds: lockoutState.remainingSeconds,
          error: `Güvenlik protokolü devrede. 3 hatalı deneme nedeniyle sistem kilitlendi. Lütfen ${Math.ceil(
            lockoutState.remainingSeconds / 60
          )} dakika bekleyiniz.`,
        },
        { status: 429 }
      )
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Geçersiz veri biçimi.' },
        { status: 400 }
      )
    }

    const { username, password } = body || {}

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kullanıcı adı ve şifre gereklidir.',
        },
        { status: 400 }
      )
    }

    const isValid = verifyCredentials(username.trim(), password.trim())

    if (!isValid) {
      const failState = recordFailedAttempt(identifier)

      if (failState.isLocked) {
        return NextResponse.json(
          {
            success: false,
            locked: true,
            remainingSeconds: failState.remainingSeconds,
            error:
              '3 kez üst üste hatalı giriş yapıldı. Güvenlik protokolü devreye girdi, giriş 15 dakika kilitlendi.',
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          locked: false,
          remainingAttempts: failState.remainingAttempts,
          error: `Hatalı kullanıcı adı veya şifre! Kalan deneme hakkınız: ${failState.remainingAttempts}`,
        },
        { status: 401 }
      )
    }

    // Login successful
    resetAttempts(identifier)
    const token = createSessionToken(username.trim())

    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı.',
    })

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Giriş işlemi sırasında sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
