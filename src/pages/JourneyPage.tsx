import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchJourney } from '@/lib/api'

export function JourneyPage() {
  const query = useQuery(() => fetchJourney(), 'journey')

  return (
    <>
      <Seo
        title="Learning Journey | VibeX Skills Academy"
        description="See how a VibeX 30-day skills program moves from foundations to a project, certification, and freelancing support."
      />
      <PageHeader
        eyebrow="Learning journey"
        title="How a 30-day program works."
        text="Each skill follows the same rhythm: learn the foundations, practice with feedback, build a real project, certify, and prepare for the next opportunity."
      />
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <DataState loading={query.loading} error={query.error} empty={!query.data?.length} count={2}>
          <ol className="space-y-5">
            {query.data?.map((step) => (
              <li key={step.id} className="grid gap-4 rounded-[1.5rem] border border-line bg-white p-6 sm:grid-cols-[120px_1fr]">
                <p className="font-display text-3xl text-blue">{String(step.step_number).padStart(2, '0')}</p>
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-violet uppercase">{step.phase}</p>
                  <h2 className="mt-1 font-display text-2xl">{step.title}</h2>
                  <p className="mt-3 leading-relaxed text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </DataState>
        <div className="mt-10 rounded-[1.5rem] bg-navy p-8 text-white">
          <h2 className="font-display text-3xl">Ready to choose a skill?</h2>
          <p className="mt-3 max-w-xl text-slate-300">
            Online and offline training, mentorship, and freelancing guidance are part of the academy experience. Income and trading results are never guaranteed.
          </p>
          <Button to="/courses" className="mt-6">Explore Courses</Button>
        </div>
      </section>
    </>
  )
}
