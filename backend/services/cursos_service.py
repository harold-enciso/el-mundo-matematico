from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Curso, Tema, Bloque
from sqlalchemy import func
def obtener_catalogo_cursos_service(db: Session):
    # Consultamos el curso junto con el conteo de sus temas
    resultados = (
        db.query(Curso, func.count(Tema.id).label("total_temas"))
        .outerjoin(Tema, Curso.id == Tema.curso_id)
        .group_by(Curso.id)
        .order_by(Curso.orden.asc())
        .all()
    )
    
    # Construimos el diccionario de respuesta incluyendo el campo 'total_temas'
    catalogo = []
    for curso, total_temas in resultados:
        catalogo.append({
            "id": curso.id,
            "nombre": curso.nombre,
            "icono_url": curso.icono_url,
            "descripcion": curso.descripcion,
            "orden": curso.orden,
            "total_temas": total_temas  # <--- Cantidad calculada en DB
        })
        
    return catalogo

def obtener_curso_y_temas_service(curso_id: str, db: Session):
    curso = db.query(Curso).filter(Curso.id == curso_id).first()
    
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Curso no encontrado"
        )
        
    temas = (
        db.query(Tema)
        .filter(Tema.curso_id == curso_id)
        .order_by(Tema.orden.asc())
        .all()
    )
    
    return {
        "curso": curso,
        "temas": temas
    }

def obtener_tema_y_bloques_service(curso_id: str, tema_slug: str, db: Session):
    tema = (
        db.query(Tema)
        .filter(Tema.curso_id == curso_id, Tema.slug == tema_slug)
        .first()
    )
    
    if not tema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Tema no encontrado"
        )
        
    bloques = (
        db.query(Bloque)
        .filter(Bloque.tema_id == tema.id)
        .order_by(Bloque.orden.asc())
        .all()
    )
    
    return {
        "tema": tema,
        "bloques": bloques
    }