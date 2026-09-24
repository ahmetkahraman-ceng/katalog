import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSessionToken } from '@/lib/auth-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gvdigwwufllbmlmxxjdf.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Can be ignored if called from a Server Component
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      const email = data.user.email?.toLowerCase().trim()
      const name =
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name ||
        email?.split('@')[0] ||
        'Google Müşterisi'

      if (email) {
        // Find or create in prisma.user
        let dbUser = await prisma.user.findUnique({
          where: { email },
        })

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              name,
              email,
              password: 'OAUTH_GOOGLE_REGISTERED',
              role: 'CUSTOMER',
            },
          })
        } else if (dbUser.name === 'Google Müşterisi' && name !== 'Google Müşterisi') {
          dbUser = await prisma.user.update({
            where: { email },
            data: { name },
          })
        }

        // Set customer session cookie
        const token = createSessionToken({
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          phone: dbUser.phone,
          company: dbUser.company,
        })

        const response = NextResponse.redirect(`${origin}${next}`)
        response.cookies.set('customer_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        })
        return response
      }
    } else {
      console.error('Supabase auth code exchange error:', error)
    }
  }

  // If code is not present or exchange failed, redirect to home with notice
  return NextResponse.redirect(`${origin}${next}`)
}
