import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapView } from '@/components/map/map-view'

export default async function AdminRotasPage() {
  const supabase = await createClient()
  const { data: bairros } = await supabase
    .from('bairros').select('*').not('lat', 'is', null).order('casas_aderentes', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const todos = (bairros as any[]) || []
  const comRota = todos.filter(b => b.tem_rota)

  // Pontos do mapa
  const points = todos.map(b => ({
    lat: b.lat, lng: b.lng, label: b.nome,
    color: b.tem_rota ? '#1FA971' : '#E0A23B',
    primary: b.tem_rota,
  }))

  // Rota = ligar os bairros com rota ativa
  const route: [number, number][] = comRota.map(b => [b.lat, b.lng])

  const center: [number, number] = todos.length
    ? [todos.reduce((s, b) => s + b.lat, 0) / todos.length, todos.reduce((s, b) => s + b.lng, 0) / todos.length]
    : [41.1496, -8.6109]

  return (
    <div>
      <div className="bg-[#0E3B2E] text-white rounded-b-3xl px-5 pt-12 pb-6">
        <h1 className="font-display font-semibold text-2xl">Rotas</h1>
        <p className="text-[#9DBFB1] text-sm mt-1">Zona Porto · {comRota.length} rotas ativas</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <Card className="p-0 overflow-hidden">
          <MapView center={center} zoom={13} height={280} points={points} route={route} />
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72] mb-3">Bairros</p>
          <div className="space-y-2">
            {todos.map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-[#E4E7E2] last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${b.tem_rota ? 'bg-[#1FA971]' : 'bg-[#E0A23B]'}`} />
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
          <p className="text-sm font-semibold text-[#0c5e44]">Como funcionam as rotas</p>
          <p className="text-xs text-[#2a7a5a] mt-1">Condomínios e restaurantes geram rotas. Casas encaixam sem custo adicional. Um bairro com casas suficientes pode gerar rota própria.</p>
        </Card>
      </div>
    </div>
  )
}
