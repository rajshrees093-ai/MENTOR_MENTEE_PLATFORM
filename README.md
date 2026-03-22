# 🎓 1-on-1 Mentorship Platform

A real-time web-based mentorship platform where a mentor and student
can collaborate through live code editing, video calls, and chat —
all in one session.

---

## 🚀 Features

- 🔐 Authentication with role-based access (Mentor / Student)
- 📅 Session management (create, join, end sessions)
- 💻 Real-time collaborative code editor (Monaco + Socket.io)
- 📹 1-on-1 video calling (WebRTC)
- 💬 Session-based live chat
- 🔒 Protected routes and JWT middleware

---

## 🧠 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| Next.js (TypeScript) | React framework |
| Tailwind CSS | Styling |
| Monaco Editor | Code editor (VS Code in browser) |
| Socket.io Client | Real-time code + chat sync |
| Supabase JS | Auth + database client |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| Socket.io | Real-time WebSocket server |
| Supabase Admin | JWT verification + DB admin |
| WebRTC | Peer-to-peer video calling |

### Database & Infra
| Tech | Purpose |
|------|---------|
| Supabase (PostgreSQL) | Database + Auth + Storage |
| Vercel | Frontend deployment |
| Railway / Render | Backend deployment |

---

## 📁 Project Structure
```
MENTOR_MENTEE_PLATFORM/
├── README.md
├── frontend/                  # Next.js app
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/page.tsx     # Login
│   │   ├── signup/page.tsx    # Signup
│   │   ├── dashboard/page.tsx # Dashboard
│   │   └── session/[id]/      # Live session
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── supabaseClient.ts
│   └── middleware.ts
│
└── backend/                   # Express app
    └── src/
        ├── index.ts
        ├── lib/
        │   └── supabaseAdmin.ts
        ├── middleware/
        │   └── auth.ts
        └── routes/
            ├── auth.ts
            └── sessions.ts
```

---

## 🗃️ Database Schema

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | References auth.users |
| email | text | User email |
| role | text | 'mentor' or 'student' |
| full_name | text | Display name |
| created_at | timestamp | Auto-set on insert |

### sessions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| mentor_id | uuid | References profiles |
| student_id | uuid | References profiles |
| status | text | 'waiting', 'active', 'ended' |
| created_at | timestamp | Auto-set on insert |

### messages
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | References sessions |
| sender_id | uuid | References profiles |
| content | text | Message text |
| created_at | timestamp | Auto-set on insert |

---

## 🛣️ Development Roadmap

| Day | Feature | Status |
|-----|---------|--------|
| Day 1-2 | Project setup + Auth + Roles | ✅ Done |
| Day 3-5 | Session Management | 🔄 In Progress |
| Day 5-7 | Shared Code Editor | ⏳ Pending |
| Day 8-9 | Chat System | ⏳ Pending |
| Day 9-11 | Video Call (WebRTC) | ⏳ Pending |
| Day 11-12 | Integration + Edge Cases | ⏳ Pending |
| Day 13-14 | Deployment + Polish | ⏳ Pending |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- npm v9+
- Supabase account

### 1. Clone the repo
```bash
git clone https://github.com/rajshrees093-ai/MENTOR_MENTEE_PLATFORM
cd MENTOR_MENTEE_PLATFORM
```

### 2. Frontend setup
```bash
cd frontend
npm install
# create .env.local and add your Supabase keys
npm run dev
```

### 3. Backend setup
```bash
cd backend
npm install
# create .env and add your Supabase keys
npm run dev
```

### 4. Environment Variables

**frontend/.env.local**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**backend/.env**
```
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLIENT_URL=http://localhost:3000
```

---

## 🌐 Live Demo
> Coming after deployment

## 🎥 Demo Video
> Coming after project completion

## 👨‍💻 Author
Rajshree — building this as a portfolio project

## 📄 License
MIT