'use client'

import { useState, useRef, useEffect } from 'react'
import { User as UserIcon, LogOut, FileText, CheckCircle2, ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

export function UserDropdown() {
  const { user, logout, openAuthModal } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative">
      {/* User Icon Button (Matching Image 2 rounded rectangle with user outline) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-10 h-10 rounded-xl border border-neutral-300 flex items-center justify-center transition-all bg-white hover:border-black text-neutral-800 shadow-2xs',
          isOpen && 'border-black ring-1 ring-black',
          user && 'border-black bg-neutral-100 text-black'
        )}
        title={user ? `${user.name} (Hesabım)` : 'Giriş Yap / Üye Ol'}
        aria-label="Kullanıcı Menüsü"
      >
        <UserIcon size={19} strokeWidth={1.75} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200/80 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {!user ? (
            <div className="flex flex-col gap-1.5">
              {/* Sleek Black "Giriş Yap" button */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  openAuthModal('login')
                }}
                className="w-full py-2.5 px-4 bg-[#18181b] hover:bg-black text-white text-xs sm:text-[13px] font-medium rounded-lg text-center transition-colors shadow-2xs"
              >
                Giriş Yap
              </button>

              {/* "Üye Ol" link button */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  openAuthModal('register')
                }}
                className="w-full py-2 px-4 text-neutral-700 hover:text-black hover:bg-neutral-100 text-xs sm:text-[13px] font-medium rounded-lg text-center transition-colors"
              >
                Üye Ol
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-100">
                <p className="text-xs font-medium text-neutral-900 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-neutral-400 font-light truncate">
                  {user.email}
                </p>
              </div>

              <div className="space-y-0.5 pt-1 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-light text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  <LogOut size={14} />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
