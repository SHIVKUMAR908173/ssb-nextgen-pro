# SSB NextGen Pro — Architecture

## Overview
SSB NextGen Pro is a modern web platform designed to prepare candidates for the Services Selection Board (SSB) interviews. The system follows a distributed microservices architecture consisting of a frontend interface, a core Node.js backend for standard business logic and real-time operations, and a specialized Python backend dedicated to AI-driven evaluations.

## System Components

### 1. Frontend (Next.js 16)
- **Framework:** Next.js with React 18, utilizing the App Router and Turbopack.
- **Styling:** Tailwind CSS with a comprehensive custom design system.
- **Authentication:** Integrated directly with Supabase Auth via `@supabase/ssr`.
- **State Management:** React hooks and context where appropriate; otherwise leaning on server components.
- **Hosting:** Vercel (Optimized edge delivery).

### 2. Backend Core (Node.js/Express)
- **Runtime:** Node.js 22
- **Language:** TypeScript
- **Responsibilities:**
  - Standard REST APIs (auth proxy, basic data fetches)
  - Real-time Matchmaking using WebSockets (for Group Planning Exercises/GDs)
  - OLQ (Officer Like Qualities) tracking endpoints
  - Integration with PostgreSQL (Supabase)
- **Hosting:** Render (Docker container).

### 3. Backend AI (Python/FastAPI)
- **Runtime:** Python 3.14
- **Framework:** FastAPI
- **Responsibilities:**
  - AI evaluations using Google Gemini API (`gemini-flash-latest`).
  - GTO Task Analysis, SRT (Situation Reaction Test), WAT (Word Association Test).
  - Acoustic Analysis using `librosa`.
  - Intelligence feed (Intel) aggregation.
- **Hosting:** Render (Docker container).

### 4. Database (Supabase / PostgreSQL)
- **Primary Store:** PostgreSQL hosted on Supabase.
- **Security:** Heavy reliance on Row Level Security (RLS) policies.
- **Tables:** `gto_progress`, `gto_sessions`, user profiles, etc.

### 5. Caching & Message Broker
- **Technology:** Redis.
- **Usage:** Rate limiting (via `slowapi`), WebSockets/Matchmaking state. (Has in-memory fallback if disabled).

## Data Flow
1. User interacts with the Next.js frontend.
2. Next.js server components/actions authenticate the user via Supabase cookies.
3. Standard data requests flow to `backend-core`.
4. Requests requiring heavy AI inference (e.g., submitting a psychological test) are routed to `backend-ai`.
5. `backend-ai` queries Google Gemini, formats the evaluation, and persists progress to Supabase.
6. The frontend polls or receives real-time updates of the evaluation results.

## Key Design Principles
- **Separation of Concerns:** AI workloads are isolated from core API traffic to prevent blocking the event loop in Node.js.
- **Graceful Degradation:** Redis is optional. Mock/dummy data fallbacks are removed in production in favor of proper error handling.
- **Security First:** Strict rate-limiting, CORS validation, and RLS on the database.
