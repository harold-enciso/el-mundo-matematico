from pydantic import BaseModel, EmailStr
from datetime import date


#Requests: FRONT->BACK
class RegisterUser(BaseModel):
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    birth_date: date | None = None
    country: str | None = None




#Responses: BACK->FRONT
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str | None = None
    role: str = "user"

    first_name: str | None = None
    last_name: str | None = None
    birth_date: date | None = None
    country: str | None = None

    verified: bool
    

    class Config:
        orm_mode = True

