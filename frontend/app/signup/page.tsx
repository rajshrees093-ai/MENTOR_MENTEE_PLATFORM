// ============================================
// signup/page.tsx — Signup Page
//
// Flow:
// 1. User picks role (mentor or student)
// 2. Fills in name, email, password
// 3. We call supabase.auth.signUp()
// 4. Supabase creates the auth user
// 5. Our DB trigger automatically creates
//    a row in profiles table with their role
// 6. User sees success screen → goes to login
// ============================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {

  // ─── Form State ─────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'student' | 'mentor'>('student')

  // ─── UI State ───────────────────────────────────────────────────────────
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ─── Signup Handler ─────────────────────────────────────────────────────
  const handleSignup = async () => {
    setError('')

    // Validate inputs before calling Supabase
    if (!fullName.trim()) return setError('Please enter your full name.')
    if (!email.trim()) return setError('Please enter your email.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)

    // Call Supabase Auth signup
    // options.data goes into raw_user_meta_data
    // Our DB trigger reads role and full_name from there
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
        },
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // Show success screen
    setSuccess(true)
  }

  // ─── Success Screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center space-y-4 max-w-sm w-full">
          <div className="text-5xl">✅</div>
          <h2 className="text-xl font-semibold text-gray-800">
            Account Created!
          </h2>
          <p className="text-gray-500 text-sm">
            We sent a confirmation email to{' '}
            <strong>{email}</strong>.
            <br />
            Please verify your email then log in.
          </p>
          <Link
            href="/login"
            className="block w-full py-2.5 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </main>
    )
  }

  // ─── Signup Form ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join the mentorship platform
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            I am a...
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['student', 'mentor'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 rounded-lg border text-sm font-medium transition ${
                  role === r
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {r === 'mentor' ? '🧑‍🏫 Mentor' : '🧑‍💻 Student'}
              </button>
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
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
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        {/* Link to Login */}
        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>

      </div>
    </main>
  )
}