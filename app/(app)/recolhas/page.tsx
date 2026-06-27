import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PackageSearch, Plus } from 'lucide-react'

export default async function RecolhasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div className="bg-[#F5F5F0] px-5 pt-12 pb-4">
        <h1 className="font-display font-semibold text-2xl">As minhas recolhas</h1>
      </div>
      <div className="px-4 mt-2">
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <div className="w-16 h-16 bg-[#EEF1EE] rounded-full flex items-center justify-center">
            <PackageSearch className="w-8 h-8 text-[#6B7A72]" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg">Ainda sem recolhas</h2>
            <p className="text-sm text-[#6B7A72] mt-1 max-w-xs">As suas recolhas aparecem aqui depois da primeira visita do motorista.</p>
          </div>
          <Link href="/recolhas/nova">
            <Button><Plus className="w-4 h-4" /> Pedir primeira recolha</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
