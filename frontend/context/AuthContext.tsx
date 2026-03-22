// ============================================
// AuthContext.tsx
//
// Global authentication state for the entire app.
//
// What it does:
// - Checks if user is already logged in on page load
// - Listens for login/logout events automatically
// - Fetches the user's profile (which has their role)
// - Provides user, profile, loading, logout
//   to any component via useAuth() hook
//
// How to use in any component:
//   const { user, profile, loading, logout } = useAuth()
//
// profile.role will be 'mentor' or 'student'
// ============================================

'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

// ─── Types ────────────────────────────────────────────────────────────────────

// Shape of a row in our profiles table
type Profile = {
  id: string
  email: string
  role: 'mentor' | 'student'
  full_name: string | null
  avatar_url: string | null
}

// Everything the context gives to components
type AuthContextType = {
  user: User | null        // Supabase auth user
  profile: Profile | null  // Our profiles table row (has role)
  loading: boolean         // true = still checking session
  logout: () => Promise<void>
}

// ─── Create Context ───────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
})

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile row from our profiles table using user ID
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    return data as Profile
  }

  useEffect(() => {
    // ── Step 1: Check existing session on page load ──
    // This handles the case where user refreshes the page
    // Supabase stores the session in cookies automatically
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      }

      // Done checking — now render the app
      setLoading(false)
    }

    initSession()

    // ── Step 2: Listen for future auth events ──
    // Fires when: user logs in, logs out, token refreshes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      } else {
        // User logged out
        setUser(null)
        setProfile(null)
      }
    })

    // Cleanup listener when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  // Signs out and clears all state
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

// Use this in any component to access auth state
// Example: const { user, profile, loading } = useAuth()
export const useAuth = () => useContext(AuthContext)