import type { ReactNode } from 'react'

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-sm text-rose-600">{error}</span> : null}
      {hint && !error ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
    </label>
  )
}
