// ============================================
// login/page.tsx — Login Page
//
// Flow:
// 1. User enters email + password
// 2. We call supabase.auth.signInWithPassword()
// 3. Supabase returns a session with JWT
// 4. AuthContext picks up the change
//    via onAuthStateChange listener
// 5. We redirect to /dashboard
//
// The JWT is stored in browser cookies
// automatically by Supabase — no manual
// token handling needed on our side
// ============================================

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()

  // ─── Form State ─────────────────────────────────────────────────────────
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ─── UI State ───────────────────────────────────────────────────────────
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ─── Login Handler ───────────────────────────────────────────────────────
  const handleLogin = async () => {
    setError('')

    // Basic validation
    if (!email.trim()) return setError('Please enter your email.')
    if (!password.trim()) return setError('Please enter your password.')

    setLoading(true)

    // Call Supabase Auth login
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (loginError) {
      // Common errors:
      // "Invalid login credentials" → wrong email or password
      // "Email not confirmed" → need to verify email first
      setError(loginError.message)
      return
    }

    // Success → go to dashboard
    // AuthContext will automatically update
    // user + profile via onAuthStateChange
    router.push('/dashboard')
  }

  // ─── Login Form ──────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Link to Signup */}
        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>

      </div>
    </main>
  )
}