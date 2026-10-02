import { Link } from 'react-router-dom'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchAdminStats } from '@/lib/api'

export function AdminDashboard() {
  const stats = useQuery(() => fetchAdminStats(), 'admin-stats')
  const cards = [
    { label: 'Programs', value: stats.data?.programs ?? 0, to: '/admin/programs' },
    { label: 'Workshops', value: stats.data?.workshops ?? 0, to: '/admin/records/workshops' },
    { label: 'Enrollments', value: stats.data?.enrollments ?? 0, to: '/admin/enrollments' },
    { label: 'Unread messages', value: stats.data?.unread ?? 0, to: '/admin/messages' },
  ]

  return (
    <div>
      <h1 className="font-display text-4xl">Academy overview</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Programs, prices, workshops, FAQs, testimonials, and enrollments are stored in Supabase. Changes publish to the website.
      </p>
      <div className="mt-8">
        <DataState loading={stats.loading} error={stats.error} count={2}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <Link key={card.label} to={card.to} className="rounded-[1.4rem] border border-line bg-white p-5">
                <p className="text-sm font-semibold text-muted">{card.label}</p>
                <p className="mt-2 font-display text-4xl">{card.value}</p>
              </Link>
            ))}
          </div>
        </DataState>
      </div>
    </div>
  )
}
