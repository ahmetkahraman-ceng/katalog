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

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    company: user.company,
  }
}
