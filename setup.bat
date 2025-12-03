@echo off
echo ========================================
echo   PORTFOLIO FULL-STACK - QUICK START
echo ========================================
echo.

echo [1/3] Activando entorno virtual del backend...
cd backend
if not exist venv (
    echo Creando entorno virtual...
    python -m venv venv
)

call venv\Scripts\activate

echo [2/3] Instalando dependencias...
pip install -r requirements.txt

echo [3/3] Verificando configuracion...
if not exist .env (
    echo ATENCION: Archivo .env no encontrado
    echo Copiando .env.example como plantilla...
    copy .env.example .env
    echo.
    echo IMPORTANTE: Edita el archivo .env con tus credenciales antes de continuar
    echo.
    pause
)

echo.
echo ========================================
echo   LISTO PARA INICIAR
echo ========================================
echo.
echo Para iniciar el backend:
echo   uvicorn main:app --reload
echo.
echo Para servir el frontend (en otra terminal):
echo   cd ../frontend
echo   python -m http.server 3000
echo.
echo URLs:
echo   Frontend: http://localhost:3000
echo   API Docs: http://localhost:8000/docs
echo.
pause