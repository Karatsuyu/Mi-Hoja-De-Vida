import uvicorn
import sys
import os

if __name__ == '__main__':
    # Cambiar al directorio del backend
    backend_path = r"C:\Users\Usuario\Documents\Desarrollo de Software\Proyecto Hoja De Vida\backend"
    os.chdir(backend_path)
    sys.path.insert(0, backend_path)
    
    print("🚀 Iniciando servidor FastAPI...")
    print("📍 URL: http://localhost:8001")
    print("📚 Documentacion: http://localhost:8001/docs")
    print("🔄 Modo reload activado")
    print("⏹️  Para detener: Ctrl+C")
    print("-" * 50)
    
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)