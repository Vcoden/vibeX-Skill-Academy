import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataState } from '@/components/ui/States'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@/hooks/useQuery'
import { fetchWorkshops, registerForWorkshop } from '@/lib/api'
import { errorMessage, formatDate, formatNaira } from '@/lib/format'
import { workshopSchema } from '@/lib/validators'
import type { Workshop } from '@/types/database'

type FormValues = { name: string; email: string; phone: string }

export function WorkshopsPage() {
  const query = useQuery(() => fetchWorkshops(), 'workshops')
  const { user, profile } = useAuth()
  const [active, setActive] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(workshopSchema),
    defaultValues: { name: '', email: '', phone: '' },
  })

  function openForm(workshop: Workshop) {
    setActive(workshop.id)
    setDone(null)
    setFormError(null)
    form.reset({
      name: profile?.full_name ?? '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone ?? '',
    })
  }

  async function onSubmit(workshopId: string, values: FormValues) {
    setFormError(null)
    try {
      await registerForWorkshop({
        workshopId,
        userId: user?.id ?? null,
        name: values.name,
        email: values.email,
        phone: values.phone,
      })
      setDone(workshopId)
      setActive(null)
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <>
      <Seo
        title="Workshops | VibeX Skills Academy"
        description="Join VibeX workshops for portfolio reviews, freelancing practice, and focused skill sessions."
      />
      <PageHeader
        eyebrow="Workshops"
        title="Practical sessions around the 30-day programs."
        text="Workshops are shorter live sessions. Seats, dates, prices, and descriptions are published from the academy database."
      />
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <DataState loading={query.loading} error={query.error} empty={!query.data?.length}>
          <div className="space-y-5">
            {query.data?.map((workshop) => (
              <article key={workshop.id} className="rounded-[1.6rem] border border-line bg-white p-6">
                {workshop.cover_url ? (
                  <img src={workshop.cover_url} alt="" className="mb-5 h-48 w-full rounded-2xl object-cover" />
                ) : null}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-violet uppercase">{workshop.mode}</p>
                    <h2 className="mt-2 font-display text-3xl">{workshop.title}</h2>
                  </div>
                  <p className="font-display text-2xl">{workshop.price_ngn === 0 ? 'Free' : formatNaira(workshop.price_ngn)}</p>
                </div>
                <p className="mt-4 max-w-3xl leading-relaxed text-muted">{workshop.description}</p>
                <p className="mt-4 text-sm font-semibold text-slate-600">
                  {formatDate(workshop.starts_at)}
                  {workshop.location ? ` · ${workshop.location}` : ''}
                  {workshop.seats ? ` · ${workshop.seats} seats` : ''}
                </p>
                {done === workshop.id ? (
                  <p className="mt-4 font-semibold text-blue">You are registered. We will use the email you submitted.</p>
                ) : (
                  <button
                    type="button"
                    className="mt-5 text-sm font-semibold text-blue"
                    onClick={() => openForm(workshop)}
                  >
                    Register for this workshop
                  </button>
                )}
                {active === workshop.id ? (
                  <form
                    className="mt-5 grid gap-4 md:grid-cols-2"
                    onSubmit={form.handleSubmit((values) => onSubmit(workshop.id, values))}
                    noValidate
                  >
                    <Field label="Name" error={form.formState.errors.name?.message}>
                      <input className="field" {...form.register('name')} />
                    </Field>
                    <Field label="Email" error={form.formState.errors.email?.message}>
                      <input className="field" type="email" {...form.register('email')} />
                    </Field>
                    <Field label="Phone" error={form.formState.errors.phone?.message}>
                      <input className="field" {...form.register('phone')} />
                    </Field>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {form.formState.isSubmitting ? 'Submitting…' : 'Submit registration'}
                      </button>
                    </div>
                    {formError ? <p className="text-sm text-rose-600 md:col-span-2">{formError}</p> : null}
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        </DataState>
      </section>
    </>
  )
}
