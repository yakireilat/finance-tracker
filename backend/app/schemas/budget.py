from pydantic import BaseModel

class BudgetCreate(BaseModel):
    category: str
    amount: float

class BudgetResponse(BudgetCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True