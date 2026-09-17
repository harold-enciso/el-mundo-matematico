import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
import logging
import os

logger = logging.getLogger("email_logger")

def send_verification_email_service(email_to: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL")
    #Usare un link con el token, asi puedo meter tokens mas seguros
    verification_link = f"{frontend_url}/verify-email?token={token}"

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT",587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    email_from = os.getenv("EMAIL_FROM")
    sender_name = os.getenv("SENDER_NAME", "El Mundo Matemático")
    if not smtp_host:
        raise ValueError("La variable de entorno SMTP_HOST no está configurada")
    if not smtp_user:
        raise ValueError("La variable de entorno SMTP_USER no está configurada")
    if not smtp_password:
        raise ValueError("La variable de entorno SMTP_PASSWORD no está configurada")
    if not email_from:
        raise ValueError("La variable de entorno EMAIL_FROM no está configurada")
    if not sender_name:
        raise ValueError("La variable de entorno SENDER_NAME no está configurada")


    msg = MIMEMultipart()
    msg['From'] = formataddr((sender_name, email_from))
    msg['To'] = email_to
    msg['Subject'] = "Verificar correo electrónico - El Mundo Matemático"

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
    msg.attach(MIMEText(html_content,'html'))

    try:
        logger.info("Conectando al servidor SMTP: %s:%s", smtp_host, smtp_port)
        with smtplib.SMTP(smtp_host,smtp_port,timeout=10) as server:
            server.starttls()
            logger.info("Iniciando sesión en SMTP Brevo...")
            server.login(smtp_user,smtp_password)
            logger.info("Enviando mensaje...")
            server.send_message(msg)

        return True
    except Exception as e:
        logger.exception("Error dentro de send_verification_email_service:")
        raise e







def send_reset_password_email_service(email_to: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL")
    #Usare un link con el token, asi puedo meter tokens mas seguros
    reset_link = f"{frontend_url}/reset-password?token={token}"

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT",587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    email_from = os.getenv("EMAIL_FROM")
    sender_name = os.getenv("SENDER_NAME", "El Mundo Matemático")

    if not smtp_host:
        raise ValueError("La variable de entorno SMTP_HOST no está configurada")
    if not smtp_user:
        raise ValueError("La variable de entorno SMTP_USER no está configurada")
    if not smtp_password:
        raise ValueError("La variable de entorno SMTP_PASSWORD no está configurada")
    if not email_from:
        raise ValueError("La variable de entorno EMAIL_FROM no está configurada")
    if not sender_name:
        raise ValueError("La variable de entorno SENDER_NAME no está configurada")
    

    msg = MIMEMultipart()
    msg['From'] = formataddr((sender_name, email_from))
    msg['To'] = email_to
    msg['Subject'] = "Restablecer contraseña - El Mundo Matemático"

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
    msg.attach(MIMEText(html_content,'html'))

    try:
        logger.info("Conectando al servidor SMTP: %s:%s", smtp_host, smtp_port)
        with smtplib.SMTP(smtp_host,smtp_port,timeout=10) as server:
            server.starttls()
            logger.info("Iniciando sesión en SMTP Brevo...")
            server.login(smtp_user,smtp_password)
            logger.info("Enviando mensaje...")
            server.send_message(msg)

        return True
    except Exception as e:
        logger.exception("Error dentro de send_reset_password_email_service:")
        raise e




