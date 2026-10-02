import { Link } from 'react-router-dom'

const groups = [
  {
    title: 'Academy',
    links: [
      { to: '/courses', label: 'Courses' },
      { to: '/journey', label: 'Learning Journey' },
      { to: '/workshops', label: 'Workshops' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/community', label: 'Community' },
      { to: '/contact', label: 'Contact' },
      { to: '/register', label: 'Create account' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src="/brand/logo.png" alt="VibeX Skills Academy" className="h-16 w-auto rounded-2xl" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
            VibeX Skills Academy is a professional skills and career academy. Learn practical skills,
            build real projects, and prepare for work or freelancing.
          </p>
          <p className="mt-4 text-sm font-semibold text-cyan">Learn Skills. Build Your Future.</p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} VibeX Skills Academy. VXSA.</p>
          <p>Training programs. No guaranteed income or trading profits.</p>
        </div>
      </div>
    </footer>
  )
}
