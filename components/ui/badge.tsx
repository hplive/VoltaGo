import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'green' | 'brass' | 'grey' | 'blue' | 'purple' | 'orange' | 'red'
}

const variantClasses = {
  green: 'bg-[#EAF7F1] text-[#0c5e44]',
  brass: 'bg-[#FBF1DD] text-[#8a5e14]',
  grey: 'bg-[#EEF1EE] text-[#5a6862]',
  blue: 'bg-[#EEF2FC] text-[#2345a8]',
  purple: 'bg-[#F2EEFB] text-[#5c1fa8]',
  orange: 'bg-[#FBF1EB] text-[#a83d1f]',
  red: 'bg-[#FDECEA] text-[#8B2318]',
}

export function Badge({ className, variant = 'grey', ...props }: BadgeProps) {
  return (
    <div
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', variantClasses[variant], className)}
      {...props}
    />
  )
}
