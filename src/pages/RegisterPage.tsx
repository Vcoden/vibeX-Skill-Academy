import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { useAuth } from '@/context/AuthContext'
import { errorMessage } from '@/lib/format'
import { registerSchema } from '@/lib/validators'

type FormValues = { fullName: string; email: string; password: string; confirm: string }

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [formError, setFormError] = useState<string | null>(null)
  const [confirmEmail, setConfirmEmail] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirm: '' },
  })

  async function onSubmit(values: FormValues) {
    setFormError(null)
    try {
      const result = await signUp({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      if (result.needsConfirmation) {
        setConfirmEmail(true)
        return
      }
      navigate(from, { replace: true })
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <>
      <Seo title="Create account | VibeX Skills Academy" description="Create your VibeX Skills Academy student account." />
      <section className="mx-auto max-w-xl px-5 py-14 sm:px-8">
        <h1 className="font-display text-4xl">Create your account.</h1>
        <p className="mt-3 text-muted">Use it to enroll, track your 30-day program, and register for workshops.</p>
        {confirmEmail ? (
          <div className="mt-8 rounded-[1.5rem] border border-line bg-white p-6">
            <h2 className="font-display text-2xl">Confirm your email.</h2>
            <p className="mt-3 text-muted">Open the message from the academy, then log in to continue.</p>
            <Link to="/login" className="mt-4 inline-flex font-semibold text-blue">Go to log in</Link>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Field label="Full name" error={form.formState.errors.fullName?.message}>
              <input className="field" autoComplete="name" {...form.register('fullName')} />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <input className="field" type="email" autoComplete="email" {...form.register('email')} />
            </Field>
            <Field label="Password" error={form.formState.errors.password?.message} hint="At least 8 characters, including a number.">
              <input className="field" type="password" autoComplete="new-password" {...form.register('password')} />
            </Field>
            <Field label="Confirm password" error={form.formState.errors.confirm?.message}>
              <input className="field" type="password" autoComplete="new-password" {...form.register('confirm')} />
            </Field>
            {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
            <button type="submit" disabled={form.formState.isSubmitting} className="rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {form.formState.isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}
        <p className="mt-6 text-sm">
          Already registered? <Link to="/login" className="font-semibold text-blue">Log in</Link>
        </p>
      </section>
    </>
  )
}
