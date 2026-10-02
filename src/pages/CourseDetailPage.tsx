import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchCategory } from '@/lib/api'
import { defaultAudience, defaultRequirements, fallbackCategory, lifeAfter, practiceSteps } from '@/lib/catalog'
import { formatNaira } from '@/lib/format'
import { ProgramIcon } from '@/lib/icons'

const fallbackWeeks = [
  { title: 'Foundation', description: 'Understand the fundamentals.' },
  { title: 'Skill Development', description: 'Learn practical techniques and professional workflows.' },
  { title: 'Project Building', description: 'Apply the skills to real-world projects.' },
  { title: 'Professional Practice', description: 'Complete projects, receive guidance, and prepare for real opportunities.' },
]

export function CourseDetailPage() {
  const { slug = '' } = useParams()
  const query = useQuery(() => fetchCategory(slug), slug)
  const program = query.data ?? (query.error ? fallbackCategory(slug) : null)
  const audience = program?.audience?.length ? program.audience : defaultAudience
  const requirements = program?.requirements?.length ? program.requirements : defaultRequirements
  const weeks = program?.roadmaps?.length
    ? program.roadmaps
    : fallbackWeeks.map((week, index) => ({ id: String(index), week_number: index + 1, title: week.title, description: week.description }))

  return (
    <>
      <Seo
        title={program ? `${program.name} | VibeX Skills Academy` : 'Program | VibeX Skills Academy'}
        description={program?.summary ?? '30-day skills program at VibeX Skills Academy.'}
      />
      <DataState loading={query.loading} error={query.error && !program ? query.error : null} empty={!query.loading && !program} count={1}>
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
                    <li>Online + Offline</li>
                    <li>One fee covers every subcategory</li>
                  </ul>
                  <Button to={`/enroll/${program.slug}`} className="mt-6 w-full">Enroll Now</Button>
                </aside>
              </div>
            </header>

            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
              <h2 className="font-display text-3xl">What You'll Learn</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {program.modules?.map((module) => (
                  <article key={module.id} className="rounded-[1.4rem] border border-line bg-white p-5">
                    <ProgramIcon name={program.icon} className="h-5 w-5 text-blue" />
                    <h3 className="mt-3 font-semibold">{module.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {module.summary ?? `Practice ${module.title} as part of this 30-day program.`}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="bg-white py-14">
              <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <h2 className="font-display text-3xl">30-Day Learning Roadmap</h2>
                <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {weeks.map((week) => (
                    <li key={week.id} className="rounded-[1.4rem] border border-line bg-mist p-5">
                      <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">Week {String(week.week_number).padStart(2, '0')}</p>
                      <h3 className="mt-2 font-display text-2xl">{week.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{week.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
              <h2 className="font-display text-3xl">Practical Projects</h2>
              <p className="mt-3 font-semibold text-ink">{practiceSteps.join(' → ')}</p>
              {program.projects?.length ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {program.projects.map((project) => (
                    <article key={project.id} className="rounded-[1.4rem] border border-line bg-white p-5">
                      <h3 className="font-display text-2xl">{project.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        {project.difficulty ? `Difficulty: ${project.difficulty}` : null}
                        {project.skills ? ` · Skills: ${project.skills}` : null}
                      </p>
                      {project.outcome ? <p className="mt-2 text-sm text-muted">Outcome: {project.outcome}</p> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 max-w-2xl text-muted">Project briefs are published by the academy for this program. The path is always learn, practice, build, improve, and present.</p>
              )}
            </section>

            <section className="bg-navy py-14 text-white">
              <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-3">
                <div>
                  <h2 className="font-display text-3xl">Who this program is for</h2>
                  <ul className="mt-4 space-y-2 text-sm text-slate-200">
                    {audience.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-3xl">What you need</h2>
                  <ul className="mt-4 space-y-2 text-sm text-slate-200">
                    {requirements.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-3xl">Earn Your Certificate</h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-200">
                    After completing the required training and program requirements, eligible students can receive a VibeX Skills Academy certificate.
                  </p>
                  <Link to="/verify-certificate" className="mt-4 inline-flex text-sm font-semibold text-cyan">Verify a certificate</Link>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
              <h2 className="font-display text-4xl">Your Learning Doesn't End After 30 Days.</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lifeAfter.map((item) => (
                  <article key={item.title} className="rounded-[1.4rem] border border-line bg-white p-5">
                    <h3 className="font-display text-2xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                  </article>
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-sm text-muted">Continued support does not guarantee employment, income, clients, or freelance success.</p>
              {program.risk_notice ? (
                <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950">
                  <h2 className="font-display text-xl">Important</h2>
                  <p className="mt-3">{program.risk_notice}</p>
                </div>
              ) : null}
            </section>
          </article>
        ) : null}
      </DataState>
    </>
  )
}
