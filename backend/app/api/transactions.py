from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=List[TransactionResponse])
def get_transactions(
    skip: int = 0,
    limit: int = 1000,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Transaction)\
             .filter(Transaction.user_id == current_user.id)\
             .offset(skip).limit(limit).all()

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = Transaction(**transaction_in.model_dump(), user_id=current_user.id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.get("/stats")
def get_transaction_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction)\
                     .filter(Transaction.user_id == current_user.id).all()

    now = datetime.now()
    current_month = now.strftime("%Y-%m")
    prev_date = datetime(now.year if now.month > 1 else now.year - 1,
                         now.month - 1 if now.month > 1 else 12, 1)
    prev_month = prev_date.strftime("%Y-%m")

    def month_key(t):
        d = t.date
        return d.strftime("%Y-%m") if hasattr(d, "strftime") else str(d)[:7]

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expenses = sum(t.amount for t in transactions if t.type == "expense")

    # By category (expenses only)
    by_category = {}
    for t in transactions:
        if t.type == "expense":
            by_category[t.category] = by_category.get(t.category, 0) + t.amount

    # By month
    by_month = {}
    for t in transactions:
        mk = month_key(t)
        if mk not in by_month:
            by_month[mk] = {"income": 0.0, "expenses": 0.0}
        if t.type == "income":
            by_month[mk]["income"] += t.amount
        else:
            by_month[mk]["expenses"] += t.amount

    # Current & previous month
    cur_income = sum(t.amount for t in transactions if t.type == "income" and month_key(t) == current_month)
    cur_expenses = sum(t.amount for t in transactions if t.type == "expense" and month_key(t) == current_month)
    prev_expenses = sum(t.amount for t in transactions if t.type == "expense" and month_key(t) == prev_month)

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_balance": total_income - total_expenses,
        "by_category": [{"category": k, "total": v} for k, v in sorted(by_category.items(), key=lambda x: -x[1])],
        "by_month": [{"month": k, **v} for k, v in sorted(by_month.items())],
        "current_month": {"income": cur_income, "expenses": cur_expenses, "net": cur_income - cur_expenses},
        "prev_month": {"expenses": prev_expenses},
    }

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction)\
                    .filter(Transaction.id == transaction_id,
                            Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    for key, value in transaction_in.model_dump(exclude_unset=True).items():
        setattr(transaction, key, value)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction)\
                    .filter(Transaction.id == transaction_id,
                            Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"message": "Deleted"}
