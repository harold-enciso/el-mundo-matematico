import requests
from fastapi import APIRouter, HTTPException, UploadFile, File,Form, Query
from starlette.responses import Response

from services.s3_service import upload_file_to_s3,get_s3_client
from settings import WASABI_BUCKET_NAME


#Creamos un APIRouter para manejo de archivos en WASABI
router = APIRouter(prefix="/folder",tags=["Folders"])


@router.post("/create")
def create_folder(folder:str):
    s3= get_s3_client()

    key = folder.strip("/")+"/"

    s3.put_object(Bucket=WASABI_BUCKET_NAME,Key=key)

    return {"status": "folder_created","folder": key}