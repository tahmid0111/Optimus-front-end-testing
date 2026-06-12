import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/cn.js'

const LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/new', label: 'New Run' },
  { to: '/history', label: 'History' },
  { to: '/admin', label: 'Admin' },
]

const USER = { name: 'Laith Hayajneh', role: 'Engineer', initials: 'LH' }

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onDoc = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false)
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[#e3eaf4] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
        {/* wordmark */}
        <button onClick={() => navigate('/')} className="press flex items-center gap-2.5">
          <img src="/mcdean-logo.png" alt="M.C. Dean" className="h-7 w-auto" />
          <span className="text-xl font-extrabold tracking-tight text-ink">
            Optimus
          </span>
        </button>

        {/* nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'press rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'bg-blue-tint text-blue' : 'text-ink/60 hover:bg-blue-tint hover:text-blue',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* avatar menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="press flex items-center gap-2 rounded-full border border-[#dce5f1] py-1 pl-1 pr-2.5 transition-colors hover:border-blue/40"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-bold text-white">
              {USER.initials}
            </span>
            <span className="hidden text-sm font-semibold text-ink sm:inline">{USER.name}</span>
            <ChevronDown size={16} className={cn('text-ink/40 transition-transform', menuOpen && 'rotate-180')} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 animate-fade-in-fast overflow-hidden rounded-2xl border border-[#e3eaf4] bg-white p-1.5 shadow-soft">
              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                  {USER.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{USER.name}</p>
                  <p className="text-xs font-medium text-blue">{USER.role}</p>
                </div>
              </div>
              <div className="my-1 h-px bg-[#eaf0f8]" />
              <button
                onClick={() => { setMenuOpen(false); navigate('/admin') }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-blue-tint hover:text-blue"
              >
                <User size={16} /> Manage users
              </button>
              <button
                onClick={() => { setMenuOpen(false); toast('Logged out — see you soon 👋') }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
