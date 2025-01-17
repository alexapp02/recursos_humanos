"""
Este script establece una conexión a una base de datos PostgreSQL
para gestionar el sistema de recursos humanos.
"""

import psycopg2
from psycopg2 import OperationalError, DatabaseError

connection = None
try: 
    connection = psycopg2.connect(
        host='localhost',
        user='postgres',
        password='Soloparami34',
        database='recursos_humanos'
    )
    print("Conexión exitosa")
except OperationalError as op_err:
    print(f"Error operativo: {op_err}")
except DatabaseError as db_err:
    print(f"Error de base de datos: {db_err}")
except Exception as ex:
    print(f"Error inesperado: {ex}")
finally: 
    if connection is not None:
        connection.close()
        print("Conexión finalizada.")
