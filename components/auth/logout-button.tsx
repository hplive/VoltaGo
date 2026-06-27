'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  async function handleLogout() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
    router.refresh()
  }
  return (
    <Button variant="danger" size="full" onClick={handleLogout} className="mt-2">
      <LogOut className="w-4 h-4" /> Terminar sessão
    </Button>
  )
}
