from fastapi import FastAPI, HTTPException, Depends
import asyncpg
from typing import List, Optional

app = FastAPI()

# Configuración de la base de datos
DATABASE_URL = "postgresql://postgres:Soloparami34@localhost/recursos_humanos"

async def get_db():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()

# Modelo de empleado
class Empleado:
    def __init__(self, cedula, nombre_completo, correo_interno, fecha_nacimiento, telefono_interno, dependencia_codigo, cargo_codigo):
        self.cedula = cedula
        self.nombre_completo = nombre_completo
        self.correo_interno = correo_interno
        self.fecha_nacimiento = fecha_nacimiento
        self.telefono_interno = telefono_interno
        self.dependencia_codigo = dependencia_codigo
        self.cargo_codigo = cargo_codigo

# Ruta principal
@app.get("/")
async def root():
    return {"message": "¡Bienvenido a la API de Recursos Humanos!"}

# 📌 Buscar empleado por cédula o nombre
@app.get("/empleado")
async def obtener_empleado(cedula: Optional[str] = None, nombre: Optional[str] = None, db=Depends(get_db)):
    if cedula:
        query = "SELECT * FROM empleados WHERE cedula = $1"
        empleado = await db.fetchrow(query, cedula)
    elif nombre:
        query = "SELECT * FROM empleados WHERE unaccent(nombre_completo) ILIKE unaccent($1)"
        empleado = await db.fetchrow(query, f"%{nombre}%")
    else:
        raise HTTPException(status_code=400, detail="Debe proporcionar cédula o nombre.")

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado.")
    return dict(empleado)

