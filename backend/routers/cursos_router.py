from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.cursos_schema import (
    CursoCreateSchema,
    TemaCreateSchema,
    ReordenarSchema,
    BloqueCreateSchema,
    BloqueUpdateSchema,
)
from services.cursos_service import (
    obtener_catalogo_cursos_service,
    obtener_curso_y_temas_service,
    obtener_tema_y_bloques_service,
    crear_curso_service,
    eliminar_curso_service,
    crear_tema_service,
    reordenar_temas_service,
    eliminar_tema_service,
    obtener_bloques_por_tema_id_service,
    crear_bloque_service,
    actualizar_bloque_service,
    reordenar_bloques_service,
    eliminar_bloque_service,
)

router = APIRouter(prefix="/cursos", tags=["Cursos"])


# ==========================================
# RUTAS PÚBLICAS (ESTUDIANTES Y CATÁLOGO)
# ==========================================

@router.get("/listar", status_code=status.HTTP_200_OK)
def obtener_catalogo_cursos(db: Session = Depends(get_db)):
    return obtener_catalogo_cursos_service(db)


@router.get("/{curso_id}", status_code=status.HTTP_200_OK)
def obtener_curso_y_temas(curso_id: str, db: Session = Depends(get_db)):
    return obtener_curso_y_temas_service(curso_id, db)


@router.get("/{curso_id}/temas/{tema_slug}", status_code=status.HTTP_200_OK)
def obtener_tema_y_bloques(curso_id: str, tema_slug: str, db: Session = Depends(get_db)):
    return obtener_tema_y_bloques_service(curso_id, tema_slug, db)


# ==========================================
# RUTAS DE ADMINISTRACIÓN: CURSOS
# ==========================================

@router.post("/create", status_code=status.HTTP_201_CREATED)
def crear_curso(datos: CursoCreateSchema, db: Session = Depends(get_db)):
    return crear_curso_service(datos.model_dump(), db)


@router.delete("/{curso_id}", status_code=status.HTTP_200_OK)
def eliminar_curso(curso_id: str, db: Session = Depends(get_db)):
    return eliminar_curso_service(curso_id, db)


# ==========================================
# RUTAS DE ADMINISTRACIÓN: TEMAS
# ==========================================

@router.post("/{curso_id}/temas", status_code=status.HTTP_201_CREATED)
def crear_tema(curso_id: str, datos: TemaCreateSchema, db: Session = Depends(get_db)):
    return crear_tema_service(curso_id, datos.model_dump(), db)


@router.patch("/{curso_id}/temas/reordenar", status_code=status.HTTP_200_OK)
def reordenar_temas(curso_id: str, payload: ReordenarSchema, db: Session = Depends(get_db)):
    items = [item.model_dump() for item in payload.items]
    return reordenar_temas_service(curso_id, items, db)


@router.delete("/{curso_id}/temas/{tema_id}", status_code=status.HTTP_200_OK)
def eliminar_tema(curso_id: str, tema_id: str, db: Session = Depends(get_db)):
    return eliminar_tema_service(curso_id, tema_id, db)


# ==========================================
# RUTAS DE ADMINISTRACIÓN: BLOQUES (TARJETITAS)
# ==========================================

@router.get("/{curso_id}/temas/{tema_id}/bloques", status_code=status.HTTP_200_OK)
def obtener_bloques_tema_admin(curso_id: str, tema_id: str, db: Session = Depends(get_db)):
    return obtener_bloques_por_tema_id_service(curso_id, tema_id, db)


@router.post("/temas/{tema_id}/bloques", status_code=status.HTTP_201_CREATED)
def crear_bloque(tema_id: str, datos: BloqueCreateSchema, db: Session = Depends(get_db)):
    return crear_bloque_service(tema_id, datos.model_dump(), db)


@router.put("/bloques/{bloque_id}", status_code=status.HTTP_200_OK)
def actualizar_bloque(bloque_id: str, datos: BloqueUpdateSchema, db: Session = Depends(get_db)):
    return actualizar_bloque_service(bloque_id, datos.model_dump(exclude_unset=True), db)


@router.patch("/temas/{tema_id}/bloques/reordenar", status_code=status.HTTP_200_OK)
def reordenar_bloques(tema_id: str, payload: ReordenarSchema, db: Session = Depends(get_db)):
    items = [item.model_dump() for item in payload.items]
    return reordenar_bloques_service(tema_id, items, db)


@router.delete("/bloques/{bloque_id}", status_code=status.HTTP_200_OK)
def eliminar_bloque(bloque_id: str, db: Session = Depends(get_db)):
    return eliminar_bloque_service(bloque_id, db)