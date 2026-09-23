'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError('Geçersiz e-posta veya şifre')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Giriş yapılırken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">ÇANTA</h1>
          <p className="text-xs font-light text-neutral-400 tracking-widest uppercase mt-2">Yönetim Paneli</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="E-posta"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@firma.com"
            required
          />
          <Input
            label="Şifre"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-sm text-red-500 font-light">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full">
            Giriş Yap
          </Button>
        </form>
      </div>
    </div>
  )
}
