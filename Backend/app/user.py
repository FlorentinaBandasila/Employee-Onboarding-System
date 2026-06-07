from sqlalchemy import Column, Integer, String
from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    department = Column(String(100), nullable=False)
    role = Column(String(100), nullable=True)