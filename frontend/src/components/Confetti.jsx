import { useEffect, useRef } from 'react'

const COLORS = ['#002B5C', '#29ABE2', '#8DC63F', '#F4E64E', '#22D3EE', '#FF2D9B']

/**
 * Self-contained canvas confetti — no dependency.
 * Pass `active` truthy to fire a burst; it cleans itself up after `duration`.
 */
export default function Confetti({ active, duration = 2800 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    resize()
    const W = () => window.innerWidth
    const H = () => window.innerHeight

    const parts = Array.from({ length: 180 }, () => ({
      x: Math.random() * W(),
      y: -20 - Math.random() * H() * 0.5,
      r: 4 + Math.random() * 7,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      vx: -2.5 + Math.random() * 5,
      vy: 2 + Math.random() * 4.5,
      rot: Math.random() * Math.PI,
      vrot: -0.25 + Math.random() * 0.5,
      rect: Math.random() > 0.45,
    }))

    let raf
    let start
    const tick = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      ctx.clearRect(0, 0, W(), H())
      const fade = Math.max(0, 1 - elapsed / duration)
      parts.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06
        p.rot += p.vrot
        ctx.save()
        ctx.globalAlpha = fade
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.c
        if (p.rect) ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6)
        else {
          ctx.beginPath()
          ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })
      if (elapsed < duration) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, W(), H())
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active, duration])

  if (!active) return null
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[60]" />
}
