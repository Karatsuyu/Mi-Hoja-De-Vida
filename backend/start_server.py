#!/usr/bin/env python3
"""
Script para iniciar el servidor FastAPI
"""
import uvicorn
import os
import sys

# Asegurar que el directorio actual está en el path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    print("🚀 Iniciando servidor FastAPI...")
    print("📍 URL: http://localhost:8001")
    print("📚 Docs: http://localhost:8001/docs")
    print("🔄 Modo reload activado")
    print("⏹️  Para detener: Ctrl+C")
    print("-" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )