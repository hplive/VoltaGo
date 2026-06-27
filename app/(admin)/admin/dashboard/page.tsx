import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { count: condominios } = await supabase.from('contas').select('*', { count: 'exact', head: true }).eq('tipo', 'condominio')
  const { count: restaurantes } = await supabase.from('contas').select('*', { count: 'exact', head: true }).eq('tipo', 'restaurante')
  const { count: casas } = await supabase.from('contas').select('*', { count: 'exact', head: true }).eq('tipo', 'casa')
  const { data: bairros } = await supabase.from('bairros').select('*').order('nome')

  return (
    <div>
      <div className="bg-[#0E3B2E] text-white rounded-b-3xl px-5 pt-12 pb-6">
        <p className="text-[#9DBFB1] text-sm">Painel de administração</p>
        <h1 className="font-display font-semibold text-2xl mt-1">Zona Porto</h1>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Condomínios', value: condominios || 0 },
            { label: 'Restaurantes', value: restaurantes || 0 },
            { label: 'Casas', value: casas || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-display font-bold text-2xl">{value}</p>
              <p className="text-[#9DBFB1] text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72] mb-3">Bairros · Zona Porto</p>
          {(bairros || []).map((b: any) => (
            <div key={b.id} className="flex items-center justify-between py-2 border-b border-[#E4E7E2] last:border-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${b.tem_rota ? 'bg-[#1FA971]' : 'bg-[#E0A23B]'}`} />
                <span className="text-sm font-medium">{b.nome}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7A72]">{b.casas_aderentes}/{b.limiar_promocao}</span>
                <Badge variant={b.tem_rota ? 'green' : 'brass'}>{b.tem_rota ? 'Ativa' : 'Espera'}</Badge>
              </div>
            </div>
          ))}
          {(!bairros || bairros.length === 0) && (
            <p className="text-sm text-[#6B7A72] py-4 text-center">Sem bairros configurados ainda.</p>
          )}
        </Card>
        <Card className="bg-[#FBF1DD] border-[#ECD9AE]">
          <p className="text-sm font-semibold text-[#6e5212]">⚠️ Questão legal em aberto</p>
          <p className="text-xs text-[#8a5e14] mt-1">Confirmar com jurista o enquadramento do transporte de resíduos (DL 152-D/2017 · e-GAR) antes da operação real.</p>
        </Card>
      </div>
    </div>
  )
}
