# 🚀 Portfolio Full-Stack - Julián Gutierrez

Proyecto completo de hoja de vida con arquitectura frontend/backend profesional.

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura](#️-arquitectura)
- [⚡ Quick Start](#-quick-start)
- [🔧 Configuración](#-configuración)
- [📡 API Endpoints](#-api-endpoints)
- [🚀 Despliegue](#-despliegue)
- [🛠️ Desarrollo](#️-desarrollo)

---

## 🏗️ Arquitectura

```
proyecto-hoja-de-vida/
├── 🎨 frontend/               # Cliente (HTML/CSS/JS)
│   ├── index.html             # Página principal
│   ├── contacto.html          # Formulario de contacto
│   ├── css/styles.css         # Estilos responsivos
│   ├── js/scripts.js          # Lógica del frontend
│   └── Hoja de vida Segundo Estilo/  # Versión futurista
├── 🔧 backend/                # Servidor API (FastAPI)
│   ├── main.py                # Aplicación principal
│   ├── database.py            # Configuración SQLAlchemy
│   ├── models.py              # Modelos de datos
│   ├── schemas.py             # Validación Pydantic
│   ├── email_utils.py         # Sistema de correos
│   └── requirements.txt       # Dependencias Python
└── 📝 README.md              # Esta documentación
```

### Stack Tecnológico

**Frontend:**
- HTML5, CSS3, JavaScript ES6+
- Font Awesome, Google Fonts
- Responsive Design (Mobile-First)

**Backend:**
- FastAPI (Python 3.8+)
- SQLAlchemy ORM
- PostgreSQL/SQLite
- Pydantic (Validación)
- SMTP Gmail (Emails)

---

## ⚡ Quick Start

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Karatsuyu/Mi-Hoja-De-Vida.git
cd Mi-Hoja-De-Vida
```

### 2. Configurar Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Ejecutar el Backend
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Servir Frontend
```bash
cd ../frontend

# Opción 1: Python
python -m http.server 3000

# Opción 2: Node.js (si tienes instalado)
npx serve . -p 3000

# Opción 3: Live Server (VS Code Extension)
```

### 6. Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🔧 Configuración

### Variables de Entorno (.env)

```bash
# Base de Datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/hoja_vida_db
# Para SQLite: sqlite:///./messages.db

# Configuración de Email
MAIL_SENDER=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password-de-gmail
MAIL_RECEIVER=tu-email-personal@gmail.com

# Seguridad
SECRET_KEY=tu-clave-secreta-muy-segura-aqui

# Desarrollo
DEBUG=True
```

### Configurar Gmail App Password

1. Ve a [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification
3. App Passwords → Generate new password
4. Usa esa password en `MAIL_PASSWORD`

### Base de Datos

**Opción 1: SQLite (Desarrollo)**
```bash
# No requiere configuración adicional
DATABASE_URL=sqlite:///./messages.db
```

**Opción 2: PostgreSQL (Producción)**
```bash
# Local
DATABASE_URL=postgresql://usuario:password@localhost:5432/hoja_vida_db

# Railway
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:7396/railway

# Supabase
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

---

## 📡 API Endpoints

### Base URL
- **Local**: `http://localhost:8000`
- **Producción**: `https://tu-api.herokuapp.com`

### Endpoints Disponibles

#### `GET /`
Información básica de la API
```json
{
  "message": "Portfolio Contact API - Funcionando correctamente ✅",
  "version": "1.0.0",
  "endpoints": {
    "contact": "/contact (POST)",
    "messages": "/messages (GET)",
    "health": "/health (GET)"
  }
}
```

#### `POST /contact`
Enviar mensaje de contacto
```javascript
// Request
{
  "username": "Juan Pérez",
  "email": "juan@example.com",
  "message": "Hola, me interesa contactarte para un proyecto..."
}

// Response (Success)
{
  "success": true,
  "message": "¡Mensaje enviado exitosamente! Te responderé pronto.",
  "data": {
    "id": 1,
    "email_sent": true,
    "timestamp": "2025-12-02T10:30:00"
  }
}
```

#### `GET /messages`
Obtener mensajes (Administrativo)
```javascript
// Query params: ?limit=50&skip=0
[
  {
    "id": 1,
    "username": "Juan Pérez",
    "email": "juan@example.com",
    "message": "Mensaje completo...",
    "created_at": "2025-12-02T10:30:00",
    "read_status": "unread"
  }
]
```

#### `GET /health`
Health check del servidor
```json
{
  "status": "healthy",
  "timestamp": "2025-12-02T10:30:00",
  "database": "connected"
}
```

---

## 🚀 Próximos Pasos

### Para Probar Localmente:

1. **Activar el backend**:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Editar .env con tus credenciales de Gmail
uvicorn main:app --reload
```

2. **Servir el frontend**:
```bash
cd frontend
python -m http.server 3000
```

3. **Probar el formulario**:
   - Ve a http://localhost:3000/contacto.html
   - Llena el formulario y envía un mensaje
   - Verifica que llegue el email

### Para Desplegar en Producción:

1. **Backend**: Railway, Render, o Heroku
2. **Frontend**: Netlify, Vercel, o GitHub Pages
3. **Base de Datos**: PostgreSQL en Railway/Supabase
4. **Actualizar URL**: Cambiar `API_BASE_URL` en `scripts.js`

---

**Desarrollado con ❤️ por Julián Estiven Gutierrez**