import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { DataState } from '@/components/ui/States'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@/hooks/useQuery'
import { createEnrollment, fetchCategories, fetchCategory, fetchMyEnrollment, savePaymentReceipt, submitPayment } from '@/lib/api'
import { collectionAccount } from '@/lib/bank'
import { fetchAcademySettings } from '@/lib/settings'
import { fallbackCategories } from '@/lib/catalog'
import { enrollmentStatusLabel, errorMessage, formatNaira } from '@/lib/format'
import type { LearningFormat } from '@/types/database'

const closedStatuses = new Set(['cancelled', 'rejected', 'completed'])

export function EnrollPage() {
  const { slug = '' } = useParams()
  const { user, profile, updateProfile } = useAuth()
  const catalog = useQuery(() => fetchCategories(), 'enroll-programs')
  const settingsQuery = useQuery(() => fetchAcademySettings(), 'enroll-settings')
  const bankDetails = settingsQuery.data
    ? {
        bankName: settingsQuery.data.bankName,
        accountName: settingsQuery.data.accountName,
        accountNumber: settingsQuery.data.accountNumber,
      }
    : collectionAccount
  const programQuery = useQuery(() => (slug ? fetchCategory(slug) : Promise.resolve(null)), slug || 'choose')
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
  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const programChoices = catalog.data?.length ? catalog.data : catalog.error ? fallbackCategories : []
  const program = programQuery.data ?? (slug && programQuery.error ? fallbackCategories.find((item) => item.slug === slug) ?? null : null)
  const liveProgram = Boolean(program && /^[0-9a-f-]{36}$/i.test(program.id))
  const enrollment = enrollmentQuery.data
  const openEnrollment = enrollment && !closedStatuses.has(enrollment.status) ? enrollment : null

  const nameValue = fullName || profile?.full_name || ''
  const phoneValue = whatsapp || profile?.phone || ''

  async function startEnrollment() {
    if (!program || !liveProgram) {
      setFormError('This program can be enrolled once the academy database is connected.')
      return
    }
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
    if (!user || !openEnrollment || !liveProgram) return
    if (nameValue.trim().length < 2 || phoneValue.trim().length < 7) {
      setFormError('Enter your full name and WhatsApp number.')
      return
    }
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
      await updateProfile({ full_name: nameValue.trim(), phone: phoneValue.trim() })
      const paymentId = await submitPayment({
        enrollmentId: openEnrollment.id,
        amount: paid,
        studentBankReference: reference.trim(),
        transactionDate: paidOn,
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
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
    await navigator.clipboard.writeText(bankDetails.accountNumber)
  }

  return (
    <>
      <Seo title="Enroll | VibeX Skills Academy" description="Start an enrollment, then submit your bank transfer and receipt." />
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        {!slug ? (
          <div>
            <h1 className="font-display text-4xl">Choose Your Program</h1>
            <p className="mt-3 text-muted">Step 1 of 4. Select a program, then choose online or offline and submit your transfer.</p>
            <div className="mt-8 grid gap-3">
              {programChoices.map((item) => (
                <Link key={item.slug} to={`/enroll/${item.slug}`} className="rounded-2xl border border-line bg-white px-4 py-4 font-semibold">
                  {item.code} · {item.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <DataState
          loading={Boolean(slug) && (programQuery.loading || enrollmentQuery.loading)}
          error={slug && programQuery.error && !program ? programQuery.error : null}
          empty={Boolean(slug) && !programQuery.loading && !program}
          count={1}
        >
          {program ? (
            <>
              <p className="text-xs font-semibold tracking-[0.18em] text-blue uppercase">{program.code}</p>
              <h1 className="mt-2 font-display text-4xl">Enroll in {program.name}</h1>
              <ol className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <li className="rounded-full bg-mist px-3 py-1">1 Choose program</li>
                <li className="rounded-full bg-mist px-3 py-1">2 Online or offline</li>
                <li className="rounded-full bg-mist px-3 py-1">3 Bank transfer</li>
                <li className="rounded-full bg-mist px-3 py-1">4 Submit enrollment</li>
              </ol>
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
                        <p className="font-semibold">Bank: {bankDetails.bankName}</p>
                        <p>Account name: {bankDetails.accountName}</p>
                        <p>Account number: {bankDetails.accountNumber}</p>
                        <button type="button" onClick={copyAccount} className="mt-3 font-semibold text-blue">
                          Copy account number
                        </button>
                        <p className="mt-3 text-muted">
                          Complete your bank transfer using the details above, then submit your payment information below.
                        </p>
                      </div>
                      <Field label="Full name">
                        <input className="field" value={fullName || profile?.full_name || ''} onChange={(event) => setFullName(event.target.value)} />
                      </Field>
                      <Field label="Email">
                        <input className="field" value={profile?.email || user?.email || ''} readOnly />
                      </Field>
                      <Field label="WhatsApp number">
                        <input className="field" value={whatsapp || profile?.phone || ''} onChange={(event) => setWhatsapp(event.target.value)} />
                      </Field>
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
                        {busy ? 'Submitting…' : 'Submit Enrollment'}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted">
                      {openEnrollment.status === 'payment_submitted' && 'Your enrollment has been received. Our team will review your payment and contact you with your next steps.'}
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
