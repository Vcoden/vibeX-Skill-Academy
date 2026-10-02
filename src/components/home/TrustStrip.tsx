import { BadgeCheck, Briefcase, CalendarRange, Hammer, Users } from 'lucide-react'

const items = [
  { icon: CalendarRange, title: '30-Day Programs', text: 'Focused, structured learning.' },
  { icon: Hammer, title: 'Practical Projects', text: 'Learn by building.' },
  { icon: BadgeCheck, title: 'Certifications', text: 'Validate your skills.' },
  { icon: Users, title: 'Mentorship', text: 'Get guidance beyond lessons.' },
  { icon: Briefcase, title: 'Freelancing Support', text: 'Learn how to turn skills into opportunities.' },
]

export function TrustStrip() {
  return (
    <section className="relative z-10 mx-auto -mt-4 max-w-7xl px-5 sm:px-8" aria-label="What every program includes">
      <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_18px_50px_rgba(7,17,31,0.06)] sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3 border-line px-5 py-5 sm:border-r sm:last:border-r-0 xl:border-b-0">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-blue">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-base text-ink">{item.title}</h2>
              <p className="mt-1 text-sm text-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
