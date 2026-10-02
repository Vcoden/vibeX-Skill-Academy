import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cx } from '@/lib/cx'
import { Button } from '@/components/ui/Button'

const links = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/journey', label: 'Learning Journey' },
  { to: '/about', label: 'About' },
  { to: '/community', label: 'Community' },
  { to: '/workshops', label: 'Workshops' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const { user, profile } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className={cx(
        'sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl',
        scrolled ? 'border-line shadow-[0_8px_30px_rgba(7,17,31,0.05)]' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img
            src="/brand/logo.png"
            alt="VibeX Skills Academy"
            className="h-14 w-auto rounded-2xl bg-black sm:h-16"
          />
        </Link>
        <nav className="ml-auto hidden items-center gap-4 xl:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cx(
                  'text-[13px] font-semibold tracking-tight',
                  isActive ? 'text-blue' : 'text-slate-600 hover:text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 xl:ml-4 xl:flex">
          {user ? (
            <Button to={profile?.role === 'admin' ? '/admin' : '/dashboard'} variant="secondary">
              {profile?.role === 'admin' ? 'Admin' : 'Dashboard'}
            </Button>
          ) : (
            <Button to="/login" variant="ghost">
              Log in
            </Button>
          )}
          <Button to="/courses">Enroll Now</Button>
        </div>
        <button
          type="button"
          className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-line xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-white px-4 py-4 xl:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'rounded-2xl px-3 py-3 text-base font-semibold',
                    isActive ? 'bg-mist text-blue' : 'text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            {user ? (
              <Button to={profile?.role === 'admin' ? '/admin' : '/dashboard'} variant="secondary">
                {profile?.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Button>
            ) : (
              <Button to="/login" variant="secondary">
                Log in
              </Button>
            )}
            <Button to="/courses">Enroll Now</Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
