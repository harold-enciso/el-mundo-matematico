from sqlalchemy import Column, Integer, String, Boolean, DateTime,Date
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True,index=True)
    email = Column(String(255),unique=True,nullable=False)
    username = Column(String(50),unique=True, nullable=True)
    role = Column(String(20),default="user")
    
    password_hash = Column(String, nullable=False)
    verified = Column(Boolean,default=False)
    verification_code = Column(String(10), nullable=True)
    verification_expires =Column(DateTime, nullable=True)
    recovery_code = Column(String(10), nullable=True)
    recovery_expires = Column(DateTime, nullable=True)
    
    first_name = Column(String(100),nullable=True)
    last_name = Column(String(100),nullable=True)
    birth_date = Column(Date,nullable=True)
    country = Column(String(100),nullable=True)
    
    last_login = Column(DateTime,nullable=True)
    created_at = Column(DateTime,server_default=func.now())
    updated_at = Column(DateTime,server_default=func.now(),onupdate=func.now())
    
    
