import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTipoLabel, getTipoEmoji } from '@/lib/utils'

export default async function AdminContasPage() {
  const supabase = await createClient()
  const { data: contas } = await supabase.from('contas').select('*').order('created_at', { ascending: false })
  const tipoBadge: Record<string, any> = { condominio: 'purple', restaurante: 'blue', casa: 'orange' }
  const estadoBadge: Record<string, any> = { ativa: 'green', espera: 'brass', suspensa: 'red' }
  return (
    <div>
      <div className="bg-[#0E3B2E] text-white rounded-b-3xl px-5 pt-12 pb-6">
        <h1 className="font-display font-semibold text-2xl">Contas</h1>
        <p className="text-[#9DBFB1] text-sm mt-1">{contas?.length || 0} contas registadas</p>
      </div>
      <div className="px-4 mt-4">
        <Card className="p-0 divide-y divide-[#E4E7E2]">
          {(contas || []).map((c: any) => (
            <div key={c.id} className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-[#EFF3F0] rounded-xl flex items-center justify-center text-xl flex-none">{getTipoEmoji(c.tipo)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{c.nome}</p>
                <p className="text-xs text-[#6B7A72]">{c.cidade} · {c.created_at?.slice(0, 10)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={tipoBadge[c.tipo]}>{getTipoLabel(c.tipo)}</Badge>
                <Badge variant={estadoBadge[c.estado] || 'grey'}>{c.estado}</Badge>
              </div>
            </div>
          ))}
          {(!contas || contas.length === 0) && (
            <div className="p-8 text-center text-[#6B7A72] text-sm">Sem contas registadas</div>
          )}
        </Card>
      </div>
    </div>
  )
}
