# ============================================================
# test_main.py — Basic API tests
# CI will run these before building the Docker image.
# If any test fails, the pipeline stops — no broken image
# gets built or deployed.
# ============================================================

from fastapi.testclient import TestClient
from main import app

# TestClient lets us make requests to FastAPI without
# actually starting a server — perfect for testing
client = TestClient(app)

def test_health_check():
    """The root endpoint should always return 200."""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_register_missing_fields():
    """Registration without fields should return 422."""
    response = client.post("/register", json={})
    assert response.status_code == 422

def test_login_wrong_credentials():
    """Login with bad credentials should return 401."""
    response = client.post("/login", json={
        "email": "nobody@nowhere.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_generate_questions_no_auth():
    """Protected endpoint without token should return 403."""
    response = client.post("/generate-questions", json={
        "job_role": "Developer",
        "experience_level": "junior",
        "tech_stack": "Python"
    })
    # 403 (no auth header) or 401 (bad token) — both are correct
    assert response.status_code in [401, 403]
