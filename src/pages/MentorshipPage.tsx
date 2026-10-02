import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { useQuery } from '@/hooks/useQuery'
import { fetchMentors, fetchMentorshipPrograms } from '@/lib/api'
import { initials } from '@/lib/format'

export function MentorshipPage() {
  const programs = useQuery(() => fetchMentorshipPrograms(), 'mentorship-programs')
  const mentors = useQuery(() => fetchMentors(), 'mentorship-mentors')

  return (
    <>
      <Seo title="Mentorship | VibeX Skills Academy" description="Continue developing through mentorship at VibeX Skills Academy." />
      <PageHeader
        eyebrow="Mentorship"
        title="Guidance after the lessons."
        text="Learners can continue developing professionally through mentorship. Programs and mentors are published by the academy."
      />
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        {!programs.loading && !programs.data?.length ? (
          <p className="text-muted">No mentorship programs are published yet.</p>
        ) : null}
        <div className="space-y-4">
          {programs.data?.map((program) => (
            <article key={program.id} className="rounded-[1.5rem] border border-line bg-white p-6">
              <h2 className="font-display text-3xl">{program.title}</h2>
              <p className="mt-3 text-muted">{program.description}</p>
              {program.availability ? <p className="mt-3 text-sm font-semibold">Availability: {program.availability}</p> : null}
              <p className="mt-1 text-sm text-muted">Application status: {program.application_status}</p>
            </article>
          ))}
        </div>
        {mentors.data?.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {mentors.data.map((mentor) => (
              <article key={mentor.id} className="rounded-[1.4rem] border border-line bg-white p-5">
                <p className="font-display text-2xl">{initials(mentor.name)} · {mentor.name}</p>
                <p className="mt-1 text-sm text-blue">{mentor.title}</p>
                <p className="mt-3 text-sm text-muted">{mentor.bio}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">No mentor names are published yet.</p>
        )}
      </section>
    </>
  )
}
