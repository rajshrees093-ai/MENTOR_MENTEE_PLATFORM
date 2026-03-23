// ============================================
// supabaseAdmin.ts
//
// Creates a Supabase client using the SECRET
// service role key.
//
// This client:
// - Bypasses Row Level Security (RLS)
// - Can read/write ANY row in ANY table
// - Verifies JWTs sent from the frontend
//
// ONLY use this on the backend server.
// NEVER expose service role key to frontend.
//
// Usage:
//   import { supabaseAdmin } from '../lib/supabaseAdmin'
// ============================================

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('❌ SUPABASE_URL missing in backend .env')
}

if (!supabaseServiceKey) {
  throw new Error('❌ SUPABASE_SERVICE_ROLE_KEY missing in backend .env')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // Don't auto-refresh tokens on backend
    autoRefreshToken: false,
    // Don't store session on backend
    persistSession: false,
  },
})