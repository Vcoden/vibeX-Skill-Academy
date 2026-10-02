import { NavLink, Outlet, Link } from 'react-router-dom'
import { cx } from '@/lib/cx'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/programs', label: 'Programs' },
  { to: '/admin/records/workshops', label: 'Workshops' },
  { to: '/admin/records/faqs', label: 'FAQs' },
  { to: '/admin/records/testimonials', label: 'Testimonials' },
  { to: '/admin/records/mentors', label: 'Mentors' },
  { to: '/admin/records/journey', label: 'Journey' },
  { to: '/admin/records/community', label: 'Community' },
  { to: '/admin/records/community-links', label: 'Community links' },
  { to: '/admin/records/social', label: 'Social' },
  { to: '/admin/records/settings', label: 'Settings' },
  { to: '/admin/records/professional', label: 'Professional' },
  { to: '/admin/records/mentorship', label: 'Mentorship' },
  { to: '/admin/records/roadmaps', label: 'Roadmaps' },
  { to: '/admin/records/projects', label: 'Projects' },
  { to: '/admin/records/announcements', label: 'Announcements' },
  { to: '/admin/records/resources', label: 'Resources' },
  { to: '/admin/records/certificates', label: 'Certificates' },
  { to: '/admin/records/students', label: 'Students' },
  { to: '/admin/enrollments', label: 'Enrollments' },
  { to: '/admin/messages', label: 'Messages' },
]

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-mist">
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-display text-lg">VibeX Admin</Link>
          <Link to="/" className="text-sm font-semibold text-blue">View site</Link>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3" aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cx(
                  'shrink-0 rounded-full px-3 py-2 text-sm font-semibold',
                  isActive ? 'bg-navy text-white' : 'bg-mist text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </div>
    </div>
  )
}
