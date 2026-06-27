import { Card } from '@/components/ui/card'
export default function AdminRotasPage() {
  return (
    <div>
      <div className="bg-[#0E3B2E] text-white rounded-b-3xl px-5 pt-12 pb-6">
        <h1 className="font-display font-semibold text-2xl">Rotas</h1>
        <p className="text-[#9DBFB1] text-sm mt-1">Zona Porto</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <Card className="text-center py-12">
          <p className="text-4xl mb-4">🗺️</p>
          <p className="font-semibold">Sem rotas planeadas</p>
          <p className="text-sm text-[#6B7A72] mt-1">As rotas são criadas quando há contas suficientes num bairro.</p>
        </Card>
        <Card className="bg-[#EAF7F1] border-[#BFE6D4]">
          <p className="text-sm font-semibold text-[#0c5e44]">Como funcionam as rotas</p>
          <p className="text-xs text-[#2a7a5a] mt-1">Condomínios e restaurantes geram rotas. Casas encaixam sem custo adicional. Um bairro com casas suficientes pode gerar rota própria.</p>
        </Card>
      </div>
    </div>
  )
}
