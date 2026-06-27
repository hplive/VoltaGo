import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTipoLabel, getTipoEmoji } from '@/lib/utils'
import { LogoutButton } from '@/components/auth/logout-button'
import { Database, Shield, Zap, MapPin } from 'lucide-react'
import { MapView } from '@/components/map/map-view'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tipo = user.user_metadata?.tipo || 'casa'
  const nome = user.user_metadata?.nome || 'Utilizador'
  const iniciais = nome.split(' ').map((x: string) => x[0]).join('').slice(0, 2).toUpperCase()

  const { data: contaLink } = await supabase
    .from('conta_utilizadores').select('conta_id, contas(*)')
    .eq('user_id', user.id).limit(1).maybeSingle()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conta = (contaLink as any)?.contas || null
  const nomeLocal = conta?.nome || '—'
  const hasCoords = conta?.lat && conta?.lng

  return (
    <div>
      <div className="bg-[#F5F5F0] px-5 pt-12 pb-4">
        <h1 className="font-display font-semibold text-2xl">Perfil</h1>
      </div>
      <div className="px-4 mt-2 space-y-4">
        <Card className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1FA971] flex items-center justify-center font-display font-bold text-xl text-[#06231A] flex-none">
            {iniciais}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{nome}</p>
            <p className="text-sm text-[#6B7A72] truncate">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <span>{getTipoEmoji(tipo)}</span>
              <span className="text-xs font-medium text-[#6B7A72]">{getTipoLabel(tipo)} · {nomeLocal}</span>
            </div>
          </div>
        </Card>

        {/* Morada com mapa */}
        {hasCoords && (
          <Card className="p-0 overflow-hidden">
            <MapView
              center={[conta.lat, conta.lng]}
              zoom={15}
              height={200}
              points={[{ lat: conta.lat, lng: conta.lng, label: nomeLocal, primary: true }]}
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[#6B7A72]" />
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72]">Morada de recolha</p>
              </div>
              <p className="text-sm font-medium">{conta.morada}</p>
              <p className="text-xs text-[#6B7A72]">{conta.codigo_postal} {conta.cidade}</p>
            </div>
          </Card>
        )}

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7A72] mb-3">Infraestrutura</p>
          <div className="space-y-3">
            {[
              { icon: Shield, label: 'Autenticação', desc: 'Supabase Auth · Email verificado' },
              { icon: Database, label: 'Base de dados', desc: 'PostgreSQL · eu-west-1 · Irlanda' },
              { icon: Zap, label: 'Row Level Security', desc: 'Dados isolados por utilizador' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#EFF3F0] rounded-xl flex items-center justify-center flex-none">
                  <Icon className="w-5 h-5 text-[#6B7A72]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-[#6B7A72]">{desc}</p>
                </div>
                <Badge variant="green">Real</Badge>
              </div>
            ))}
          </div>
        </Card>

        <LogoutButton />
      </div>
    </div>
  )
}
