import type { Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { requireSupabase, supabase } from '@/lib/supabase'
import type { Profile } from '@/types/database'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: { fullName: string; email: string; password: string }) => Promise<{ needsConfirmation: boolean }>
  signOut: () => Promise<void>
  updateProfile: (patch: Partial<Pick<Profile, 'full_name' | 'phone' | 'bio' | 'avatar_url'>>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function loadProfile(userId: string) {
  const db = requireSupabase()
  const { data, error } = await db.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return (data as Profile | null) ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!nextSession) {
        setProfile(null)
        setLoading(false)
      }
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session?.user) return
    let active = true
    setLoading(true)
    loadProfile(session.user.id)
      .then((next) => {
        if (active) setProfile(next)
      })
      .catch(() => {
        if (active) setProfile(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [session?.user?.id])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user: session?.user ?? null,
      profile,
      loading,
      configured: Boolean(supabase),
      async signIn(email, password) {
        const db = requireSupabase()
        const { error } = await db.auth.signInWithPassword({ email, password })
        if (error) throw error
      },
      async signUp({ fullName, email, password }) {
        const db = requireSupabase()
        const { data, error } = await db.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (error) throw error
        return { needsConfirmation: !data.session }
      },
      async signOut() {
        const db = requireSupabase()
        const { error } = await db.auth.signOut()
        if (error) throw error
      },
      async updateProfile(patch) {
        if (!session?.user) throw new Error('Sign in to update your profile.')
        const db = requireSupabase()
        const { data, error } = await db
          .from('profiles')
          .update(patch)
          .eq('id', session.user.id)
          .select('*')
          .single()
        if (error) throw error
        setProfile(data as Profile)
      },
      async refreshProfile() {
        if (!session?.user) return
        setProfile(await loadProfile(session.user.id))
      },
    }
  }, [loading, profile, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
