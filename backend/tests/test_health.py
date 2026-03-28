from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_register_and_login():
    # Register a new user
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "TestPass123",
        "full_name": "Test User"
    })
    assert response.status_code == 200
    assert "email" in response.json()

    # Login with the same user
    response = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "TestPass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()