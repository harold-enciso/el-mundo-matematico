from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from settings import CORS_Origins
from routers import pdf_router

app = FastAPI(
    title="El Mundo Matematico API",
    description="Muestra de PDFs educativos de matemática",
    version="1.0.0"
)

#AÑADIR EL MIDDLEWARE CORS para permitir origenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_Origins,    # Las URLs definidas
    allow_credentials=True,        # Permite cookies
    allow_methods=["*"],           # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],           # Permite todas las cabeceras
)

#Montamos todos los Routers con sus prefijos y tags
app.include_router(
    pdf_router.router,
    prefix="/pdf",
    tags=["Mostrar PDFs"]
    )
    
#Funcion de prueba
@app.get("/")
def mensaje():
    return {"mensaje": "Esperamos que disfruten su estadia"}