import { useState } from 'react'
import { DataState } from '@/components/ui/States'
import { Field } from '@/components/ui/Field'
import { useQuery } from '@/hooks/useQuery'
import { deleteRow, fetchAdminTable, insertRow, updateRow } from '@/lib/api'
import { errorMessage } from '@/lib/format'

export type FieldDef = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'datetime'
  required?: boolean
}

type Row = Record<string, unknown> & { id?: string }

function toInput(value: unknown, type: FieldDef['type']) {
  if (type === 'checkbox') return Boolean(value)
  if (type === 'datetime' && typeof value === 'string' && value) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const pad = (part: number) => String(part).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
  if (value == null) return ''
  return String(value)
}

export function CrudManager({
  title,
  table,
  orderBy,
  labelKey,
  fields,
  blank,
  allowCreate = true,
}: {
  title: string
  table: string
  orderBy: string
  labelKey: string
  fields: FieldDef[]
  blank: Row
  allowCreate?: boolean
}) {
  const query = useQuery(() => fetchAdminTable<Row>(table, orderBy), `${table}-${orderBy}`)
  const [editing, setEditing] = useState<Row | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function start(row?: Row) {
    const source = row ?? blank
    const next: Row = {}
    if (row?.id) next.id = row.id
    for (const field of fields) next[field.name] = toInput(source[field.name], field.type)
    setEditing(next)
    setFormError(null)
  }

  async function save() {
    if (!editing) return
    const payload: Row = {}
    for (const field of fields) {
      const raw = editing[field.name]
      if (field.type === 'checkbox') {
        payload[field.name] = Boolean(raw)
        continue
      }
      const text = String(raw ?? '').trim()
      if (field.required && !text) {
        setFormError(`${field.label} is required.`)
        return
      }
      if (field.type === 'number') payload[field.name] = text === '' ? null : Number(text)
      else if (field.type === 'datetime') payload[field.name] = text ? new Date(text).toISOString() : null
      else payload[field.name] = text === '' ? null : text
    }
    if (editing.id) payload.id = editing.id
    setSaving(true)
    setFormError(null)
    try {
      if (payload.id) await updateRow(table, String(payload.id), payload)
      else await insertRow(table, payload)
      setEditing(null)
      query.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this record?')) return
    try {
      await deleteRow(table, id)
      query.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">{title}</h1>
        {allowCreate ? (
          <button type="button" onClick={() => start()} className="rounded-full bg-blue px-4 py-2 text-sm font-semibold text-white">
            Add
          </button>
        ) : null}
      </div>
      {formError ? <p className="mt-4 text-sm text-rose-600">{formError}</p> : null}
      {editing ? (
        <div className="mt-6 space-y-4 rounded-[1.4rem] border border-line bg-white p-5">
          {fields.map((field) => (
            <Field key={field.name} label={field.label}>
              {field.type === 'textarea' ? (
                <textarea
                  className="field min-h-28"
                  value={String(editing[field.name] ?? '')}
                  onChange={(event) => setEditing({ ...editing, [field.name]: event.target.value })}
                />
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={Boolean(editing[field.name])}
                  onChange={(event) => setEditing({ ...editing, [field.name]: event.target.checked })}
                />
              ) : (
                <input
                  className="field"
                  type={field.type === 'number' ? 'number' : field.type === 'datetime' ? 'datetime-local' : 'text'}
                  value={String(editing[field.name] ?? '')}
                  onChange={(event) => setEditing({ ...editing, [field.name]: event.target.value })}
                />
              )}
            </Field>
          ))}
          <div className="flex gap-3">
            <button type="button" disabled={saving} onClick={save} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="text-sm font-semibold">
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      <div className="mt-6">
        <DataState loading={query.loading} error={query.error} empty={!query.data?.length} count={2}>
          <div className="space-y-3">
            {query.data?.map((row) => (
              <article key={String(row.id)} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-4">
                <div>
                  <h2 className="font-semibold">{String(row[labelKey] ?? 'Untitled')}</h2>
                  {'is_published' in row ? (
                    <p className="text-xs text-muted">{row.is_published ? 'Published' : 'Draft'}</p>
                  ) : null}
                </div>
                <div className="flex gap-3 text-sm font-semibold">
                  <button type="button" className="text-blue" onClick={() => start(row)}>Edit</button>
                  {row.id ? <button type="button" className="text-rose-600" onClick={() => remove(String(row.id))}>Delete</button> : null}
                </div>
              </article>
            ))}
          </div>
        </DataState>
      </div>
    </div>
  )
}
