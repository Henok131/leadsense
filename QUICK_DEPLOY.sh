#!/bin/bash
# Quick deployment script for VPS
# Run this after pushing to GitHub

cd /var/www/lead.asenaytech.com

echo "🔄 Pulling latest code from GitHub..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "🐳 Restarting Docker containers..."
docker compose down && docker compose up -d

echo "✅ Deployment complete!"
echo "🌐 Visit: https://lead.asenaytech.com"

