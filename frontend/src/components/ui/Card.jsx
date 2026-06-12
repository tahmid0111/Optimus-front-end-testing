import { cn } from '../../lib/cn.js'

const TONES = {
  deep: 'bg-card-deep',
  light: 'bg-card-light',
  green: 'bg-card-green',
}

// pick a tone by position so sibling cards rotate deep → light → green
export const cardTone = (i) => ['deep', 'light', 'green'][i % 3]

export default function Card({ className, hover = false, tone = 'light', children, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#e3eaf4] shadow-card',
        TONES[tone] || TONES.light,
        hover && 'lift',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
