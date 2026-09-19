from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from settings import CORS_Origins
from routers import pdf_router,auth_router,noti_router,file_router,folder_router
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from core.rate_limit import limiter
from fastapi.exceptions import RequestValidationError


app = FastAPI(
    title="El Mundo Matematico API",
    description="Contenido educativo de matemática",
    version="1.0.0"
)
# Vinculación del limiter al estado de la aplicación
app.state.limiter = limiter

#AÑADIR EL MIDDLEWARE CORS para permitir origenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_Origins,    # Las URLs definidas
    allow_credentials=True,        # Permite cookies
    allow_methods=["*"],           # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],           # Permite todas las cabeceras
)
# --- CABECERAS DE SEGURIDAD ---
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    # CSP Permisivo
    response.headers["Content-Security-Policy"] = "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval';"
    return response
# --------------------------------------------

# Manejador de errores personalizado para Rate Limit (429)
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Has superado el límite de peticiones. Inténtalo más tarde."}
    )


# Manejador de errores de validación (422)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc:RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": "Formato de email incorrecto, revisa e ingrésalo nuevamente"}
    )

# Montamos todos los Routers
app.include_router(pdf_router.router)
app.include_router(auth_router.router)
app.include_router(noti_router.router)
app.include_router(file_router.router)
app.include_router(folder_router.router)

#Funcion de prueba
@app.get("/")
def ping():
    return {"status": "ok"}