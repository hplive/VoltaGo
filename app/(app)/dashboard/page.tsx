import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getTipoLabel, getTipoEmoji, formatCurrency } from '@/lib/utils'
import { MapPin, Recycle, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tipo = user.user_metadata?.tipo || 'casa'
  const nomeLocal = user.user_metadata?.nome_local || 'A minha conta'
  const nomeUser = user.user_metadata?.nome || user.email?.split('@')[0] || 'Utilizador'

  // Carregar conta
  const { data: contaLink } = await supabase
    .from('conta_utilizadores')
    .select('conta_id, contas(*)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  const conta = (contaLink?.contas as any) || null

  // Carregar carteira
  const { data: carteira } = conta ? await supabase
    .from('carteiras')
    .select('saldo')
    .eq('conta_id', conta.id)
    .single() : { data: null }

  // Carregar zona e bairros
  const { data: zona } = await supabase.from('zonas').select('*').eq('estado', 'ativa').limit(1).single()
  const { data: bairros } = zona ? await supabase.from('bairros').select('*').eq('zona_id', zona.id).order('nome') : { data: [] }

  const saldo = carteira?.saldo || 0
  const tipoLabel = getTipoLabel(tipo)
  const tipoEmoji = getTipoEmoji(tipo)
  const estadoBadge = conta?.estado === 'ativa' ? 'green' : conta?.estado === 'espera' ? 'brass' : 'grey'

  return (
    <div>
      {/* Header */}
      <div className="bg-[#0E3B2E] text-white rounded-b-3xl px-5 pt-12 pb-6">
        <p className="text-[#9DBFB1] text-sm">Bom dia, {nomeUser} {tipoEmoji}</p>
        <h1 className="font-display font-semibold text-2xl mt-1">{nomeLocal}</h1>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-[#9DBFB1] text-xs uppercase tracking-wide">
              {tipo === 'condominio' ? 'Fundo comum' : 'Saldo disponível'}
            </p>
            <p className="font-display font-bold text-3xl mt-1">{formatCurrency(saldo)}</p>
          </div>
          <Badge variant={estadoBadge} className="text-sm px-3 py-1">
            {conta?.estado === 'ativa' ? 'Ativa' : conta?.estado === 'espera' ? 'Lista de espera' : 'Em configuração'}
          </Badge>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* CTA principal */}
        {tipo === 'casa' && conta?.estado === 'espera' ? (
          <Card className="border-[#ECD9AE] bg-[#FBF1DD]">
            <div className="flex gap-3 items-start">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-semibold text-sm text-[#6e5212]">Em lista de espera</p>
                <p className="text-xs text-[#8a5e14] mt-1">Avisamos quando uma rota abrir no seu bairro.</p>
              </div>
            </div>
          </Card>
        ) : (
          <Link href="/recolhas/nova">
            <Button size="full" variant="brass" className="text-base h-14">
              <Recycle className="w-5 h-5" /> Pedir recolha
            </Button>
          </Link>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Recolhas', value: '0', icon: Recycle },
            { label: 'Embalagens', value: '0', icon: TrendingUp },
            { label: 'CO₂ poupado', value: '0 kg', icon: MapPin },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="text-center p-3">
              <p className="font-display font-bold text-xl">{value}</p>
              <p className="text-xs text-[#6B7A72] mt-1">{label}</p>
            </Card>
          ))}
        </div>

        {/* Zona Porto */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72]">Zona Porto</p>
            <Badge variant="green">Ativa</Badge>
          </div>
          <div className="space-y-2">
            {(bairros || []).slice(0, 5).map((b: any) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-[#E4E7E2] last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${b.tem_rota ? 'bg-[#1FA971]' : 'bg-[#E0A23B]'}`} />
                  <span className="text-sm font-medium">{b.nome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B7A72]">{b.casas_aderentes} casas</span>
                  <Badge variant={b.tem_rota ? 'green' : 'brass'}>{b.tem_rota ? 'Rota ativa' : 'Espera'}</Badge>
                </div>
              </div>
            ))}
            {(!bairros || bairros.length === 0) && (
              <p className="text-sm text-[#6B7A72] py-2">A carregar bairros da Zona Porto…</p>
            )}
          </div>
        </Card>

        {/* Info card */}
        <Card className="bg-[#EAF7F1] border-[#BFE6D4]">
          <div className="flex gap-3">
            <span className="text-xl">♻️</span>
            <div>
              <p className="text-sm font-semibold text-[#0c5e44]">Como funciona</p>
              <p className="text-xs text-[#2a7a5a] mt-1">
                {tipo === 'condominio'
                  ? 'O parceiro logístico recolhe no vosso contentor. O depósito vai para o fundo comum do prédio.'
                  : tipo === 'restaurante'
                  ? 'Recolha recorrente adaptada ao vosso volume. Faturação mensal pelo serviço.'
                  : 'Quando uma rota abrir no seu bairro, encaixamos a sua casa gratuitamente.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
