// ============================================
// middleware.ts — Route Protection
//
// Runs on EVERY request before the page loads.
// Uses Supabase session from cookies to check
// if user is logged in or not.
//
// Two jobs:
//
// 1. PROTECTED ROUTES (/dashboard, /session)
//    If user is NOT logged in → redirect to /login
//
// 2. GUEST ONLY ROUTES (/login, /signup)
//    If user IS logged in → redirect to /dashboard
// ============================================

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require login
const PROTECTED_ROUTES = ['/dashboard', '/session']

// Routes only for logged out users
const GUEST_ONLY_ROUTES = ['/login', '/signup']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create Supabase client for middleware using SSR package
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // ── Guard 1: Protected Routes ─────────────────────────────────────────
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtected && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Guard 2: Guest Only Routes ────────────────────────────────────────
  const isGuestOnly = GUEST_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/session/:path*',
    '/login',
    '/signup',
  ],
}