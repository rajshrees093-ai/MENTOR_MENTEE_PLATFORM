// ============================================
// index.ts — Express App Entry Point
//
// Sets up:
// - CORS (allows requests from frontend)
// - JSON body parsing
// - All API routes
// - 404 handler
// - Starts the server
//
// Current Routes:
//   GET  /health             → server status check
//   GET  /api/auth/me        → get my profile
//   GET  /api/auth/verify    → verify JWT token
//
// Routes added in future days:
//   Day 3: /api/sessions     → session management
//   Day 5: Socket.io         → real time code sync
//   Day 8: /api/messages     → chat messages
// ============================================

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'

// Load .env file variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// ─── Global Middleware ────────────────────────────────────────────────────────

// Allow requests from our frontend URL
// credentials: true allows cookies and auth headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

// Parse incoming JSON request bodies
// Lets us read req.body in route handlers
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check — visit this to confirm backend is running
// Try: http://localhost:4000/health
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: '✅ Mentorship backend is running',
    timestamp: new Date().toISOString(),
  })
})

// Auth routes
// /api/auth/me
// /api/auth/verify
app.use('/api/auth', authRoutes)

// ─── 404 Handler ──────────────────────────────────────────────────────────────

// Catch any requests to routes that don't exist
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('')
  console.log('🚀 Mentorship Backend Started')
  console.log(`📡 Server      → http://localhost:${PORT}`)
  console.log(`❤️  Health      → http://localhost:${PORT}/health`)
  console.log(`🔐 Auth/me     → http://localhost:${PORT}/api/auth/me`)
  console.log(`✅ Auth/verify  → http://localhost:${PORT}/api/auth/verify`)
  console.log('')
})

export default app