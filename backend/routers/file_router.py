import requests
from fastapi import APIRouter, HTTPException, UploadFile, File,Form, Query
from starlette.responses import Response
import traceback

from services.s3_service import upload_file_to_s3,get_s3_client,get_presigned_url
from settings import WASABI_BUCKET_NAME


#Creamos un APIRouter para manejo de archivos en WASABI
router = APIRouter(prefix="/files",tags=["Archivos"])


@router.get("/")
def list_files(folder: str=""):
    s3=get_s3_client()
    
    prefix = folder.strip("/") + "/" if folder else ""

    response = s3.list_objects_v2(
        Bucket = WASABI_BUCKET_NAME,
        Prefix = prefix,
        Delimiter = "/"
    )

    items = []

    #Detectar carpetas

    for p in response.get("CommonPrefixes",[]):
        folder_name = p["Prefix"].replace(prefix,"").rstrip("/")
        items.append({
            "name": folder_name,
            "is_dir": True
        })
        
    #Detectar archivos
    for obj in response.get("Contents",[]):
        name = obj["Key"].replace(prefix,"")
        if name == "":
            continue
        items.append({
            "name": name,
            "is_dir": False,
            "size": obj["Size"]
        })
    return items


@router.get("/{file_name}")
async def file_proxy(file_name: str, folder: str = ""):
    try:
        key = f"{folder}/{file_name}".strip("/")
        presigned_url = get_presigned_url(key)
        r = requests.get(presigned_url)
        r.raise_for_status()

        content_type = r.headers.get("Content-Type", "application/octet-stream")

        return Response(
            content=r.content,
            media_type=content_type,
            headers={
                "Content-Disposition": f'inline; filename="{file_name}"',
                "Access-Control-Allow-Origin": "*",
                "Content-Length": str(len(r.content))
            }
        )

    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno")

@router.delete("/")
def delete_file(file_path: str = Query(...)):
    s3 = get_s3_client()
    try:
        s3.delete_object(Bucket=WASABI_BUCKET_NAME, Key=file_path)
        return {"status": "deleted", "file": file_path}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def upload_file(file: UploadFile = File(...),folder:str=Form("")):
    try:
        content = await file.read()
        #Se envia con carpeta si asi se indica:
        key = f"{folder}/{file.filename}" if folder else str(file.filename)
        upload_file_to_s3(key,content)
        return {"message":f"Archivo '{file.filename}' subido correctamente a {folder}/"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo: {e}")

