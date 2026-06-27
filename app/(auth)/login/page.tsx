'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou password incorretos.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-[#14201B] mb-6">Entrar</h1>
      {error && (
        <div className="bg-[#FDECEA] border border-[#F5C6C2] rounded-xl p-3 text-sm text-[#8B2318] mb-4">{error}</div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="o.seu@email.com" value={email}
            onChange={e => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <Button type="submit" size="full" disabled={loading} className="mt-2">
          {loading ? 'A entrar…' : 'Entrar'}
        </Button>
      </form>
      <div className="mt-4 text-center space-y-2">
        <Link href="/forgot-password" className="text-sm text-[#1FA971] hover:underline block">
          Esqueceu a password?
        </Link>
        <p className="text-sm text-[#6B7A72]">
          Não tem conta?{' '}
          <Link href="/register" className="text-[#1FA971] font-medium hover:underline">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}
