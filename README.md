# InterviewForge — AI-Powered Interview Question Generator

A full-stack AI application that generates structured, role-specific interview questions using Google Gemini. Built with FastAPI, React, LangChain, and deployed on Render with a fully automated CI/CD pipeline.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Docker](https://img.shields.io/badge/Docker-containerized-2496ED?logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions)

## Live Demo

- **App:** https://ai-interview-generator-o8ml.onrender.com
- **API Docs:** https://interview-backend-latest.onrender.com/docs

---

## Overview

InterviewForge takes a job role, experience level, and tech stack as input and returns structured interview questions across three difficulty tiers — each with contextual hints, evaluation criteria, and follow-up probes — generated dynamically by Google Gemini via an engineered LangChain prompt pipeline.

---

## Architecture

```
┌─────────────────┐     HTTPS      ┌──────────────────┐     LangChain    ┌──────────────┐
│  React Frontend │ ─────────────► │  FastAPI Backend │ ───────────────► │ Gemini 2.0   │
│  Vite + CSS     │ ◄───────────── │  JWT Auth + ORM  │ ◄─────────────── │ Flash (AI)   │
└─────────────────┘   JSON resp    └──────────────────┘   structured JSON └──────────────┘
       │                                    │
  Render Static                     Render Web Service
    Hosting                          + SQLite DB
```

### CI/CD Pipeline

```
git push origin main
       │
       ▼
GitHub Actions
  ├── Job 1: pytest          (backend unit tests)
  ├── Job 2: npm build       (frontend verification)
  └── Job 3: docker build    (only if 1 + 2 pass)
       │
       ▼
Push to Docker Hub
  ├── tagged: latest
  └── tagged: sha-{commit}
       │
       ▼
Render deploy hook → zero-downtime redeploy
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS custom properties |
| Backend | Python 3.11, FastAPI, Uvicorn |
| AI | LangChain LCEL, Google Gemini 2.0 Flash |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Database | SQLite, SQLAlchemy 2.0 |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Registry | Docker Hub |
| Hosting | Render (backend + frontend) |

---

## Features

- **AI question generation** — role-specific questions at beginner, intermediate, and advanced tiers
- **Rich question format** — each question includes a hint, what the interviewer is evaluating, and a follow-up probe
- **JWT authentication** — register/login with bcrypt-hashed passwords, stateless token auth on all protected endpoints
- **Dark/light mode** — animated gradient backgrounds, glassmorphism UI, full theme switching via CSS variables
- **Automated CI/CD** — tests run on every push, Docker images built and deployed on every merge to main
- **Prompt engineering** — persona assignment, strict JSON output contracts, seniority calibration, chain-of-thought anchoring

---

## Project Structure

```
ai-interview-generator/
├── .github/
│   └── workflows/
│       ├── ci.yml              # test + build on every push
│       └── cd.yml              # push images + deploy on main
│
├── backend/
│   ├── main.py                 # FastAPI app, endpoints, auth routes
│   ├── auth.py                 # JWT creation/verification, password hashing
│   ├── database.py             # SQLAlchemy engine + session factory
│   ├── models.py               # User ORM model
│   ├── prompts.py              # LangChain prompt templates
│   ├── test_main.py            # pytest test suite
│   ├── Dockerfile
│   ├── .dockerignore
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # root component, auth state, API calls
│   │   ├── main.jsx            # entry point
│   │   ├── index.css           # theme variables, gradient backgrounds
│   │   └── components/
│   │       ├── Header.jsx      # brand + dark mode toggle + logout
│   │       ├── AuthPage.jsx    # login/register form
│   │       ├── InputForm.jsx   # job role/level/stack inputs
│   │       └── QuestionCard.jsx # expandable question cards
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml          # local multi-container dev setup
└── .gitignore
```

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker Desktop (optional, for container testing)
- Google Gemini API key — [get one free](https://aistudio.google.com/apikey)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate        # macOS/Linux
.venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your keys

# Start the server
uvicorn main:app --reload
# API available at http://localhost:8000
# Swagger UI at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# App available at http://localhost:5173
```

### Environment Variables

Create `backend/.env`:

```env
GOOGLE_API_KEY=your-gemini-api-key
JWT_SECRET=your-long-random-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173
```

> **Never commit `.env` to version control.**

---

## Running with Docker Compose

```bash
# From project root
docker-compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

---

## Running Tests

```bash
cd backend
pytest test_main.py -v
```

```
test_main.py::test_health_check                  PASSED
test_main.py::test_register_missing_fields       PASSED
test_main.py::test_login_wrong_credentials       PASSED
test_main.py::test_generate_questions_no_auth    PASSED
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Health check |
| POST | `/register` | No | Create account |
| POST | `/login` | No | Returns JWT token |
| POST | `/generate-questions` | Bearer token | Generate interview questions |

### Example Request

```bash
curl -X POST https://interview-backend-latest.onrender.com/generate-questions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_role": "Backend Developer",
    "experience_level": "senior",
    "tech_stack": "Python, FastAPI, PostgreSQL, Redis"
  }'
```

### Example Response

```json
{
  "job_role": "Backend Developer",
  "experience_level": "senior",
  "tech_stack": "Python, FastAPI, PostgreSQL, Redis",
  "beginner_questions": [
    {
      "question": "Explain the difference between a list and a tuple in Python.",
      "hint": "Think about mutability and use cases.",
      "what_interviewer_looks_for": "Understanding of core Python data structures.",
      "follow_up": "When would you use a named tuple instead?"
    }
  ],
  "intermediate_questions": [...],
  "advanced_questions": [...]
}
```

---

## Deployment

### CI/CD Setup

The pipeline requires these GitHub Secrets:

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (Read/Write/Delete) |
| `VITE_API_URL` | Production backend URL |
| `RENDER_BACKEND_DEPLOY_HOOK` | Render backend deploy hook URL |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Render frontend deploy hook URL |

### Manual Deployment

```bash
# Build and push images
docker build -t fahamaabdulrehman/interview-backend:latest ./backend
docker build -t fahamaabdulrehman/interview-frontend:latest ./frontend
docker push fahamaabdulrehman/interview-backend:latest
docker push fahamaabdulrehman/interview-frontend:latest
```

---

## Prompt Engineering

The question generation prompt uses five techniques:

**Persona assignment** — the model is instructed to act as a senior staff engineer with 15+ years of interviewing experience, which measurably improves output quality.

**Output contract** — the prompt specifies the exact JSON schema including field names and types. This eliminates freeform parsing and makes the pipeline deterministic.

**Seniority calibration** — each experience level is explicitly defined (years of experience, expected depth, topic boundaries) rather than left to the model's interpretation.

**Negative constraints** — explicit rules about what NOT to include (no numbering inside strings, no markdown fences, no text outside the JSON) reduce post-processing edge cases.

**Chain-of-thought anchoring** — requiring `what_interviewer_looks_for` before the question forces the model to reason about evaluation criteria first, which improves question relevance.

---

## License

MIT
