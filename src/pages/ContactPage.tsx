import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { useQuery } from '@/hooks/useQuery'
import { sendContactMessage } from '@/lib/api'
import { contactDefaults } from '@/lib/catalog'
import { fetchAcademySettings } from '@/lib/settings'
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
  const settings = useQuery(() => fetchAcademySettings(), 'contact-settings')
  const contact = settings.data ?? {
    email: contactDefaults.email,
    whatsappDisplay: contactDefaults.whatsappDisplay,
    whatsappLink: contactDefaults.whatsappLink,
  }
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
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[1.5rem] border border-line bg-white p-6">
          <h2 className="font-display text-2xl">Email</h2>
          <a className="mt-2 inline-flex font-semibold text-blue" href={`mailto:${contact.email}`}>{contact.email}</a>
          <h2 className="mt-6 font-display text-2xl">WhatsApp</h2>
          <p className="mt-2 font-semibold">{contact.whatsappDisplay}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#contact-form" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">Contact Us</a>
            <a href={contact.whatsappLink} className="rounded-full bg-blue px-4 py-2 text-sm font-semibold text-white" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </aside>
        <div id="contact-form">
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
        </div>
      </section>
    </>
  )
}
