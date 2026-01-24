import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Obtenemos la URL de la base de datos desde las variables de entorno de Docker
# Si no existe (para pruebas locales), usa SQLite por defecto
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://admin:frenzy_password@db:5432/frenzykey_db"
)

# 2. Creamos el motor de la base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. Creamos una fábrica de sesiones (para hacer consultas)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Clase base para que nuestros modelos (User, Level, etc.) hereden de ella
Base = declarative_base()

# 5. Función auxiliar (Dependencia) para obtener la DB en los endpoints de FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()