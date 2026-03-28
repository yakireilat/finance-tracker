import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_register_and_login():
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

    response = client.post("/auth/register", json={
        "email": unique_email,
        "password": "TestPass123",
        "full_name": "Test User"
    })
    assert response.status_code == 200
    assert "email" in response.json()

    response = client.post("/auth/login", data={
        "username": unique_email,
        "password": "TestPass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()