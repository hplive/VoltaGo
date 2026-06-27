'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

const materiais = [
  { id: 'plastico', label: 'Plástico', emoji: '🍶', desc: 'Garrafas PET' },
  { id: 'lata', label: 'Latas', emoji: '🥫', desc: 'Alumínio e aço' },
  { id: 'vidro', label: 'Vidro', emoji: '🫙', desc: 'Em breve' },
]
const quantidades = [10, 20, 30, 50, 100, 200]

export default function NovaRecolhaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string[]>(['plastico'])
  const [quantidade, setQuantidade] = useState(30)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  function toggleMaterial(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleSubmit() {
    setLoading(true); setErro('')
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { setErro('Sessão expirada.'); setLoading(false); return }

    const { data: link } = await sb.from('conta_utilizadores')
      .select('conta_id').eq('user_id', user.id).limit(1).maybeSingle()
    if (!link) { setErro('Conta não encontrada.'); setLoading(false); return }

    const labels: Record<string,string> = { plastico: 'Plástico', lata: 'Latas', vidro: 'Vidro' }
    const materiaisStr = selected.map(s => labels[s]).join(', ')
    const valor = Number((quantidade * 0.10).toFixed(2))
    const co2 = Number((quantidade * 0.0142).toFixed(2))

    const { error } = await sb.from('pedidos_recolha').insert({
      conta_id: link.conta_id,
      materiais: materiaisStr,
      quantidade,
      valor_deposito: valor,
      co2_kg: co2,
      estado: 'agendada',
    })

    if (error) { setErro('Não foi possível registar o pedido.'); setLoading(false); return }
    setSubmitted(true); setLoading(false)
  }

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-[#EAF7F1] rounded-full flex items-center justify-center mb-4">
        <Check className="w-10 h-10 text-[#1FA971]" />
      </div>
      <h2 className="font-display font-semibold text-2xl mb-2">Pedido registado!</h2>
      <p className="text-[#6B7A72] text-sm mb-2">A sua recolha foi adicionada e está agendada.</p>
      <p className="text-[#6B7A72] text-sm mb-8">Encaixamo-la na próxima rota do seu bairro.</p>
      <div className="w-full max-w-sm space-y-2">
        <Link href="/recolhas"><Button size="full">Ver as minhas recolhas</Button></Link>
        <Link href="/dashboard"><Button size="full" variant="ghost">Voltar ao início</Button></Link>
      </div>
    </div>
  )

  return (
    <div>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link href="/recolhas" className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E4E7E2]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-display font-semibold text-xl">Nova recolha</h1>
        <Badge variant="grey" className="ml-auto">Passo {step}/3</Badge>
      </div>
      <div className="px-4 space-y-4">
        {step === 1 && (
          <>
            <p className="text-sm text-[#6B7A72]">Que tipo de embalagens tem para entregar?</p>
            <div className="space-y-3">
              {materiais.map(m => (
                <button key={m.id} onClick={() => m.id !== 'vidro' && toggleMaterial(m.id)}
                  className={cn('w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                    selected.includes(m.id) ? 'border-[#1FA971] bg-[#EAF7F1]' : 'border-[#E4E7E2] bg-white',
                    m.id === 'vidro' && 'opacity-50 cursor-not-allowed'
                  )}>
                  <span className="text-3xl">{m.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{m.label}</p>
                    <p className="text-xs text-[#6B7A72]">{m.desc}</p>
                  </div>
                  {selected.includes(m.id) && <Check className="w-5 h-5 text-[#1FA971]" />}
                </button>
              ))}
            </div>
            <Button size="full" onClick={() => setStep(2)} disabled={selected.length === 0}>Continuar</Button>
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-sm text-[#6B7A72]">Quantas embalagens tem aproximadamente?</p>
            <div className="grid grid-cols-3 gap-3">
              {quantidades.map(q => (
                <button key={q} onClick={() => setQuantidade(q)}
                  className={cn('p-4 rounded-2xl border-2 font-display font-bold text-lg transition-all',
                    quantidade === q ? 'border-[#1FA971] bg-[#EAF7F1] text-[#0c5e44]' : 'border-[#E4E7E2] bg-white'
                  )}>{q}</button>
              ))}
            </div>
            <Card className="bg-[#FBF1DD] border-[#ECD9AE]">
              <p className="text-sm text-[#6e5212]">
                <span className="font-semibold">Depósito estimado: {(quantidade * 0.1).toFixed(2)} €</span>
                <br />0,10 € × {quantidade} embalagens
              </p>
            </Card>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Voltar</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Continuar</Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p className="text-sm text-[#6B7A72]">Confirmação do pedido</p>
            <Card>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-[#6B7A72]">Materiais</span>
                  <span className="text-sm font-medium">{selected.map(s => materiais.find(m => m.id === s)?.label).join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#6B7A72]">Quantidade</span>
                  <span className="text-sm font-medium">~{quantidade} embalagens</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#6B7A72]">Depósito estimado</span>
                  <span className="font-semibold text-[#0c5e44]">{(quantidade * 0.1).toFixed(2)} €</span></div>
                <div className="border-t border-[#E4E7E2] pt-3">
                  <p className="text-xs text-[#6B7A72]">📍 Zona Porto — encaixamos na próxima rota do seu bairro</p>
                </div>
              </div>
            </Card>
            {erro && <p className="text-sm text-[#C2563B]">{erro}</p>}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)} className="flex-1" disabled={loading}>Voltar</Button>
              <Button variant="brass" onClick={handleSubmit} className="flex-1" disabled={loading}>
                {loading ? 'A registar…' : 'Confirmar pedido'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
