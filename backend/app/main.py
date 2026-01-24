from fastapi import FastAPI
from loguru import logger
from app.database import engine, Base

from app.models import user, program, level, shortcut, progress, score

# ESTA LÍNEA CREA LAS TABLAS
Base.metadata.create_all(bind=engine)

# Inicializar tablas de la base de datos
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Tablas de FrenzyKey creadas exitosamente")
except Exception as e:
    logger.error(f"Error creando las tablas: {e}")

app = FastAPI(title="FrenzyKey API")

@app.get("/")
def read_root():
    logger.info("Acceso al root de FrenzyKey")
    return {
        "status": "online",
        "game": "FrenzyKey",
        "version": "0.1.0"
    }