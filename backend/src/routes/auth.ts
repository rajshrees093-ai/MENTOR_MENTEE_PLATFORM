// ============================================
// routes/auth.ts — Auth Routes
//
// GET /api/auth/me
//   Returns full profile of logged in user
//   Requires valid JWT
//
// GET /api/auth/verify
//   Quick check — is this JWT valid?
//   Returns { valid: true, user: {...} }
//   Frontend uses this to check auth status
// ============================================

import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { supabaseAdmin } from '../lib/supabaseAdmin'

const router = Router()

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    // req.user was attached by requireAuth middleware
    // Now fetch their full profile row
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user!.id)
      .single()

    if (error || !profile) {
      return res.status(404).json({ error: 'Profile not found.' })
    }

    return res.json({ profile })

  } catch (err) {
    console.error('/me error:', err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
})

// ─── GET /api/auth/verify ─────────────────────────────────────────────────────

router.get('/verify', requireAuth, (req: AuthRequest, res: Response) => {
  // If we reach here requireAuth passed
  // meaning the token is valid
  return res.json({
    valid: true,
    user: req.user,
  })
})

export default router