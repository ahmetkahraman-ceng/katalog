import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, createSessionToken, hashPassword, verifyPassword } from '@/lib/auth-service'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('customer_token')?.value
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const session = verifySessionToken(token)
    if (!session) {
      return NextResponse.json({ user: null })
    }

    // Always fetch fresh data from DB
    const dbUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, phone: true, company: true, role: true },
    })

    return NextResponse.json({ user: dbUser || session })
  } catch {
    return NextResponse.json({ user: null })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('customer_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const session = verifySessionToken(token)
    if (!session) {
      return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, company, currentPassword, newPassword } = body

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const updateData: any = {}
    if (name) updateData.name = name.trim()
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null
    if (company !== undefined) updateData.company = company ? company.trim() : null

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Mevcut şifrenizi giriniz' }, { status: 400 })
      }
      const isMatch = verifyPassword(currentPassword, user.password)
      if (!isMatch) {
        return NextResponse.json({ error: 'Mevcut şifreniz hatalı' }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalıdır' }, { status: 400 })
      }
      updateData.password = hashPassword(newPassword)
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, company: true, role: true },
    })

    // Update cookie with new session token
    const newToken = createSessionToken(updatedUser)
    const response = NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profiliniz başarıyla güncellendi.',
    })

    response.cookies.set('customer_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Güncelleme başarısız' }, { status: 500 })
  }
}
