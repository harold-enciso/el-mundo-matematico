from fastapi import FastAPI

app = FastAPI()



#Funcion sincrona o normal
@app.get("/")
def mensaje():
    return {"mensaje": "BIENVENIDOS A KAHUUUUUT!"}