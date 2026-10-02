import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { useAuth } from '@/context/AuthContext'
import { errorMessage } from '@/lib/format'

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    try {
      await requestPasswordReset(email.trim())
      setSent(true)
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <>
      <Seo title="Reset password | VibeX Skills Academy" description="Request a password reset for your VibeX account." />
      <section className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <h1 className="font-display text-4xl">Reset your password.</h1>
        {sent ? (
          <p className="mt-4 text-muted">If an account exists for that email, a reset link is on the way.</p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Field label="Email">
              <input className="field" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </Field>
            {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
            <button type="submit" className="rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white">Send reset link</button>
          </form>
        )}
        <Link to="/login" className="mt-6 inline-flex text-sm font-semibold text-blue">Back to log in</Link>
      </section>
    </>
  )
}
