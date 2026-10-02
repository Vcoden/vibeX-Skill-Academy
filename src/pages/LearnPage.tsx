import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { DataState } from '@/components/ui/States'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@/hooks/useQuery'
import { fetchCategory, fetchModuleProgress, fetchMyEnrollment, setModuleProgress } from '@/lib/api'
import { errorMessage } from '@/lib/format'
import { useState } from 'react'

export function LearnPage() {
  const { slug = '' } = useParams()
  const { user } = useAuth()
  const programQuery = useQuery(() => fetchCategory(slug), slug)
  const enrollmentQuery = useQuery(
    () => (user && programQuery.data ? fetchMyEnrollment(user.id, programQuery.data.id) : Promise.resolve(null)),
    `${user?.id ?? 'none'}-${programQuery.data?.id ?? slug}`,
  )
  const modules = programQuery.data?.modules ?? []
  const progressQuery = useQuery(
    () => (user ? fetchModuleProgress(user.id, modules.map((module) => module.id)) : Promise.resolve([])),
    `${user?.id ?? 'none'}-${modules.map((module) => module.id).join(',')}`,
  )
  const [busy, setBusy] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const done = new Set((progressQuery.data ?? []).map((item) => item.module_id))
  const enrolled = Boolean(
    enrollmentQuery.data && ['enrolled', 'active', 'completed'].includes(enrollmentQuery.data.status),
  )

  async function toggle(moduleId: string) {
    if (!user || !enrolled) return
    setBusy(moduleId)
    setFormError(null)
    try {
      await setModuleProgress(user.id, moduleId, !done.has(moduleId))
      await progressQuery.reload()
    } catch (error) {
      setFormError(errorMessage(error))
    } finally {
      setBusy(null)
    }
  }

  const program = programQuery.data

  return (
    <>
      <Seo title={program ? `Learn ${program.name}` : 'Learn | VibeX'} description="Track your VibeX program modules." />
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <DataState loading={programQuery.loading} error={programQuery.error} empty={!program} count={1}>
          {program ? (
            <>
              <Link to="/dashboard" className="text-sm font-semibold text-blue">Dashboard</Link>
              <h1 className="mt-3 font-display text-4xl">{program.name}</h1>
              <p className="mt-3 text-muted">
                {enrolled
                  ? `Enrollment status: ${enrollmentQuery.data?.status}. Mark a module when you have worked through it.`
                  : 'Enroll to track your progress. You can still read the curriculum on the program page.'}
              </p>
              {!enrolled ? (
                <Link to={`/enroll/${program.slug}`} className="mt-4 inline-flex font-semibold text-blue">Enroll Now</Link>
              ) : null}
              <ul className="mt-8 space-y-3">
                {modules.map((module) => (
                  <li key={module.id}>
                    <label className="flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-4">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={done.has(module.id)}
                        disabled={!enrolled || busy === module.id}
                        onChange={() => toggle(module.id)}
                      />
                      <span>
                        <span className="block font-semibold">{module.title}</span>
                        {module.summary ? <span className="mt-1 block text-sm text-muted">{module.summary}</span> : null}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {formError ? <p className="mt-4 text-sm text-rose-600">{formError}</p> : null}
            </>
          ) : null}
        </DataState>
      </section>
    </>
  )
}
