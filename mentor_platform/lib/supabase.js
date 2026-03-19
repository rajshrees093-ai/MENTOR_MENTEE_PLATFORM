import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqaXRpYm9ieWFkZnRodGdsemxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjQwNDcsImV4cCI6MjA4OTUwMDA0N30.U7pzX2sls0hltcvsskE5QO4zzHPsyH9ASgFl70TPJMw"
const supabaseKey = "YOUR_ANON_KEY"

export const supabase = createClient(supabaseUrl, supabaseKey)