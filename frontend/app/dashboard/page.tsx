// ============================================
// dashboard/page.tsx — Dashboard Page
//
// This is shown after successful login.
//
// What it does:
// - Reads user + profile from AuthContext
// - Shows different UI for mentor vs student
// - Has a logout button
// - Redirects to /login if not authenticated
//
// Day 3 will wire up the actual session
// creation and joining functionality
// ============================================

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const { user, profile, loading, logout } = useAuth()
  const router = useRouter()

  // Client-side auth guard
  // Middleware handles server-side protection
  // This handles edge cases on the client
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // ─── Logout Handler ──────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // ─── Loading Screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">
            Loading your dashboard...
          </p>
        </div>
      </main>
    )
  }

  // Don't render while redirecting
  if (!user || !profile) return null

  // ─── Dashboard UI ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <span className="font-bold text-gray-900 text-lg">
            Mentorship Platform
          </span>
        </div>

        {/* Right side — email, role badge, logout */}
        <div className="flex items-center gap-4">

          {/* Email — hidden on mobile */}
          <span className="text-sm text-gray-500 hidden sm:block">
            {profile.email}
          </span>

          {/* Role Badge */}
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              profile.role === 'mentor'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {profile.role === 'mentor' ? '🧑‍🏫' : '🧑‍💻'} {profile.role}
          </span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* ── Page Body ────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {profile.full_name || profile.email} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            You are signed in as a{' '}
            <span className="font-semibold capitalize">
              {profile.role}
            </span>
          </p>
        </div>

        {/* ── Role Action Card ─────────────────────────────────────────── */}
        {profile.role === 'mentor' ? (

          // MENTOR CARD
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-purple-800">
              🧑‍🏫 Mentor Actions
            </h2>
            <p className="text-purple-600 text-sm">
              Create a session and share the link with your student
              to start a live coding session together.
            </p>
            <button
              onClick={() =>
                alert('Session management coming in Day 3!')
              }
              className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              + Create New Session
            </button>
          </div>

        ) : (

          // STUDENT CARD
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-blue-800">
              🧑‍💻 Student Actions
            </h2>
            <p className="text-blue-600 text-sm">
              Ask your mentor to share a session link with you.
              Paste it here to join the live coding session.
            </p>
            <button
              onClick={() =>
                alert('Session joining coming in Day 3!')
              }
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Join a Session
            </button>
          </div>

        )}

        {/* ── Profile Info Card ────────────────────────────────────────── */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">
            Your Profile
          </h2>

          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-3">
              <span className="text-gray-400 w-24 shrink-0">
                Full Name
              </span>
              <span className="text-gray-700 font-medium">
                {profile.full_name || '—'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-400 w-24 shrink-0">
                Email
              </span>
              <span className="text-gray-700">
                {profile.email}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-400 w-24 shrink-0">
                Role
              </span>
              <span className="text-gray-700 font-medium capitalize">
                {profile.role}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-gray-400 w-24 shrink-0">
                User ID
              </span>
              <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded break-all">
                {profile.id}
              </code>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}