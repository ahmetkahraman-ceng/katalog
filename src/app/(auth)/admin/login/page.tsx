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
    <div className="min-h-screen bg-[#0e0f10] text-neutral-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden selection:bg-neutral-800">
      {/* Arka Plan Deseni / Aydınlatması */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent pointer-events-none" />

      {/* Üst Bar */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto">
        <Link
          href="/"
          className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-400 hover:text-white transition-colors"
        >
          ← Mağazaya Dön
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400">
            GÜVENLİ PROTOKOL
          </span>
        </div>
      </div>

      {/* Ana Giriş Kutusu */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-[#141517] border border-neutral-800/80 p-8 sm:p-10 shadow-2xl rounded-sm">
          {/* Başlık & Marka */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 mb-4 text-neutral-300">
              {isLocked ? (
                <ShieldAlert size={22} className="text-red-500 animate-bounce" />
              ) : (
                <Lock size={20} className="text-neutral-300" />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-white font-serif">
              Çanta Atelier
            </h1>
            <p className="text-[11px] font-mono text-neutral-400 tracking-[0.2em] uppercase mt-1">
              Merkez Kontrol Girişi
            </p>
          </div>

          {/* Kilit Uyarısı & Geri Sayım */}
          {isLocked && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-sm text-center">
              <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-mono uppercase tracking-wider mb-2">
                <AlertTriangle size={15} />
                <span>GÜVENLİK KİLİDİ DEVREDE</span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed mb-3">
                3 kez üst üste hatalı giriş yapıldı. Güvenlik protokolü gereği
                giriş askıya alındı.
              </p>
              <div className="bg-neutral-900/90 py-2.5 px-4 border border-red-900/40 inline-flex items-center gap-2 text-red-400 font-mono text-lg tracking-widest rounded-sm">
                <Clock size={16} />
                <span>{formatCountdown(countdown)}</span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono mt-2">
                Kalan süre bittiğinde kilit otomatik olarak kalkacaktır.
              </p>
            </div>
          )}

          {/* Normal Hata Mesajı & Kalan Hak */}
          {!isLocked && error && (
            <div className="mb-6 p-3.5 bg-red-950/30 border border-red-900/50 rounded-sm">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-red-300 font-light">{error}</p>
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono border-t border-red-900/40 pt-1.5 text-neutral-400">
                      <span>Kalan Deneme Hakkı:</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          remainingAttempts === 1
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {remainingAttempts} / 3
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Giriş Formu */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Kullanıcı Adı */}
            <div>
              <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 mb-2">
                Kullanıcı Adı
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
                  className="w-full pl-10 pr-4 py-3 bg-neutral-900/80 border border-neutral-800 text-sm font-light text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 focus:bg-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 mb-2">
                Şifre
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
                  className="w-full pl-10 pr-10 py-3 bg-neutral-900/80 border border-neutral-800 text-sm font-light text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 focus:bg-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isLocked || loading}
              className="w-full py-3.5 mt-2 bg-white hover:bg-neutral-200 text-black text-xs font-light tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span>Doğrulanıyor...</span>
              ) : isLocked ? (
                <span>Kilitli ({formatCountdown(countdown)})</span>
              ) : (
                <>
                  <span>Panele Giriş Yap</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Alt Güvenlik Bilgisi */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-500" />
              Brute-Force Korumalı
            </span>
            <span>Maks: 3 Deneme</span>
          </div>
        </div>
      </div>

      {/* Alt Bilgi Barı */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center text-[10px] font-mono text-neutral-600 tracking-wider">
        ÇANTA KATALOG ATELIER © 2026 • TÜM HAKLARI SAKLIDIR
      </div>
    </div>
  )
}
