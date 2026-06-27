import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PackageSearch, Plus, Recycle } from 'lucide-react'

const estadoMap: Record<string, { label: string; variant: 'green' | 'brass' | 'blue' | 'grey' }> = {
  concluida: { label: 'Concluída', variant: 'green' },
  em_rota: { label: 'Em rota', variant: 'blue' },
  agendada: { label: 'Agendada', variant: 'brass' },
  pendente: { label: 'Pendente', variant: 'grey' },
  cancelada: { label: 'Cancelada', variant: 'grey' },
}

export default async function RecolhasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contaLink } = await supabase.from('conta_utilizadores')
    .select('conta_id').eq('user_id', user?.id ?? '').limit(1).maybeSingle()
  const contaId = contaLink?.conta_id

  const { data: pedidos } = contaId ? await supabase
    .from('pedidos_recolha').select('*').eq('conta_id', contaId)
    .order('created_at', { ascending: false }) : { data: [] }

  const lista = pedidos || []

  return (
    <div>
      <div className="bg-[#F5F5F0] px-5 pt-12 pb-4 flex items-center justify-between">
        <h1 className="font-display font-semibold text-2xl">Recolhas</h1>
        <Link href="/recolhas/nova">
          <Button size="sm"><Plus className="w-4 h-4" /> Nova</Button>
        </Link>
      </div>
      <div className="px-4 mt-2">
        {lista.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4 text-center">
            <div className="w-16 h-16 bg-[#EEF1EE] rounded-full flex items-center justify-center">
              <PackageSearch className="w-8 h-8 text-[#6B7A72]" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg">Ainda sem recolhas</h2>
              <p className="text-sm text-[#6B7A72] mt-1 max-w-xs">Peça a sua primeira recolha e ela aparece aqui.</p>
            </div>
            <Link href="/recolhas/nova"><Button><Plus className="w-4 h-4" /> Pedir recolha</Button></Link>
          </div>
        ) : (
          <Card className="p-0 divide-y divide-[#E4E7E2]">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {lista.map((p: any) => {
              const e = estadoMap[p.estado] || estadoMap.pendente
              return (
                <div key={p.id} className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 bg-[#EFF3F0] rounded-xl flex items-center justify-center flex-none">
                    <Recycle className="w-5 h-5 text-[#0E3B2E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{p.materiais}</p>
                    <p className="text-xs text-[#6B7A72]">
                      {p.quantidade} embalagens · {p.data_recolha ? formatDate(p.data_recolha) : formatDate(p.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-display font-semibold text-sm text-[#0c5e44]">
                      {p.estado === 'concluida' ? '+ ' + formatCurrency(p.valor_deposito) : formatCurrency(p.valor_deposito)}
                    </span>
                    <Badge variant={e.variant}>{e.label}</Badge>
                  </div>
                </div>
              )
            })}
          </Card>
        )}
      </div>
    </div>
  )
}
