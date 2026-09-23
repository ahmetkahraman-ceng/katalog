import { NextRequest, NextResponse } from 'next/server'
import { getClientIdentifier, checkLockout, isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request)
    const lockoutState = checkLockout(identifier)
    const authenticated = await isAuthenticated()

    return NextResponse.json({
      authenticated,
      isLocked: lockoutState.isLocked,
      remainingSeconds: lockoutState.remainingSeconds,
      remainingAttempts: lockoutState.remainingAttempts,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
