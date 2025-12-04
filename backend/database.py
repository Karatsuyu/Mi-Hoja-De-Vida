from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./messages.db")

# Configurar SQLite para que funcione con threading
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # Configuración optimizada para PostgreSQL/Supabase
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,        # Verifica conexiones antes de usarlas
        pool_recycle=300,          # Recicla conexiones cada 5 minutos
        connect_args={"sslmode": "require"}  # SSL obligatorio para Supabase
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Función para obtener sesión de base de datos
def get_database():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()