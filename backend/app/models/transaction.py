from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String)
    category = Column(String, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="transactions")