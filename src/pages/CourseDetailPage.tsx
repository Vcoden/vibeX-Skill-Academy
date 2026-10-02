import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchCategory } from '@/lib/api'
import { formatNaira } from '@/lib/format'
import { ProgramIcon } from '@/lib/icons'

export function CourseDetailPage() {
  const { slug = '' } = useParams()
  const query = useQuery(() => fetchCategory(slug), slug)
  const program = query.data

  return (
    <>
      <Seo
        title={program ? `${program.name} | VibeX Skills Academy` : 'Program | VibeX Skills Academy'}
        description={program?.summary ?? '30-day skills program at VibeX Skills Academy.'}
      />
      <DataState loading={query.loading} error={query.error} empty={!query.loading && !query.error && !program} count={1}>
        {program ? (
          <article>
            <header className="border-b border-line bg-white">
              <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                <div>
                  <Link to="/courses" className="text-sm font-semibold text-blue">All courses</Link>
                  <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-blue uppercase">{program.code}</p>
                  <h1 className="mt-2 font-display text-5xl tracking-tight">{program.name}</h1>
                  {program.subtitle ? <p className="mt-2 text-lg font-semibold text-violet">{program.subtitle}</p> : null}
                  <p className="mt-4 max-w-2xl text-lg text-muted">{program.description}</p>
                </div>
                <aside className="rounded-[1.6rem] border border-line bg-mist p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue">
                      <ProgramIcon name={program.icon} className="h-5 w-5" />
                    </span>
                    <p className="font-display text-3xl">{formatNaira(program.price)}</p>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm font-semibold text-slate-600">
                    <li>{program.duration_days} Days</li>
                    <li>{program.format_label}</li>
                    <li>Project, mentorship, and certification</li>
                  </ul>
                  <Button to={`/enroll/${program.slug}`} className="mt-6 w-full">
                    Enroll Now
                  </Button>
                </aside>
              </div>
            </header>
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
              <section>
                <h2 className="font-display text-3xl">Curriculum</h2>
                <ol className="mt-6 space-y-3">
                  {program.modules?.map((module, index) => (
                    <li key={module.id} className="flex gap-4 rounded-2xl border border-line bg-white px-4 py-4">
                      <span className="font-display text-sm text-blue">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        {module.summary ? <p className="mt-1 text-sm text-muted">{module.summary}</p> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="space-y-5">
                <div className="rounded-[1.5rem] border border-line bg-white p-6">
                  <h2 className="font-display text-2xl">You will work toward</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                    {program.outcomes.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </div>
                {program.risk_notice ? (
                  <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950">
                    <h2 className="font-display text-xl text-amber-950">Risk education</h2>
                    <p className="mt-3">{program.risk_notice}</p>
                  </div>
                ) : null}
              </section>
            </div>
          </article>
        ) : null}
      </DataState>
    </>
  )
}
