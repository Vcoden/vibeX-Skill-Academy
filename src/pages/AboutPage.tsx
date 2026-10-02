import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { useQuery } from '@/hooks/useQuery'
import { fetchMentors } from '@/lib/api'
import { initials } from '@/lib/format'

export function AboutPage() {
  const mentors = useQuery(() => fetchMentors(), 'mentors')

  return (
    <>
      <Seo
        title="About | VibeX Skills Academy"
        description="VibeX Skills Academy trains practical, career-focused skills through 30-day programs, mentorship, and project-based learning."
      />
      <PageHeader
        eyebrow="About VXSA"
        title="Building Skills for the Future."
        text="VibeX Skills Academy helps people acquire practical skills, develop professional confidence, build projects, pursue opportunities, and continue growing beyond classroom training."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2">
        <img
          src="/brand/campus.jpg"
          alt="VibeX Skills Academy"
          className="h-full max-h-[520px] w-full rounded-[1.8rem] object-cover"
          onError={(event) => {
            event.currentTarget.src = '/brand/logo.png'
          }}
        />
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Students come to learn a skill they can use: marketing, design, writing, research, development, trading education, and other professional tracks published by the academy.
          </p>
          <p>
            Training is available online and offline. Lessons sit next to workshops, mentorship, and a community that reviews real work. Freelancing support covers how to present a skill and work with clients, including international clients.
          </p>
          <p>
            VibeX does not sell shortcuts. Certificates confirm that you completed training. They do not promise a job, a client, or a trading profit.
          </p>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-4xl">Mentors</h2>
          <p className="mt-3 max-w-2xl text-muted">Mentor profiles appear here when the academy publishes them.</p>
          <div className="mt-8">
            {mentors.data?.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {mentors.data?.map((mentor) => (
                  <article key={mentor.id} className="rounded-[1.5rem] border border-line p-6">
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy font-display text-white">
                        {initials(mentor.name)}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl">{mentor.name}</h3>
                        <p className="text-sm text-blue">{mentor.title}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-violet">{mentor.focus}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{mentor.bio}</p>
                  </article>
                ))}
              </div>
            ) : mentors.loading ? (
              <p className="text-sm text-muted">Loading mentor profiles.</p>
            ) : (
              <p className="text-sm text-muted">No mentor profiles are published yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
