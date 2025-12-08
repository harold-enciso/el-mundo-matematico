from sqlalchemy import Column,BigInteger, Integer, String, Boolean, DateTime,Date,ForeignKey
from sqlalchemy.sql import func
from database import Base

#TABLAS BD POSTGRES

class User(Base):
    __tablename__ = "users"
    id = Column(BigInteger, primary_key=True,index=True)
    email = Column(String(255),unique=True,index=True,nullable=False)
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


class Notifications(Base):
    __tablename__ = "notifications"
    id = Column(BigInteger, primary_key=True,index=True)
    user_id = Column(BigInteger,ForeignKey("users.id"),index=True)
    title = Column(String, nullable=False)
    message = Column(String,nullable=False)
    link = Column(String,nullable=True)
    image_url = Column(String,nullable=True)
    file_url = Column(String,nullable=True)
    file_name = Column(String,nullable=True)
    file_type = Column(String,nullable=True)
    file_size = Column(BigInteger,nullable=True)
    is_read = Column(Boolean,default=False)
    read_at = Column(DateTime,nullable=True)
    is_archived = Column(Boolean,default=False)
    created_at = Column(DateTime,server_default=func.now())