import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoadingScreen } from '@/components/ui/States'

export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, profile, loading, configured, refreshProfile, signOut } = useAuth()
  const location = useLocation()
  const refreshRef = useRef(refreshProfile)
  refreshRef.current = refreshProfile
  const [checkedRole, setCheckedRole] = useState(false)

  useEffect(() => {
    if (!admin || !user) return
    let active = true
    setCheckedRole(false)
    refreshRef.current().finally(() => {
      if (active) setCheckedRole(true)
    })
    return () => {
      active = false
    }
  }, [admin, user?.id])

  if (!configured) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Connect Supabase to use accounts</h1>
        <p className="mt-3 text-muted">
          Add your project URL and anon key, then restart the app. The SQL files in the supabase folder create the tables and access rules.
        </p>
      </div>
    )
  }
  if (loading || (admin && user && !checkedRole && profile?.role !== 'admin')) {
    return <LoadingScreen label="Checking your account" />
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Profile not ready</h1>
        <p className="mt-3 text-muted">
          Your login exists, but there is no profile row yet. Run supabase/schema.sql so new accounts create a profile automatically.
        </p>
      </div>
    )
  }
  if (admin && profile.role !== 'admin') {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Admin access only</h1>
        <p className="mt-3 text-muted">
          {profile.email || user.email} is signed in as a student. Admin tools stay closed until that account is given the admin role.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/dashboard" className="font-semibold text-blue">Back to dashboard</Link>
          <button type="button" className="font-semibold text-slate-600" onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
    )
  }
  return children
}
