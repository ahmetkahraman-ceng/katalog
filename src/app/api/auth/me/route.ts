import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('customer_token')?.value
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const user = verifySessionToken(token)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
