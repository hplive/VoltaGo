import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Smartphone, Building2, Heart, ArrowDownToLine, ArrowUpRight } from 'lucide-react'

export default async function CarteiraPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const tipo = user?.user_metadata?.tipo || 'casa'

  const { data: contaLink } = await supabase.from('conta_utilizadores')
    .select('conta_id').eq('user_id', user?.id ?? '').limit(1).maybeSingle()
  const contaId = contaLink?.conta_id

  const { data: carteira } = contaId ? await supabase.from('carteiras')
    .select('*').eq('conta_id', contaId).single() : { data: null }
  const carteiraId = carteira?.id

  const { data: transacoes } = carteiraId ? await supabase.from('transacoes')
    .select('*').eq('carteira_id', carteiraId).order('created_at', { ascending: false }) : { data: [] }

  const saldo = carteira?.saldo || 0
  const isCondominioFundo = tipo === 'condominio'
  const lista = transacoes || []

  const metodos = [
    { icon: Smartphone, label: 'MB WAY', desc: 'Imediato, para o seu número' },
    { icon: Building2, label: 'Transferência bancária', desc: '1–2 dias úteis' },
    { icon: ArrowDownToLine, label: isCondominioFundo ? 'Abater na quota' : 'Carteira VoltaGo', desc: 'Usar em serviços VoltaGo' },
    { icon: Heart, label: 'Doação a IPSS', desc: '100% para a instituição' },
  ]

  return (
    <div>
      <div className="bg-[#0E3B2E] text-white rounded-b-3xl px-5 pt-12 pb-8 text-center">
        <p className="text-[#9DBFB1] text-sm uppercase tracking-wide">
          {isCondominioFundo ? 'Fundo comum' : 'Saldo disponível'}
        </p>
        <p className="font-display font-bold text-4xl mt-2">{formatCurrency(saldo)}</p>
        <p className="text-[#9DBFB1] text-xs mt-2">Atualizado após cada recolha confirmada</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72] mb-3">Histórico</p>
          {lista.length === 0 ? (
            <div className="text-center py-8 text-[#6B7A72]">
              <p className="text-sm">Sem transações ainda.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {lista.map((t: any) => (
                <div key={t.id} className="flex items-center gap-3 py-3 border-b border-[#E4E7E2] last:border-0">
                  <div className="w-9 h-9 bg-[#EAF7F1] rounded-xl flex items-center justify-center flex-none">
                    <ArrowUpRight className="w-4 h-4 text-[#1FA971]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.descricao || 'Crédito'}</p>
                    <p className="text-xs text-[#6B7A72]">{formatDate(t.created_at)}</p>
                  </div>
                  <span className="font-display font-semibold text-sm text-[#0c5e44]">+ {formatCurrency(t.valor)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72] mb-3">Como quer receber?</p>
          <div className="space-y-1">
            {metodos.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 py-3 border-b border-[#E4E7E2] last:border-0">
                <div className="w-10 h-10 bg-[#EFF3F0] rounded-xl flex items-center justify-center flex-none">
                  <Icon className="w-5 h-5 text-[#6B7A72]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-[#6B7A72]">{desc}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#EEF1EE] text-[#5a6862]">Em breve</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
