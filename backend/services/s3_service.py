import boto3.session
import os
from fastapi import HTTPException
from requests import exceptions as request_exceptions
from settings import (WASABI_BUCKET_NAME,WASABI_ENDPOINT_URL,WASABI_KEY_ID,WASABI_SECRET_KEY)







# INICIALIZO MI CLIENTE PARA ACCEDER AL ALMACENAMIENTO WASABI
try:
    session = boto3.session.Session()
    S3_CLIENT = session.client(
        service_name="s3",
        endpoint_url=os.getenv("WASABI_ENDPOINT_URL"),
        aws_access_key_id=os.getenv("WASABI_KEY_ID"),
        aws_secret_access_key=os.getenv("WASABI_SECRET_KEY")
    )
except Exception as e:
    print(f"ERROR: No se pudo inicializar el cliente S3/Wasabi: {e}")
    S3_CLIENT = None

def get_s3_client():
    if S3_CLIENT is None:
        raise HTTPException(status_code=503, detail="El servicio S3 no está configurado o falló al iniciarse.")
    return S3_CLIENT

def get_presigned_url(file_name: str):
    client = get_s3_client()
    try:
        presigned_url = client.generate_presigned_url(
            "get_object",
            Params={"Bucket": os.getenv("WASABI_BUCKET_NAME"), "Key": file_name},
            ExpiresIn=3600  # 1 hora
        )
        return presigned_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar URL pre-firmada: {e}")
