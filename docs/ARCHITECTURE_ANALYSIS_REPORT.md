# SSB NextGen Pro - Complete Architecture Analysis Report

## Executive Summary

This report provides a comprehensive analysis of the SSB NextGen Pro project, which is a professional SSB (Services Selection Board) preparation platform. The project consists of two main components:

1. **`extensions`** - A Node.js/TypeScript backend API server for SSB dataset compilation and evaluation
2. **`ssb-nextgen-pro`** - A full-stack application with a Next.js frontend and Python backend

## 1. Project Structure Analysis

### 1.1 Extensions Workspace (Backend API)

```
extensions/
├── src/
│   ├── index.ts              # Dataset compilation entry point
│   ├── server.ts             # Main HTTP server (1342 lines)
│   ├── ai/                   # AI/Interview evaluation logic
│   │   ├── mockEvaluator.ts
│   │   ├── runSession.ts
│   │   ├── types.ts
│   │   ├── questionProviderStatic.ts
│   │   └── interviewStateMachine.ts
│   ├── lib/                  # Core datasets library
│   │   └── datasets/         # SSB test datasets
│   │       ├── tat.ts        # Thematic Apperception Test
│   │       ├── ppdt.ts       # Picture Perception & Description Test
│   │       ├── wat.ts        # Word Association Test
│   │       ├── srt.ts        # Situation Reaction Test
│   │       ├── sdt.ts        # Self Description Test
│   │       ├── oir.ts        # Officer Intelligence Rating
│   │       ├── css.ts        # Computerized Stage 1 Selection
│   │       ├── opam.ts       # OPAM Personality Assessment
│   │       ├── gto.ts        # Group Testing Officer tasks
│   │       ├── gtoSnakeRace.ts
│   │       ├── gtoIO.ts      # Individual Obstacles
│   │       ├── gdAgents.ts   # Group Discussion Agents
│   │       ├── lecturetteCards.ts
│   │       ├── interview.ts
│   │       ├── olq.ts        # Officer Like Qualities
│   │       └── defencePrepResources.ts
│   ├── wat/                  # WAT specific logic
│   │   ├── types.ts
│   │   ├── wordOrder.ts
│   │   ├── sessionStateMachine.ts
│   │   └── watScoring.ts
│   ├── gpe/                  # Group Planning Exercise
│   │   ├── types.ts
│   │   ├── datasets/
│   │   │   ├── types.ts
│   │   │   └── scenarios.ts
│   │   ├── sessionStateMachine.ts
│   │   └── gpeScoring.ts
│   ├── gto/                  # GTO Rules
│   │   └── rules.ts
│   ├── gd/                   # Group Discussion
│   │   ├── types.ts
│   │   ├── datasets/
│   │   │   └── topics.ts
│   │   ├── gdScoring.ts
│   │   ├── gdAgentsTypes.ts
│   │   └── gdAgentsScoring.ts
│   ├── oir/                  # OIR Test
│   │   └── sessionStateMachine.ts
│   ├── css/                  # Computerized Selection System
│   │   └── sessionStateMachine.ts
│   ├── opam/                 # OPAM Assessment
│   │   ├── opamBigFiveMapping.ts
│   │   └── sessionStateMachine.ts
│   ├── stage1/               # Stage 1 Combined (CSS + OPAM)
│   │   └── sessionStateMachine.ts
│   ├── ssb/                  # SSB Specific modules
│   │   ├── lecturette/
│   │   │   ├── types.ts
│   │   │   ├── scoring.ts
│   │   │   └── sessionStateMachine.ts
│   │   └── conference/
│   │       ├── types.ts
│   │       └── aggregation.ts
│   ├── medical/              # Medical pre-screening
│   │   └── standards.ts
│   ├── matchmaking/          # GD/GPE matchmaking
│   │   ├── persistence.ts
│   │   ├── redisMatchmaking.ts
│   │   ├── inMemoryMatchmaking.ts
│   │   └── inMemoryPersistence.ts
│   ├── platform/             # Platform utilities
│   │   ├── gamification.ts
│   │   └── percentiles.ts
│   └── security/             # Security middleware
│       └── waf.ts            # Web Application Firewall
├── assets/                   # Static assets
│   └── tat/                  # TAT images
├── dist-output/              # Compiled output
├── tmp/                      # Test payloads and smoke tests
├── package.json
└── tsconfig.json
```

### 1.2 SSB NextGen Pro Workspace

```
ssb-nextgen-pro/
├── frontend/                 # Next.js 16 frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx     # Dashboard
│   │   │   ├── api/         # API routes
│   │   │   ├── oir/         # OIR test pages
│   │   │   ├── vacha/       # Interview/GD pages
│   │   │   ├── mansa/       # Psychology test pages
│   │   │   ├── karmana/     # GTO simulation pages
│   │   │   ├── piq/         # PIQ pages
│   │   │   ├── practice/    # Practice pages
│   │   │   └── ...
│   │   ├── components/      # React components
│   │   │   ├── charts/      # Chart components
│   │   │   ├── chat/        # Chat components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── tests/       # Test components
│   │   │   └── ui/          # UI components
│   │   ├── data/            # Static JSON datasets
│   │   ├── lib/
│   │   │   ├── supabase/    # Supabase client
│   │   │   └── utils/       # Utilities
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # Python FastAPI backend
│   ├── main.py
│   ├── app/
│   └── requirements.txt
├── database/                 # Database schema and data
│   ├── schema.sql           # PostgreSQL/Supabase schema
│   ├── datasets/            # Dataset files
│   └── oir_master_bank.json
├── scripts/                  # Utility scripts
│   ├── seed_db.py
│   ├── generate_psychometric_datasets.py
│   └── ...
└── legacy-clone/            # Legacy frontend
```

## 2. Technology Stack Analysis

### 2.1 Extensions (Backend API)

| Category      | Technology                   |
| ------------- | ---------------------------- |
| Runtime       | Node.js (ES Modules)         |
| Language      | TypeScript 5.7.2             |
| Validation    | Zod 3.25.76                  |
| Caching/Queue | Redis (ioredis 5.4.1)        |
| Observability | OpenTelemetry 0.56.0         |
| HTTP Server   | Node.js native `http` module |

### 2.2 Frontend (Next.js)

| Category   | Technology                      |
| ---------- | ------------------------------- |
| Framework  | Next.js 16.2.4                  |
| UI Library | React 19.2.4                    |
| Styling    | Tailwind CSS 4                  |
| Charts     | Recharts, Plotly.js             |
| Icons      | Lucide React                    |
| Animation  | Framer Motion                   |
| Database   | Supabase (PostgreSQL)           |
| AI         | LangChain, Google Generative AI |

### 2.3 Backend (Python)

| Category  | Technology         |
| --------- | ------------------ |
| Framework | FastAPI (inferred) |
| Language  | Python             |

## 3. API Endpoints Analysis

### 3.1 Extensions Server Endpoints

| Endpoint                          | Method | Purpose                          |
| --------------------------------- | ------ | -------------------------------- |
| `/health`                         | GET    | Health check                     |
| `/assets/*`                       | GET    | Static asset serving             |
| `/api/medical/prescreen/evaluate` | POST   | Medical pre-screening evaluation |
| `/api/gd-gpe/matchmaking/enqueue` | POST   | Enqueue for GD/GPE matching      |
| `/api/gd-gpe/matchmaking/status`  | GET    | Get matchmaking status           |
| `/api/gd-gpe/matchmaking/token`   | POST   | Get room token after matching    |
| `/api/pi/mock-evaluate`           | POST   | Mock PI evaluation               |
| `/api/pi/session/init`            | POST   | Initialize PI session            |
| `/api/pi/session/submit`          | POST   | Submit PI session                |
| `/api/css/session/init`           | POST   | Initialize CSS session           |
| `/api/css/session/submit`         | POST   | Submit CSS answer                |
| `/api/stage1/session/init`        | POST   | Initialize Stage 1 session       |
| `/api/stage1/session/submit`      | POST   | Submit Stage 1 answer            |
| `/api/wat/session/init`           | POST   | Initialize WAT session           |
| `/api/wat/session/submit`         | POST   | Submit WAT response              |
| `/api/gpe/session/init`           | POST   | Initialize GPE session           |
| `/api/gpe/session/submit`         | POST   | Submit GPE plan                  |
| `/api/gto/rules/evaluate-gap`     | POST   | Evaluate GTO gap rules           |
| `/api/gto/rules/evaluate-color`   | POST   | Evaluate GTO color rules         |
| `/api/gto/snake-race/evaluate`    | POST   | Evaluate snake race task         |
| `/api/gto/io/evaluate`            | POST   | Evaluate Individual Obstacles    |
| `/api/oir/session/init`           | POST   | Initialize OIR session           |
| `/api/oir/session/submit`         | POST   | Submit OIR answers               |
| `/api/gd/topics/evaluate`         | POST   | Evaluate GD topic discussion     |

## 4. Architecture Patterns Identified

### 4.1 State Machine Pattern

The codebase extensively uses state machine pattern for session management:

- `sessionStateMachine.ts` files in each module
- States: `reading`, `writing`, `finished`, `running`, etc.
- Transitions triggered by user actions

### 4.2 Dataset Stub Pattern

Datasets are provided as "stubs" that can be replaced with real data:

- `buildTATDatasetStub()`
- `buildWATDatasetStub()`
- `buildOIRQuestionBankStub()`
- etc.

### 4.3 Dependency Injection

Session state machines accept `deps` parameter for extensibility:

```typescript
createInitialStateAndNext({ deps, config });
```

### 4.4 Schema Validation

Zod is used for runtime validation of:

- Request bodies
- Configuration objects
- Output schemas

## 5. Security Analysis

### 5.1 Current Security Measures

1. **WAF (Web Application Firewall)** - `src/security/waf.ts`
   - IP-based rate limiting (120 req/60s default)
   - Payload size limits (200KB default)
   - Bot user-agent detection
   - Session token validation (optional)
   - Protected path prefixes

2. **Input Validation**
   - Zod schemas for all API endpoints
   - Type-safe request/response handling

3. **Path Traversal Protection**
   - Asset serving validates paths against directory traversal

### 5.2 Security Gaps Identified

1. **No Authentication System**
   - No user authentication implemented
   - No session management
   - No JWT/token-based auth

2. **No Authorization/RBAC**
   - No role-based access control
   - No permission checking

3. **No CSRF Protection**
   - No CSRF tokens implemented

4. **No CORS Configuration**
   - Missing CORS headers

5. **No HTTPS Enforcement**
   - HTTP only, no TLS configuration

6. **Environment Variables**
   - No `.env` file handling
   - Hardcoded defaults for sensitive values

7. **Supabase Security**
   - Placeholder credentials in frontend
   - No Row Level Security (RLS) policies visible

## 6. Performance Analysis

### 6.1 Current Performance Characteristics

1. **In-Memory State**
   - Rate limit buckets stored in memory
   - Matchmaking can use in-memory or Redis

2. **Static Asset Serving**
   - Synchronous file reading (`readFileSync`)
   - No caching headers

3. **No Compression**
   - No gzip/brotli compression

4. **No Connection Pooling**
   - Basic HTTP server

### 6.2 Performance Bottlenecks

1. **Synchronous File Operations**
   - `readFileSync` blocks event loop

2. **No Caching Strategy**
   - Datasets loaded on every request

3. **No Database Connection Pooling**
   - If Supabase is used, no pooling configured

## 7. Type Safety Analysis

### 7.1 Strong Typing Areas

- Session state machines have well-defined types
- Dataset schemas are typed with Zod
- API request/response types are defined

### 7.2 Type Safety Gaps

- `z.any()` used in several places (e.g., CSS session state)
- Some imports use type assertions instead of proper typing
- Frontend uses `any` types in some components

## 8. Supabase Integration Analysis

### 8.1 Current Supabase Setup

**Frontend Client** (`lib/supabase/client.ts`):

```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
  );
}
```

### 8.2 Database Schema

The schema includes:

- `users` - User accounts
- `oir_tests` - OIR test definitions
- `test_results` - User test results
- `vacha_interview_bank` - Interview questions
- `vacha_gd_topics` - GD topics
- `mansa_scenarios` - Psychology scenarios
- `psych_submissions` - Psychology test submissions

### 8.3 Supabase Security Gaps

1. **No RLS Policies**
   - Schema doesn't include Row Level Security
   - Data access not restricted by user

2. **No Server-Side Client**
   - Only browser client configured
   - No SSR-safe auth handling

3. **Placeholder Credentials**
   - Fallback values expose misconfiguration

## 9. Code Quality Issues

### 9.1 Issues Found

1. **Large Server File**
   - `server.ts` is 1342 lines - should be split

2. **Duplicate Code**
   - Similar session init/submit patterns across modules
   - Could use a factory pattern

3. **Magic Numbers**
   - Hardcoded values for rates, sizes, timeouts

4. **Inconsistent Error Handling**
   - Some places use try/catch, others don't

5. **Missing Tests**
   - Only smoke test files in `tmp/`
   - No unit tests

## 10. Recommendations

### 10.1 Immediate Actions (High Priority)

1. **Implement Authentication**
   - Add Supabase Auth integration
   - Implement session management
   - Add protected routes

2. **Add Environment Configuration**
   - Create `.env.example`
   - Use environment variables for all secrets

3. **Implement RLS Policies**
   - Add Row Level Security to all tables
   - Restrict data access by user

4. **Split Large Files**
   - Break `server.ts` into route modules
   - Create middleware pipeline

### 10.2 Short-Term Actions (Medium Priority)

1. **Add Caching**
   - Redis caching for datasets
   - HTTP caching headers

2. **Implement Logging**
   - Structured logging
   - Request/response logging

3. **Add Rate Limiting**
   - Redis-backed rate limiting
   - Per-user rate limits

4. **Improve Error Handling**
   - Centralized error handler
   - Error codes and messages

### 10.3 Long-Term Actions (Low Priority)

1. **Add Monitoring**
   - Metrics collection
   - Alerting

2. **Implement CI/CD**
   - Automated testing
   - Deployment pipeline

3. **Add Documentation**
   - API documentation
   - Architecture diagrams

## 11. File Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         server.ts                                │
│                    (Main HTTP Server)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  WAF Module   │    │ Matchmaking   │    │  Session      │
│  (waf.ts)     │    │  Modules      │    │  State Machines│
└───────────────┘    └───────────────┘    └───────────────┘
                              │                     │
                              │                     │
        ┌─────────────────────┴─────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Dataset Library                             │
│                    (lib/datasets/*.ts)                           │
└─────────────────────────────────────────────────────────────────┘
```

## 12. Conclusion

The SSB NextGen Pro project has a solid foundation with well-structured state machines and dataset management. However, it lacks critical production features:

1. **Authentication & Authorization** - Must be implemented
2. **Environment Configuration** - Needs proper setup
3. **Database Security** - RLS policies required
4. **Code Organization** - Large files need refactoring
5. **Testing** - Comprehensive test suite needed

The recommended refactoring plan addresses these issues while maintaining backward compatibility and following enterprise-level standards.
