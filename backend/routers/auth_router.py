from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas.auth_schema import RegisterUser, LoginUser, UserResponse, UserUpdate
from services.auth_service import register_user_service,login_user_service,update_user_service
from dependencies.auth import get_current_user


router = APIRouter(prefix="/auth",tags=["Auth"])




@router.post("/register")
def register_user(data: RegisterUser, db: Session = Depends(get_db)):
    new_user = register_user_service(data,db)
    return {"message": "Usuario creado","email": new_user.email}

@router.post("/login")
def login_user(data: LoginUser, db: Session = Depends(get_db)):
    token = login_user_service(data,db)
    return token

@router.get("/me", response_model=UserResponse)
def me(current_user = Depends(get_current_user)):
    return current_user

@router.put("/me",response_model=UserResponse)
def update_me(user_data: UserUpdate,db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_user = update_user_service(db,current_user,user_data.model_dump(exclude_unset=True))
    return updated_user
