import { Link } from 'react-router-dom'
import { useQuery } from '@/hooks/useQuery'
import { fetchCategories, fetchSocialLinks } from '@/lib/api'
import { fallbackCategories } from '@/lib/catalog'

const academy = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/journey', label: 'Learning Journey' },
  { to: '/about', label: 'About' },
  { to: '/community', label: 'Community' },
  { to: '/workshops', label: 'Workshops' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

const support = [
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
  { to: '/enroll', label: 'Enrollment' },
  { to: '/verify-certificate', label: 'Certificate Verification' },
]

export function Footer() {
  const programs = useQuery(() => fetchCategories(), 'footer-programs')
  const socials = useQuery(() => fetchSocialLinks(), 'footer-social')
  const list = programs.data?.length ? programs.data : fallbackCategories

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src="/brand/logo.png" alt="VibeX Skills Academy" className="h-16 w-auto rounded-2xl" />
          <p className="mt-5 text-sm font-semibold text-cyan">Learn Skills. Build Your Future.</p>
          {socials.data?.length ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {socials.data.map((link) => (
                <li key={link.id}>
                  <a href={link.url} className="text-sm font-semibold text-white underline" target="_blank" rel="noreferrer">
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">Academy</h2>
          <ul className="mt-4 space-y-3">
            {academy.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-slate-200 hover:text-white">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">Programs</h2>
          <ul className="mt-4 space-y-3">
            {list.map((program) => (
              <li key={program.slug}>
                <Link to={`/courses/${program.slug}`} className="text-sm text-slate-200 hover:text-white">{program.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">Support</h2>
          <ul className="mt-4 space-y-3">
            {support.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-sm text-slate-200 hover:text-white">{link.label}</Link>
              </li>
            ))}
            <li><Link to="/programs" className="text-sm text-slate-200 hover:text-white">Professional programs</Link></li>
            <li><Link to="/mentorship" className="text-sm text-slate-200 hover:text-white">Mentorship</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-slate-400 sm:px-8">© VibeX Skills Academy. All rights reserved.</p>
      </div>
    </footer>
  )
}
