from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import auth, transactions, budgets

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finance Tracker API", version="1.0.0", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://finance-tracker-frontend-production-d7c8.up.railway.app",
        "http://localhost:5173",
        "http://localhost:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(budgets.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}