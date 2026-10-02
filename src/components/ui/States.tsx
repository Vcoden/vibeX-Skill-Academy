import type { ReactNode } from 'react'

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-line bg-white px-6 py-12 text-center">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-muted">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="h-72 animate-pulse rounded-[1.6rem] bg-white" />
      ))}
    </div>
  )
}

export function DataState({
  loading,
  error,
  empty,
  emptyTitle = 'Nothing published yet',
  emptyBody = 'This section loads from Supabase. Add or publish records in the admin dashboard and they will show up here.',
  children,
  count = 3,
}: {
  loading: boolean
  error: string | null
  empty?: boolean
  emptyTitle?: string
  emptyBody?: string
  children: ReactNode
  count?: number
}) {
  if (loading) return <SkeletonGrid count={count} />
  if (error) {
    return (
      <EmptyState
        title="Content is not available yet"
        body={error}
      />
    )
  }
  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        body={emptyBody}
      />
    )
  }
  return children
}

export function LoadingScreen({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center text-sm font-semibold text-muted">{label}…</div>
  )
}
