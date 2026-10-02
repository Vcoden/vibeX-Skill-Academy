import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoadingScreen } from '@/components/ui/States'

export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, profile, loading, configured } = useAuth()
  const location = useLocation()

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
  if (loading) return <LoadingScreen label="Checking your account" />
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
        <p className="mt-3 text-muted">This area is for academy administrators.</p>
        <Link to="/dashboard" className="mt-6 inline-flex font-semibold text-blue">
          Back to dashboard
        </Link>
      </div>
    )
  }
  return children
}
