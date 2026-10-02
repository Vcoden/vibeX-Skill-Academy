import { useState } from 'react'
import { DataState } from '@/components/ui/States'
import { useQuery } from '@/hooks/useQuery'
import { advanceEnrollment, confirmEnrollment, fetchEnrollmentsAdmin, receiptSignedUrl, reviewPayment } from '@/lib/api'
import { enrollmentStatusLabel, errorMessage, formatDate, formatNaira } from '@/lib/format'
import type { Payment } from '@/types/database'

export function AdminEnrollments() {
  const query = useQuery(() => fetchEnrollmentsAdmin(), 'admin-enrollments')
  const [formError, setFormError] = useState<string | null>(null)
  const [reason, setReason] = useState<Record<string, string>>({})

  async function run(action: () => Promise<void>) {
    setFormError(null)
    try {
      await action()
      query.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  async function openReceipt(payment: Payment) {
    const receipt = payment.payment_receipts?.[0]
    if (!receipt) return
    const url = await receiptSignedUrl(receipt.storage_bucket, receipt.storage_path)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Enrollments</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        A verified payment does not admit the student. Confirm admission only after you have checked the receipt.
      </p>
      {formError ? <p className="mt-4 text-sm text-rose-600">{formError}</p> : null}
      <div className="mt-6">
        <DataState loading={query.loading} error={query.error} empty={!query.data?.length} count={2}>
          <div className="space-y-4">
            {query.data?.map((enrollment) => (
              <article key={enrollment.id} className="rounded-[1.4rem] border border-line bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-blue">{enrollment.enrollment_number}</p>
                    <h2 className="font-display text-2xl">{enrollment.profiles?.full_name || 'Student'}</h2>
                    <p className="text-sm text-muted">{enrollment.profiles?.email} · {enrollment.profiles?.phone}</p>
                    <p className="mt-1 font-semibold">{enrollment.course_categories?.name}</p>
                    <p className="text-sm text-muted">
                      {enrollmentStatusLabel(enrollment.status)} · {enrollment.learning_format} · due {formatNaira(enrollment.amount_due)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {enrollment.status === 'payment_verified' ? (
                      <button type="button" className="rounded-full bg-navy px-3 py-2 text-xs font-semibold text-white" onClick={() => run(() => confirmEnrollment(enrollment.id))}>
                        Confirm admission
                      </button>
                    ) : null}
                    {enrollment.status === 'enrolled' ? (
                      <button type="button" className="rounded-full bg-blue px-3 py-2 text-xs font-semibold text-white" onClick={() => run(() => advanceEnrollment(enrollment.id, 'active'))}>
                        Mark active
                      </button>
                    ) : null}
                    {enrollment.status === 'enrolled' || enrollment.status === 'active' ? (
                      <button type="button" className="rounded-full bg-mist px-3 py-2 text-xs font-semibold" onClick={() => run(() => advanceEnrollment(enrollment.id, 'completed'))}>
                        Mark completed
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {(enrollment.payments ?? []).map((payment) => (
                    <div key={payment.id} className="rounded-2xl bg-mist p-4 text-sm">
                      <p className="font-semibold">
                        {payment.internal_payment_reference} · {formatNaira(payment.amount)} · {payment.status}
                      </p>
                      <p className="text-muted">
                        Student bank reference: {payment.student_bank_reference || 'None'} · {payment.bank_name} · {payment.account_name}
                      </p>
                      <p className="text-muted">{formatDate(payment.created_at)}</p>
                      {payment.rejection_reason ? <p className="text-rose-700">{payment.rejection_reason}</p> : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {payment.payment_receipts?.length ? (
                          <button type="button" className="font-semibold text-blue" onClick={() => run(() => openReceipt(payment))}>
                            View receipt
                          </button>
                        ) : (
                          <span className="text-muted">No receipt uploaded</span>
                        )}
                        {payment.status === 'submitted' || payment.status === 'under_review' ? (
                          <>
                            {payment.status === 'submitted' ? (
                              <button type="button" className="font-semibold" onClick={() => run(() => reviewPayment(payment.id, 'under_review'))}>
                                Mark under review
                              </button>
                            ) : null}
                            <button type="button" className="font-semibold text-blue" onClick={() => run(() => reviewPayment(payment.id, 'verified'))}>
                              Verify payment
                            </button>
                            <input
                              className="field max-w-xs"
                              placeholder="Rejection reason"
                              value={reason[payment.id] ?? ''}
                              onChange={(event) => setReason((current) => ({ ...current, [payment.id]: event.target.value }))}
                            />
                            <button type="button" className="font-semibold text-rose-700" onClick={() => run(() => reviewPayment(payment.id, 'rejected', reason[payment.id]))}>
                              Reject payment
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </DataState>
      </div>
    </div>
  )
}
