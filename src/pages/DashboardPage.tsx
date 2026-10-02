import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Field } from '@/components/ui/Field'
import { DataState } from '@/components/ui/States'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@/hooks/useQuery'
import { fetchAnnouncements, fetchCommunityLinks, fetchMentorshipPrograms, fetchMyCertificates, fetchMyEnrollments, fetchMyResources, uploadMedia } from '@/lib/api'
import { enrollmentStatusLabel, errorMessage, formatNaira, initials } from '@/lib/format'
import { profileSchema } from '@/lib/validators'

type FormValues = { fullName: string; phone: string; bio: string }

export function DashboardPage() {
  const { profile, user, signOut, updateProfile } = useAuth()
  const enrollments = useQuery(() => fetchMyEnrollments(user?.id ?? ''), user?.id ?? 'none')
  const certificates = useQuery(() => fetchMyCertificates(user?.id ?? ''), `certs-${user?.id ?? 'none'}`)
  const announcements = useQuery(() => fetchAnnouncements(), 'announcements')
  const resources = useQuery(() => fetchMyResources(), 'resources')
  const mentorship = useQuery(() => fetchMentorshipPrograms(), 'dash-mentorship')
  const community = useQuery(() => fetchCommunityLinks(), 'dash-community')
  const [message, setMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: '', phone: '', bio: '' },
  })

  useEffect(() => {
    form.reset({
      fullName: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      bio: profile?.bio ?? '',
    })
  }, [form, profile?.full_name, profile?.phone, profile?.bio])

  async function onSubmit(values: FormValues) {
    setFormError(null)
    setMessage(null)
    try {
      await updateProfile({
        full_name: values.fullName,
        phone: values.phone || null,
        bio: values.bio || null,
      })
      setMessage('Profile saved.')
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  async function onAvatar(file: File | undefined) {
    if (!file || !user) return
    if (!file.type.startsWith('image/') || file.size > 2_000_000) {
      setFormError('Use an image under 2 MB.')
      return
    }
    try {
      const url = await uploadMedia(`avatars/${user.id}/avatar-${Date.now()}.${file.name.split('.').pop()}`, file)
      await updateProfile({ avatar_url: url })
      setMessage('Photo updated.')
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <>
      <Seo title="Dashboard | VibeX Skills Academy" description="Your VibeX programs, progress, and profile." />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-blue uppercase">Student dashboard</p>
            <h1 className="mt-2 font-display text-4xl">Hello, {profile?.full_name || 'student'}.</h1>
          </div>
          <button type="button" onClick={() => signOut()} className="text-sm font-semibold text-slate-600">
            Sign out
          </button>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-2xl">Your programs</h2>
            <div className="mt-4">
              <DataState loading={enrollments.loading} error={enrollments.error} empty={!enrollments.data?.length} count={1}>
                <div className="space-y-4">
                  {enrollments.data?.map((enrollment) => {
                    const canLearn = ['enrolled', 'active', 'completed'].includes(enrollment.status)
                    return (
                      <article key={enrollment.id} className="rounded-[1.4rem] border border-line bg-white p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-blue">{enrollment.enrollment_number}</p>
                            <h3 className="font-display text-2xl">{enrollment.course_categories?.name}</h3>
                          </div>
                          <p className="text-sm font-semibold">{enrollmentStatusLabel(enrollment.status)}</p>
                        </div>
                        <p className="mt-2 text-sm text-muted">
                          Amount due {formatNaira(enrollment.amount_due)} · {enrollment.learning_format}
                        </p>
                        {canLearn && enrollment.course_categories?.slug ? (
                          <Link to={`/learn/${enrollment.course_categories.slug}`} className="mt-4 inline-flex text-sm font-semibold text-blue">
                            Continue learning
                          </Link>
                        ) : (
                          <Link to={`/enroll/${enrollment.course_categories?.slug ?? ''}`} className="mt-4 inline-flex text-sm font-semibold text-blue">
                            View enrollment
                          </Link>
                        )}
                      </article>
                    )
                  })}
                </div>
              </DataState>
            </div>
          </div>
          <form className="h-fit space-y-4 rounded-[1.5rem] border border-line bg-white p-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-navy font-display text-white">
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : initials(profile?.full_name || 'VX')}
              </span>
              <label className="text-sm font-semibold text-blue">
                Change photo
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => onAvatar(event.target.files?.[0])} />
              </label>
            </div>
            <Field label="Full name" error={form.formState.errors.fullName?.message}>
              <input className="field" {...form.register('fullName')} />
            </Field>
            <Field label="Phone" error={form.formState.errors.phone?.message}>
              <input className="field" {...form.register('phone')} />
            </Field>
            <Field label="Bio" error={form.formState.errors.bio?.message}>
              <textarea className="field min-h-28" {...form.register('bio')} />
            </Field>
            {message ? <p className="text-sm font-semibold text-blue">{message}</p> : null}
            {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
            <button type="submit" className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">
              Save profile
            </button>
          </form>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-[1.4rem] border border-line bg-white p-5">
            <h2 className="font-display text-2xl">Learning journey</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              <li>Week 1 — Foundation</li>
              <li>Week 2 — Skill Development</li>
              <li>Week 3 — Project Building</li>
              <li>Week 4 — Professional Practice</li>
            </ol>
          </article>
          <article className="rounded-[1.4rem] border border-line bg-white p-5">
            <h2 className="font-display text-2xl">Certificate</h2>
            {certificates.data?.length ? certificates.data.map((certificate) => (
              <p key={certificate.id} className="mt-3 text-sm">
                {certificate.program_name} · {certificate.certificate_number} · {certificate.status}
              </p>
            )) : <p className="mt-3 text-sm text-muted">No certificate has been issued yet.</p>}
          </article>
          <article className="rounded-[1.4rem] border border-line bg-white p-5">
            <h2 className="font-display text-2xl">Announcements</h2>
            {announcements.data?.length ? announcements.data.map((item) => (
              <p key={item.id} className="mt-3 text-sm"><span className="font-semibold">{item.title}.</span> {item.body}</p>
            )) : <p className="mt-3 text-sm text-muted">No announcements yet.</p>}
          </article>
          <article className="rounded-[1.4rem] border border-line bg-white p-5">
            <h2 className="font-display text-2xl">Resources</h2>
            {resources.data?.length ? resources.data.map((item) => (
              <p key={item.id} className="mt-3 text-sm">
                {item.link_url ? <a className="font-semibold text-blue" href={item.link_url}>{item.title}</a> : item.title}
              </p>
            )) : <p className="mt-3 text-sm text-muted">Learning materials appear here after you are enrolled.</p>}
          </article>
          <article className="rounded-[1.4rem] border border-line bg-white p-5">
            <h2 className="font-display text-2xl">Mentorship</h2>
            {mentorship.data?.length ? mentorship.data.map((item) => (
              <p key={item.id} className="mt-3 text-sm"><span className="font-semibold">{item.title}.</span> {item.description}</p>
            )) : <p className="mt-3 text-sm text-muted">Mentorship programs are published by the academy. None are listed yet.</p>}
          </article>
          <article className="rounded-[1.4rem] border border-line bg-white p-5">
            <h2 className="font-display text-2xl">Community</h2>
            {community.data?.length ? community.data.map((item) => (
              <p key={item.id} className="mt-3 text-sm"><a className="font-semibold text-blue" href={item.url}>{item.label}</a></p>
            )) : <p className="mt-3 text-sm text-muted">Community links appear when the academy adds them.</p>}
          </article>
        </div>
      </section>
    </>
  )
}
