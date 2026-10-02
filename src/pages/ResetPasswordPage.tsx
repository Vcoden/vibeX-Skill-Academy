import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { useAuth } from '@/context/AuthContext'
import { errorMessage } from '@/lib/format'

export function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (password.length < 8) {
      setFormError('Use at least 8 characters.')
      return
    }
    setFormError(null)
    try {
      await updatePassword(password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <>
      <Seo title="Choose a new password | VibeX Skills Academy" description="Set a new password for your VibeX account." />
      <section className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <h1 className="font-display text-4xl">Choose a new password.</h1>
        <p className="mt-3 text-muted">Open this page from the reset email so your session is ready.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Field label="New password">
            <input className="field" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>
          {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
          <button type="submit" className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">Save password</button>
        </form>
      </section>
    </>
  )
}
