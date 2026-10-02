import { useState } from 'react'
import { DataState } from '@/components/ui/States'
import { Field } from '@/components/ui/Field'
import { useQuery } from '@/hooks/useQuery'
import { deleteCategory, fetchAdminCategories, saveCategory } from '@/lib/api'
import { errorMessage, formatNaira } from '@/lib/format'
import { iconOptions } from '@/lib/icons'
import type { Category } from '@/types/database'

type ModuleDraft = { id?: string; title: string; summary: string }

type Draft = {
  id?: string
  slug: string
  sort_order: string
  code: string
  name: string
  subtitle: string
  summary: string
  description: string
  icon: string
  price: string
  duration_days: string
  format_label: string
  risk_notice: string
  outcomes: string
  is_published: boolean
  modules: ModuleDraft[]
}

const emptyDraft = (): Draft => ({
  slug: '',
  sort_order: '1',
  code: '',
  name: '',
  subtitle: '',
  summary: '',
  description: '',
  icon: 'Sparkles',
  price: '0',
  duration_days: '30',
  format_label: 'Online & Offline',
  risk_notice: '',
  outcomes: '',
  is_published: true,
  modules: [{ title: '', summary: '' }],
})

function fromCategory(program: Category): Draft {
  return {
    id: program.id,
    slug: program.slug,
    sort_order: String(program.sort_order),
    code: program.code,
    name: program.name,
    subtitle: program.subtitle ?? '',
    summary: program.summary,
    description: program.description,
    icon: program.icon,
    price: String(program.price),
    duration_days: String(program.duration_days),
    format_label: program.format_label,
    risk_notice: program.risk_notice ?? '',
    outcomes: (program.outcomes ?? []).join('\n'),
    is_published: program.is_published,
    modules: (program.modules ?? []).map((module) => ({
      id: module.id,
      title: module.title,
      summary: module.summary ?? '',
    })),
  }
}

export function AdminPrograms() {
  const query = useQuery(() => fetchAdminCategories(), 'admin-programs')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function updateModule(index: number, patch: Partial<ModuleDraft>) {
    if (!draft) return
    const modules = draft.modules.map((module, moduleIndex) => (moduleIndex === index ? { ...module, ...patch } : module))
    setDraft({ ...draft, modules })
  }

  async function save() {
    if (!draft) return
    if (!draft.name.trim() || !draft.slug.trim() || !draft.summary.trim() || !draft.description.trim()) {
      setFormError('Name, slug, summary, and description are required.')
      return
    }
    const modules = draft.modules
      .filter((module) => module.title.trim())
      .map((module, index) => ({
        ...(module.id ? { id: module.id } : {}),
        title: module.title.trim(),
        summary: module.summary.trim() || null,
        sort_order: index + 1,
      }))
    setSaving(true)
    setFormError(null)
    try {
      await saveCategory(
        {
          id: draft.id,
          slug: draft.slug.trim(),
          sort_order: Number(draft.sort_order) || 1,
          code: draft.code.trim(),
          name: draft.name.trim(),
          subtitle: draft.subtitle.trim() || null,
          summary: draft.summary.trim(),
          description: draft.description.trim(),
          icon: draft.icon,
          price: Number(draft.price) || 0,
          duration_days: Number(draft.duration_days) || 30,
          format_label: draft.format_label.trim() || 'Online & Offline',
          risk_notice: draft.risk_notice.trim() || null,
          outcomes: draft.outcomes.split('\n').map((line) => line.trim()).filter(Boolean),
          is_published: draft.is_published,
        },
        modules,
      )
      setDraft(null)
      query.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this program and its curriculum?')) return
    try {
      await deleteCategory(id)
      query.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Programs</h1>
        <button type="button" onClick={() => setDraft(emptyDraft())} className="rounded-full bg-blue px-4 py-2 text-sm font-semibold text-white">
          Add program
        </button>
      </div>
      {formError ? <p className="mt-4 text-sm text-rose-600">{formError}</p> : null}
      {draft ? (
        <div className="mt-6 grid gap-4 rounded-[1.4rem] border border-line bg-white p-5 md:grid-cols-2">
          <Field label="Code"><input className="field" value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} /></Field>
          <Field label="Name"><input className="field" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field>
          <Field label="Slug"><input className="field" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} /></Field>
          <Field label="Subtitle"><input className="field" value={draft.subtitle} onChange={(event) => setDraft({ ...draft, subtitle: event.target.value })} /></Field>
          <Field label="Price (NGN)"><input className="field" type="number" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></Field>
          <Field label="Duration days"><input className="field" type="number" value={draft.duration_days} onChange={(event) => setDraft({ ...draft, duration_days: event.target.value })} /></Field>
          <Field label="Format"><input className="field" value={draft.format_label} onChange={(event) => setDraft({ ...draft, format_label: event.target.value })} /></Field>
          <Field label="Sort order"><input className="field" type="number" value={draft.sort_order} onChange={(event) => setDraft({ ...draft, sort_order: event.target.value })} /></Field>
          <Field label="Icon">
            <select className="field" value={draft.icon} onChange={(event) => setDraft({ ...draft, icon: event.target.value })}>
              {iconOptions.map((icon) => <option key={icon}>{icon}</option>)}
            </select>
          </Field>
          <label className="mt-8 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={draft.is_published} onChange={(event) => setDraft({ ...draft, is_published: event.target.checked })} />
            Published
          </label>
          <div className="md:col-span-2">
            <Field label="Summary"><textarea className="field min-h-24" value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Description"><textarea className="field min-h-32" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Outcomes" hint="One outcome per line."><textarea className="field min-h-24" value={draft.outcomes} onChange={(event) => setDraft({ ...draft, outcomes: event.target.value })} /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Risk notice" hint="Leave blank unless the program needs a financial-risk statement.">
              <textarea className="field min-h-24" value={draft.risk_notice} onChange={(event) => setDraft({ ...draft, risk_notice: event.target.value })} />
            </Field>
          </div>
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Curriculum</h2>
              <button type="button" className="text-sm font-semibold text-blue" onClick={() => setDraft({ ...draft, modules: [...draft.modules, { title: '', summary: '' }] })}>
                Add module
              </button>
            </div>
            {draft.modules.map((module, index) => (
              <div key={module.id ?? index} className="grid gap-2 rounded-2xl bg-mist p-3 md:grid-cols-[1fr_1fr_auto]">
                <input className="field" placeholder="Module title" value={module.title} onChange={(event) => updateModule(index, { title: event.target.value })} />
                <input className="field" placeholder="Short note" value={module.summary} onChange={(event) => updateModule(index, { summary: event.target.value })} />
                <button type="button" className="text-sm font-semibold text-rose-600" onClick={() => setDraft({ ...draft, modules: draft.modules.filter((_, moduleIndex) => moduleIndex !== index) })}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 md:col-span-2">
            <button type="button" disabled={saving} onClick={save} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">{saving ? 'Saving…' : 'Save program'}</button>
            <button type="button" onClick={() => setDraft(null)} className="text-sm font-semibold">Cancel</button>
          </div>
        </div>
      ) : null}
      <div className="mt-6">
        <DataState loading={query.loading} error={query.error} empty={!query.data?.length} count={2}>
          <div className="space-y-3">
            {query.data?.map((program) => (
              <article key={program.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-4">
                <div>
                  <h2 className="font-semibold">{program.code} · {program.name}</h2>
                  <p className="text-sm text-muted">{formatNaira(program.price)} · {program.is_published ? 'Published' : 'Draft'}</p>
                </div>
                <div className="flex gap-3 text-sm font-semibold">
                  <button type="button" className="text-blue" onClick={() => setDraft(fromCategory(program))}>Edit</button>
                  <button type="button" className="text-rose-600" onClick={() => remove(program.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </DataState>
      </div>
    </div>
  )
}
