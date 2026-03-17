# ============================================================
# main.py — Stage 5: richer response model + seniority context
# ============================================================

import os
import json

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.output_parser import StrOutputParser

from database import engine, get_db, Base
from models import User
from auth import (
    hash_password, verify_password,
    create_access_token, get_current_user
)

from prompts import INTERVIEW_PROMPT_TEMPLATE, SENIORITY_CONTEXT

load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY not found. Did you create a .env file?")

# ── Create database tables on startup ────────────────────────
# This reads all models that inherit from Base and creates
# their tables if they don't already exist. Safe to run
# every time — it won't drop existing tables.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Interview Question Generator",
    description="Generates rich interview questions using Google Gemini",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
)

chain = INTERVIEW_PROMPT_TEMPLATE | llm | StrOutputParser()

# ── Auth request/response models ─────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ── Question model ─────────────────────────────────────────────
class QuestionRequest(BaseModel):
    job_role: str
    experience_level: str
    tech_stack: str

# ── Rich question model ───────────────────────────────────────
# Each question is now an object, not just a plain string.
# Pydantic validates that every field is present and is a string.
class RichQuestion(BaseModel):
    question: str
    hint: str
    what_interviewer_looks_for: str
    follow_up: str

# ── Response model ────────────────────────────────────────────
class QuestionResponse(BaseModel):
    job_role: str
    experience_level: str
    tech_stack: str
    beginner_questions: list[RichQuestion]
    intermediate_questions: list[RichQuestion]
    advanced_questions: list[RichQuestion]

# ── Health check ──────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "AI Interview Question Generator v3 is running!"}

# ── Register ──────────────────────────────────────────────────
@app.post("/register", status_code=201)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    print(f"[REGISTER] email={request.email!r} password_len={len(request.password)}")
    # Check if email exists already
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    # Validate password length
    if(len(request.password) < 6):
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Hash the password and save the user
    user = User(
        email = request.email,
        hashed_password = hash_password(request.password)  
    )

    db.add(user)
    db.commit()

    return {"message": "Account created successfully"}

# ── Login ─────────────────────────────────────────────────────
@app.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Look up the user in the DB
    user = db.query(User).filter(User.email == request.email).first()

    # Check both existence and password in one step to avoid
    # leaking information about whether an email exists
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    # Create and return the JWT token
    token = create_access_token({"sub": user.email})
    return TokenResponse(access_token=token)

# ── Main endpoint ─────────────────────────────────────────────
@app.post("/generate-questions", response_model=QuestionResponse)
async def generate_questions(request: QuestionRequest):

    # ── Look up seniority context ────────────────────────────
    # Default to "mid" context if an unexpected level is passed
    seniority_context = SENIORITY_CONTEXT.get(
        request.experience_level.lower(),
        SENIORITY_CONTEXT["mid"]
    )

    print(f"[REQUEST] role={request.job_role!r} "
          f"level={request.experience_level!r} "
          f"stack={request.tech_stack!r}")

    try:
        # ── Run the chain ────────────────────────────────────
        raw_output = await chain.ainvoke({
            "job_role": request.job_role,
            "experience_level": request.experience_level,
            "tech_stack": request.tech_stack,
            "seniority_context": seniority_context,
        })

        print(f"[RAW OUTPUT PREVIEW] {raw_output[:300]}...")

        # ── Clean markdown fences if present ─────────────────
        cleaned = raw_output.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            cleaned = "\n".join(lines[1:-1])

        # ── Parse JSON ───────────────────────────────────────
        data = json.loads(cleaned)

        # ── Convert each dict to a RichQuestion object ───────
        # Pydantic can parse a dict directly with model_validate()
        def parse_questions(raw_list: list) -> list[RichQuestion]:
            return [RichQuestion.model_validate(q) for q in raw_list]

        return QuestionResponse(
            job_role=request.job_role,
            experience_level=request.experience_level,
            tech_stack=request.tech_stack,
            beginner_questions=parse_questions(data.get("beginner", [])),
            intermediate_questions=parse_questions(data.get("intermediate", [])),
            advanced_questions=parse_questions(data.get("advanced", [])),
        )

    except json.JSONDecodeError as e:
        print(f"[JSON ERROR] {e}\nRaw:\n{raw_output}")
        raise HTTPException(
            status_code=500,
            detail="AI returned malformed JSON. Please try again."
        )
    except Exception as e:
        print(f"[ERROR] {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong: {str(e)}"
        )