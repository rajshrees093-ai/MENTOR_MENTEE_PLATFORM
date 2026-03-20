'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'mentor' | 'student'>('student')
  const [error, setError] = useState('')

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }  // stored in raw_user_meta_data → trigger picks it up
    })
    if (error) return setError(error.message)
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-semibold">Sign Up</h1>
      <input className="border p-2 rounded" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 rounded" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <select className="border p-2 rounded" value={role} onChange={e => setRole(e.target.value as any)}>
        <option value="student">Student</option>
        <option value="mentor">Mentor</option>
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button className="bg-blue-600 text-white py-2 rounded" onClick={handleSignup}>Create account</button>
    </div>
  )
}
