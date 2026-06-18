1 # SSB NextGen Pro - Localhost Fullstack Setup Guide

## ✅ Application Successfully Running on Localhost!

Your fullstack SSB NextGen Pro application is now running on localhost with the following configuration:

### 🌐 Services Running

1. **Frontend (Next.js 16)**
   - **URL:** http://localhost:3000
   - **Framework:** Next.js 16.2.4 with Turbopack
   - **Status:** ✅ Running

2. **Backend API (FastAPI)**
   - **URL:** http://localhost:8000
   - **API Endpoint:** http://localhost:8000/api/v1
   - **Framework:** FastAPI with Uvicorn
   - **Status:** ✅ Running

3. **Database**
   - **Provider:** Supabase (PostgreSQL)
   - **URL:** https://oexyteyhyefabiecizfw.supabase.co
   - **Status:** ✅ Connected

### 🚀 How to Start the Application

#### Terminal 1: Start Backend API

```bash
cd backend-ai
python main.py
```

The backend will start on http://localhost:8000

#### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:3000

### ⚙️ Environment Configuration

#### Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://oexyteyhyefabiecizfw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ENABLE_AUTH=false
NEXT_PUBLIC_ENABLE_MATCHMAKING=false
```

#### Backend (.env)

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://oexyteyhyefabiecizfw.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ENABLE_AUTH=false
```

### 🔧 Key Features Available

- **SSB Preparation Modules:** TAT, WAT, SRT, PPDT, GPE, OIR
- **AI-Powered Assessment:** Brigadier AI for interview simulation
- **OLQ Tracking:** Officer-Like Qualities assessment and tracking
- **Real-time Features:** WebSocket integration for virtual interviews
- **Progress Analytics:** Charts and reports for performance tracking

### 📊 Testing the Setup

1. **Test Backend Health:**

   ```bash
   curl http://localhost:8000/health
   ```

   Expected: `{"status": "healthy"}`

2. **Test Backend Root:**

   ```bash
   curl http://localhost:8000/
   ```

   Expected: `{"message": "Welcome to SSB NextGen API", "status": "operational"}`

3. **Test Frontend:**
   - Open browser: http://localhost:3000
   - Should see the SSB NextGen Pro homepage

### 🔗 API Documentation

Once the backend is running, you can access interactive API documentation at:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### 🛠️ Troubleshooting

#### Frontend Issues

- **Supabase URL Error:** Ensure `.env.local` has valid Supabase credentials
- **Port Already in Use:** Change port in `package.json` or kill the process using port 3000
- **Module Not Found:** Run `npm install` in the frontend directory

#### Backend Issues

- **Module Not Found (asyncpg):** Run `pip install asyncpg`
- **Port Already in Use:** Change port in `main.py` or kill the process using port 8000
- **Database Connection Error:** Verify Supabase credentials in `.env`

### 📝 Important Notes

1. **Environment Variables:** Never commit `.env` or `.env.local` files to version control
2. **Supabase Setup:** The current setup uses a pre-configured Supabase instance
3. **Development Mode:** Both services run in development mode with hot-reload enabled
4. **CORS Configuration:** Backend is configured to accept requests from http://localhost:3000

### 🔄 Stopping the Application

- **Frontend:** Press `Ctrl+C` in the frontend terminal
- **Backend:** Press `Ctrl+C` in the backend terminal

### 📦 Dependencies

#### Frontend (package.json)

- Next.js 16.2.4
- React 19.2.4
- TypeScript
- Tailwind CSS
- Supabase JS Client
- Recharts, Plotly, Three.js for visualizations

#### Backend (requirements.txt)

- FastAPI
- Uvicorn
- SQLAlchemy
- Psycopg2-binary
- Google GenAI
- Librosa (audio processing)
- Pydantic

---

**🎉 Your fullstack SSB NextGen Pro application is ready for development!**

For more information, refer to:

- Main README: `../ssb-nextgen-pro/README.md`
- OLQ Tracking Guide: `../ssb-nextgen-pro/docs/OLQ_TRACKING_SYSTEM.md`
- Brigadier AI Guide: `../ssb-nextgen-pro/docs/BRIGADIER_AI_GUIDE.md`
