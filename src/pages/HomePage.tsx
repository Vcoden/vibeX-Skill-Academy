import { ArrowRight, BadgeCheck, Globe2, Quote, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Hero } from '@/components/home/Hero'
import { TrustStrip } from '@/components/home/TrustStrip'
import { ProgramCard } from '@/components/programs/ProgramCard'
import { Reveal } from '@/components/Reveal'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchCategories, fetchFaqs, fetchJourney, fetchTestimonials, fetchWorkshops } from '@/lib/api'
import { fallbackCategories, fallbackFaqs, fallbackJourney } from '@/lib/catalog'
import { formatDate, formatNaira } from '@/lib/format'

export function HomePage() {
  const programs = useQuery(() => fetchCategories(), 'home-programs')
  const journey = useQuery(() => fetchJourney(), 'home-journey')
  const workshops = useQuery(() => fetchWorkshops(), 'home-workshops')
  const stories = useQuery(() => fetchTestimonials(), 'home-stories')
  const faqs = useQuery(() => fetchFaqs(), 'home-faqs')
  const programList = programs.data?.length ? programs.data : programs.error ? fallbackCategories : []
  const journeyList = journey.data?.length ? journey.data : journey.error ? fallbackJourney : []
  const faqList = faqs.data?.length ? faqs.data : faqs.error ? fallbackFaqs : []

  return (
    <>
      <Seo
        title="VibeX Skills Academy | Learn Skills. Build Your Future."
        description="Practical 30-day skills programs with projects, certifications, mentorship, and freelancing support."
      />
      <Hero />
      <TrustStrip />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" id="programs">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-blue uppercase">Programs</p>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-display text-4xl tracking-tight text-ink">
              Choose Your Skill. Start Your Journey.
            </h2>
            <p className="max-w-md text-muted">
              Explore practical professional programs designed around real-world skills and career opportunities.
            </p>
          </div>
        </Reveal>
        <div className="mt-10">
          <DataState loading={programs.loading} error={programs.error && programList.length === 0 ? programs.error : null} empty={!programs.loading && programList.length === 0}>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {programList.map((program, index) => (
                <Reveal key={program.id} delay={index * 40}>
                  <ProgramCard program={program} />
                </Reveal>
              ))}
            </div>
          </DataState>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue uppercase">Learning journey</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Thirty days with a clear path.</h2>
            <p className="mt-4 text-muted">
              Every program moves from foundations to practice, a real project, certification, and support for what comes next.
            </p>
            <Button to="/journey" variant="secondary" className="mt-6">
              See the full journey
            </Button>
          </div>
          <DataState loading={journey.loading} error={journey.error && journeyList.length === 0 ? journey.error : null} empty={!journey.loading && journeyList.length === 0} count={2}>
            <ol className="grid gap-4 sm:grid-cols-2">
              {journeyList.slice(0, 4).map((step) => (
                <li key={step.id} className="rounded-[1.4rem] border border-line bg-mist p-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">{step.phase}</p>
                  <h3 className="mt-2 font-display text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </DataState>
        </div>
      </section>

      <section className="bg-navy py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-3">
          {[
            { icon: BadgeCheck, title: 'Certifications', text: 'Finish the requirements and receive a certificate for the skill you trained.' },
            { icon: Users, title: 'Mentorship and community', text: 'Get guidance beyond the lessons, with cohort support and project feedback.' },
            { icon: Globe2, title: 'International clients', text: 'Learn how to communicate, scope, and deliver work for clients beyond your city.' },
          ].map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <item.icon className="h-6 w-6 text-cyan" />
              <h2 className="mt-4 font-display text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue uppercase">Workshops</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Short sessions around the programs.</h2>
          </div>
          <Link to="/workshops" className="hidden items-center gap-1 font-semibold text-blue sm:inline-flex">
            All workshops <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8">
          <DataState
            loading={workshops.loading}
            error={workshops.error}
            empty={!workshops.loading && !workshops.data?.length}
            emptyTitle="No workshops scheduled"
            emptyBody="Short sessions appear here when the academy publishes them."
            count={2}
          >
            <div className="grid gap-5 md:grid-cols-2">
              {workshops.data?.slice(0, 2).map((workshop) => (
                <article key={workshop.id} className="rounded-[1.5rem] border border-line bg-white p-6">
                  <p className="text-xs font-semibold tracking-[0.16em] text-violet uppercase">{workshop.mode}</p>
                  <h3 className="mt-2 font-display text-2xl">{workshop.title}</h3>
                  <p className="mt-3 text-sm text-muted">{workshop.summary}</p>
                  <p className="mt-4 text-sm font-semibold">{formatDate(workshop.starts_at)} · {formatNaira(workshop.price_ngn)}</p>
                </article>
              ))}
            </div>
          </DataState>
        </div>
      </section>

      {stories.data?.length ? (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-blue uppercase">Student stories</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">What the work feels like.</h2>
          <div className="mt-8">
            <div className="grid gap-5 md:grid-cols-2">
                {stories.data.slice(0, 4).map((story) => (
                  <figure key={story.id} className="rounded-[1.5rem] border border-line bg-mist p-6">
                    <Quote className="h-5 w-5 text-blue" />
                    <blockquote className="mt-4 text-lg leading-relaxed text-ink">{story.quote}</blockquote>
                    <figcaption className="mt-5 text-sm">
                      <span className="font-semibold">{story.name}</span>
                      <span className="text-muted"> · {story.program_label}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
          </div>
        </div>
      </section>
      ) : null}

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <h2 className="text-center font-display text-4xl tracking-tight">Questions, answered.</h2>
        <div className="mt-8">
          <DataState loading={faqs.loading} error={faqs.error && faqList.length === 0 ? faqs.error : null} empty={!faqs.loading && faqList.length === 0} count={2}>
            <div className="space-y-3">
              {faqList.slice(0, 4).map((faq) => (
                <details key={faq.id} className="rounded-2xl border border-line bg-white px-5 py-4">
                  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </DataState>
        </div>
        <div className="mt-6 text-center">
          <Link to="/faq" className="font-semibold text-blue">Read all FAQs</Link>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-white sm:px-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">VXSA</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-tight">Pick a skill. Spend 30 days building it.</h2>
          <p className="mt-4 max-w-xl text-slate-300">
            Programs, workshops, and enrollments are managed in the academy database, so the catalog stays current.
          </p>
          <div className="mt-8">
            <Button to="/courses">Explore Courses</Button>
          </div>
        </div>
      </section>
    </>
  )
}
