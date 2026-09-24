'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  ArrowLeft,
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [countdown, setCountdown] = useState<number>(0)

  // Check initial lock status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/admin/status')
        if (res.ok) {
          const data = await res.json()
          if (data.authenticated) {
            router.push('/admin')
            return
          }
          if (data.isLocked && data.remainingSeconds > 0) {
            setIsLocked(true)
            setCountdown(data.remainingSeconds)
          } else if (data.remainingAttempts !== undefined) {
            setRemainingAttempts(data.remainingAttempts)
          }
        }
      } catch (err) {
        console.error('Status check error:', err)
      }
    }
    checkStatus()
  }, [router])

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isLocked && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false)
            setRemainingAttempts(3)
            setError(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLocked, countdown])

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        if (data.locked) {
          setIsLocked(true)
          setCountdown(data.remainingSeconds || 900)
          setError(
            'Güvenlik protokolü devreye girdi: 3 kez hatalı giriş yapıldı. Sistem 15 dakika boyunca kilitlendi.'
          )
        } else {
          setError(data.error || 'Giriş bilgileri geçersiz.')
          if (data.remainingAttempts !== undefined) {
            setRemainingAttempts(data.remainingAttempts)
          }
        }
      }
    } catch {
      setError('Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-neutral-900 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-md mx-auto">
        <Link
          href="/"
          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Kataloğa Dön</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Güvenli Yönetim
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white border border-neutral-200/90 p-8 sm:p-10 shadow-xl rounded-3xl">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center font-bold text-xl shadow-xs mx-auto mb-4">
              Ç
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              ÇANTA<span className="text-[#2d6a4f]">PRO</span>
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-1">
              Atölye & Katalog Yönetim Paneli
            </p>
          </div>

          {/* Lockout Warning */}
          {isLocked && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center shadow-2xs">
              <div className="flex items-center justify-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                <AlertTriangle size={16} />
                <span>GÜVENLİK KİLİDİ DEVREDE</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                3 kez üst üste hatalı giriş yapıldı. Giriş askıya alındı.
              </p>
              <div className="bg-white py-2 px-4 border border-rose-200 inline-flex items-center gap-2 text-rose-700 font-mono text-base font-bold rounded-xl shadow-2xs">
                <Clock size={16} />
                <span>{formatCountdown(countdown)}</span>
              </div>
            </div>
          )}

          {/* Normal Error */}
          {!isLocked && error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl shadow-2xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-rose-800 font-medium">{error}</p>
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <div className="mt-2 flex items-center justify-between text-[11px] border-t border-rose-200/80 pt-1.5 text-neutral-600">
                      <span>Kalan Deneme Hakkı:</span>
                      <span className="font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                        {remainingAttempts} / 3
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Yönetici Kullanıcı Adı
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled={isLocked || loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 rounded-xl placeholder:text-neutral-400 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs disabled:opacity-40"
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Yönetici Şifresi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLocked || loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 rounded-xl placeholder:text-neutral-400 focus:outline-hidden focus:border-[#2d6a4f] focus:bg-white transition-all shadow-2xs disabled:opacity-40"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLocked || loading}
              className="w-full py-3.5 mt-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              {loading ? (
                <span>Doğrulanıyor...</span>
              ) : isLocked ? (
                <span>Kilitli ({formatCountdown(countdown)})</span>
              ) : (
                <>
                  <span>Yönetim Paneline Giriş Yap</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-8 pt-5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5 font-medium text-neutral-500">
              <ShieldCheck size={14} className="text-emerald-500" />
              Brute-Force Korumalı
            </span>
            <span>Maks: 3 Deneme</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center text-[11px] text-neutral-400">
        ÇANTA PRO © 2026 • Kurumsal Toptan Çanta Yönetimi
      </div>
    </div>
  )
}
