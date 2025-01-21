from fastapi import FastAPI, HTTPException, Depends
import asyncpg
from typing import List, Optional
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Configuración de la base de datos
DATABASE_URL = "postgresql://postgres:Soloparami34@localhost/recursos_humanos"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia "*" por los dominios específicos si es necesario
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_db():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()

# Modelo de empleado
class Empleado:
    def __init__(self, cedula, nombre_completo, correo_interno, dependencia_codigo_nacimiento, telefono_interno, dependencia_codigo, cargo_codigo):
        self.cedula = cedula
        self.nombre_completo = nombre_completo
        self.correo_interno = correo_interno
        self.dependencia_codigo_nacimiento = dependencia_codigo_nacimiento
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
async def empleados_dependencia(dependencia_codigo: Optional[str] = None, db=Depends(get_db)):
    if not dependencia_codigo:
        raise HTTPException(status_code=400, detail="Debe proporcionar el código de dependencia.")
    
    query = "SELECT * FROM empleados WHERE dependencia_codigo = $1"
    empleados = await db.fetch(query, dependencia_codigo)
    
    if not empleados:
        raise HTTPException(status_code=404, detail="No se encontraron empleados en esta dependencia.")

    return [dict(emp) for emp in empleados]

# Buscar cumpleaños de un empleado
@app.get("/birthday")
async def birthday_empleado(cedula: Optional[str] = None, nombre: Optional[str] = None, db=Depends(get_db)):
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
    return {"nombre": empleado["nombre_completo"], "fecha_nacimiento": empleado["fecha_nacimiento"]}

# Buscar empleados que cumplen años en una fecha dada
@app.get("/birthday/empleados")
async def obtener_cumpleanios(fecha: Optional[str] = None, db=Depends(get_db)):
    if not fecha:
        raise HTTPException(status_code=400, detail="Debe proporcionar la fecha en formato YYYY-MM-DD.")

    try:
        fecha_obj = datetime.strptime(fecha, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido. Use YYYY-MM-DD.")

    mes = fecha_obj.month
    dia = fecha_obj.day

    query = """
        SELECT *
        FROM empleados
        WHERE EXTRACT(MONTH FROM fecha_nacimiento) = $1
          AND EXTRACT(DAY FROM fecha_nacimiento) = $2
    """
    try:
        empleados = await db.fetch(query, mes, dia)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar la base de datos: {str(e)}")

    if not empleados:
        raise HTTPException(status_code=404, detail="No se encontraron empleados con ese cumpleaños.")

    return [dict(emp) for emp in empleados]