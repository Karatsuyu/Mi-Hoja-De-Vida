from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging
from datetime import datetime

# Importar módulos locales
from database import get_database, engine, Base
from models import Message
from schemas import MessageCreate, MessageResponse, ContactResponse, ErrorResponse
from email_utils import send_notification_email, send_confirmation_email

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Crear todas las tablas
Base.metadata.create_all(bind=engine)

# Crear aplicación FastAPI
app = FastAPI(
    title="Portfolio Contact API",
    description="API para el formulario de contacto del portfolio de Julián Gutierrez",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://julian-gutierrez-portfolio.netlify.app",  # Cambia por tu dominio
    "*"  # En desarrollo - remover en producción
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Middleware para logging de requests
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = datetime.now()
    
    # Procesar request
    response = await call_next(request)
    
    # Log del request
    process_time = (datetime.now() - start_time).total_seconds()
    logger.info(
        f"'{request.method} {request.url.path}' "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    return response

# Endpoints

@app.get("/", response_model=dict)
async def root():
    """Endpoint de prueba para verificar que la API está funcionando"""
    return {
        "message": "Portfolio Contact API - Funcionando correctamente ✅",
        "version": "1.0.0",
        "endpoints": {
            "contact": "/contact (POST)",
            "messages": "/messages (GET)",
            "health": "/health (GET)",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected"
    }

@app.post("/contact", response_model=ContactResponse)
async def create_contact_message(
    message_data: MessageCreate,
    db: Session = Depends(get_database)
):
    """
    Procesar mensaje del formulario de contacto
    
    - **username**: Nombre del usuario (2-100 caracteres)
    - **email**: Email válido del usuario
    - **message**: Mensaje del usuario (10-2000 caracteres)
    """
    try:
        logger.info(f"Procesando mensaje de contacto de: {message_data.username}")
        
        # Crear nuevo mensaje en la base de datos
        new_message = Message(
            username=message_data.username,
            email=message_data.email,
            message=message_data.message,
            read_status=False  # False = unread, True = read
        )
        
        db.add(new_message)
        db.commit()
        db.refresh(new_message)
        
        logger.info(f"Mensaje guardado en BD con ID: {new_message.id}")
        
        # Enviar email de notificación (no bloquear si falla)
        email_sent = False
        try:
            email_sent = send_notification_email(
                message_data.username,
                message_data.email,
                message_data.message
            )
            
            if email_sent:
                logger.info("Email de notificación enviado exitosamente")
                
                # Enviar confirmación al usuario
                confirmation_sent = send_confirmation_email(
                    message_data.email,
                    message_data.username
                )
                
                if confirmation_sent:
                    logger.info("Email de confirmación enviado al usuario")
            
        except Exception as e:
            logger.error(f"Error al enviar emails: {str(e)}")
        
        # Respuesta exitosa
        return ContactResponse(
            success=True,
            message="¡Mensaje enviado exitosamente! Te responderé pronto.",
            data={
                "id": new_message.id,
                "email_sent": email_sent,
                "timestamp": new_message.created_at.isoformat()
            }
        )
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Error de base de datos: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al guardar el mensaje en la base de datos"
        )
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error inesperado: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@app.get("/messages", response_model=list[MessageResponse])
async def get_messages(
    limit: int = 50,
    skip: int = 0,
    db: Session = Depends(get_database)
):
    """
    Obtener mensajes (endpoint administrativo)
    
    - **limit**: Número máximo de mensajes a retornar (default: 50)
    - **skip**: Número de mensajes a saltar (default: 0)
    """
    try:
        messages = db.query(Message)\
                    .order_by(Message.created_at.desc())\
                    .offset(skip)\
                    .limit(limit)\
                    .all()
        
        return messages
    
    except Exception as e:
        logger.error(f"Error al obtener mensajes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener los mensajes"
        )

@app.put("/messages/{message_id}/read")
async def mark_message_as_read(
    message_id: int,
    db: Session = Depends(get_database)
):
    """Marcar un mensaje como leído"""
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensaje no encontrado"
        )
    
    message.read_status = True  # True = read
    db.commit()
    
    return {"message": "Mensaje marcado como leído"}

# Manejador global de errores
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.detail,
            detail=f"Error en {request.method} {request.url.path}"
        ).dict()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Error no manejado: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Error interno del servidor",
            detail=str(exc)
        ).dict()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )