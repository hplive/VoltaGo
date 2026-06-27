import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getTipoLabel, getTipoEmoji, formatCurrency, formatDate } from '@/lib/utils'
import { Recycle, Leaf, Package, Calendar, MapPin } from 'lucide-react'
import { MapView } from '@/components/map/map-view'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tipo = user.user_metadata?.tipo || 'casa'
  const nomeUser = user.user_metadata?.nome || user.email?.split('@')[0] || 'Utilizador'

  const { data: contaLink } = await supabase
    .from('conta_utilizadores')
    .select('conta_id, contas(*)')
    .eq('user_id', user.id).limit(1).maybeSingle()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conta = (contaLink as any)?.contas || null
  const contaId = conta?.id
  const nomeLocal = conta?.nome || user.user_metadata?.nome_local || 'A minha conta'

  const { data: carteira } = contaId ? await supabase
    .from('carteiras').select('saldo').eq('conta_id', contaId).single() : { data: null }

  // Bairro da conta (para "encaixado na rota de…")
  const { data: bairro } = conta?.bairro_id ? await supabase
    .from('bairros').select('nome, tem_rota').eq('id', conta.bairro_id).single() : { data: null }

  // Stats reais
  const { data: pedidos } = contaId ? await supabase
    .from('pedidos_recolha').select('quantidade, co2_kg, estado, materiais, data_recolha, created_at')
    .eq('conta_id', contaId).order('created_at', { ascending: false }) : { data: [] }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lista = (pedidos as any[]) || []
  const concluidos = lista.filter(p => p.estado === 'concluida')
  const numRecolhas = concluidos.length
  const totalEmb = concluidos.reduce((s, p) => s + (p.quantidade || 0), 0)
  const totalCO2 = concluidos.reduce((s, p) => s + Number(p.co2_kg || 0), 0)

  // Próxima recolha = primeiro pedido agendado/em rota
  const proxima = lista.find(p => p.estado === 'agendada' || p.estado === 'em_rota')

  const saldo = carteira?.saldo || 0
  const tipoEmoji = getTipoEmoji(tipo)
  const estadoBadge = conta?.estado === 'ativa' ? 'green' : conta?.estado === 'espera' ? 'brass' : 'grey'
  const hasCoords = conta?.lat && conta?.lng

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
            {conta?.estado === 'ativa' ? 'Ativa' : conta?.estado === 'espera' ? 'Lista de espera' : 'Config.'}
          </Badge>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* PRÓXIMA RECOLHA — substitui a lista de rotas */}
        {tipo === 'casa' && conta?.estado === 'espera' ? (
          <Card className="border-[#ECD9AE] bg-[#FBF1DD]">
            <div className="flex gap-3 items-start">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-semibold text-sm text-[#6e5212]">Em lista de espera</p>
                <p className="text-xs text-[#8a5e14] mt-1">
                  Avisamos quando uma rota abrir em {bairro?.nome || 'no seu bairro'}.
                </p>
              </div>
            </div>
          </Card>
        ) : proxima ? (
          <Card className="border-[#BFE6D4] bg-[#EAF7F1]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E3B2E] flex items-center justify-center flex-none">
                <Calendar className="w-5 h-5 text-[#9DE7C6]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0c5e44]">Próxima recolha</p>
                <p className="font-display font-semibold text-lg text-[#0E3B2E] mt-0.5">
                  {proxima.data_recolha ? formatDate(proxima.data_recolha) : 'A agendar'}
                </p>
                <p className="text-xs text-[#2a7a5a] mt-1">
                  {proxima.estado === 'em_rota' ? 'O estafeta está a caminho' : 'Encaixada na rota'}
                  {bairro?.nome ? ` de ${bairro.nome}` : ''} · {proxima.materiais}
                </p>
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

        {/* Botão pedir recolha (sempre visível para contas ativas) */}
        {conta?.estado === 'ativa' && proxima && (
          <Link href="/recolhas/nova">
            <Button size="full" variant="brass"><Recycle className="w-5 h-5" /> Pedir nova recolha</Button>
          </Link>
        )}

        {/* Stats */}
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

        {/* Morada + mapa */}
        {hasCoords && (
          <Card className="p-0 overflow-hidden">
            <MapView
              center={[conta.lat, conta.lng]}
              zoom={15}
              height={180}
              points={[{ lat: conta.lat, lng: conta.lng, label: nomeLocal, primary: true }]}
            />
            <div className="p-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6B7A72] flex-none" />
              <div>
                <p className="text-sm font-medium">{conta.morada}</p>
                <p className="text-xs text-[#6B7A72]">{conta.codigo_postal} {conta.cidade}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Como funciona */}
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
