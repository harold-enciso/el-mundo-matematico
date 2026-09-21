from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from services.cursos_service import (
    obtener_catalogo_cursos_service,
    obtener_curso_y_temas_service,
    obtener_tema_y_bloques_service
)

router = APIRouter(prefix="/cursos", tags=["Cursos"])

@router.get("/listar", status_code=status.HTTP_200_OK)
def obtener_catalogo_cursos(db: Session = Depends(get_db)):
    return obtener_catalogo_cursos_service(db)

@router.get("/{curso_id}", status_code=status.HTTP_200_OK)
def obtener_curso_y_temas(curso_id: str, db: Session = Depends(get_db)):
    return obtener_curso_y_temas_service(curso_id, db)

@router.get("/{curso_id}/temas/{tema_slug}", status_code=status.HTTP_200_OK)
def obtener_tema_y_bloques(curso_id: str, tema_slug: str, db: Session = Depends(get_db)):
    return obtener_tema_y_bloques_service(curso_id, tema_slug, db)