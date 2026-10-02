import { useState, type FormEvent } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { verifyCertificate } from '@/lib/api'
import { errorMessage, formatDate } from '@/lib/format'

export function VerifyCertificatePage() {
  const [number, setNumber] = useState('')
  const [result, setResult] = useState<Awaited<ReturnType<typeof verifyCertificate>> | undefined>(undefined)
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setFormError(null)
    try {
      setResult(await verifyCertificate(number))
    } catch (error) {
      setResult(undefined)
      setFormError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo title="Verify a certificate | VibeX Skills Academy" description="Check whether a VibeX Skills Academy certificate number is valid." />
      <PageHeader eyebrow="Certificates" title="Verify a certificate." text="Enter the certificate number exactly as it appears on the document." />
      <section className="mx-auto max-w-xl px-5 py-14 sm:px-8">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
          <input className="field" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="VXSA-CERT-000123" required />
          <button type="submit" disabled={busy} className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">
            {busy ? 'Checking…' : 'Verify'}
          </button>
        </form>
        {formError ? <p className="mt-4 text-sm text-rose-600">{formError}</p> : null}
        {result === null ? <p className="mt-6 text-muted">No certificate matches that number.</p> : null}
        {result ? (
          <article className="mt-6 rounded-[1.4rem] border border-line bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">{result.status === 'valid' ? 'Valid' : 'Revoked'}</p>
            <h2 className="mt-2 font-display text-3xl">{result.certificate_number}</h2>
            <p className="mt-3 text-sm text-muted">{result.student_name} · {result.program_name}</p>
            <p className="mt-1 text-sm text-muted">Issued {formatDate(result.issued_on)}</p>
          </article>
        ) : null}
      </section>
    </>
  )
}
