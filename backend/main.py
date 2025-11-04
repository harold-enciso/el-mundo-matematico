import boto3.session
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import boto3
import os
import io
import requests
from dotenv import load_dotenv
from starlette.responses import Response
from starlette.background import BackgroundTask


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
    "http://localhost:8000",
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
async def pdf_proxy(file_name: str):
    """
    Endpoint Proxy: Obtiene un archivo PDF de Wasabi mediante URL pre-firmada
    y lo sirve al navegador.
    """
    if not s3:
        raise HTTPException(status_code=503, detail="El servicio S3 no está configurado.")
    
    try:
        presigned_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": os.getenv("WASABI_BUCKET_NAME"), "Key": file_name},
            ExpiresIn=3600  # 1 hora
        )

        r = requests.get(presigned_url)
        r.raise_for_status() 
        pdf_content = r.content
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'inline; filename="{file_name}"',
                "Access-Control-Allow-Origin": "*",
                "Content-Length": str(len(pdf_content)) 
            }
        )

    except requests.exceptions.HTTPError as e:

        if r.status_code == 404:
            raise HTTPException(
                status_code=404, 
                detail=f"Archivo '{file_name}' no encontrado en Wasabi (Error 404)."
            )
        
        raise HTTPException(
            status_code=500, 
            detail=f"Error al acceder a Wasabi: {e}"
        )
        
    except Exception as e:
        print(f"Error interno: {e}")
        raise HTTPException(status_code=500, detail="Error de configuración interna del servidor.")
    
#Funcion sincrona o normal
@app.get("/")
def mensaje():
    return {"mensaje": "Esperamos que disfruten su estadia"}