#!/usr/bin/env bash
# build.sh - Script de construcción para Render

# Instalar dependencias
pip install -r requirements.txt

# Crear las tablas si no existen (opcional, Supabase ya las tendrá)
echo "Build completed successfully!"