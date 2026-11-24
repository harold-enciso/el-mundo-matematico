from typing import Any, Literal
from pydantic import BaseModel, Field


TipoBloque = Literal[
    "texto",
    "formula",
    "callout",
    "ejemplo_resuelto",
    "cuestionario",
    "grafico",
]


class CursoCreateSchema(BaseModel):
    id: str = Field(..., min_length=1, max_length=50)
    nombre: str = Field(..., min_length=1, max_length=150)
    descripcion: str = ""
    icono_url: str = "📚"
    orden: int | None = None


class TemaCreateSchema(BaseModel):
    id: str | None = None
    curso_id: str | None = None
    titulo: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200)
    descripcion: str = ""
    duracion_estimada: str = "45 min"
    orden: int | None = None


class OrdenItemSchema(BaseModel):
    id: str
    orden: int


class ReordenarSchema(BaseModel):
    items: list[OrdenItemSchema]


class BloqueCreateSchema(BaseModel):
    id: str | None = None
    tema_id: str | None = None
    tipo: TipoBloque
    orden: int | None = None
    contenido: dict[str, Any] = Field(default_factory=dict)


class BloqueUpdateSchema(BaseModel):
    tipo: TipoBloque | None = None
    orden: int | None = None
    contenido: dict[str, Any] | None = None