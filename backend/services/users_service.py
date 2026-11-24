from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import User # Cambia por tu modelo de Usuario

def listar_usuarios_service(db: Session):
    return db.query(User).all()

def cambiar_rol_usuario_service(usuario_id: int, nuevo_rol: str, db: Session):
    usuario = db.query(User).filter(User.id == usuario_id).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuario no encontrado"
        )
    usuario.rol = nuevo_rol
    db.commit()
    db.refresh(usuario)
    return usuario

def eliminar_usuario_service(usuario_id: int, db: Session):
    usuario = db.query(User).filter(User.id == usuario_id).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuario no encontrado"
        )
    db.delete(usuario)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}