# SSB NextGen - Professional Preparation Platform

This is the professional implementation of the SSB Preparation Platform (SSB NextGen), structured into modular components for scalability and maintainability.

## 📁 Project Structure

- **`frontend/`**: Next.js 14+ application with Tailwind CSS and Lucide icons.
  - Built with TypeScript for type safety.
  - Modern App Router architecture.
  - **New**: Live WebSocket integration for real-time virtual interviews.
- **`backend/`**: FastAPI (Python 3.12+) high-performance AI backend.
  - **Multi-Agent Orchestration**: Specialized agents for interview logic and psych-evaluation.
  - **Acoustic Telemetry**: Real-time DSP for pitch stability and confidence analysis.
  - **Psych Engine**: OLQ (Officer-Like Qualities) scoring logic.
- **`database/`**: SQL schemas and specialized psychometric datasets.
  - **Datasets**: Structured JSON repositories for WAT, SRT, SDT, and PIQ-CIQ mapping.
- **`scripts/`**: Utility scripts for data generation, dataset merging, and AI model seeding.

## 🚀 Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## 🛠 Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons, CLSX.
- **Backend**: Python, FastAPI, SQLAlchemy, Uvicorn.
- **Database**: PostgreSQL / Supabase.
- **Design**: Professional Dark Tactical UI.

---
*Developed as part of the SSB NextGen modern preparation ecosystem.*
