import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { DataState } from '@/components/ui/States'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@/hooks/useQuery'
import { createEnrollment, fetchCategory, fetchMyEnrollment, savePaymentReceipt, submitPayment } from '@/lib/api'
import { collectionAccount } from '@/lib/bank'
import { enrollmentStatusLabel, errorMessage, formatNaira } from '@/lib/format'
import type { LearningFormat } from '@/types/database'

const closedStatuses = new Set(['cancelled', 'rejected', 'completed'])

export function EnrollPage() {
  const { slug = '' } = useParams()
  const { user } = useAuth()
  const programQuery = useQuery(() => fetchCategory(slug), slug)
  const enrollmentQuery = useQuery(
    () => (user && programQuery.data ? fetchMyEnrollment(user.id, programQuery.data.id) : Promise.resolve(null)),
    `${user?.id ?? 'guest'}-${programQuery.data?.id ?? slug}`,
  )
  const [format, setFormat] = useState<LearningFormat>('online')
  const [agreed, setAgreed] = useState(false)
  const [risk, setRisk] = useState(false)
  const [reference, setReference] = useState('')
  const [paidOn, setPaidOn] = useState('')
  const [amount, setAmount] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const program = programQuery.data
  const enrollment = enrollmentQuery.data
  const openEnrollment = enrollment && !closedStatuses.has(enrollment.status) ? enrollment : null

  async function startEnrollment() {
    if (!program) return
    if (!agreed) {
      setFormError('Confirm that you understand this is a training program.')
      return
    }
    if (program.risk_notice && !risk) {
      setFormError('Acknowledge the risk statement before continuing.')
      return
    }
    setBusy(true)
    setFormError(null)
    try {
      await createEnrollment(program.id, format)
      setAmount(String(program.price))
      await enrollmentQuery.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  async function sendPayment() {
    if (!user || !openEnrollment) return
    if (!file) {
      setFormError('Upload the payment receipt.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type) || file.size > 5_000_000) {
      setFormError('Use a JPG, PNG, WEBP, or PDF receipt under 5 MB.')
      return
    }
    const paid = Number(amount)
    if (!reference.trim() || reference.trim().length < 3 || !paidOn || !Number.isFinite(paid) || paid <= 0) {
      setFormError('Enter the amount, bank reference, and payment date.')
      return
    }
    setBusy(true)
    setFormError(null)
    try {
      const paymentId = await submitPayment({
        enrollmentId: openEnrollment.id,
        amount: paid,
        studentBankReference: reference.trim(),
        transactionDate: paidOn,
        bankName: collectionAccount.bankName,
        accountName: collectionAccount.accountName,
      })
      await savePaymentReceipt({ paymentId, studentId: user.id, file })
      await enrollmentQuery.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  async function copyAccount() {
    await navigator.clipboard.writeText(collectionAccount.accountNumber)
  }

  return (
    <>
      <Seo title="Enroll | VibeX Skills Academy" description="Start an enrollment, then submit your bank transfer and receipt." />
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <DataState
          loading={programQuery.loading || enrollmentQuery.loading}
          error={programQuery.error}
          empty={!programQuery.loading && !program}
          count={1}
        >
          {program ? (
            <>
              <p className="text-xs font-semibold tracking-[0.18em] text-blue uppercase">{program.code}</p>
              <h1 className="mt-2 font-display text-4xl">Enroll in {program.name}</h1>
              <p className="mt-3 text-muted">
                Current fee {formatNaira(program.price)}. This amount is locked onto your enrollment and does not change if the program price changes later.
              </p>

              {openEnrollment ? (
                <div className="mt-8 space-y-5 rounded-[1.5rem] border border-line bg-white p-6">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">{openEnrollment.enrollment_number}</p>
                    <h2 className="mt-2 font-display text-3xl">{enrollmentStatusLabel(openEnrollment.status)}</h2>
                    <p className="mt-2 text-sm text-muted">
                      Amount due {formatNaira(openEnrollment.amount_due)} · {openEnrollment.learning_format}
                    </p>
                  </div>

                  {openEnrollment.status === 'pending_payment' ? (
                    <>
                      <div className="rounded-2xl bg-mist p-4 text-sm">
                        <p className="font-semibold">Bank: {collectionAccount.bankName}</p>
                        <p>Account name: {collectionAccount.accountName}</p>
                        <p>Account number: {collectionAccount.accountNumber}</p>
                        <button type="button" onClick={copyAccount} className="mt-3 font-semibold text-blue">
                          Copy account number
                        </button>
                        <p className="mt-3 text-muted">
                          Transfer the amount due, then submit the bank reference and receipt. A verified payment does not by itself admit you. The academy confirms admission separately.
                        </p>
                      </div>
                      <Field label="Amount transferred">
                        <input className="field" inputMode="decimal" value={amount || String(openEnrollment.amount_due)} onChange={(event) => setAmount(event.target.value)} />
                      </Field>
                      <Field label="Bank transaction reference">
                        <input className="field" value={reference} onChange={(event) => setReference(event.target.value)} />
                      </Field>
                      <Field label="Payment date">
                        <input className="field" type="date" value={paidOn} onChange={(event) => setPaidOn(event.target.value)} />
                      </Field>
                      <Field label="Payment receipt">
                        <input className="field" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                      </Field>
                      <button type="button" disabled={busy} onClick={sendPayment} className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                        {busy ? 'Submitting…' : 'Submit payment'}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted">
                      {openEnrollment.status === 'payment_submitted' && 'Your receipt is with the academy. Payment verification does not yet mean you are enrolled.'}
                      {openEnrollment.status === 'payment_verified' && 'The payment is verified. Admission is confirmed separately.'}
                      {openEnrollment.status === 'enrolled' && 'You are enrolled. Training has not been marked active yet.'}
                      {openEnrollment.status === 'active' && 'Your training is active.'}
                    </p>
                  )}
                  {['enrolled', 'active', 'completed'].includes(openEnrollment.status) ? (
                    <Link to={`/learn/${program.slug}`} className="inline-flex font-semibold text-blue">Continue learning</Link>
                  ) : (
                    <Link to="/dashboard" className="inline-flex font-semibold text-blue">Go to your dashboard</Link>
                  )}
                </div>
              ) : (
                <div className="mt-8 space-y-4 rounded-[1.5rem] border border-line bg-white p-6">
                  <fieldset>
                    <legend className="text-sm font-semibold">Learning format</legend>
                    <div className="mt-3 flex gap-3">
                      {(['online', 'offline'] as const).map((option) => (
                        <label key={option} className="flex items-center gap-2 rounded-full bg-mist px-4 py-2 text-sm font-semibold capitalize">
                          <input type="radio" name="format" checked={format === option} onChange={() => setFormat(option)} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                    <span>I understand this is skills training. The fee shown now is the amount due for this enrollment. Completion does not guarantee income or employment.</span>
                  </label>
                  {program.risk_notice ? (
                    <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                      <p>{program.risk_notice}</p>
                      <label className="mt-3 flex items-start gap-3">
                        <input type="checkbox" className="mt-1" checked={risk} onChange={(event) => setRisk(event.target.checked)} />
                        <span>I understand the financial risk and that this program does not promise profits.</span>
                      </label>
                    </div>
                  ) : null}
                  <button type="button" disabled={busy} onClick={startEnrollment} className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                    {busy ? 'Creating enrollment…' : 'Create enrollment'}
                  </button>
                </div>
              )}
              {formError ? <p className="mt-4 text-sm text-rose-600">{formError}</p> : null}
            </>
          ) : null}
        </DataState>
      </section>
    </>
  )
}
