from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from models import User
import string
from schemas.auth_schema import RegisterUser, LoginUser
from services.email_service import send_reset_password_email_service, send_verification_email_service
import secrets
#Manejo de errores
from fastapi import HTTPException
from core.security import create_access_token
import logging
#Configuracion
logger = logging.getLogger("auth_logger")
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(ch)



pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

def register_user_service(data: RegisterUser, db: Session):
        
    #Buscar si el correo ya existe
    existing_user = db.query(User).filter(User.email == data.email).first()
    
    #Generar token de verificación de 10 dígitos y expiración en 24 horas
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(10))
    now = datetime.now()
    expires = now + timedelta(hours=24)
    hashed_password = pwd_context.hash(data.password)

    if existing_user:
        logger.info("--> 1. Iniciando proceso de registro para: %s", data.email)
        # SI YA ESTÁ VERIFICADO, bloqueamos el registro.
        if existing_user.verified: # type: ignore
            raise HTTPException(status_code=400, detail="Email ya registrado")
        
        # 2. SI EXISTE Y NO ESTÁ VERIFICADO -> Revisamos si su token actual sigue vigente
        if (
            existing_user.verification_code  # type: ignore
            and existing_user.verification_expires 
            and existing_user.verification_expires > now
        ):
            # El token aún está activo: se evita sobreescribir y reenviar de inmediato
            raise HTTPException(
                status_code=429,
                detail="Ya hemos enviado un correo de verificación a esta dirección recientemente. Revisa tu bandeja de entrada o intenta más tarde."
            )

        # 3. SI EL TOKEN YA EXPIRÓ -> Reutilizamos el registro y actualizamos token/pw
        user_to_save = existing_user
        user_to_save.password_hash = hashed_password
        user_to_save.verification_code = token # type: ignore
        user_to_save.verification_expires = expires # type: ignore
    else:
        # SI ES UN USUARIO NUEVO:
        user_to_save = User(
            email=data.email,
            password_hash=hashed_password,
            verified=False,
            verification_code=token,
            verification_expires=expires
        )
        db.add(user_to_save)

    try:
        # Enviamos el correo 
        
        logger.info("--> 2. Intentando enviar correo mediante email_service...")
        send_verification_email_service(data.email, token)
        logger.info("--> 3. Correo enviado exitosamente.")
        db.commit()
        return {"message": "Código de verificación enviado, revisa tu correo"}

    except Exception:
        logger.exception("!!! ERROR CRÍTICO EN REGISTRO !!!")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al enviar el correo de verificación. Inténtalo más tarde.")

def verify_email_service(token: str, db: Session):
    #Ubicamos al usuario con ese token
    user = db.query(User).filter(User.verification_code == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="El enlace de verificación es inválido o ya fue utilizado")
    # Validar si el token expiró usando hora local naive
    now = datetime.now()
    if user.verification_expires and user.verification_expires < now: # type: ignore
        # Limpiamos las columnas
        user.verification_code = None # type: ignore
        user.verification_expires = None # type: ignore
        db.commit()
        raise HTTPException(status_code=400, detail="El enlace de verificación ha expirado.")
    
    # Verificar el usuario
    user.verified = True # type: ignore
    user.verification_code = None # type: ignore
    user.verification_expires = None # type: ignore
    
    try:
        db.commit()
        return {"message": "Correo verificado con éxito"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al activar la cuenta en la base de datos.")
def login_user_service(data: LoginUser, db: Session):
    #Ubicamos al usuario
    user = db.query(User).filter(User.email == data.email).first()
    msg_error = "Credenciales inválidas"
    if not user:
        raise HTTPException(status_code=401,detail=msg_error)
    if not pwd_context.verify(data.password,user.password_hash): # type: ignore
        raise HTTPException(status_code=401,detail=msg_error)
    if not user.verified: # type: ignore
        raise HTTPException(status_code=403,detail="Cuenta no verificada")
    #Creamos el token
    token = create_access_token({"sub":user.email})
    #Devolvemos todos los datos necesarios para poblar el user de UserContext
    return {
        "token":token,
        "id":user.id,
        "email":user.email,
        "username":user.username,
        "role":user.role,
        "first_name":user.first_name,
        "last_name":user.last_name,
        "birth_date":user.birth_date,
        "country":user.country,
        "verified":user.verified
        }


def update_user_service(db: Session, user: User, data:dict):
    for field,value in data.items():
        setattr(user,field,value)
    db.commit()
    db.refresh(user)
    return user


def forgot_password_service(email:str, db: Session):
    #Ubicamos al usuario con ese correo
    user = db.query(User).filter(User.email == email).first()
    if user:
        now = datetime.now()
        # SI TIENE UN CÓDIGO ACTIVO QUE NO HA EXPIRADO -> LANZAMOS EXCEPCIÓN
        if user.recovery_expires and user.recovery_expires > now: # type: ignore
            raise HTTPException(
                status_code=429,  # Too Many Requests
                detail="Ya hemos enviado un enlace de recuperación recientemente. Por favor revisa tu bandeja o espera a que expire."
            )
        #Creo el token
        alphabet = string.ascii_letters + string.digits
        token = ''.join(secrets.choice(alphabet) for _ in range(10))
        #Lo guardo en la BD:
        user.recovery_code = token # type: ignore
        user.recovery_expires = now + timedelta(minutes = 15) # type: ignore
        
        #Envio el correo
        # Envolvemos solo el envío para que un fallo de red externa no tumbe tu API
        try:
            send_reset_password_email_service(str(user.email), token)
            db.commit()
        except Exception:
            db.rollback()
    return {"message": "Si el correo está registrado, recibirás un enlace de recuperación de contraseña"}

def reset_password_service(token: str, new_password: str, db: Session):
    #Ubicamos al usuario con ese token
    user = db.query(User).filter(User.recovery_code == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="El enlace de recuperación es inválido o ya fue utilizado")
    #Validar si el token expiró en la BD
    # Comparación de hora local (sin timezone/naive)
    now = datetime.now()
    expires = user.recovery_expires

    if expires and expires < now: # type: ignore
        user.recovery_code = None # type: ignore
        user.recovery_expires = None # type: ignore
        db.commit()
        raise HTTPException(status_code=400, detail="El enlace de recuperación ha expirado.")
    
    
    #Actualizar la pw
    user.password_hash = pwd_context.hash(new_password)
    user.recovery_code = None # type: ignore
    user.recovery_expires = None # type: ignore
    
    try:
        db.commit()
        return {"message": "Contraseña actualizada con éxito"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500,detail="Error al cambiar la contraseña en la base de datos.")