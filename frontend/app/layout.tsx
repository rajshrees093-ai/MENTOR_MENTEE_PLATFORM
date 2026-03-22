// ============================================
// layout.tsx — Root Layout
//
// This wraps EVERY page in the app.
//
// By putting AuthProvider here, every single
// page automatically has access to useAuth()
// without any extra setup needed.
//
// Think of this as the "shell" of the app —
// navbar, fonts, global styles all go here.
// ============================================

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mentorship Platform',
  description: '1-on-1 live coding sessions with your mentor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/*
          AuthProvider wraps everything.
          Now any page can call useAuth()
          to get user, profile, loading, logout.
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}