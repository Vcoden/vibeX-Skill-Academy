import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { fetchMessages, updateRow } from '@/lib/api'
import { errorMessage, formatDate } from '@/lib/format'
import { useState } from 'react'

export function AdminMessages() {
  const query = useQuery(() => fetchMessages(), 'admin-messages')
  const [formError, setFormError] = useState<string | null>(null)

  async function markRead(id: string) {
    try {
      await updateRow('contact_messages', id, { is_read: true })
      query.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Messages</h1>
      {formError ? <p className="mt-4 text-sm text-rose-600">{formError}</p> : null}
      <div className="mt-6">
        <DataState loading={query.loading} error={query.error} empty={!query.data?.length} count={2}>
          <div className="space-y-4">
            {query.data?.map((message) => (
              <article key={message.id} className="rounded-[1.4rem] border border-line bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">{message.subject}</p>
                    <h2 className="mt-1 font-display text-2xl">{message.name}</h2>
                    <p className="text-sm text-muted">{message.email}{message.phone ? ` · ${message.phone}` : ''}</p>
                  </div>
                  <p className="text-xs text-muted">{formatDate(message.created_at)} · {message.is_read ? 'Read' : 'New'}</p>
                </div>
                <p className="mt-4 leading-relaxed text-ink">{message.message}</p>
                {!message.is_read ? (
                  <button type="button" className="mt-4 text-sm font-semibold text-blue" onClick={() => markRead(message.id)}>
                    Mark as read
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </DataState>
      </div>
    </div>
  )
}
