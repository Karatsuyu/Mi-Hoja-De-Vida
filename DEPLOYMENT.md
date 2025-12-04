# 🚀 Despliegue del Portfolio - Julián Gutierrez

## 🌐 URLs de Producción

- **Frontend (Netlify)**: https://mi-hoja-de-vida-julian.netlify.app
- **Backend API (Render)**: https://mi-hoja-de-vida.onrender.com
- **Base de Datos**: Supabase PostgreSQL

## 📁 Estructura del Proyecto

```
├── frontend/                 # Páginas estáticas (Netlify)
│   ├── index.html           # Página principal (neon)
│   ├── Hoja de vida Segundo Estilo/  # Página futurista
│   ├── css/
│   └── js/
├── backend/                  # API FastAPI (Render)
│   ├── main.py
│   ├── requirements.txt
│   └── build.sh
└── netlify.toml             # Configuración de Netlify
```

## 🔧 Configuración

### Frontend (Netlify)
- **Build command**: No necesario (archivos estáticos)
- **Publish directory**: `frontend`
- **Site name**: `mi-hoja-de-vida-julian`

### Backend (Render)
- **Build command**: `chmod +x build.sh && ./build.sh`
- **Start command**: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
- **Environment**: Python 3
- **Root directory**: `backend`

### Variables de Entorno (Render)
```
DATABASE_URL=postgresql://postgres:*VUX90A*@db.kevwrlyreqrynwswyocj.supabase.co:5432/postgres
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_HOST_USER=tabjulian07@gmail.com
EMAIL_HOST_PASSWORD=evce lynd wsxc gmmj
APP_ENV=production
DEBUG=false
```

## 🎯 Funcionalidades

- ✅ Formulario de contacto funcional en ambas páginas
- ✅ Base de datos PostgreSQL en Supabase
- ✅ Envío de emails automático
- ✅ Diseño responsive
- ✅ Modo oscuro/claro
- ✅ Carrusel 3D de proyectos
- ✅ CORS configurado correctamente