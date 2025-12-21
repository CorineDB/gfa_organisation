#!/bin/bash
# Script de lancement local
# Usage: ./start-local.sh

echo "🚀 Starting local development environment..."

# Copier .env.local.example si .env.local n'existe pas
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.local.example..."
    cp .env.local.example .env.local
fi

# Lancer docker-compose
echo "🐳 Starting containers..."
docker-compose -f docker-compose.local.yml up -d --build

echo "✅ Done! Access at http://localhost:3001"
