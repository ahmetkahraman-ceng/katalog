import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSessionToken } from '@/lib/auth-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json({ error: 'Email gerekli.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const cleanName = name || cleanEmail.split('@')[0] || 'Müşteri'

    let dbUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          password: 'OAUTH_GOOGLE_REGISTERED',
          role: 'CUSTOMER',
        },
      })
    }

    const token = createSessionToken({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      phone: dbUser.phone,
      company: dbUser.company,
    })

    const response = NextResponse.json({ success: true, user: dbUser })
    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (err: any) {
    console.error('Sync session error:', err)
    return NextResponse.json(
      { error: err.message || 'Oturum eşitlenemedi.' },
      { status: 500 }
    )
  }
}
