import { cn } from '../../lib/cn.js'

const VARIANTS = {
  primary: 'bg-blue text-white hover:bg-blue-hover shadow-soft hover:shadow-lift',
  secondary: 'bg-white text-ink border border-[#dce5f1] hover:border-blue/50 hover:text-blue',
  subtle: 'bg-blue-tint text-blue hover:bg-blue/15',
  ghost: 'bg-transparent text-ink/70 hover:bg-blue-tint hover:text-blue',
  danger: 'bg-white text-status-failed border border-red-200 hover:bg-red-50',
}

const SIZES = {
  sm: 'h-9 px-3.5 text-sm rounded-xl',
  md: 'h-11 px-5 text-sm rounded-xl',
  lg: 'h-12 px-7 text-base rounded-2xl',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  return (
    <Comp
      className={cn(
        'press inline-flex select-none items-center justify-center gap-2 font-semibold transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}
