import { Logo } from '@/components/layout/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Logo size="lg" />
          <p className="text-[#6B7A72] text-sm mt-2">A reciclagem chega até si.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
