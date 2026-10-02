import { useMemo, useState } from 'react'
import { ProgramCard } from '@/components/programs/ProgramCard'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchCategories } from '@/lib/api'

export function CoursesPage() {
  const query = useQuery(() => fetchCategories(), 'courses')
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (query.data ?? []).filter((program) => {
      if (!term) return true
      return `${program.name} ${program.subtitle ?? ''} ${program.summary}`.toLowerCase().includes(term)
    })
  }, [query.data, search])

  return (
    <>
      <Seo
        title="Courses | VibeX Skills Academy"
        description="Explore practical 30-day professional programs at VibeX Skills Academy."
      />
      <PageHeader
        eyebrow="Courses"
        title="Choose Your Skill. Start Your Journey."
        text="Explore practical professional programs designed around real-world skills and career opportunities."
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <label className="block max-w-md">
          <span className="sr-only">Search programs</span>
          <input
            className="field"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search programs"
          />
        </label>
        <div className="mt-8">
          <DataState loading={query.loading} error={query.error} empty={!query.data?.length}>
            {filtered.length === 0 ? (
              <p className="text-muted">No programs match that search.</p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </DataState>
        </div>
      </section>
    </>
  )
}
