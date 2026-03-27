from pydantic import BaseModel
from datetime import datetime
from app.models.transaction import TransactionType

class TransactionCreate(BaseModel):
    amount: float
    description: str | None = None
    category: str
    type: TransactionType
    date: datetime | None = None

class TransactionResponse(TransactionCreate):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True