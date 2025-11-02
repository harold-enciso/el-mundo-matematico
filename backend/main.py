import boto3.session
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

#Definiendo origenes permitidos
origins = [
    "https://el-mundo-matematico.onrender.com",
    "https://el-mundo-matematico-api.onrender.com",
    "https://api.elmundomatematico.com",
    "https://elmundomatematico.com",
    "https://www.elmundomatematico.com",
    
    # URLs de desarrollo local
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
]
#Agregaremos IP local del front (si existe, entonces no debo agregar nada a Render)
local_front = os.getenv("DEV_FRONT_IP")
if local_front:
    origins.append(local_front)


# INICIALIZO MI CLIENTE PARA ACCEDER AL ALMACENAMIENTO WASABI
session = boto3.session.Session()
s3 = session.client(
    service_name="s3",
    endpoint_url=os.getenv("WASABI_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("WASABI_KEY_ID"),
    aws_secret_access_key=os.getenv("WASABI_SECRET_KEY")
)

#AÑADIR EL MIDDLEWARE CORS para permitir origenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # Las URLs definidas
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