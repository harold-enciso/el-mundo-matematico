from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User
from schemas.auth_schema import RegisterUser, LoginUser, UserUpdate
#Manejo de errores
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from core.security import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

def register_user_service(data: RegisterUser, db: Session):
        
    hashed = pwd_context.hash(data.password)
    new_user = User(
        email = data.email,
        password_hash = hashed
    )

    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
        return new_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
def login_user_service(data: LoginUser, db: Session):
    #Ubicamos al usuario
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401,detail="Correo no encontrado")
    if not pwd_context.verify(data.password,user.password_hash): # type: ignore
        raise HTTPException(status_code=401,detail="Contraseña incorrecta")
    #Creamos el token
    token = create_access_token({"sub":user.email})

    return {"access_token":token,"token_type": "bearer"}


def update_user_service(db: Session, user: User, data:dict):
    for field,value in data.items():
        setattr(user,field,value)
    db.commit()
    db.refresh(user)
    return user