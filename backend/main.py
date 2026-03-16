from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# App iinstance creation
app = FastAPI(
    title="AI Interviewer",
    description="Generates interview questions based on role, experience, and tech stack",
    version="1.0.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"]
)

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

# ── 5. Hardcoded question bank ───────────────────────────────
# Stage 1 keeps it simple: a fixed dictionary of questions.
# Stage 2 will replace this with a real AI call.
HARDCODED_QUESTIONS = {
    "beginner": [
        "What is the difference between a list and a tuple in Python?",
        "Explain what an API is in simple terms.",
        "What is version control and why is it important?",
        "What does HTTP stand for, and what is a status code?",
        "What is the difference between GET and POST requests?",
    ],
    "intermediate": [
        "How does dependency injection work, and why is it useful?",
        "Explain the difference between synchronous and asynchronous code.",
        "What is database indexing and when would you use it?",
        "How would you handle authentication in a REST API?",
        "Describe the MVC pattern and its benefits.",
    ],
    "advanced": [
        "How do you design a system that handles 1 million requests per second?",
        "Explain the CAP theorem and its trade-offs.",
        "What strategies do you use to debug a memory leak in production?",
        "How would you architect a microservices system from a monolith?",
        "Describe how you approach database schema migrations with zero downtime.",
    ],
}

# ── 6. Health-check endpoint ─────────────────────────────────
# A simple GET endpoint so we can verify the server is alive.
# Visit http://localhost:8000/ in your browser to test it.
@app.get("/")
def root():
    return {"message": "Interview Questions Generator API is running!!" }

@app.post("/generate-questions", response_model=QuestionResponse)
def generateQuestions(request: QuestionRequest):
    # Log the incoming request to the terminal
    print(f"[REQUEST] role={request.job_role!r}"
          f"level={request.experience_level}!r"
          f"stack={request.tech_stack}!r")
    
    return QuestionResponse(
        job_role = request.job_role,
        experience_level = request.experience_level,
        tech_stack = request.tech_stack,
        beginner_questions = HARDCODED_QUESTIONS["beginner"],
        intermediate_questions = HARDCODED_QUESTIONS["intermediate"],
        advanced_questions = HARDCODED_QUESTIONS["advanced"]
    )