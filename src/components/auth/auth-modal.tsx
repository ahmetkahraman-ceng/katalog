'use client'

import { useState } from 'react'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

export function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [kvkkAccepted, setKvkkAccepted] = useState(true)
  const [marketingAccepted, setMarketingAccepted] = useState(false)

  // Sync mode from context when modal opens
  if (!isAuthModalOpen) return null

  const handleTabSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setErrorMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (mode === 'register' && !kvkkAccepted) {
      setErrorMsg('Lütfen aydınlatma metnini onaylayınız.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register({ name, email, password })
      }
      closeAuthModal()
    } catch (err: any) {
      setErrorMsg(err.message || 'İşlem sırasında bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Kapat"
        >
          <X size={18} />
        </button>

        {/* Top Pill Tab Switcher: [ Giriş Yap ] | [ Üye Ol ] */}
        <div className="flex bg-neutral-100/90 p-1 rounded-full mb-6 border border-neutral-200/50">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={cn(
              'flex-1 py-2.5 text-xs sm:text-sm font-medium transition-all rounded-full text-center',
              mode === 'login'
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-neutral-600 hover:text-black'
            )}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={cn(
              'flex-1 py-2.5 text-xs sm:text-sm font-medium transition-all rounded-full text-center',
              mode === 'register'
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-neutral-600 hover:text-black'
            )}
          >
            Üye Ol
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-light rounded-xl border border-red-200 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#f3f4f6] text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm rounded-xl border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-hidden transition-all"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="E-Posta Adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#f3f4f6] text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm rounded-xl border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-hidden transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-4 pr-11 py-3 bg-[#f3f4f6] text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm rounded-xl border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-hidden transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Mode-specific Checkboxes / Helper links */}
          {mode === 'register' ? (
            <div className="space-y-2 pt-1 text-[11px] text-neutral-500 font-light leading-relaxed">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kvkkAccepted}
                  onChange={(e) => setKvkkAccepted(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 text-black rounded-xs border-neutral-300 focus:ring-0"
                />
                <span>Kişisel verilerimin işlenmesine yönelik aydınlatma metnini okudum ve anladım.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 text-black rounded-xs border-neutral-300 focus:ring-0"
                />
                <span>Kampanyalardan haberdar olabilmem için tarafıma elektronik ileti gönderilmesini kabul ediyorum.</span>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 text-black rounded-xs border-neutral-300"
                />
                <span>Beni Hatırla</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Şifre sıfırlama bağlantısı için destek hattımızla iletişime geçebilirsiniz.')}
                className="text-neutral-500 hover:text-black hover:underline"
              >
                Şifremi Unuttum
              </button>
            </div>
          )}

          {/* Sleek Black Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-[#18181b] hover:bg-black text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Lütfen bekleyin...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Giriş Yap' : 'Üye Ol'}</span>
            )}
          </button>

          {/* "ya da" Divider */}
          <div className="relative py-2 text-center">
            <span className="text-xs text-neutral-400 font-light">ya da</span>
          </div>

          {/* Google Sign In Button Matching Image 1 */}
          <button
            type="button"
            onClick={() => {
              alert('Google ile kurumsal giriş yakında aktif olacaktır. Lütfen e-posta ile kayıt olunuz.')
            }}
            className="w-full py-3 bg-white border border-neutral-200 text-neutral-700 text-xs sm:text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2.5 shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google ile giriş yap</span>
          </button>
        </form>
      </div>
    </div>
  )
}
