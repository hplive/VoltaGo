import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Smartphone, Building2, Heart, ArrowDownToLine } from 'lucide-react'

export default async function CarteiraPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const tipo = user?.user_metadata?.tipo || 'casa'

  const { data: contaLink } = await supabase.from('conta_utilizadores')
    .select('conta_id').eq('user_id', user!.id).limit(1).maybeSingle()

  const { data: carteira } = contaLink ? await supabase.from('carteiras')
    .select('*').eq('conta_id', contaLink.conta_id).single() : { data: null }

  const saldo = carteira?.saldo || 0
  const isCondominioFundo = tipo === 'condominio'

  const metodos = [
    { icon: Smartphone, label: 'MB WAY', desc: 'Imediato, para o seu número', available: false },
    { icon: Building2, label: 'Transferência bancária', desc: '1–2 dias úteis', available: false },
    { icon: ArrowDownToLine, label: isCondominioFundo ? 'Abater na quota' : 'Carteira VoltaGo', desc: 'Usar em serviços VoltaGo', available: false },
    { icon: Heart, label: 'Doação a IPSS', desc: '100% para a instituição', available: false },
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
        <Card className="bg-[#FBF1DD] border-[#ECD9AE]">
          <div className="flex gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-semibold text-[#6e5212]">Como cresce o saldo?</p>
              <p className="text-xs text-[#8a5e14] mt-1">
                {isCondominioFundo
                  ? 'Cada recolha confirmada pelo motorista credita 0,10 € por embalagem no fundo comum.'
                  : 'Cada recolha confirmada credita 0,10 € por embalagem na sua carteira.'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72] mb-3">
            Como quer receber?
          </p>
          <div className="space-y-1">
            {metodos.map(({ icon: Icon, label, desc, available }) => (
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

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72] mb-3">Histórico</p>
          <div className="text-center py-8 text-[#6B7A72]">
            <p className="text-sm">Sem transações ainda.</p>
            <p className="text-xs mt-1">Aparecem aqui depois da primeira recolha.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
