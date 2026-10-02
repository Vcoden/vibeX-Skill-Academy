import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { sendContactMessage } from '@/lib/api'
import { errorMessage } from '@/lib/format'
import { contactSchema } from '@/lib/validators'

type FormValues = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', subject: 'Programs', message: '' },
  })

  async function onSubmit(values: FormValues) {
    setFormError(null)
    try {
      await sendContactMessage(values)
      setSent(true)
      form.reset()
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <>
      <Seo
        title="Contact | VibeX Skills Academy"
        description="Contact VibeX Skills Academy about programs, workshops, mentorship, and enrollment."
      />
      <PageHeader
        eyebrow="Contact"
        title="Talk to the academy."
        text="Ask about a program, a workshop, mentorship, or a partnership. Messages go straight into the academy inbox."
      />
      <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
        {sent ? (
          <div className="rounded-[1.5rem] border border-line bg-white p-8">
            <h2 className="font-display text-3xl">Message received.</h2>
            <p className="mt-3 text-muted">The academy team can read it from the admin inbox.</p>
          </div>
        ) : (
          <form className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Field label="Name" error={form.formState.errors.name?.message}>
              <input className="field" {...form.register('name')} />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <input className="field" type="email" autoComplete="email" {...form.register('email')} />
            </Field>
            <Field label="Phone" error={form.formState.errors.phone?.message}>
              <input className="field" {...form.register('phone')} />
            </Field>
            <Field label="Subject" error={form.formState.errors.subject?.message}>
              <select className="field" {...form.register('subject')}>
                {['Programs', 'Workshops', 'Mentorship', 'Partnerships', 'Other'].map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </Field>
            <Field label="Message" error={form.formState.errors.message?.message}>
              <textarea className="field min-h-36" {...form.register('message')} />
            </Field>
            {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {form.formState.isSubmitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </section>
    </>
  )
}
