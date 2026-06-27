import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold font-display transition-all disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]',
  {
    variants: {
      variant: {
        default: 'bg-[#1FA971] text-[#06231A] hover:brightness-105',
        brass: 'bg-[#E0A23B] text-[#3a2602] hover:brightness-105',
        dark: 'bg-[#0E3B2E] text-[#EAF2EC] hover:brightness-105',
        ghost: 'border border-[#E4E7E2] bg-transparent text-[#14201B] hover:bg-gray-50',
        danger: 'bg-[#C2563B] text-white hover:brightness-105',
        cond: 'bg-[#8B3BE0] text-white hover:brightness-105',
        resto: 'bg-[#3B6BE0] text-white hover:brightness-105',
        link: 'text-[#1FA971] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-5 py-3',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
        full: 'h-12 w-full px-5 py-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
