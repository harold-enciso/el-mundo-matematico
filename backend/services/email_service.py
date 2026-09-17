import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
import requests
import logging
import os

logger = logging.getLogger("email_logger")
# 1. La URL fija del endpoint de Brevo
BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

#Funcion general de envio de correos
def send_email_api_service(email_to: str, subject: str, html_content: str):
    email_api_key= os.getenv("EMAIL_API_KEY")
    email_from = os.getenv("EMAIL_FROM")
    sender_name = os.getenv("SENDER_NAME")

    if not email_api_key:
        raise ValueError("La variable de entorno EMAIL_API_KEY no está bien configurada")

    if not email_from:
        raise ValueError("La variable de entorno EMAIL_FROM no está bien configurada")

    payload = {
        "sender": {"name": sender_name, "email": email_from},
        "to": [{"email": email_to}],
        "subject": subject,
        "htmlContent": html_content,
    }

    headers = {
        "accept": "application/json",
        "api-key": email_api_key,
        "content-type": "application/json",
    }

    try:
        logger.info("Enviando correo vía API HTTP de Brevo a: %s", email_to)
        response = requests.post(BREVO_API_URL, json=payload, headers=headers, timeout=10)

        if response.status_code not in [200, 201]:
            logger.error("Error en API Brevo [%s]: %s", response.status_code, response.text)
            raise RuntimeError(f"Brevo API error: {response.text}")

        logger.info("Correo enviado exitosamente a %s", email_to)
        return True

    except Exception as e:
        logger.exception("Error al enviar correo vía API de Brevo:")
        raise e

def send_verification_email_service(email_to: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL")
    if not frontend_url:
        raise ValueError("La variable de entorno FRONTEND_URL no está configurada")
    #Usare un link con el token, asi puedo meter tokens mas seguros
    verification_link = f"{frontend_url}/verify-email?token={token}"

    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #6b21a8; text-align: center;">El Mundo Matemático</h2>
        <p style="color: #333333; font-size: 16px;">Hola,</p>
        <p style="color: #555555; font-size: 14px; line-height: 1.5;">
            Recibimos una solicitud para verificar el correo electrónico de tu cuenta. Haz clic en el siguiente botón para continuar (el enlace expira en 24 horas):
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_link}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Verificar correo
            </a>
        </div>
        <p style="color: #888888; font-size: 12px; text-align: center;">
            Si no solicitaste esta verificación, puedes ignorar este correo.
        </p>
    </div>
    """

    return send_email_api_service(
        email_to=email_to,
        subject="Verificar correo electrónico - El Mundo Matemático",
        html_content=html_content,
    )







def send_reset_password_email_service(email_to: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL")
    if not frontend_url:
        raise ValueError("La variable de entorno FRONTEND_URL no está configurada")
    #Usare un link con el token, asi puedo meter tokens mas seguros
    reset_link = f"{frontend_url}/reset-password?token={token}"

    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #6b21a8; text-align: center;">El Mundo Matemático</h2>
        <p style="color: #333333; font-size: 16px;">Hola,</p>
        <p style="color: #555555; font-size: 14px; line-height: 1.5;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para continuar (el enlace expira en 15 minutos):
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Restablecer contraseña
            </a>
        </div>
        <p style="color: #888888; font-size: 12px; text-align: center;">
            Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
    </div>
    """

    return send_email_api_service(
            email_to=email_to,
            subject="Restablecer contraseña - El Mundo Matemático",
            html_content=html_content,
        )




