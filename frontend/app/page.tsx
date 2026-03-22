// ============================================
// page.tsx — Home / Landing Page
//
// This is the first page users see.
// Shows the platform name and two buttons:
// Login and Sign Up.
//
// If user is already logged in, the middleware
// will redirect them to /dashboard before
// this page even loads.
// ============================================

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 max-w-md px-4">

        {/* Logo and Title */}
        <div className="space-y-3">
          <div className="text-6xl">🎓</div>
          <h1 className="text-4xl font-bold text-gray-900">
            Mentorship Platform
          </h1>
          <p className="text-gray-500 text-lg">
            1-on-1 live coding sessions, video calls,
            and real-time collaboration
          </p>
        </div>

        {/* Login and Signup Buttons */}
        <div className="flex gap-4 justify-center pt-2">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-3 gap-4 pt-4 text-sm text-gray-500">
          <div className="space-y-2">
            <div className="text-3xl">💻</div>
            <p>Live Code Editor</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">📹</div>
            <p>Video Calls</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">💬</div>
            <p>Session Chat</p>
          </div>
        </div>

      </div>
    </main>
  )
}