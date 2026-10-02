import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchCommunity } from '@/lib/api'

export function CommunityPage() {
  const query = useQuery(() => fetchCommunity(), 'community')

  return (
    <>
      <Seo
        title="Community | VibeX Skills Academy"
        description="Join the VibeX learning community for project feedback, office hours, and cohort support."
      />
      <PageHeader
        eyebrow="Community"
        title="A cohort, not a comment section."
        text="Students learn with a team: skill circles, project showcases, mentor office hours, and practical conversations about client work."
      />
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <DataState loading={query.loading} error={query.error} empty={!query.data?.length}>
          <div className="grid gap-5 md:grid-cols-2">
            {query.data?.map((post) => (
              <article key={post.id} className="rounded-[1.5rem] border border-line bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">{post.kind}</p>
                <h2 className="mt-2 font-display text-2xl">{post.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{post.body}</p>
                {post.author_name ? <p className="mt-4 text-sm font-semibold">{post.author_name}</p> : null}
              </article>
            ))}
          </div>
        </DataState>
      </section>
    </>
  )
}
