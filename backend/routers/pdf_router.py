import requests
from fastapi import APIRouter, HTTPException
from starlette.responses import Response
from requests import exceptions as request_exceptions
from services.s3_service import get_presigned_url

#Creamos un APIRouter para las rutas PDF
router = APIRouter(tags=["PDF"])

@router.get("/{file_name}")
async def pdf_proxy(file_name: str):
    try:
        presigned_url = get_presigned_url(file_name)
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