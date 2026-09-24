import crypto from 'crypto'
import { prisma } from './prisma'

export interface UserSession {
  id: string
  name: string
  email: string
  role: string
  phone?: string | null
  company?: string | null
}

const AUTH_SECRET = process.env.AUTH_SECRET || 'bag-catalog-jwt-secret-key-at-least-32-chars-long!!'

/**
 * Hashes a plain text password with a unique salt using standard PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verifies a plain text password against the stored salt:hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':')
    if (!salt || !originalHash) return false
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'))
  } catch {
    return false
  }
}

/**
 * Creates a signed JWT-like base64 session token
 */
export function createSessionToken(user: UserSession): string {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  })
  const encodedPayload = Buffer.from(payload).toString('base64url')
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url')
  return `${encodedPayload}.${signature}`
}

/**
 * Verifies and decodes a session token
 */
export function verifySessionToken(token: string): UserSession | null {
  try {
    const [encodedPayload, signature] = token.split('.')
    if (!encodedPayload || !signature) return null

    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url')
    if (signature !== expectedSignature) return null

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'))
    if (payload.exp && Date.now() > payload.exp) return null

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role || 'CUSTOMER',
      phone: payload.phone || null,
      company: payload.company || null,
    }
  } catch {
    return null
  }
}

/**
 * Registers a new customer into PostgreSQL database
 */
export async function registerCustomer({
  name,
  email,
  password,
  phone,
  company,
}: {
  name: string
  email: string
  password: string
  phone?: string
  company?: string
}): Promise<UserSession> {
  const cleanEmail = email.toLowerCase().trim()
  const cleanName = name.trim()

  const existing = await prisma.user.findUnique({
    where: { email: cleanEmail },
  })

  if (existing) {
    throw new Error('Bu e-posta adresiyle kayıtlı bir hesap zaten mevcuttur.')
  }

  const hashedPassword = hashPassword(password)

  const user = await prisma.user.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      role: 'CUSTOMER',
    },
  })

  // Synchronize customer to Supabase auth.users so it appears in Supabase Auth Dashboard
  try {
    await syncUserToSupabaseAuth({
      email: cleanEmail,
      password,
      name: cleanName,
      phone,
      company,
    })
  } catch (syncErr) {
    console.warn('Supabase Auth register sync warning:', syncErr)
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    company: user.company,
  }
}

/**
 * Authenticates a customer
 */
export async function authenticateCustomer(
  email: string,
  password: string
): Promise<UserSession> {
  const cleanEmail = email.toLowerCase().trim()

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  })

  if (!user) {
    throw new Error('E-posta veya şifre hatalı.')
  }

  const isValid = verifyPassword(password, user.password)
  if (!isValid) {
    throw new Error('E-posta veya şifre hatalı.')
  }

  // Update last sign in in Supabase auth.users
  syncUserToSupabaseAuth({
    email: cleanEmail,
    name: user.name,
    phone: user.phone,
    company: user.company,
  }).catch(() => {})

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    company: user.company,
  }
}

/**
 * Ensures user is registered and synced in Supabase Auth (auth.users & auth.identities)
 * so that they appear on the Supabase Dashboard -> Authentication -> Users page.
 */
export async function syncUserToSupabaseAuth({
  email,
  password,
  name,
  phone,
  company,
}: {
  email: string
  password?: string
  name: string
  phone?: string | null
  company?: string | null
}): Promise<string | null> {
  const cleanEmail = email.toLowerCase().trim()
  const metadata = JSON.stringify({
    name,
    full_name: name,
    phone: phone || null,
    company: company || null,
  })

  // 1. Try Supabase Service Role Admin API if configured
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceKey && !serviceKey.includes('placeholder')) {
      const { createServerClient } = await import('./supabase')
      const supabaseAdmin = createServerClient()
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: password || undefined,
        email_confirm: true,
        user_metadata: {
          name,
          full_name: name,
          phone: phone || null,
          company: company || null,
        },
      })
      if (!error && created?.user) {
        return created.user.id
      }
    }
  } catch (err) {
    // Proceed to direct DB sync
  }

  // 2. Direct PostgreSQL sync to auth.users & auth.identities (Guaranteed via DATABASE_URL)
  try {
    const existing: any[] = await prisma.$queryRawUnsafe(
      `SELECT id FROM auth.users WHERE lower(email) = lower($1) LIMIT 1;`,
      cleanEmail
    )

    if (existing.length > 0) {
      const userId = existing[0].id
      await prisma.$executeRawUnsafe(
        `UPDATE auth.users 
         SET raw_user_meta_data = $1::jsonb, updated_at = now(), last_sign_in_at = now()
         WHERE id = $2::uuid;`,
        metadata,
        userId
      )
      return userId
    } else {
      const inserted: any[] = await prisma.$queryRawUnsafe(
        `
        INSERT INTO auth.users (
          id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at, last_sign_in_at,
          confirmation_token, is_sso_user, is_anonymous
        ) VALUES (
          gen_random_uuid(),
          '00000000-0000-0000-0000-000000000000'::uuid,
          'authenticated',
          'authenticated',
          $1,
          extensions.crypt($2, extensions.gen_salt('bf')),
          now(),
          '{"provider":"email","providers":["email"]}'::jsonb,
          $3::jsonb,
          now(),
          now(),
          now(),
          '',
          false,
          false
        ) RETURNING id;
        `,
        cleanEmail,
        password || 'OAUTH_SYNCED_USER_NO_PASSWORD',
        metadata
      )

      const userId = inserted[0]?.id
      if (userId) {
        await prisma.$executeRawUnsafe(
          `
          INSERT INTO auth.identities (
            id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
          ) VALUES (
            gen_random_uuid(),
            $1::uuid,
            $2::jsonb,
            'email',
            $3,
            now(),
            now(),
            now()
          ) ON CONFLICT DO NOTHING;
          `,
          userId,
          JSON.stringify({ sub: userId, email: cleanEmail, name }),
          userId
        )
      }
      return userId
    }
  } catch (sqlErr: any) {
    console.warn('Direct auth.users sync notice:', sqlErr?.message)
    return null
  }
}
