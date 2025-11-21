from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from .base import Base

# Your model inherits from Base
class Todo(Base):
    __tablename__ = "todos"  # This becomes the table name

    id = Column(Integer, primary_key=True, index=True)  # This becomes a column
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
