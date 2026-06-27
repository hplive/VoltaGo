import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getTipoLabel, getTipoEmoji, formatCurrency } from '@/lib/utils'
import { Recycle, Leaf, Package } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tipo = user.user_metadata?.tipo || 'casa'
  const nomeLocal = user.user_metadata?.nome_local || 'A minha conta'
  const nomeUser = user.user_metadata?.nome || user.email?.split('@')[0] || 'Utilizador'

  const { data: contaLink } = await supabase
    .from('conta_utilizadores')
    .select('conta_id, contas(*)')
    .eq('user_id', user.id).limit(1).maybeSingle()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conta = (contaLink as any)?.contas || null
  const contaId = conta?.id

  const { data: carteira } = contaId ? await supabase
    .from('carteiras').select('saldo').eq('conta_id', contaId).single() : { data: null }

  // Stats reais a partir dos pedidos concluídos
  const { data: pedidos } = contaId ? await supabase
    .from('pedidos_recolha').select('quantidade, co2_kg, estado').eq('conta_id', contaId) : { data: [] }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const concluidos = (pedidos || []).filter((p: any) => p.estado === 'concluida')
  const numRecolhas = concluidos.length
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalEmb = concluidos.reduce((s: number, p: any) => s + (p.quantidade || 0), 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalCO2 = concluidos.reduce((s: number, p: any) => s + Number(p.co2_kg || 0), 0)

  const { data: zona } = await supabase.from('zonas').select('*').eq('estado', 'ativa').limit(1).single()
  const { data: bairros } = zona ? await supabase.from('bairros').select('*').eq('zona_id', zona.id).order('casas_aderentes', { ascending: false }) : { data: [] }

  const saldo = carteira?.saldo || 0
  const tipoLabel = getTipoLabel(tipo)
  const tipoEmoji = getTipoEmoji(tipo)
  const estadoBadge = conta?.estado === 'ativa' ? 'green' : conta?.estado === 'espera' ? 'brass' : 'grey'

  return (
    <div>
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
            {conta?.estado === 'ativa' ? 'Ativa' : conta?.estado === 'espera' ? 'Lista de espera' : 'Config.'}
          </Badge>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
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

        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center p-3">
            <Recycle className="w-5 h-5 text-[#1FA971] mx-auto mb-1" />
            <p className="font-display font-bold text-xl">{numRecolhas}</p>
            <p className="text-xs text-[#6B7A72] mt-1">Recolhas</p>
          </Card>
          <Card className="text-center p-3">
            <Package className="w-5 h-5 text-[#E0A23B] mx-auto mb-1" />
            <p className="font-display font-bold text-xl">{totalEmb.toLocaleString('pt-PT')}</p>
            <p className="text-xs text-[#6B7A72] mt-1">Embalagens</p>
          </Card>
          <Card className="text-center p-3">
            <Leaf className="w-5 h-5 text-[#1FA971] mx-auto mb-1" />
            <p className="font-display font-bold text-xl">{totalCO2.toFixed(1)}</p>
            <p className="text-xs text-[#6B7A72] mt-1">kg CO₂</p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72]">Zona Porto · Bairros</p>
            <Badge variant="green">Ativa</Badge>
          </div>
          <div className="space-y-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(bairros || []).slice(0, 6).map((b: any) => (
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
          </div>
        </Card>

        <Card className="bg-[#EAF7F1] border-[#BFE6D4]">
          <div className="flex gap-3">
            <span className="text-xl">♻️</span>
            <div>
              <p className="text-sm font-semibold text-[#0c5e44]">Como funciona</p>
              <p className="text-xs text-[#2a7a5a] mt-1">
                {tipo === 'condominio'
                  ? 'O parceiro logístico recolhe no vosso contentor. O depósito vai para o fundo comum.'
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
