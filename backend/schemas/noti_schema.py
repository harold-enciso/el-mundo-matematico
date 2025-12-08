from pydantic import BaseModel, EmailStr
from datetime import datetime

#Requests: FRONT->BACK
class NotificationCreate(BaseModel):
    
    email: EmailStr
    title: str
    message: str
    link: str | None = None
    image_url: str | None = None
    file_url: str | None = None
    file_name: str | None = None
    file_type: str | None = None
    file_size: int | None = None
    
    




#Responses: BACK->FRONT
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    link: str | None = None
    image_url: str | None = None
    file_url: str | None = None
    file_name: str | None = None
    file_type: str | None = None
    file_size: int | None = None
    is_read: bool
    read_at: datetime | None = None
    is_archived: bool
    created_at: datetime


    class Config:
        orm_mode = True
