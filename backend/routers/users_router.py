from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db # Cambia por tu conexión a DB
from services.users_service import (
    listar_usuarios_service,
    cambiar_rol_usuario_service,
    eliminar_usuario_service
)
# Aquí debes incluir tu dependencia de verificación de Admin/Token
# from dependencies import get_current_admin_user 

router = APIRouter(
    prefix="/users",
    tags=["Gestión de Usuarios (Admin)"]
)

@router.get("", status_code=status.HTTP_200_OK)
def obtener_usuarios(db: Session = Depends(get_db)):
    return listar_usuarios_service(db)

@router.put("/{usuario_id}/role", status_code=status.HTTP_200_OK)
def cambiar_rol(usuario_id: int, datos: dict, db: Session = Depends(get_db)):
    nuevo_rol = datos.get("role")
    return cambiar_rol_usuario_service(usuario_id, str(nuevo_rol), db)

@router.delete("/{usuario_id}", status_code=status.HTTP_200_OK)
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return eliminar_usuario_service(usuario_id, db)