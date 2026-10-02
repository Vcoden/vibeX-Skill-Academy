import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { useQuery } from '@/hooks/useQuery'
import { fetchProfessionalPrograms } from '@/lib/api'
import { formatNaira } from '@/lib/format'

export function ProfessionalProgramsPage() {
  const query = useQuery(() => fetchProfessionalPrograms(), 'professional-programs')

  return (
    <>
      <Seo title="Professional programs | VibeX Skills Academy" description="Programs beyond the standard 30-day courses at VibeX Skills Academy." />
      <PageHeader
        eyebrow="Professional programs"
        title="Training beyond the 30-day courses."
        text="These programs are managed separately from the 11 main courses. They appear when the academy publishes them."
      />
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        {query.loading ? <p className="text-muted">Loading programs.</p> : null}
        {!query.loading && !query.data?.length ? (
          <p className="text-muted">No professional programs are published yet.</p>
        ) : null}
        <div className="space-y-4">
          {query.data?.map((program) => (
            <article key={program.id} className="rounded-[1.5rem] border border-line bg-white p-6">
              <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">{program.status}</p>
              <h2 className="mt-2 font-display text-3xl">{program.title}</h2>
              <p className="mt-3 text-muted">{program.description}</p>
              <p className="mt-3 text-sm font-semibold">
                {program.duration_label ?? 'Duration to be announced'}
                {program.price != null ? ` · ${formatNaira(program.price)}` : ''}
              </p>
              {program.requirements ? <p className="mt-2 text-sm text-muted">Requirements: {program.requirements}</p> : null}
              {program.application_process ? <p className="mt-2 text-sm text-muted">How to apply: {program.application_process}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
