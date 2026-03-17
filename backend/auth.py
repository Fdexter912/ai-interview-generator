import os 
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from models import User

# JWT config read from .env
JWT_SECRET = os.getenv("JWT_SECRET", "fallback-secret-change-this")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# ── Password hashing ──────────────────────────────────────────
# CryptContext handles hashing and verification.
# bcrypt is the industry standard — it's slow by design,
# which makes brute-force attacks impractical.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain_password: str) -> str:
    """Convert plain text password to bcrypt hash."""
    return pwd_context.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if a plain password matches its stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

# JWT token creation
def create_access_token(data: dict):
    """
    Create a signed JWT token.
    'sub' (subject) is the standard JWT claim for the user identifier.
    'exp' (expiry) automatically invalidates old tokens.
    """
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

# ── JWT token verification ────────────────────────────────────
# HTTPBearer reads the 'Authorization: Bearer <token>' header
bearer_scheme = HTTPBearer()

def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
        db: Session = Depends(get_db)
) -> User:
    """
    FastAPI dependency — validates the JWT token on every
    protected route. Use by adding:
        current_user: User = Depends(get_current_user)
    to any endpoint function signature.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token.",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        # Decode and verify the token signature
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET,
            algorithms=[ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    # Look up the user in the database
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user