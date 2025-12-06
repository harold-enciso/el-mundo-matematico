from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from settings import CORS_Origins
from routers import pdf_router,auth_router
from fastapi.responses import JSONResponse

from fastapi.exceptions import RequestValidationError


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

#Manejador de errores 422
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc:RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": "Formato de email incorrecto, revisa e ingrésalo nuevamente"}
    )

#Montamos todos los Routers con sus prefijos y tags
app.include_router(
    pdf_router.router,
    )

app.include_router(
    auth_router.router,
)
    
#Funcion de prueba
@app.get("/")
def ping():
    return {"status": "ok"}