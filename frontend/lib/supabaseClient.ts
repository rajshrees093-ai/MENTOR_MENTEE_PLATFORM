// ============================================
// supabaseClient.ts
//
// Creates and exports a single Supabase client
// instance for use across the entire frontend.
//
// Uses the ANON key — safe to use in the browser.
//
// Import this in any file that needs to:
// - Sign up / login users
// - Query the database
// - Listen to realtime changes
//
// Usage:
//   import { supabase } from '@/lib/supabaseClient'
// ============================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// These throw clearly if .env.local is missing or wrong
if (!supabaseUrl) {
  throw new Error(
    '❌ NEXT_PUBLIC_SUPABASE_URL is missing. Check your frontend/.env.local file.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    '❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Check your frontend/.env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)