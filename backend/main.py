from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # << IMPORTAR CORS
app = FastAPI()

# ⚠️ PASO 1: DEFINIR LOS ORÍGENES PERMITIDOS
# Esta lista DEBE incluir la URL pública de tu Frontend en Render
# y las URLs que usas para probar localmente.
origins = [
    # 🚨 IMPORTANTE: Reemplaza esta URL con la URL final de tu Static Service en Render
    "https://el-mundo-matematico.onrender.com",
    "https://elmundomatematico.com",
    
    # URLs de desarrollo local (para que funcione mientras pruebas en tu PC)
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
]

# ⚠️ PASO 2: AÑADIR EL MIDDLEWARE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # Las URLs que definiste arriba
    allow_credentials=True,        # Permite cookies (si usas autenticación basada en sesión)
    allow_methods=["*"],           # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],           # Permite todas las cabeceras
)

#Funcion sincrona o normal
@app.get("/")
def mensaje():
    return {"mensaje": "Esperamos que disfruten su estadia"}