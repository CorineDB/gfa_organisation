#!/bin/bash
# Script de lancement production (build local)
# Usage: ./start-prod.sh

echo "🏭 Starting PRODUCTION environment..."

# Vérifier que .env.production existe
if [ ! -f .env.production ]; then
    echo "❌ ERROR: .env.production not found!"
    echo "   Copy .env.production.example to .env.production and fill in values"
    echo "   cp .env.production.example .env.production"
    exit 1
fi

# Lancer docker-compose avec config production
echo "🐳 Starting containers with production config..."
docker-compose --env-file .env.production \
  -f docker-compose.prod.yml \
  up -d --build

echo "✅ Done! Frontend Organisation running on port 3001"
