import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { useQuery } from '@/hooks/useQuery'
import { fetchCommunity, fetchCommunityLinks } from '@/lib/api'

const sections = ['Student Community', 'Team Groups', 'Announcements', 'Learning Discussions', 'Opportunities', 'Workshops', 'Mentorship']

export function CommunityPage() {
  const posts = useQuery(() => fetchCommunity(), 'community')
  const links = useQuery(() => fetchCommunityLinks(), 'community-links')

  return (
    <>
      <Seo
        title="Community | VibeX Skills Academy"
        description="Learn together and grow together at VibeX Skills Academy."
      />
      <PageHeader
        eyebrow="Community"
        title="Learn Together. Grow Together."
        text="VibeX provides a community environment where learners can stay connected, share progress, receive information, and interact with other members."
      />
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <article key={section} className="rounded-[1.4rem] border border-line bg-white p-5">
              <h2 className="font-display text-2xl">{section}</h2>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <h2 className="font-display text-3xl">Community links</h2>
          {links.data?.length ? (
            <ul className="mt-4 space-y-3">
              {links.data.map((link) => (
                <li key={link.id}>
                  <a href={link.url} className="font-semibold text-blue" target="_blank" rel="noreferrer">
                    {link.label} · {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted">WhatsApp, Telegram, Discord, and other links appear here when an administrator publishes them.</p>
          )}
        </div>
        {posts.data?.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {posts.data.map((post) => (
              <article key={post.id} className="rounded-[1.5rem] border border-line bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">{post.kind}</p>
                <h2 className="mt-2 font-display text-2xl">{post.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{post.body}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </>
  )
}
