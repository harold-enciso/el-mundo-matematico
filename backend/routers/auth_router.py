from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas.auth_schema import RegisterUser, LoginUser, UserResponse, UserUpdate, ForgotPasswordRequest, ResetPasswordRequest
from services.auth_service import register_user_service,login_user_service,update_user_service,forgot_password_service,reset_password_service,verify_email_service
from dependencies.auth import get_current_user
from services.captcha_service import verify_turnstile_token
#RATE LIMIT
from core.rate_limit import limiter

router = APIRouter(prefix="/auth",tags=["Auth"])




@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/10minutes")
def register_user(request: Request, data: RegisterUser, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else None
    verify_turnstile_token(data.captcha_token, client_ip) #type: ignore
    result = register_user_service(data, db)
    return result

@router.get("/verify-email", status_code=status.HTTP_200_OK)
def verify_email(token: str, db: Session = Depends(get_db)):
    return verify_email_service(token, db)

@router.post("/login")
@limiter.limit("5/minute")
def login_user(request: Request, data: LoginUser, db: Session = Depends(get_db)):
    user_data = login_user_service(data,db)
    return user_data

@router.get("/me", response_model=UserResponse)
def me(current_user = Depends(get_current_user)):
    return current_user

@router.put("/me",response_model=UserResponse)
def update_me(user_data: UserUpdate,db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_user = update_user_service(db,current_user,user_data.model_dump(exclude_unset=True))
    return updated_user

@router.post("/forgot-password")
@limiter.limit("3/10minutes")
def forgot_password(request: Request, data: ForgotPasswordRequest, db: Session= Depends(get_db)):
    # Obtiene la IP de forma segura o pasa None si no está disponible
    client_ip = request.client.host if request.client else None
    verify_turnstile_token(data.captcha_token, client_ip) #type: ignore
    return forgot_password_service(data.email,db)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session= Depends(get_db)):
    return reset_password_service(data.token, data.new_password,db)