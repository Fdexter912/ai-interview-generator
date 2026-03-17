# ============================================================
# database.py — SQLite database setup using SQLAlchemy
# SQLite is a file-based database — perfect for this project.
# In production you'd swap this for PostgreSQL.
# ============================================================

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite file will be created at backend/interview_app.db
DATABASE_URL = "sqlite:///./interview_app.db"

# create_engine sets up the connection to the database.
# check_same_thread=False is required for SQLite with FastAPI
# because FastAPI handles requests across multiple threads.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# SessionLocal is a factory for database sessions.
# Each request gets its own session, uses it, then closes it.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base is the parent class for all our database models.
Base = declarative_base()

# ── Dependency ────────────────────────────────────────────────
# FastAPI calls this function to get a DB session for each
# request. The 'yield' makes it a context manager — the session
# is automatically closed after the request finishes.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()