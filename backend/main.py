import boto3.session
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # << IMPORTAR CORS
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# ⚠️ PASO 1: DEFINIR LOS ORÍGENES PERMITIDOS
# Esta lista DEBE incluir la URL pública de tu Frontend
# y las URLs que usas para probar localmente.
origins = [
    # 🚨 IMPORTANTE: Reemplaza esta URL con la URL final de tu Static Service en Render
    "https://el-mundo-matematico.onrender.com",
    "https://el-mundo-matematico-api.onrender.com",
    "https://api.elmundomatematico.com",
    "https://elmundomatematico.com",
    "https://www.elmundomatematico.com",
    
    # URLs de desarrollo local (para que funcione mientras pruebas en tu PC)
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
]

# INICIALIZO MI CLIENTE PARA ACCEDER AL ALMACENAMIENTO B2
session = boto3.session.Session()
s3 = session.client(
    service_name="s3",
    endpoint_url=os.getenv("WASABI_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("WASABI_KEY_ID"),
    aws_secret_access_key=os.getenv("WASABI_SECRET_KEY")
)

# ⚠️ PASO 2: AÑADIR EL MIDDLEWARE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # Las URLs que definiste arriba
    allow_credentials=True,        # Permite cookies (si usas autenticación basada en sesión)
    allow_methods=["*"],           # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],           # Permite todas las cabeceras
)

#FUNCION PARA MOSTRAR PDF
@app.get("/pdf/{file_name}")
def mostrar_pdf(file_name: str):
    #Genera una URL temporal para acceder a un PDF privado
    bucket_name = os.getenv("WASABI_BUCKET_NAME")
    url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket_name,"Key": file_name},
        ExpiresIn=3600,
    )
    return {"url":url}


#Funcion sincrona o normal
@app.get("/")
def mensaje():
    return {"mensaje": "Esperamos que disfruten su estadia"}