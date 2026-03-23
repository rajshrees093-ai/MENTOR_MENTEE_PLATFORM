// ============================================
// auth.ts — Auth Middleware
//
// requireAuth:
//   Reads Bearer token from Authorization header
//   Verifies it with Supabase
//   Fetches user role from profiles table
//   Attaches { id, email, role } to req.user
//   Rejects with 401 if token is invalid
//
// requireRole(role):
//   Use AFTER requireAuth
//   Checks req.user.role matches required role
//   Rejects with 403 if role doesn't match
//
// Usage:
//   // Only mentors can create sessions
//   router.post('/sessions',
//     requireAuth,
//     requireRole('mentor'),
//     handler
//   )
//
//   // Both roles can access
//   router.get('/sessions/:id',
//     requireAuth,
//     handler
//   )
// ============================================

import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabaseAdmin'

// Extend Express Request to carry our user object
// This lets us access req.user in route handlers
export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: 'mentor' | 'student'
  }
}

// ─── requireAuth ──────────────────────────────────────────────────────────────

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Step 1: Get token from Authorization header
    // Frontend sends: Authorization: Bearer <jwt_token>
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing Authorization header. Format: Bearer <token>',
      })
    }

    const token = authHeader.split('Bearer ')[1]

    // Step 2: Ask Supabase to verify the token
    // Returns the user if token is valid and not expired
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({
        error: 'Invalid or expired token. Please log in again.',
      })
    }

    // Step 3: Get their role from profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return res.status(401).json({
        error: 'User profile not found.',
      })
    }

    // Step 4: Attach user info to request
    // Now any route handler can use req.user
    req.user = {
      id: user.id,
      email: user.email ?? '',
      role: profile.role,
    }

    // Step 5: Move to next middleware or route handler
    next()

  } catch (err) {
    console.error('requireAuth error:', err)
    return res.status(500).json({
      error: 'Server error during auth check.',
    })
  }
}

// ─── requireRole ──────────────────────────────────────────────────────────────

export const requireRole = (role: 'mentor' | 'student') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {

    // requireAuth must run before this
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' })
    }

    // Check if their role matches what this route requires
    if (req.user.role !== role) {
      return res.status(403).json({
        error: `Access denied. This action requires the '${role}' role. You are a '${req.user.role}'.`,
      })
    }

    next()
  }
}