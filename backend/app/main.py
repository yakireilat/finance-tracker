from fastapi import FastAPI
from app.database import engine, Base
from app.api import auth, transactions

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finance Tracker API", version="1.0.0", root_path="/api")

app.include_router(auth.router)
app.include_router(transactions.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
