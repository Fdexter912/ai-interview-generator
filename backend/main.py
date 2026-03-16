import os
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.output_parser import StrOutputParser

from prompts import INTERVIEW_PROMPT_TEMPLATE


# load the env file
load_dotenv()

# Validate if key exists at startup
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY not found. Please check if you created an env file with the API key.")

# App iinstance creation
app = FastAPI(
    title="AI Interviewer",
    description="Generates interview questions based on role, experience, and tech stack",
    version="2.0.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"]
)

# ── Gemini LLM setup ─────────────────────────────────────────
# gemini-2.0-flash is fast and completely free on the free tier
# temperature=0.7 means slightly creative but not too random
# (0.0 = deterministic, 1.0 = very creative)
llm = ChatGoogleGenerativeAI(
    model = "gemini-2.5-flash",
    temperature = 0.7
)

# ── LangChain pipeline (called a "chain") ────────────────────
# The | operator pipes output from one step into the next:
#   1. INTERVIEW_PROMPT_TEMPLATE  → fills in {job_role} etc.
#   2. llm                        → sends prompt to Gemini
#   3. StrOutputParser()          → extracts raw text from response
#
# This is called an LCEL chain (LangChain Expression Language)
chain = INTERVIEW_PROMPT_TEMPLATE | llm | StrOutputParser()

# ── 3. Request model ─────────────────────────────────────────
# Pydantic BaseModel validates incoming JSON automatically.
# If a required field is missing or the wrong type, FastAPI
# returns a clear 422 error before your code even runs.
class QuestionRequest(BaseModel) :
    job_role: str
    experience_level:  str
    tech_stack: str

# ── 4. Response model ────────────────────────────────────────
# Defines the exact shape of data we send back to the client.
class QuestionResponse(BaseModel):
    job_role: str
    experience_level: str
    tech_stack: str
    beginner_questions: list[str]
    intermediate_questions: list[str]
    advanced_questions: list[str]

# ── 6. Health-check endpoint ─────────────────────────────────
# A simple GET endpoint so we can verify the server is alive.
# Visit http://localhost:8000/ in your browser to test it.
@app.get("/")
def root():
    return {"message": "Interview Questions Generator API is running!!" }

@app.post("/generate-questions", response_model=QuestionResponse)
async def generateQuestions(request: QuestionRequest):
    """
    Calls Gemini via LangChain to generate interview questions.
    The chain fills in the prompt template, sends it to Gemini,
    and returns the raw text. We then parse that text as JSON.
    """
    try:
        print(f"[REQUEST] role={request.job_role!r}"
            f"level={request.experience_level}!r"
            f"stack={request.tech_stack}!r")
        
        # ── Step 1: Run the LangChain chain ──────────────────
        # .ainvoke() is the async version of .invoke()
        # Always use async (ainvoke) inside FastAPI endpoints
        raw_output = await chain.ainvoke({
            "job_role": request.job_role,
            "experience_level": request.experience_level,
            "tech_stack": request.tech_stack
        })

        print(f"[RAW OUTPUT] {raw_output}...")         # preview first 200 chars

        # ── Step 2: Clean the output ─────────────────────────
        # Gemini sometimes wraps JSON in markdown code fences
        # like ```json ... ``` even when told not to.
        # This strips those out before parsing.
        cleaned = raw_output.strip()
        if cleaned.startswith("```"):
            # Remove first line (```json) and last line (```)
            lines = cleaned.split("\n")
            cleaned = "\n".join(lines[1:-1])

        # ── Step 3: Parse JSON ───────────────────────────────
        questions = json.loads(cleaned)

        # ── Step 4: Return structured response ───────────────
        return QuestionResponse(
            job_role = request.job_role,
            experience_level = request.experience_level,
            tech_stack = request.tech_stack,
            beginner_questions = questions.get("beginner_questions", []),
            intermediate_questions = questions.get("intermediate_questions", []),
            advanced_questions = questions.get("advanced_questions", [])
        )

    except json.JSONDecodeError as e:
        # The LLM returned something that wasn't valid JSON
        print(f"[JSON ERROR] {e}\nRaw output was:\n{raw_output}")
        raise HTTPException(
            status_code=500,
            detail="AI returned malformed JSON. Try again."
        )
    except Exception as e:
        # Any other error (network, API key, quota, etc.)
        print(f"[ERROR] {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong: {str(e)}"
        )
        