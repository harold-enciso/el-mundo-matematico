import os
import requests
from fastapi import HTTPException, status

TURNSTILE_SECRET_KEY = os.getenv("TURNSTILE_SECRET_KEY")

def verify_turnstile_token(token: str | None, client_ip: str | None = None):
    #Si no llega token se rechaza:
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Validación de CAPTCHA requerida.")

    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

    payload = {
        "secret": TURNSTILE_SECRET_KEY,
        "response": token,
        "remoteip": client_ip
    }

    try:
        response = requests.post(url,data=payload, timeout=5)
        result = response.json()

    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de comunicación con el servicio de verificación CAPTCHA")

    if not result.get("success"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Validación de CAPTCHA fallida o expirada. Inténtalo de nuevo.")