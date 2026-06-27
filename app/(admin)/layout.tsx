import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/layout/app-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center">
      <div className="w-full max-w-lg min-h-screen pb-20 relative">
        {children}
        <AdminNav />
      </div>
    </div>
  )
}
