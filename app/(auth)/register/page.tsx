'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const tipos = [
  { value: 'condominio', label: 'Condomínio', emoji: '🏢', desc: 'Prédio ou condomínio' },
  { value: 'restaurante', label: 'Restaurante', emoji: '☕', desc: 'Café, bar, restaurante' },
  { value: 'casa', label: 'Casa', emoji: '🏠', desc: 'Habitação particular' },
]

export default function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nomeLocal, setNomeLocal] = useState('')
  const [tipo, setTipo] = useState('condominio')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (password.length < 6) { setError('A password deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    const sb = createClient()
    const { data, error: authError } = await sb.auth.signUp({
      email, password,
      options: { data: { nome, tipo, nome_local: nomeLocal } }
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (data.user) {
      const { data: zonaData } = await sb.from('zonas').select('id').eq('estado', 'ativa').limit(1).single()
      if (zonaData) {
        const { data: contaData } = await sb.from('contas').insert({
          tipo: tipo as any,
          nome: nomeLocal,
          zona_id: zonaData.id,
          cidade: 'Porto',
          estado: tipo === 'casa' ? 'espera' : 'ativa'
        }).select().single()
        if (contaData) {
          await sb.from('conta_utilizadores').insert({
            conta_id: contaData.id,
            user_id: data.user.id,
            papel: 'admin'
          })
          await sb.from('carteiras').insert({
            conta_id: contaData.id,
            saldo: 0,
            tipo: tipo === 'condominio' ? 'fundo_comum' : 'individual'
          })
        }
      }
    }
    setSuccess('Conta criada! Verifique o seu email para confirmar.')
    setLoading(false)
  }

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-[#14201B] mb-6">Criar conta</h1>
      {error && <div className="bg-[#FDECEA] border border-[#F5C6C2] rounded-xl p-3 text-sm text-[#8B2318] mb-4">{error}</div>}
      {success && <div className="bg-[#EAF7F1] border border-[#BFE6D4] rounded-xl p-3 text-sm text-[#0c5e44] mb-4">{success}</div>}
      {!success && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div><Label>Nome</Label><Input placeholder="O seu nome" value={nome} onChange={e => setNome(e.target.value)} required /></div>
          <div><Label>Email</Label><Input type="email" placeholder="o.seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><Label>Password</Label><Input type="password" placeholder="mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <div>
            <Label>Tipo de conta</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {tipos.map(t => (
                <button key={t.value} type="button" onClick={() => setTipo(t.value)}
                  className={cn('border rounded-xl p-3 text-center transition-all',
                    tipo === t.value ? 'border-[#1FA971] bg-[#EAF7F1]' : 'border-[#E4E7E2] bg-white hover:border-gray-300'
                  )}>
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-xs font-semibold text-[#14201B]">{t.label}</div>
                  <div className="text-xs text-[#6B7A72] mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div><Label>Nome do local / edifício</Label>
            <Input placeholder={tipo === 'condominio' ? 'ex: Foz Plaza' : tipo === 'restaurante' ? 'ex: Café Aurora' : 'ex: Rua do Heroísmo, 48'}
              value={nomeLocal} onChange={e => setNomeLocal(e.target.value)} required /></div>
          <Button type="submit" size="full" disabled={loading}>{loading ? 'A criar conta…' : 'Criar conta'}</Button>
        </form>
      )}
      {success && <Link href="/login"><Button size="full" className="mt-4">Entrar</Button></Link>}
      <p className="text-sm text-[#6B7A72] text-center mt-4">
        Já tem conta? <Link href="/login" className="text-[#1FA971] font-medium hover:underline">Entrar</Link>
      </p>
    </div>
  )
}
