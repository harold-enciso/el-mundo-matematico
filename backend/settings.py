import os
from dotenv import load_dotenv

load_dotenv()



WASABI_ENDPOINT_URL = os.getenv("WASABI_ENDPOINT_URL")
WASABI_KEY_ID = os.getenv("WASABI_KEY_ID")
WASABI_SECRET_KEY = os.getenv("WASABI_SECRET_KEY")
WASABI_BUCKET_NAME = os.getenv("WASABI_BUCKET_NAME")



CORS_Origins = [
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
    CORS_Origins.append(local_front)
