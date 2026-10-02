import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { useAuth } from '@/context/AuthContext'
import { errorMessage } from '@/lib/format'
import { loginSchema } from '@/lib/validators'

type FormValues = { email: string; password: string }

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: FormValues) {
    setFormError(null)
    try {
      await signIn(values.email, values.password)
      navigate(from, { replace: true })
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <>
      <Seo title="Log in | VibeX Skills Academy" description="Log in to your VibeX Skills Academy account." />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2">
        <img src="/brand/logo.png" alt="VibeX" className="hidden rounded-[2rem] bg-navy lg:block" />
        <div>
          <h1 className="font-display text-4xl">Welcome back.</h1>
          <p className="mt-3 text-muted">Log in to continue a program, track modules, or manage the academy.</p>
          <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <input className="field" type="email" autoComplete="email" {...form.register('email')} />
            </Field>
            <Field label="Password" error={form.formState.errors.password?.message}>
              <input className="field" type="password" autoComplete="current-password" {...form.register('password')} />
            </Field>
            {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
            <button type="submit" disabled={form.formState.isSubmitting} className="rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {form.formState.isSubmitting ? 'Signing in…' : 'Log in'}
            </button>
          </form>
          <p className="mt-6 text-sm">
            New student? <Link to="/register" className="font-semibold text-blue">Create an account</Link>
          </p>
        </div>
      </section>
    </>
  )
}
