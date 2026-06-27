'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const sb = createClient()
    await sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` })
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="text-center">
      <div className="text-4xl mb-4">📬</div>
      <h2 className="font-display font-semibold text-xl mb-2">Email enviado!</h2>
      <p className="text-[#6B7A72] text-sm mb-6">Verifique a sua caixa de entrada e siga o link para redefinir a password.</p>
      <Link href="/login"><Button size="full">Voltar ao login</Button></Link>
    </div>
  )

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl mb-2">Recuperar password</h1>
      <p className="text-[#6B7A72] text-sm mb-6">Enviamos um link para o seu email.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><Label>Email</Label><Input type="email" placeholder="o.seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <Button type="submit" size="full" disabled={loading}>{loading ? 'A enviar…' : 'Enviar link'}</Button>
      </form>
      <p className="text-sm text-center mt-4">
        <Link href="/login" className="text-[#1FA971] hover:underline">← Voltar ao login</Link>
      </p>
    </div>
  )
}
