import { cn } from '../../lib/cn.js'

export default function Card({ className, hover = false, children, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#e3eaf4] bg-card-brand shadow-card',
        hover && 'lift',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
