import { useMemo, useState } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchFaqs } from '@/lib/api'

export function FaqPage() {
  const query = useQuery(() => fetchFaqs(), 'faqs')
  const [open, setOpen] = useState<string | null>(null)
  const topics = useMemo(() => {
    const names = new Set((query.data ?? []).map((faq) => faq.topic))
    return ['All', ...names]
  }, [query.data])
  const [topic, setTopic] = useState('All')
  const visible = (query.data ?? []).filter((faq) => topic === 'All' || faq.topic === topic)

  return (
    <>
      <Seo
        title="FAQ | VibeX Skills Academy"
        description="Answers about VibeX 30-day programs, certificates, mentorship, enrollment, and trading risk education."
      />
      <PageHeader
        eyebrow="FAQ"
        title="Clear answers before you enroll."
        text="Program length, certificates, mentorship, freelancing support, and risk education are explained here. The academy updates these answers from the database."
      />
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <DataState loading={query.loading} error={query.error} empty={!query.data?.length}>
          <div className="mb-6 flex flex-wrap gap-2">
            {topics.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTopic(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${topic === item ? 'bg-navy text-white' : 'bg-white text-ink'}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {visible.map((faq) => {
              const expanded = open === faq.id
              return (
                <div key={faq.id} className="rounded-2xl border border-line bg-white">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : faq.id)}
                  >
                    {faq.question}
                    <span className="text-blue">{expanded ? '–' : '+'}</span>
                  </button>
                  {expanded ? <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p> : null}
                </div>
              )
            })}
          </div>
        </DataState>
      </section>
    </>
  )
}
