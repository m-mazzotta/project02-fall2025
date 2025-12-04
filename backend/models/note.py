from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from .base import Base


# Your model inherits from Base
class Note(Base):
    __tablename__ = "notes"  # This becomes the table name

    id = Column(Integer, primary_key=True, index=True)  # This becomes a column
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    name = Column(String, nullable=True)
    img_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
