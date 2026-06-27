import Link from 'next/link'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }[size]
  const mark = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-10 h-10' }[size]
  return (
    <Link href="/" className={`flex items-center gap-2 font-display font-bold ${s} no-underline`}>
      <div className={`${mark} rounded-xl bg-[#1FA971] flex items-center justify-center flex-none`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path d="M12 4a8 8 0 1 0 7.5 5.3" stroke="#06231A" strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M19.5 4.2v4.2h-4.2" stroke="#06231A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-[#0E3B2E]">Volta<span className="text-[#E0A23B]">Go</span></span>
    </Link>
  )
}
