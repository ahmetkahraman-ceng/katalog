import { cookies } from 'next/headers'
import crypto from 'crypto'

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'luxury-bag-catalog-secure-session-key-2026'
export const COOKIE_NAME = 'admin_session'

// Max 3 attempts, 15 minutes lockout
const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes

interface AttemptRecord {
  attempts: number
  lockedUntil: number | null
}

// In-memory attempt store keyed by identifier (IP / client)
const attemptsStore = new Map<string, AttemptRecord>()

export function getClientIdentifier(req?: Request): string {
  if (!req) return 'default-admin'
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'default-admin'
}

export function checkLockout(identifier: string): {
  isLocked: boolean
  remainingSeconds: number
  remainingAttempts: number
} {
  const record = attemptsStore.get(identifier)
  const now = Date.now()

  if (!record) {
    return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS }
  }

  // Check if actively locked
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000)
    return { isLocked: true, remainingSeconds, remainingAttempts: 0 }
  }

  // If lockout expired, reset attempts
  if (record.lockedUntil && record.lockedUntil <= now) {
    attemptsStore.delete(identifier)
    return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS }
  }

  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - record.attempts)
  return { isLocked: false, remainingSeconds: 0, remainingAttempts }
}

export function recordFailedAttempt(identifier: string): {
  isLocked: boolean
  remainingSeconds: number
  remainingAttempts: number
} {
  const now = Date.now()
  const current = attemptsStore.get(identifier) || { attempts: 0, lockedUntil: null }

  current.attempts += 1

  if (current.attempts >= MAX_ATTEMPTS) {
    current.lockedUntil = now + LOCKOUT_DURATION_MS
    attemptsStore.set(identifier, current)
    return {
      isLocked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      remainingAttempts: 0,
    }
  }

  attemptsStore.set(identifier, current)
  return {
    isLocked: false,
    remainingSeconds: 0,
    remainingAttempts: MAX_ATTEMPTS - current.attempts,
  }
}

export function resetAttempts(identifier: string) {
  attemptsStore.delete(identifier)
}

export function verifyCredentials(username: string, password: string):boolean {
  const validUser = process.env.ADMIN_USERNAME || DEFAULT_USERNAME
  const validPass = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD
  return username === validUser && password === validPass
}

export function createSessionToken(username: string): string {
  const timestamp = Date.now()
  const payload = `${username}:${timestamp}`
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64')
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [user, timestampStr, signature] = decoded.split(':')
    if (!user || !timestampStr || !signature) return false

    // Max 7 days session
    const timestamp = parseInt(timestampStr, 10)
    if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return false
    }

    const payload = `${user}:${timestampStr}`
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return false
    return verifySessionToken(token)
  } catch {
    return false
  }
}
