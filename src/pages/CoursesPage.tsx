import { useMemo, useState } from 'react'
import { ProgramCard } from '@/components/programs/ProgramCard'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchCategories } from '@/lib/api'
import { fallbackCategories } from '@/lib/catalog'

export function CoursesPage() {
  const query = useQuery(() => fetchCategories(), 'courses')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')
  const [priceBand, setPriceBand] = useState('all')
  const source = query.data?.length ? query.data : query.error ? fallbackCategories : []
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const next = source.filter((program) => {
      const matchesTerm = !term || `${program.name} ${program.subtitle ?? ''} ${program.summary}`.toLowerCase().includes(term)
      const price = Number(program.price)
      const matchesPrice = priceBand === 'all'
        || (priceBand === '100' && price <= 120000)
        || (priceBand === '150' && price > 120000 && price <= 170000)
        || (priceBand === '200' && price > 170000)
      return matchesTerm && matchesPrice
    })
    if (sort === 'price-asc') next.sort((a, b) => Number(a.price) - Number(b.price))
    if (sort === 'price-desc') next.sort((a, b) => Number(b.price) - Number(a.price))
    return next
  }, [priceBand, search, sort, source])

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
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label>
            <span className="sr-only">Search programs</span>
            <input className="field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search programs" />
          </label>
          <label>
            <span className="sr-only">Filter by price</span>
            <select className="field" value={priceBand} onChange={(event) => setPriceBand(event.target.value)}>
              <option value="all">All prices</option>
              <option value="100">Up to ₦120,000</option>
              <option value="150">₦120,001 – ₦170,000</option>
              <option value="200">Above ₦170,000</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Sort programs</span>
            <select className="field" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
              <option value="featured">Featured order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-muted">Every program is available online and offline. One fee covers all of its subcategories.</p>
        <div className="mt-8">
          <DataState loading={query.loading} error={query.error && source.length === 0 ? query.error : null} empty={!query.loading && source.length === 0}>
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
