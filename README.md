# SSB NextGen Pro - The Ultimate SSB Assessment Platform 🎯

**SSB NextGen Pro** is the world's most advanced, AI-driven preparation platform for the Services Selection Board (SSB) interviews. Designed with a strict military aesthetic and state-of-the-art evaluation pipelines, it provides an unparalleled environment for defense aspirants to test, analyze, and perfect their Officer Like Qualities (OLQs).

## 🌟 Core Modules

### 🧠 Pragya (Intelligence & Study Hub)
Comprehensive study architecture containing categorized syllabus modules for SSB:
- OIR (Officer Intelligence Rating) - Verbal and Non-Verbal Simulator
- PPDT Picture Perception and Discussion Test concepts
- Current Affairs and Military Knowledge Hub

### ⚔️ Karmana (GTO & Field Assessment)
A dedicated environment simulating the physical and tactical aspects of SSB testing:
- **3D Virtual GTO Ground**: Interactive Group Testing Officer tasks.
- **GPE (Group Planning Exercise)**: Highly complex scenarios requiring spatial planning and resource allocation.
- **CPSS Simulator**: Stage-1 synthetic testing for the Computerized Pilot Selection System.
- Individual Obstacles (IO) and Group Tasks simulations.

### 👁️ Mansa (Psychological Battery)
A strict, time-bound psychological assessment engine mimicking the real board pressure:
- **WAT**: Word Association Test with millisecond timing.
- **TAT**: Thematic Apperception Test with synthetic image banks.
- **SRT**: Situation Reaction Test scaling in difficulty based on candidate response.
- **Self Description**: Evaluated using advanced "Authenticity Auditing."

### 🗣️ Vacha (Interview & Communication)
- **Personal Interview**: Live simulation routing candidates to our Brigadier AI Assessor.
- **Lecturette**: Prompt generation and feedback loop for public speaking.

## 🤖 The Brigadier AI Assessor

At the heart of SSB NextGen Pro lies a multi-agent orchestration pipeline powered by Gemini API and custom Python state machines. 

- **OLQ Mapping**: Every response (whether in WAT, Interview, or GPE) is dynamically mapped to the 15 Officer Like Qualities.
- **Red Flag Detection**: Actively scans for inconsistencies, lack of courage, or poor social adaptability.
- **Adaptive Questioning**: Automatically generates stress-test questions, depth probes, and ethical dilemmas based on the candidate's psych profile.

## 📁 Architecture

The project is structured into highly scalable microservices:

- **`frontend/`**: Next.js 16 (App Router) with Tailwind CSS. Incorporates complex state management for simulators and anti-cheat mechanisms.
- **`backend-core/`**: Node.js/Express server handling core routing and state persistence.
- **`backend-ai/`**: FastAPI (Python) high-performance AI engine responsible for processing candidate responses and communicating with the Gemini API.

## 🚀 Getting Started

### 1. Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### 2. Core Backend Development
```bash
cd backend-core
npm install
npm run dev
```

### 3. AI Assessor (Python)
```bash
cd backend-ai
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

---
*Developed to forge the next generation of defense leaders.* 🇮🇳
