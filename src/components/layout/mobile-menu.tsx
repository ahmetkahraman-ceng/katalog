'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  links: { href: string; label: string }[]
}

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 w-[300px] bg-white z-50 transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <span className="text-lg font-extralight tracking-[0.3em] uppercase">Menü</span>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black">
            <X size={22} />
          </button>
        </div>

        <nav className="p-6">
          <ul className="space-y-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-sm font-light tracking-[0.15em] uppercase text-neutral-600 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-100">
          <Link
            href="/inquiry"
            onClick={onClose}
            className="block w-full py-3 text-center text-xs font-light tracking-[0.15em] uppercase bg-black text-white hover:bg-neutral-800 transition-colors"
          >
            Teklif İste
          </Link>
        </div>
      </div>
    </>
  )
}
