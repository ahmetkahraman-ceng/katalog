'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, FileText, Heart, Lock, Building, Phone, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

export default function AccountPage() {
  const router = useRouter()
  const { user, openAuthModal } = useAuth()
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        company: user.company || '',
      }))
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (formData.newPassword) {
      if (formData.newPassword !== formData.newPasswordConfirm) {
        setErrorMsg('Yeni şifreler eşleşmiyor.')
        return
      }
      if (formData.newPassword.length < 6) {
        setErrorMsg('Yeni şifre en az 6 karakter olmalıdır.')
        return
      }
      if (!formData.currentPassword) {
        setErrorMsg('Şifrenizi değiştirmek için mevcut şifrenizi girmelisiniz.')
        return
      }
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Güncelleme başarısız oldu.')
      }

      setSuccessMsg('Hesap bilgileriniz başarıyla güncellendi.')
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      }))
    } catch (err: any) {
      setErrorMsg(err.message || 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 border border-neutral-200 shadow-sm rounded-sm">
          <User className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
          <h1 className="text-xl font-medium text-neutral-900 mb-2">Hesabınıza Giriş Yapın</h1>
          <p className="text-xs text-neutral-500 mb-6">
            Hesap bilgilerinizi ve geçmiş teklif taleplerinizi görüntülemek için lütfen giriş yapın.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 bg-[#2d6a4f] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#1b4332] transition-colors rounded-sm"
          >
            Giriş Yap / Kayıt Ol
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-light">
          <Link href="/" className="hover:text-black transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-normal">Hesabım</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sol Menü */}
          <div className="md:col-span-1">
            <div className="bg-white border border-neutral-200 rounded-sm p-4 space-y-1">
              <div className="pb-3 mb-2 border-b border-neutral-100 px-3 pt-1">
                <p className="text-xs font-semibold text-neutral-900">{user.name}</p>
                <p className="text-[11px] text-neutral-400 font-light truncate">{user.email}</p>
              </div>

              <Link
                href="/hesabim"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2d6a4f] bg-neutral-50 rounded-xs"
              >
                <User size={15} />
                <span>Hesap Bilgilerim</span>
              </Link>

              <Link
                href="/hesabim/taleplerim"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-light text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-xs transition-colors"
              >
                <FileText size={15} />
                <span>Geçmiş Taleplerim</span>
              </Link>

              <Link
                href="/favorites"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-light text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-xs transition-colors"
              >
                <Heart size={15} />
                <span>Favorilerim</span>
              </Link>
            </div>
          </div>

          {/* Sağ İçerik: Profil Formu */}
          <div className="md:col-span-3">
            <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-8 shadow-2xs">
              <h2 className="text-lg font-medium tracking-wide text-neutral-900 border-b border-neutral-100 pb-3 mb-6">
                HESAP BİLGİLERİ VE GÜVENLİK
              </h2>

              {successMsg && (
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-light tracking-wider uppercase text-neutral-500 mb-1.5">
                      Ad Soyad *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xs text-xs text-neutral-900 focus:bg-white focus:border-[#2d6a4f] focus:outline-hidden transition-colors"
                      />
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-light tracking-wider uppercase text-neutral-500 mb-1.5">
                      E-Posta Adresi
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xs text-xs text-neutral-500 cursor-not-allowed"
                      />
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>
                    <span className="text-[10px] text-neutral-400 font-light mt-1 block">
                      * E-posta adresi hesap güvenliği nedeniyle değiştirilemez.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-light tracking-wider uppercase text-neutral-500 mb-1.5">
                      Telefon Numarası
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="05XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xs text-xs text-neutral-900 focus:bg-white focus:border-[#2d6a4f] focus:outline-hidden transition-colors"
                      />
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-light tracking-wider uppercase text-neutral-500 mb-1.5">
                      Firma / Şirket Unvanı
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Kurumsal Teklifler İçin Firma Adı"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xs text-xs text-neutral-900 focus:bg-white focus:border-[#2d6a4f] focus:outline-hidden transition-colors"
                      />
                      <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </div>
                </div>

                {/* Şifre Değiştirme Bölümü */}
                <div className="pt-6 border-t border-neutral-100">
                  <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-800 mb-4 flex items-center gap-1.5">
                    <Lock size={14} className="text-[#2d6a4f]" />
                    <span>Şifre Değiştir (İsteğe Bağlı)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-light text-neutral-500 mb-1">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xs text-xs text-neutral-900 focus:bg-white focus:border-[#2d6a4f] focus:outline-hidden transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-light text-neutral-500 mb-1">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        placeholder="En az 6 karakter"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xs text-xs text-neutral-900 focus:bg-white focus:border-[#2d6a4f] focus:outline-hidden transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-light text-neutral-500 mb-1">
                        Yeni Şifre Tekrar
                      </label>
                      <input
                        type="password"
                        placeholder="Tekrar giriniz"
                        value={formData.newPasswordConfirm}
                        onChange={(e) => setFormData({ ...formData, newPasswordConfirm: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xs text-xs text-neutral-900 focus:bg-white focus:border-[#2d6a4f] focus:outline-hidden transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#2d6a4f] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#1b4332] transition-colors flex items-center gap-2 rounded-xs shadow-xs disabled:opacity-50"
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    <span>Bilgileri Kaydet</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
