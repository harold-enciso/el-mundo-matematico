from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from models import Curso, Tema, Bloque


# ==========================================
# 1. SERVICIOS DE LECTURA (PÚBLICO / ADMIN)
# ==========================================

def obtener_catalogo_cursos_service(db: Session):
    resultados = (
        db.query(Curso, func.count(Tema.id).label("total_temas"))
        .outerjoin(Tema, Curso.id == Tema.curso_id)
        .group_by(Curso.id)
        .order_by(Curso.orden.asc())
        .all()
    )

    catalogo = []
    for curso, total_temas in resultados:
        catalogo.append({
            "id": curso.id,
            "nombre": curso.nombre,
            "icono_url": curso.icono_url,
            "descripcion": curso.descripcion,
            "orden": curso.orden,
            "total_temas": total_temas,
        })

    return catalogo


def obtener_curso_y_temas_service(curso_id: str, db: Session):
    curso = db.query(Curso).filter(Curso.id == curso_id).first()

    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curso no encontrado",
        )

    temas = (
        db.query(Tema)
        .filter(Tema.curso_id == curso_id)
        .order_by(Tema.orden.asc())
        .all()
    )

    return {
        "curso": curso,
        "temas": temas,
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
            detail="Tema no encontrado",
        )

    bloques = (
        db.query(Bloque)
        .filter(Bloque.tema_id == tema.id)
        .order_by(Bloque.orden.asc())
        .all()
    )

    return {
        "tema": tema,
        "bloques": bloques,
    }


# ==========================================
# 2. CRUD ADMIN: CURSOS
# ==========================================

def crear_curso_service(datos_curso: dict, db: Session):
    curso_id = (datos_curso.get("id") or "").strip().lower()
    nombre = (datos_curso.get("nombre") or datos_curso.get("title") or "").strip()

    if not curso_id or not nombre:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El id y el nombre del curso son obligatorios",
        )

    existente = db.query(Curso).filter(Curso.id == curso_id).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un curso con el código '{curso_id}'",
        )

    max_orden = db.query(func.max(Curso.orden)).scalar() or 0
    orden = datos_curso.get("orden") or (max_orden + 1)

    nuevo_curso = Curso(
        id=curso_id,
        nombre=nombre,
        descripcion=(datos_curso.get("descripcion") or datos_curso.get("description") or "").strip(),
        icono_url=(datos_curso.get("icono_url") or "📚").strip(),
        orden=orden,
    )
    db.add(nuevo_curso)
    db.commit()
    db.refresh(nuevo_curso)
    return nuevo_curso


def eliminar_curso_service(curso_id: str, db: Session):
    curso = db.query(Curso).filter(Curso.id == curso_id).first()
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curso no encontrado",
        )
    db.delete(curso)
    db.commit()
    return {"message": "Curso eliminado correctamente"}


# ==========================================
# 3. CRUD ADMIN: TEMAS
# ==========================================

def crear_tema_service(curso_id: str, datos_tema: dict, db: Session):
    curso = db.query(Curso).filter(Curso.id == curso_id).first()
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curso no encontrado",
        )

    titulo = (datos_tema.get("titulo") or "").strip()
    slug = (datos_tema.get("slug") or "").strip()
    if not titulo or not slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El título y el slug del tema son obligatorios",
        )

    max_orden = (
        db.query(func.max(Tema.orden))
        .filter(Tema.curso_id == curso_id)
        .scalar()
        or 0
    )
    orden = datos_tema.get("orden") or (max_orden + 1)
    tema_id = (datos_tema.get("id") or f"{curso_id}-t{orden}").strip()

    if db.query(Tema).filter(Tema.id == tema_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un tema con el ID '{tema_id}'",
        )

    nuevo_tema = Tema(
        id=tema_id,
        curso_id=curso_id,
        slug=slug,
        titulo=titulo,
        descripcion=(datos_tema.get("descripcion") or "").strip(),
        duracion_estimada=(datos_tema.get("duracion_estimada") or "45 min").strip(),
        orden=orden,
    )
    db.add(nuevo_tema)
    db.commit()
    db.refresh(nuevo_tema)
    return nuevo_tema


def reordenar_temas_service(curso_id: str, items: list[dict], db: Session):
    for item in items:
        db.query(Tema).filter(
            Tema.id == item["id"],
            Tema.curso_id == curso_id,
        ).update({"orden": item["orden"]})

    db.commit()
    return {"message": "Orden de temas actualizado"}


def eliminar_tema_service(curso_id: str, tema_id: str, db: Session):
    tema = (
        db.query(Tema)
        .filter(Tema.id == tema_id, Tema.curso_id == curso_id)
        .first()
    )
    if not tema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tema no encontrado",
        )
    db.delete(tema)
    db.commit()
    return {"message": "Tema eliminado correctamente"}


# ==========================================
# 4. CRUD ADMIN: BLOQUES (TARJETITAS)
# ==========================================

def obtener_bloques_por_tema_id_service(curso_id: str, tema_id: str, db: Session):
    tema = (
        db.query(Tema)
        .filter(Tema.id == tema_id, Tema.curso_id == curso_id)
        .first()
    )
    if not tema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tema no encontrado",
        )

    bloques = (
        db.query(Bloque)
        .filter(Bloque.tema_id == tema_id)
        .order_by(Bloque.orden.asc())
        .all()
    )

    return {
        "tema": tema,
        "bloques": bloques,
    }


def crear_bloque_service(tema_id: str, datos_bloque: dict, db: Session):
    tema = db.query(Tema).filter(Tema.id == tema_id).first()
    if not tema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tema no encontrado",
        )

    max_orden = (
        db.query(func.max(Bloque.orden))
        .filter(Bloque.tema_id == tema_id)
        .scalar()
        or 0
    )
    orden = datos_bloque.get("orden") or (max_orden + 1)
    bloque_id = (datos_bloque.get("id") or f"b-{tema_id}-{orden}").strip()

    nuevo_bloque = Bloque(
        id=bloque_id,
        tema_id=tema_id,
        tipo=datos_bloque["tipo"],
        orden=orden,
        contenido=datos_bloque.get("contenido") or {},
    )
    db.add(nuevo_bloque)
    db.commit()
    db.refresh(nuevo_bloque)
    return nuevo_bloque


def actualizar_bloque_service(bloque_id: str, datos_bloque: dict, db: Session):
    bloque = db.query(Bloque).filter(Bloque.id == bloque_id).first()
    if not bloque:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bloque no encontrado",
        )

    if "tipo" in datos_bloque:
        bloque.tipo = datos_bloque["tipo"]
    if "orden" in datos_bloque:
        bloque.orden = datos_bloque["orden"]
    if "contenido" in datos_bloque:
        bloque.contenido = datos_bloque["contenido"]

    db.commit()
    db.refresh(bloque)
    return bloque


def reordenar_bloques_service(tema_id: str, items: list[dict], db: Session):
    for item in items:
        db.query(Bloque).filter(
            Bloque.id == item["id"],
            Bloque.tema_id == tema_id,
        ).update({"orden": item["orden"]})

    db.commit()
    return {"message": "Orden de bloques actualizado"}


def eliminar_bloque_service(bloque_id: str, db: Session):
    bloque = db.query(Bloque).filter(Bloque.id == bloque_id).first()
    if not bloque:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bloque no encontrado",
        )
    db.delete(bloque)
    db.commit()
    return {"message": "Bloque eliminado correctamente"}