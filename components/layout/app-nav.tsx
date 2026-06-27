'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, Wallet, User, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/recolhas', label: 'Recolhas', icon: List },
  { href: '/carteira', label: 'Carteira', icon: Wallet },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export function AppNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E4E7E2] flex max-w-lg mx-auto">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href}
            className={cn('flex flex-col items-center gap-1 flex-1 py-3 text-xs font-medium transition-colors no-underline',
              active ? 'text-[#0E3B2E]' : 'text-[#6B7A72]'
            )}>
            <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminNav() {
  const pathname = usePathname()
  const items = [
    { href: '/admin/dashboard', label: 'Resumo', icon: LayoutDashboard },
    { href: '/admin/contas', label: 'Contas', icon: User },
    { href: '/admin/rotas', label: 'Rotas', icon: List },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E3B2E] flex max-w-lg mx-auto">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link key={href} href={href}
            className={cn('flex flex-col items-center gap-1 flex-1 py-3 text-xs font-medium no-underline',
              active ? 'text-[#E0A23B]' : 'text-[#9DBFB1]'
            )}>
            <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
