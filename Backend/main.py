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

# Buscar empleado por cédula o nombre
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

# Buscar empleados por dependencia
@app.get("/empleados/dependencia")
async def obtener_empleados_por_dependencia(dependencia_codigo:Optional[str] = None, db=Depends(get_db)):
    if not dependencia_codigo:
        raise HTTPException(status_code=400, detail="Debe Proporcionar el código de dependencia.")
    
    query = "SELECT * FROM empleados WHERE dependencia_codigo = $1"
    empleados = await db.fetch(query, dependencia_codigo)
    
    if not empleados:
        raise HTTPException(status_code=404, detail="No se encontraron empleados en esta dependencia.")

    return [dict(emp) for emp in empleados]

# Buscar cumpleaños de un empleado
@app.get("/cumpleaños/empleado")
async def obtener_cumpleaños_empleado(cedula: Optional[str] = None, nombre: Optional[str] = None, db=Depends(get_db)):
    if cedula:
        query = "SELECT * FROM empleados WHERE cedula = $1"
        empleado = await db.fetchrow(query, cedula)
    elif nombre:
        query = "SELECT * FROM empleados WHERE nombre_completo ILIKE $1"
        empleado = await db.fetchrow(query, f"%{nombre}%")
    else:
        raise HTTPException(status_code=400, detail="Debe proporcionar cédula o nombre.")
    
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado.")
    return {"nombre": empleado["nombre_completo"], "fecha_nacimiento": empleado["fecha_nacimiento"]}

# Buscar empleados que cumplen años en una fecha dada
@app.get("/cumpleaños/{fecha}")
async def obtener_cumpleañeros(fecha: str, db=Depends(get_db)):
    query = "SELECT * FROM empleados WHERE DATE_PART('month', fecha_nacimiento) = DATE_PART('month', $1) AND DATE_PART('day', fecha_nacimiento) = DATE_PART('day', $1)"
    empleados = await db.fetch(query, fecha)
    return [dict(emp) for emp in empleados]
